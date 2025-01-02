import { beforeAll, describe, expect, test } from 'bun:test';
import { AnchorError, Program } from '@coral-xyz/anchor';
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { Mess } from '../target/types/mess';
import { ProgramTestContext, startAnchor } from 'solana-bankrun';
import { BankrunProvider } from 'anchor-bankrun';
import IDL from '../target/idl/mess.json';

describe('mess', () => {
  let context: ProgramTestContext;
  let provider: BankrunProvider;
  let payer: Keypair;
  let program: Program<Mess>;
  let chatPDA: PublicKey;
  const anotherAccount = Keypair.generate();

  beforeAll(async () => {
    context = await startAnchor(
      '',
      [],
      [
        {
          address: anotherAccount.publicKey,
          info: {
            lamports: 1_000_000_000,
            data: Buffer.alloc(0),
            owner: SystemProgram.programId,
            executable: false,
          },
        },
      ]
    );

    provider = new BankrunProvider(context);
    payer = context.payer;
    program = new Program(IDL as Mess, provider);

    [chatPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('global'), payer.publicKey.toBuffer()],
      program.programId
    );
  });

  test('initializes chat', async () => {
    await program.methods
      .init()
      .accounts({
        payer: payer.publicKey,
      })
      .signers([payer])
      .rpc();

    const chat = await program.account.chat.fetch(chatPDA);

    expect(chat.messages).toEqual([]);
  });

  test('sends message', async () => {
    const message = 'Hello world';

    await program.methods
      .send(message)
      .accounts({
        chat: chatPDA,
        sender: payer.publicKey,
      })
      .signers([payer])
      .rpc();

    const chat = await program.account.chat.fetch(chatPDA);

    expect(chat.messages[0].sender).toEqual(payer.publicKey);
    expect(chat.messages[0].text).toEqual(message);
  });

  test('sends message from another account', async () => {
    const message = 'Hey there';

    await program.methods
      .send(message)
      .accounts({
        chat: chatPDA,
        sender: anotherAccount.publicKey,
      })
      .signers([anotherAccount])
      .rpc();

    const chat = await program.account.chat.fetch(chatPDA);

    expect(chat.messages[1].sender).toEqual(anotherAccount.publicKey);
    expect(chat.messages[1].text).toEqual(message);
  });

  test('throws an error when text is too long', async () => {
    const veryLongText = 'a'.repeat(256);

    try {
      await program.methods
        .send(veryLongText)
        .accounts({
          chat: chatPDA,
          sender: payer.publicKey,
        })
        .signers([payer])
        .rpc();
    } catch (e) {
      expect(e).toBeInstanceOf(AnchorError);
      expect(e.error.errorCode.code).toEqual('TextTooLong');
      expect(e.error.errorCode.number).toEqual(6000);
    }
  });

  test('throws an error when text is empty', async () => {
    try {
      await program.methods
        .send('')
        .accounts({
          chat: chatPDA,
          sender: payer.publicKey,
        })
        .signers([payer])
        .rpc();
    } catch (e) {
      expect(e).toBeInstanceOf(AnchorError);
      expect(e.error.errorCode.code).toEqual('TextEmpty');
      expect(e.error.errorCode.number).toEqual(6001);
    }
  });
});

import { beforeAll, describe, expect, test } from 'bun:test';
import { AnchorError, Program } from '@coral-xyz/anchor';
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from '@solana/web3.js';
import { Mess } from '../target/types/mess';
import { ProgramTestContext, startAnchor } from 'solana-bankrun';
import { BankrunProvider } from 'anchor-bankrun';
import idl from '../target/idl/mess.json';

describe('mess', () => {
  let { context, provider, program } = {} as {
    context: ProgramTestContext;
    provider: BankrunProvider;
    program: Program<Mess>;
  };

  let chatPDA: PublicKey;

  const walletA = Keypair.generate();

  beforeAll(async () => {
    context = await startAnchor(
      '',
      [],
      [
        {
          address: walletA.publicKey,
          info: {
            lamports: LAMPORTS_PER_SOL,
            data: Buffer.alloc(0),
            owner: SystemProgram.programId,
            executable: false,
          },
        },
      ]
    );

    provider = new BankrunProvider(context);
    program = new Program(idl as Mess, provider);

    [chatPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('global'), context.payer.publicKey.toBuffer()],
      program.programId
    );
  });

  test('initializes chat', async () => {
    await program.methods
      .init()
      .accounts({
        payer: context.payer.publicKey,
      })
      .signers([context.payer])
      .rpc();

    const chat = await program.account.chat.fetch(chatPDA);

    expect(chat.messages).toEqual([]);
  });

  test('sends message', async () => {
    const message = 'Hello world';
    const sender = context.payer.publicKey;

    await program.methods
      .send(message)
      .accounts({
        chat: chatPDA,
        sender,
      })
      .signers([context.payer])
      .rpc();

    const chat = await program.account.chat.fetch(chatPDA);

    expect(chat.messages[0].sender).toEqual(sender);
    expect(chat.messages[0].text).toEqual(message);
  });

  test('sends message from another wallet', async () => {
    const message = 'Hey there';
    const sender = walletA.publicKey;

    await program.methods
      .send(message)
      .accounts({
        chat: chatPDA,
        sender: walletA.publicKey,
      })
      .signers([walletA])
      .rpc();

    const chat = await program.account.chat.fetch(chatPDA);

    expect(chat.messages[1].sender).toEqual(sender);
    expect(chat.messages[1].text).toEqual(message);
  });

  test('throws an error when text is too long', async () => {
    const veryLongText = 'a'.repeat(256);

    try {
      await program.methods
        .send(veryLongText)
        .accounts({
          chat: chatPDA,
          sender: context.payer.publicKey,
        })
        .signers([context.payer])
        .rpc();
    } catch (err) {
      expect(err).toBeInstanceOf(AnchorError);

      const { error } = err as AnchorError;
      expect(error.errorCode.code).toEqual('TextTooLong');
      expect(error.errorCode.number).toEqual(6000);
    }
  });

  test('throws an error when text is empty', async () => {
    try {
      await program.methods
        .send('')
        .accounts({
          chat: chatPDA,
          sender: context.payer.publicKey,
        })
        .signers([context.payer])
        .rpc();
    } catch (err) {
      expect(err).toBeInstanceOf(AnchorError);

      const { error } = err as AnchorError;
      expect(error.errorCode.code).toEqual('TextEmpty');
      expect(error.errorCode.number).toEqual(6001);
    }
  });
});

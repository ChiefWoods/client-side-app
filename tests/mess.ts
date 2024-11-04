import { AnchorError, Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Mess } from "../target/types/mess";
import { ProgramTestContext, startAnchor } from "solana-bankrun";
import { BankrunProvider } from "anchor-bankrun";
import IDL from "../target/idl/mess.json";
import { assert } from "chai";

describe("mess", () => {
  let context: ProgramTestContext;
  let provider: BankrunProvider;
  let payer: Keypair;
  let program: Program<Mess>;
  let chatPDA: PublicKey;
  const anotherAccount = Keypair.generate();

  before(async () => {
    context = await startAnchor("", [], [
      {
        address: anotherAccount.publicKey,
        info: {
          lamports: 1_000_000_000,
          data: Buffer.alloc(0),
          owner: SystemProgram.programId,
          executable: false
        }
      }
    ]);
    provider = new BankrunProvider(context);
    payer = context.payer;
    program = new Program<Mess>(IDL as Mess, provider);
    [chatPDA] = PublicKey.findProgramAddressSync([Buffer.from("global"), payer.publicKey.toBuffer()], program.programId);
  });

  it("initializes chat", async () => {
    await program.methods
      .init()
      .accounts({
        payer: payer.publicKey,
      })
      .signers([payer])
      .rpc();

    const chat = await program.account.chat.fetch(chatPDA);

    assert.deepEqual(chat.messages, []);
  })

  it("sends message", async () => {
    const message = "Hello world";

    await program.methods
      .send(message)
      .accounts({
        chat: chatPDA,
        sender: payer.publicKey,
      })
      .signers([payer])
      .rpc();

    const chat = await program.account.chat.fetch(chatPDA);

    assert.deepEqual(chat.messages[0].sender, payer.publicKey);
    assert.deepEqual(chat.messages[0].text, message);
  });

  it("sends message from another account", async () => {
    const message = "Hey there";

    await program.methods
      .send(message)
      .accounts({
        chat: chatPDA,
        sender: anotherAccount.publicKey,
      })
      .signers([anotherAccount])
      .rpc();

    const chat = await program.account.chat.fetch(chatPDA);

    assert.deepEqual(chat.messages[1].sender, anotherAccount.publicKey);
    assert.deepEqual(chat.messages[1].text, message);
  });

  it("throws an error when text is too long", async () => {
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
      assert.instanceOf(e, AnchorError);
      assert.equal(e.error.errorCode.code, "TextTooLong");
      assert.equal(e.error.errorCode.number, 6000);
    }
  });

  it("throws an error when text is empty", async () => {
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
      assert.instanceOf(e, AnchorError);
      assert.equal(e.error.errorCode.code, "TextEmpty");
      assert.equal(e.error.errorCode.number, 6001);
    }
  });
});

import { AnchorProvider, Program, setProvider, workspace } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Mess } from "../target/types/mess";
import { assert } from "chai";

describe("mess", () => {
  // Configure the client to use the local cluster.
  setProvider(AnchorProvider.env());

  const program = workspace.Mess as Program<Mess>;
  const programProvider = program.provider as AnchorProvider;

  const chatOwner = Keypair.generate();
  const messageOwner = Keypair.generate();
  const [chatPublicKey] = PublicKey.findProgramAddressSync([Buffer.from("global"), chatOwner.publicKey.toBuffer()], program.programId);

  it("initialize chat", async () => {
    const signature = await programProvider.connection.requestAirdrop(chatOwner.publicKey, 5_000_000_000);
    const { blockhash, lastValidBlockHeight } = await programProvider.connection.getLatestBlockhash();
    await programProvider.connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature
    });

    await program.methods.init().accounts({
      chat: chatPublicKey,
      payer: chatOwner.publicKey,
    }).signers([chatOwner]).rpc();

    const chatData = await program.account.chat.fetch(chatPublicKey);

    assert.deepEqual(chatData.messages, []);
  });

  it("send message", async () => {
    await program.methods.send("Hello world").accounts({
      chat: chatPublicKey,
      sender: chatOwner.publicKey
    }).signers([chatOwner]).rpc();

    const chatData = await program.account.chat.fetch(chatPublicKey);

    assert.deepEqual(chatData.messages[0].sender, chatOwner.publicKey);
    assert.equal(chatData.messages[0].text, "Hello world");
  })

  it("send message from another account", async () => {
    const signature = await programProvider.connection.requestAirdrop(messageOwner.publicKey, 5_000_000_000);
    const { blockhash, lastValidBlockHeight } = await programProvider.connection.getLatestBlockhash();
    await programProvider.connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature
    });

    await program.methods.send("Hey there").accounts({
      chat: chatPublicKey,
      sender: messageOwner.publicKey
    }).signers([messageOwner]).rpc();

    const chatData = await program.account.chat.fetch(chatPublicKey);

    assert.deepEqual(chatData.messages[1].sender, messageOwner.publicKey);
    assert.equal(chatData.messages[1].text, "Hey there");
  });
});

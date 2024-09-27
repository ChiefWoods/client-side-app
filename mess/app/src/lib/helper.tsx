import { PublicKey } from "@solana/web3.js";

export function getChatPDA(publicKey: PublicKey) {
  const chatPDA = PublicKey.findProgramAddressSync(
    [Buffer.from("global"), publicKey.toBuffer()],
    new PublicKey("3o3K93TeUMRxrcsWf2Eu6E7oX41Ffx9AWcxEZqC6KEqg"),
  )[0].toBase58();

  return chatPDA;
}

export function truncateAddress(address: string) {
  return `${address.slice(0, 4)}....${address.slice(-4)}`;
}

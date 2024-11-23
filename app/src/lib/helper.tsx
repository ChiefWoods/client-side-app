import { PublicKey } from "@solana/web3.js";

export function getChatPDA(owner: PublicKey) {
  const chatPDA = PublicKey.findProgramAddressSync(
    [Buffer.from("global"), owner.toBuffer()],
    new PublicKey(import.meta.env.VITE_MESS_PROGRAM_ID),
  )[0].toBase58();

  return chatPDA;
}

export function truncateAddress(address: string) {
  return `${address.slice(0, 5)}....${address.slice(-5)}`;
}

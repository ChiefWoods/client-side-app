import { PublicKey } from "@solana/web3.js";
import idl from "@/idl/mess.json";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function deriveChatPda(owner: PublicKey): string {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("global"), owner.toBuffer()],
    new PublicKey(idl.address),
  )[0].toBase58();
}

export function truncateAddress(address: string) {
  return `${address.slice(0, 4)}....${address.slice(-4)}`;
}

import { PublicKey } from "@solana/web3.js";

export interface Message {
  sender: PublicKey;
  text: string;
}

export interface MessageGroup {
  sender: string;
  texts: string[];
}

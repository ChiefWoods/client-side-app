import { Connection, PublicKey } from "@solana/web3.js";
import { z } from "zod";

const connection = new Connection(`https://devnet.helius-rpc.com/?api-key=${import.meta.env.VITE_HELIUS_API_KEY}`);

export const searchFormSchema = z.object({
  chatroom: z
    .string()
    .min(1, {
      message: "Chatroom address cannot be empty."
    })
    .refine(async (value) => {
      try {
        return Boolean(await connection.getBalance(new PublicKey(value)));
      } catch (err) {
        console.error(err);
        return false;
      }
    }, {
      message: "Invalid PDA."
    })
});

export const messageFormSchema = z.object({
  message: z
    .string()
    .min(1, {
      message: "Message cannot be empty."
    })
    .max(256, {
      message: "Message cannot exceed 256 characters."
    })
});

import { Connection, PublicKey } from "@solana/web3.js";
import { z } from "zod";

const connection = new Connection(import.meta.env.VITE_RPC_ENDPOINT);

export const searchFormSchema = z.object({
  chatroom: z
    .string()
    .length(44, {
      message: "Chatroom address must be 44 characters long."
    })
    .refine(async (value) => {
      try {
        return Boolean(await connection.getAccountInfo(new PublicKey(value)));
      } catch (err) {
        console.error(err);
        return false;
      }
    }, {
      message: "Invalid chatroom address."
    })
});
import { Connection, PublicKey } from '@solana/web3.js';
import { z } from 'zod';

const connection = new Connection(import.meta.env.VITE_RPC_URL);

export const messageFormSchema = z.object({
  message: z
    .string()
    .min(1, {
      message: 'Message cannot be empty.',
    })
    .max(256, {
      message: 'Message cannot exceed 256 characters.',
    }),
});

export const searchFormSchema = z.object({
  chatroom: z
    .string()
    .length(44, {
      message: 'Chatroom address must be 44 characters long.',
    })
    .refine(
      async (value) => {
        try {
          return Boolean(await connection.getAccountInfo(new PublicKey(value)));
        } catch (err) {
          console.error(err);
          return false;
        }
      },
      {
        message: 'Invalid chatroom address.',
      }
    ),
});

import { Connection } from '@solana/web3.js';

export const connection = new Connection(import.meta.env.VITE_RPC_URL);

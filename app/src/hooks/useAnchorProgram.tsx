import { Mess } from "@/types/mess";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useMemo, useState } from "react";
import idl from "@/idl/mess.json";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";

export function useAnchorProgram() {
  const [program, setProgram] = useState<Program<Mess> | null>(null);
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const wallet = useAnchorWallet();

  useMemo(() => {
    if (wallet) {
      const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
      setProgram(new Program(idl as Mess, provider));
    }
  }, [connection, wallet]);

  async function getInitIx(): Promise<TransactionInstruction> {
    return await program!.methods
      .init()
      .accounts({
        payer: publicKey!,
      })
      .instruction();
  }

  async function getSendIx(text: string, chatPda: PublicKey): Promise<TransactionInstruction> {
    return await program!.methods
      .send(text)
      .accounts({
        chat: chatPda!,
        sender: publicKey!,
      })
      .instruction();
  }

  const getChatAcc = useCallback(async (chatPda: PublicKey) => {
    if (program) {
      return await program.account.chat.fetchNullable(chatPda);
    }
  }, [program]);

  return { 
    getInitIx,
    getSendIx,
    getChatAcc,
   };
}
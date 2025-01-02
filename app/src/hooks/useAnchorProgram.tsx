import { Mess } from '@/types/mess';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import {
  AnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import { useCallback, useMemo, useState } from 'react';
import idl from '@/idl/mess.json';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';

export function useAnchorProgram() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [program, setProgram] = useState<Program<Mess>>(
    new Program(
      idl as Mess,
      new AnchorProvider(connection, wallet as AnchorWallet, {
        commitment: 'confirmed',
      })
    )
  );

  useMemo(() => {
    setProgram(
      new Program(
        idl as Mess,
        new AnchorProvider(connection, wallet as AnchorWallet, {
          commitment: 'confirmed',
        })
      )
    );
  }, [connection, wallet]);

  async function getInitIx(): Promise<TransactionInstruction> {
    return await program.methods
      .init()
      .accounts({
        payer: wallet.publicKey!,
      })
      .instruction();
  }

  async function getSendIx(
    text: string,
    chatPda: PublicKey
  ): Promise<TransactionInstruction> {
    return await program.methods
      .send(text)
      .accounts({
        chat: chatPda!,
        sender: wallet.publicKey!,
      })
      .instruction();
  }

  const getChatAcc = useCallback(
    async (chatPda: PublicKey) => {
      return await program.account.chat.fetchNullable(chatPda);
    },
    [program]
  );

  return {
    getInitIx,
    getSendIx,
    getChatAcc,
  };
}

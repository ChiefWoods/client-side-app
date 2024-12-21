import { Mess } from "@/types/mess";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useMemo, useState } from "react";
import idl from "@/idl/mess.json";

export function useAnchorProgram() {
  const [program, setProgram] = useState<Program<Mess> | null>(null);
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  useMemo(() => {
    if (wallet) {
      const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
      setProgram(new Program(idl as Mess, provider));
    }
  }, [connection, wallet]);

  return { program };
}
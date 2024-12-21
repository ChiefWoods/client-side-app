import { deriveChatPda } from "@/lib/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

export function useChatPda() {
  const { publicKey } = useWallet();
  const [chatPda, setChatPda] = useState<string | null>(null);

  useEffect(() => {
    setChatPda(publicKey ? deriveChatPda(publicKey) : null);
  }, [publicKey]);

  return { chatPda, setChatPda };
}
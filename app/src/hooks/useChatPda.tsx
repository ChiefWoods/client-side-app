import { deriveChatPda } from '@/lib/utils';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';

export function useChatPda() {
  const { publicKey } = useWallet();
  const [chatPda, setChatPda] = useState<PublicKey | null>(null);

  useEffect(() => {
    setChatPda(publicKey ? deriveChatPda(publicKey) : null);
  }, [publicKey]);

  return { chatPda, setChatPda };
}

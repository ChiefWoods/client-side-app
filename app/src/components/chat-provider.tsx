import { useAnchorProgram } from '@/hooks/useAnchorProgram';
import { getChatPda } from '@/lib/pda';
import { Chat } from '@/types/accounts';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import useSWR from 'swr';

type ChatContextType = {
  isLoading: boolean;
  error: Error | null;
  mutate: () => void;
  chatPda: PublicKey | null;
  setChatPda: (chatPda: PublicKey) => void;
  chatAcc: Chat | null | undefined;
};

const ChatContext = createContext<ChatContextType>({} as ChatContextType);

export function useChat() {
  return useContext(ChatContext);
}

export default function ChatProvider({ children }: { children: ReactNode }) {
  const { publicKey } = useWallet();
  const { fetchChatAcc, getChatSubscription } = useAnchorProgram();
  const [chatPda, setChatPda] = useState<PublicKey | null>(null);

  useEffect(() => {
    if (publicKey) {
      setChatPda(getChatPda(publicKey));
    }
  }, [publicKey]);

  const {
    data: chatAcc,
    isLoading,
    error,
    mutate,
  } = useSWR(chatPda, async () => {
    return chatPda ? await fetchChatAcc(chatPda) : null;
  });

  useEffect(() => {
    if (chatPda) {
      const subscription = getChatSubscription(chatPda, mutate);

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [chatPda]);

  return (
    <ChatContext.Provider
      value={{ isLoading, error, mutate, chatPda, setChatPda, chatAcc }}
    >
      {children}
    </ChatContext.Provider>
  );
}

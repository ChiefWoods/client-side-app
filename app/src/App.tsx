import { useEffect, useState } from "react";
import { Chat, Header } from "./components";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Mess } from "./types/mess";
import IDL from "@/idl/mess.json";
import { getChatPDA } from "./lib/helper";

export default function App() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const wallet = useAnchorWallet();
  const [program, setProgram] = useState<Program<Mess> | null>(null);
  const [chatPDA, setChatPDA] = useState<string | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);

  useEffect(() => {
    if (wallet) {
      const provider = new AnchorProvider(connection, wallet, {});
      setProgram(new Program(IDL as Mess, provider));
    }
  }, [connection, wallet])

  useEffect(() => {
    if (publicKey) {
      setChatPDA(getChatPDA(publicKey));
    } else {
      setChatPDA(null);
    }
  }, [publicKey])

  return (
    <>
      <Header
        setChatPDA={setChatPDA}
      />
      <Chat
        program={program}
        chatPDA={chatPDA}
        isLoadingChat={isLoadingChat}
        setIsLoadingChat={setIsLoadingChat}
      />
    </>
  )
}

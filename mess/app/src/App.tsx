import { useEffect, useState } from "react";
import Chat from "./components/chat";
import Header from "./components/header";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Idl, Program } from "@coral-xyz/anchor";
import { Mess } from "./types/mess";
import mess from "@/mess.json";
import { Message } from "./types/message";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { chatroomFormSchema } from "./lib/formSchemas";

export default function App() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const wallet = useAnchorWallet();
  const [program, setProgram] = useState<Program<Mess>>();
  const [chatPDA, setChatPDA] = useState<PublicKey>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const chatroomForm = useForm<z.infer<typeof chatroomFormSchema>>({
    resolver: zodResolver(chatroomFormSchema),
    defaultValues: {
      chatroom: "",
    }
  })

  function handleError(err: Error) {
    if (err instanceof Error) {
      setErrorMessage(err.message);
    } else {
      setErrorMessage(String(err));
    }
  }

  useEffect(() => {
    if (wallet) {
      const provider = new AnchorProvider(connection, wallet, {});
      setProgram(new Program(mess as Idl, provider) as unknown as Program<Mess>);
    }
  }, [connection, wallet])

  useEffect(() => {
    async function fetchData() {
      if (publicKey && program) {
        const [chatPDA] = PublicKey.findProgramAddressSync([Buffer.from("global"), publicKey.toBuffer()], program.programId);

        try {
          const isChatInitialized = await program.account.chat.getAccountInfo(chatPDA);

          if (!isChatInitialized) {
            const inst = await program.methods
              .init()
              .accounts({
                chat: chatPDA,
                payer: publicKey
              })
              .instruction();

            const signature = await sendTransaction(new Transaction().add(inst), connection);

            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

            await connection.confirmTransaction({
              signature,
              blockhash,
              lastValidBlockHeight,
            });
          }

          setChatPDA(chatPDA);
        } catch (err) {
          console.error(err);

          // handleError(err as Error); // TODO
        }
      }
    }

    fetchData();

  }, [publicKey, program, connection, sendTransaction])

  useEffect(() => {
    async function fetchData() {
      if (program && chatPDA) {
        try {
          const { messages } = await program.account.chat.fetch(chatPDA);
          setMessages(messages);

          if (messages.length > 20) {
            setIsLimitReached(true);
            clearInterval(interval);
          }
        } catch (err) {
          console.error(err);

          // handleError(err as Error); // TODO
        }

        setIsJoining(false);
        chatroomForm.reset();
      }
    }

    const interval: NodeJS.Timeout = setInterval(fetchData, 5000)

    return () => clearInterval(interval);
  }, [program, chatPDA])

  return (
    <>
      <Header
        chatroomForm={chatroomForm}
        setChatPDA={setChatPDA}
        isJoining={isJoining}
        setIsJoining={setIsJoining} />
      {program && chatPDA &&
        <Chat
          program={program}
          chatPDA={chatPDA}
          messages={messages}
          setMessages={setMessages}
          errorMessage={errorMessage}
          isLimitReached={isLimitReached}
          isJoining={isJoining} />}
    </>
  )
}

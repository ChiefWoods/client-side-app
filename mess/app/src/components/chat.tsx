import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Button, Form, FormControl, FormField, FormItem, Input } from "./ui";
import { Copy, CopyCheck, LoaderCircle, Plus, SendHorizonal } from "lucide-react";
import { Program } from "@coral-xyz/anchor";
import { Mess } from "@/types/mess";
import { useEffect, useState } from "react";
import { Message, MessageGroup } from "@/types/message";
import { truncateAddress } from "@/lib/helper";
import { z } from "zod";
import { messageFormSchema } from "@/lib/formSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Transaction } from "@solana/web3.js";
import { Spinner, Text } from ".";

export default function Chat({
  program,
  chatPDA,
  isLoadingChat,
  setIsLoadingChat,
}: {
  program: Program<Mess> | null,
  chatPDA: string | null,
  isLoadingChat: boolean,
  setIsLoadingChat: (isLoadingChat: boolean) => void
}) {
  const { publicKey, connecting, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [doesChatroomExist, setDoesChatroomExist] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageGroup, setMessageGroup] = useState<MessageGroup[]>([]);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isCreatingChatroom, setIsCreatingChatroom] = useState<boolean>(false);

  const messageForm = useForm<z.infer<typeof messageFormSchema>>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      message: ""
    }
  })

  function copyChatPDA() {
    if (!isCopied && chatPDA) {
      navigator.clipboard.writeText(chatPDA.toString());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  }

  async function createChatroom() {
    if (program && chatPDA && publicKey) {
      setIsCreatingChatroom(true);

      try {
        const inst = await program.methods
          .init()
          .accounts({
            chat: chatPDA,
            payer: publicKey,
          })
          .instruction();

        const signature = await sendTransaction(new Transaction().add(inst), connection);

        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

        await connection.confirmTransaction({
          signature,
          blockhash,
          lastValidBlockHeight,
        });

        setDoesChatroomExist(true);
      } catch (err) {
        console.error(err)
      }

      setIsCreatingChatroom(false);
    }
  }

  async function sendMessage(values: z.infer<typeof messageFormSchema>) {
    if (program && chatPDA && publicKey) {
      try {
        const inst = await program.methods
          .send(values.message)
          .accounts({
            chat: chatPDA,
            sender: publicKey,
          })
          .instruction();

        const signature = await sendTransaction(new Transaction().add(inst), connection);

        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

        await connection.confirmTransaction({
          signature,
          blockhash,
          lastValidBlockHeight,
        });

        setMessages([...messages, { sender: publicKey, text: values.message }]);
        messageForm.reset();
      } catch (err) {
        console.error(err);
      }
    }
  }

  useEffect(() => {
    async function fetchData() {
      if (program && chatPDA) {
        setIsLoadingChat(true);

        try {
          const { messages } = await program.account.chat.fetch(chatPDA);
          setMessages(messages);
          setDoesChatroomExist(true);
        } catch (err) {
          console.error(err)
          setMessages([]);
          setDoesChatroomExist(false);
        }

        setIsLoadingChat(false);
      }
    }

    fetchData()
  }, [program, chatPDA, setIsLoadingChat])

  useEffect(() => {
    async function fetchData() {
      if (program && chatPDA) {
        try {
          const messageGroup: MessageGroup[] = [];
          let currentSender: string = "";
          let currentGroup: string[] = [];

          messages.forEach(({ sender, text }, i) => {
            if (currentSender === sender.toBase58()) {
              currentGroup.push(text);
            } else {
              if (currentGroup.length) {
                messageGroup.push({ sender: currentSender, texts: currentGroup });
              }

              currentSender = sender.toBase58();
              currentGroup = [text];
            }

            if (i === messages.length - 1) {
              messageGroup.push({ sender: currentSender, texts: currentGroup });
            }
          })

          setMessageGroup(messageGroup);
        } catch (err) {
          console.error(err);
          setMessageGroup([]);
        }
      }
    }

    fetchData();
  }, [program, chatPDA, messages])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    async function fetchData() {
      if (program && chatPDA) {
        interval = setInterval(async () => {
          try {
            const { messages } = await program.account.chat.fetch(chatPDA);
            setMessages(messages);

            if (messages.length >= 20) {
              clearInterval(interval!);
            }
          } catch (err) {
            console.error(err);
            setMessages([]);
          }
        }, 5000);
      }
    }

    fetchData()

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    }
  }, [program, chatPDA])

  useEffect(() => {
    if (chatPDA && doesChatroomExist) {
      document.title = `Mess | ${truncateAddress(chatPDA)}`;
    }
  }, [chatPDA, doesChatroomExist])

  return (
    <>
      <main className="flex flex-col gap-y-2 justify-center items-center grow h-full">
        {connecting ? (
          <Text content="Connecting..." />
        ) : (
          publicKey ? (
            isLoadingChat ? (
              <Spinner />
            ) : (
              doesChatroomExist ? (
                <>
                  <div className="w-full flex gap-x-2 items-center">
                    <h2 className="text-3xl text-primary font-semibold">Chatroom : {truncateAddress(chatPDA!)}</h2>
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      onClick={copyChatPDA}
                      className="aspect-square bg-transparent hover:bg-transparent"
                    >
                      {isCopied ? (
                        <CopyCheck className="text-green-500 hover:text-green-500" />
                      ) : (
                        <Copy className="text-primary hover:text-primary" />
                      )}
                    </Button>
                  </div>
                  <section className="flex flex-col gap-y-2 justify-start items-center w-full overflow-y-auto grow h-0">
                    {messages.length ? messageGroup.map(({ sender, texts }, i) => {
                      const isSelf = sender === publicKey.toBase58();

                      return (
                        <div
                          key={i}
                          className={`w-fit max-w-[200px] p-2 bg-primary-foreground flex flex-col gap-y-2 rounded-lg
                          ${isSelf
                              ? "self-end items-end bg-accent text-primary rounded-br-none mr-4"
                              : "self-start items-start bg-primary-foreground text-tertiary rounded-bl-none"}`}
                        >
                          {texts.map((text, j) => <p key={j}>{text}</p>)}
                          {!isSelf && <p className="text-[0.6rem]">{truncateAddress(sender)}</p>}
                        </div>
                      )
                    }) : (
                      <Text content="No messages sent." />
                    )}
                  </section>
                </>
              ) : (
                <div className="flex flex-col items-center gap-y-3">
                  <Text content="You don't own a chatroom." />
                  <Button
                    className="w-fit hover:bg-tertiary font-semibold flex gap-x-2 items-center"
                    onClick={createChatroom}
                    disabled={isCreatingChatroom}
                  >
                    {isCreatingChatroom ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                      <Plus size={16} />
                    )}
                    Create Chatroom
                  </Button>
                </div>
              )
            )
          ) : (
            <Text content="Connect Your Wallet" />
          )
        )}
      </main>
      {publicKey && doesChatroomExist && !isLoadingChat && <Form {...messageForm}>
        <form
          className="flex w-full gap-x-2 pb-4"
          onSubmit={messageForm.handleSubmit(sendMessage)}
        >
          <FormField
            control={messageForm.control}
            name="message"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Type a message"
                    {...field}
                    disabled={messageForm.formState.isSubmitting || messages.length >= 20}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            className="hover:bg-tertiary p-2 aspect-square"
            size={"icon"}
            type="submit"
            disabled={messageForm.formState.isSubmitting || messages.length >= 20}
          >
            {messageForm.formState.isSubmitting ? (
              <LoaderCircle size={20} className="animate-spin" />
            ) : (
              <SendHorizonal size={20} />
            )}
          </Button>
        </form>
      </Form>}
    </>
  )
}
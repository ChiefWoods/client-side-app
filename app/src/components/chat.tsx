import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Button, Form, FormControl, FormField, FormItem, Input, Tooltip, TooltipContent, TooltipProvider } from "./ui";
import { Copy, CopyCheck, LoaderCircle, Plus, SendHorizonal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Message, MessageGroup } from "@/types/message";
import { truncateAddress } from "@/lib/utils";
import { z } from "zod";
import { messageFormSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PublicKey } from "@solana/web3.js";
import { Spinner, Text } from ".";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { useAnchorProgram } from "@/hooks";
import { toast } from "sonner";

export default function Chat({
  chatPda
}: {
  chatPda: PublicKey | null
}) {
  const { publicKey, connecting, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { getInitTx, getSendTx, getChatAcc } = useAnchorProgram();
  const [doesChatroomExist, setDoesChatroomExist] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageGroup, setMessageGroup] = useState<MessageGroup[]>([]);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isCreatingChatroom, setIsCreatingChatroom] = useState<boolean>(false);
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);
  const chatSection = useRef<HTMLDivElement>(null);

  const messageForm = useForm<z.infer<typeof messageFormSchema>>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      message: ""
    }
  })

  function copyChatPDA() {
    if (!isCopied && chatPda) {
      navigator.clipboard.writeText(chatPda.toBase58());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  }

  async function createChatroom() {
    if (chatPda && publicKey) {
      setIsCreatingChatroom(true);

      try {
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
        const tx = await getInitTx();

        tx.recentBlockhash = blockhash;
        tx.lastValidBlockHeight = lastValidBlockHeight;

        const signature = await sendTransaction(tx, connection);

        await connection.confirmTransaction({
          blockhash,
          lastValidBlockHeight,
          signature,
        });

        setDoesChatroomExist(true);
      } catch (err) {
        console.error(err)
      }

      setIsCreatingChatroom(false);
    }
  }

  async function sendMessage(values: z.infer<typeof messageFormSchema>) {
    if (chatPda && publicKey) {
      try {
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
        const tx = await getSendTx(values.message.trim(), chatPda);

        tx.recentBlockhash = blockhash;
        tx.lastValidBlockHeight = lastValidBlockHeight;

        const signature = await sendTransaction(tx, connection);

        await connection.confirmTransaction({
          blockhash,
          lastValidBlockHeight,
          signature,
        });

        setMessages([...messages, { sender: publicKey, text: values.message }]);
        messageForm.reset();
        messageForm.setFocus("message");
      } catch (err) {
        console.error(err);
      }
    }
  }

  useEffect(() => {
    if (connected) {
      toast.success("Connected to wallet.");
    } else {
      toast.error("Disconnected from wallet.");
    }
  }, [connected])

  useEffect(() => {
    (async () => {
      if (chatPda) {
        setIsLoadingChat(true);
        
        const chatAcc = await getChatAcc(chatPda);

        if (chatAcc) {
          setMessages(chatAcc.messages);
          setDoesChatroomExist(true);
        } else {
          setMessages([]);
          setDoesChatroomExist(false);
        }

        setIsLoadingChat(false);
      }
    })();
  }, [chatPda, setIsLoadingChat, getChatAcc])

  useEffect(() => {
    (async () => {
      if (chatPda) {
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
    })();
  }, [chatPda, messages])

  useEffect(() => {
    if (messageGroup.length) {
      chatSection.current?.scrollTo({
        top: chatSection.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messageGroup])

  useEffect(() => {
    let subscriptionId: number | null = null;

    (async () => {
      if (chatPda) {
        subscriptionId = connection.onAccountChange(chatPda, async () => {
          try {
            const chatAcc = await getChatAcc(chatPda);
            const messages = chatAcc?.messages || [];
            setMessages(messages);
          } catch (err) {
            console.error(err);
            setMessages([]);
          }
        });
      }
    })();

    return () => {
      if (subscriptionId) {
        connection.removeAccountChangeListener(subscriptionId);
      }
    }
  }, [chatPda, connection, getChatAcc])

  useEffect(() => {
    if (chatPda && doesChatroomExist) {
      document.title = `Mess | ${truncateAddress(chatPda.toBase58())}`;
    } else {
      document.title = "Mess";
    }
  }, [chatPda, doesChatroomExist])

  useEffect(() => {
    if (messageForm.formState.errors.message) {
      toast.error(messageForm.formState.errors.message.message);
    } else {
      toast.dismiss();
    }
  }, [messageForm.formState.errors.message]);

  useEffect(() => {
    messageForm.reset()
  }, [connected, messageForm])

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
              chatPda && doesChatroomExist ? (
                <>
                  <div className="w-full flex gap-x-2 items-center">
                    <h2 className="text-2xl sm:text-3xl text-primary font-semibold">Chatroom : {truncateAddress(chatPda.toBase58())}</h2>
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      onClick={copyChatPDA}
                      className="aspect-square bg-transparent hover:bg-transparent"
                    >
                      {isCopied ? (
                        <CopyCheck className="text-green-500 hover:text-green-500" size={20} />
                      ) : (
                        <Copy className="text-primary hover:text-primary" size={20} />
                      )}
                    </Button>
                  </div>
                  <section
                    className={`flex flex-col gap-y-2 items-center w-full overflow-y-auto grow h-0 ${messages.length ? "justify-start" : "justify-center"}`}
                    ref={chatSection}
                  >
                    {messages.length ? messageGroup.map(({ sender, texts }, i) => {
                      const isSelf = sender === publicKey.toBase58();

                      return (
                        <div
                          key={i}
                          className={`w-fit max-w-[200px] sm:max-w-[400px] p-2 bg-primary-foreground flex flex-col gap-y-2 rounded-lg break-words
                          ${isSelf
                              ? "self-end items-end bg-accent text-primary rounded-br-none mr-4"
                              : "self-start items-start bg-primary-foreground text-primary rounded-bl-none"}`}
                        >
                          {texts.map((text, j) => <p key={j} className="max-w-full">{text}</p>)}
                          {!isSelf && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <p className="text-[0.6rem]">{truncateAddress(sender)}</p>
                                </TooltipTrigger>
                                <TooltipContent>{sender}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
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
                    disabled={messageForm.formState.isSubmitting}
                    className={messageForm.formState.errors.message && "border-destructive"}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            className="btn"
            size={"icon"}
            type="submit"
            disabled={messageForm.formState.isSubmitting}
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
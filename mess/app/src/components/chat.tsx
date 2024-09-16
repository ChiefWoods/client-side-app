import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program } from "@coral-xyz/anchor";
import { useEffect, useState } from "react";
import type { Mess } from "@/types/mess";
import { PublicKey, Transaction } from "@solana/web3.js";
import { Message, MessageGroup } from "@/types/message";
import { Button, Form, FormControl, FormField, FormItem, Input } from "./ui";
import { Copy, CopyCheck, Loader2, SendHorizonal } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { messageSchema } from "@/lib/formSchemas";

export default function Chat({
  program,
  chatPDA,
  messages,
  setMessages,
  errorMessage,
  isLimitReached,
  isJoining
}: {
  program: Program<Mess>,
  chatPDA: PublicKey,
  messages: Message[],
  setMessages: (messages: Message[]) => void,
  errorMessage: string,
  isLimitReached: boolean,
  isJoining: boolean
}) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [messageGroups, setMessageGroups] = useState<MessageGroup[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const messageForm = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    }
  })

  function copyChatPDA() {
    if (!isCopied) {
      navigator.clipboard.writeText(chatPDA.toString());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  }

  function truncateAddress(address: string) {
    return `${address.slice(0, 4)}....${address.slice(-4)}`;
  }

  async function sendMessage(values: z.infer<typeof messageSchema>) {
    if (publicKey) {
      setIsSending(true);

      try {
        const inst = await program.methods
          .send(values.message)
          .accounts({
            chat: chatPDA,
            sender: publicKey
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
      } catch (err) {
        console.error(err)
      }

      setIsSending(false);
      messageForm.reset();
    }
  }

  useEffect(() => {
    if (messages.length) {
      const newMessageGroups: MessageGroup[] = [];
      let currentSender: string = "";
      let currentGroup: string[] = [];

      messages.forEach(({ sender, text }, i) => {
        if (currentSender === sender.toString()) {
          currentGroup.push(text);
        } else {
          if (currentGroup.length) {
            newMessageGroups.push({ sender: currentSender, texts: currentGroup });
          }

          currentSender = sender.toString();
          currentGroup = [text];
        }

        if (i === messages.length - 1) {
          newMessageGroups.push({ sender: currentSender, texts: currentGroup });
        }
      })

      setMessageGroups(newMessageGroups);
    }
  }, [messages])

  return (
    <main className={`h-full flex justify-center px-12 py-4 ${publicKey ? "" : "items-center"}`}>
      {errorMessage ? (
        <h2 className="font-semibold text-2xl text-primary">{errorMessage}</h2>
      ) :
        publicKey ? (
          <section className="w-full h-full flex flex-col justify-center gap-y-4 text-primary">
            <div className="flex gap-x-4 justify-start items-center min-h-[40px]">
              {chatPDA && !isJoining && <>
                <h1 className="font-semibold text-3xl text-start">Chatroom : {truncateAddress(chatPDA.toString())}</h1>
                <Button
                  variant={"link"}
                  onClick={copyChatPDA}
                  className="w-fit h-fit p-2">
                  {!isCopied
                    ? <Copy size={20} />
                    : <CopyCheck
                      size={20}
                      color="#22c55e" />}
                </Button>
              </>}
            </div>
            <section className={`h-full flex flex-col gap-y-2 p-4 overflow-y-scroll ${messages.length ? "items-center justify-center" : "justify-center"} ${isJoining ? "justify-center" : ""}`}>
              {isJoining ? (
                <Loader2
                  size={32}
                  className="animate-spin text-secondary" />
              ) : messageGroups.length ? messageGroups.map(({ sender, texts }, i) => {
                const isSelf = sender === publicKey.toString();

                return (
                  <div key={i} className={`chat-box ${isSelf ? "self" : "other"}`}>
                    {texts.map((text, j) => <p key={j}>{text}</p>)}
                    {!isSelf && <p className="text-[0.6rem]">{truncateAddress(sender)}</p>}
                  </div>
                )
              }) : (
                <h2 className="font-semibold text-2xl text-primary text-center">No messages yet</h2>
              )}
            </section>
            <Form {...messageForm}>
              <form
                onSubmit={messageForm.handleSubmit(sendMessage)}
                className="flex gap-x-2">
                <FormField
                  control={messageForm.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          placeholder={isLimitReached ? "Maximum messages limit reached" : "Type a message"}
                          required
                          disabled={isLimitReached || isSending} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  className="flex aspect-square p-2 text-primary hover:bg-tertiary"
                  type="submit"
                  disabled={isSending}>
                  {!isSending
                    ? <SendHorizonal
                      size={20}
                      color="#fff" />
                    : <Loader2
                      size={20}
                      className="animate-spin text-secondary" />}
                </Button>
              </form>
            </Form>
          </section>
        ) : (
          <h2 className="font-semibold text-2xl text-primary">Connect Your Wallet</h2>
        )}
    </main>
  )
}
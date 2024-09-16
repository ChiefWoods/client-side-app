import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Loader2, MessageSquareMore, Search } from "lucide-react";
import { Button, Form, FormControl, FormField, FormItem, Input } from "./ui";
import { z } from "zod";
import { PublicKey } from "@solana/web3.js";
import { UseFormReturn } from "react-hook-form"
import { useWallet } from "@solana/wallet-adapter-react";
import { chatroomFormSchema } from "@/lib/formSchemas";

export default function Header({
  chatroomForm,
  setChatPDA,
  isJoining,
  setIsJoining
}: {
  chatroomForm: UseFormReturn<z.infer<typeof chatroomFormSchema>>,
  setChatPDA: (pda: PublicKey) => void,
  isJoining: boolean,
  setIsJoining: (isJoining: boolean) => void
}) {
  const { publicKey } = useWallet();

  function joinChatroom(values: z.infer<typeof chatroomFormSchema>) {
    setIsJoining(true);
    setChatPDA(new PublicKey(values.chatroom));
  }

  return (
    <header className="px-12 py-4 flex justify-between gap-x-4 items-center">
      <div className="flex gap-x-4 items-center text-primary">
        <MessageSquareMore size={32} />
        <h1 className="font-semibold text-2xl">Mess</h1>
      </div>
      {publicKey && <Form {...chatroomForm}>
        <form onSubmit={chatroomForm.handleSubmit(joinChatroom)} className="ml-auto flex gap-x-2">
          <FormField
            control={chatroomForm.control}
            name="chatroom"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    placeholder="Enter chatroom address"
                    required
                    disabled={isJoining}
                    className="mt-auto min-w-[250px]" />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            className="flex aspect-square p-2 text-primary hover:bg-tertiary"
            type="submit"
            disabled={isJoining}>
            {!isJoining
              ? <Search size={20} color="#fff" />
              : <Loader2
                size={20}
                className="animate-spin text-secondary" />}
          </Button>
        </form>
      </Form>}
      <WalletMultiButton />
    </header >
  )
}
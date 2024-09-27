import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button, Form, FormControl, FormField, FormItem, Input } from "./ui";
import { MessageSquareMore, Search } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getChatPDA } from "@/lib/helper";
import { useForm } from "react-hook-form";
import { searchFormSchema } from "@/lib/formSchemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Header({ setChatPDA }: { setChatPDA: (chatPDA: string) => void }) {
  const { publicKey } = useWallet();

  const searchForm = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      chatroom: ""
    }
  });

  function showDefaultChatroom() {
    if (publicKey) {
      setChatPDA(getChatPDA(publicKey));
    }
  }

  function joinChatroom(values: z.infer<typeof searchFormSchema>) {
    setChatPDA(values.chatroom);
    searchForm.reset();
  }

  return (
    <header className="flex justify-between items-center gap-x-4 pt-4">
      <Button
        variant={"ghost"}
        className="hover:bg-transparent hover:text-primary text-primary flex gap-x-3 items-center pl-0"
        onClick={showDefaultChatroom}
      >
        <MessageSquareMore
          size={32}
        />
        <p className="text-3xl font-semibold hidden md:block">Mess</p>
      </Button>
      <Form {...searchForm}>
        <form
          className="flex gap-x-2 ml-auto"
          onSubmit={searchForm.handleSubmit(joinChatroom)}
        >
          <FormField
            control={searchForm.control}
            name="chatroom"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter chatroom address"
                    {...field}
                    disabled={searchForm.formState.isSubmitting}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            className="hover:bg-tertiary p-2 aspect-square"
            size={"icon"}
            type="submit"
            disabled={searchForm.formState.isSubmitting}
          >
            <Search size={20} />
          </Button>
        </form>
      </Form>
      <WalletMultiButton />
    </header>
  )
}
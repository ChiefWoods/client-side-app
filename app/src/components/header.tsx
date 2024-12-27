import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button } from "./ui";
import { ArrowLeft, MessageSquareMore, Search } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useForm } from "react-hook-form";
import { searchFormSchema } from "@/lib/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { ModeToggle, SearchBar } from ".";
import { deriveChatPda } from "@/lib/utils";
import { PublicKey } from "@solana/web3.js";

export default function Header({
  setChatPda
}: {
  setChatPda: (chatPda: PublicKey) => void
}) {
  const { publicKey } = useWallet();
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 640);
  const [isSearchExpanded, setIsSearchExpanded] = useState<boolean>(false);

  const searchForm = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      chatroom: ""
    }
  });

  function showDefaultChatroom() {
    if (publicKey) {
      setChatPda(deriveChatPda(publicKey));
    }
  }

  function joinChatroom(values: z.infer<typeof searchFormSchema>) {
    setChatPda(new PublicKey(values.chatroom));
    searchForm.reset();
  }

  useEffect(() => {
    function handleResize() {
      const belowBreakpoint = window.innerWidth < 640;
      setIsMobile(belowBreakpoint);

      if (!belowBreakpoint) {
        setIsSearchExpanded(false);
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  useEffect(() => {
    if (isSearchExpanded) {
      searchForm.setFocus("chatroom");
    }
  }, [isSearchExpanded, searchForm])

  return (
    <header className="flex sm:justify-between items-center gap-x-2 sm:gap-x-4 pt-4 h-[80px]">
      {!isSearchExpanded && <Button
        variant={"ghost"}
        className="hover:bg-transparent hover:text-primary text-primary flex gap-x-3 items-center pl-0 mr-auto"
        onClick={showDefaultChatroom}
      >
        <MessageSquareMore
          size={32}
        />
        <p className="text-3xl font-semibold hidden sm:block">Mess</p>
      </Button>}
      {publicKey && (
        isMobile ? (
          isSearchExpanded ? (
            <>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="hover:bg-transparent hover:text-primary text-primary flex gap-x-3"
                onClick={() => setIsSearchExpanded(false)}
              >
                <ArrowLeft size={20} />
              </Button>
              <SearchBar
                joinChatroom={joinChatroom}
                searchForm={searchForm}
              />
            </>
          ) : (
            <Button
              variant={"ghost"}
              size={"icon"}
              className="hover:bg-transparent hover:text-primary text-primary flex gap-x-3"
              onClick={() => setIsSearchExpanded(true)}
            >
              <Search size={20} />
              <p className="text-3xl font-semibold hidden md:block">Mess</p>
            </Button>
          )
        ) : (
          <SearchBar
            joinChatroom={joinChatroom}
            searchForm={searchForm}
          />
        )
      )}
      {!isSearchExpanded && (
        <>
          <ModeToggle />
          <WalletMultiButton />
        </>
      )}
    </header>
  )
}

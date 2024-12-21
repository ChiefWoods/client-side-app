import { Chat, Header } from "./components";
import { Toaster } from "./components/ui";
import { useChatPda } from "./hooks";

export default function App() {
  const { chatPda, setChatPda } = useChatPda();

  return (
    <>
      <Header
        setChatPda={setChatPda}
      />
      <Chat
        chatPda={chatPda}
      />
      <Toaster
        richColors
        closeButton
        toastOptions={{
          classNames: {
            error: 'bg-red-400',
            success: 'text-green-400',
            warning: 'text-yellow-400',
            info: 'bg-blue-400',
          },
        }}
      />
    </>
  )
}

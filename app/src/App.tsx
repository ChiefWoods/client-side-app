import { Chat, Header } from "./components";
import { useChatPda } from "./hooks";

export default function App() {
  const { chatPda, setChatPda } = useChatPda();

  return (
    <>
      <Header setChatPda={setChatPda} />
      <Chat chatPda={chatPda} />
    </>
  )
}

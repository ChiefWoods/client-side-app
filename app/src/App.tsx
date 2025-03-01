import Chat from './components/chat';
import ChatProvider from './components/chat-provider';
import Header from './components/header';
import SolanaProvider from './components/solana-provider';
import ThemeProvider from './components/theme-provider';
import { Toaster } from './components/ui';
import { SWRConfig } from 'swr';

export default function App() {
  return (
    <>
      <SWRConfig value={{ suspense: false, revalidateOnFocus: false }}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <SolanaProvider>
            <ChatProvider>
              <Header />
              <Chat />
            </ChatProvider>
          </SolanaProvider>
        </ThemeProvider>
      </SWRConfig>
      <Toaster
        richColors
        closeButton
        theme="system"
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
  );
}

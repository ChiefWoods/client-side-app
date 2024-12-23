import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { BitgetWalletAdapter, PhantomWalletAdapter, SolflareWalletAdapter, SalmonWalletAdapter } from "@solana/wallet-adapter-wallets";
import { ReactNode, useMemo } from "react";
import "@solana/wallet-adapter-react-ui/styles.css";

export default function SolanaProvider({ children }: { children: ReactNode }) {
  const endpoint = useMemo(() => import.meta.env.VITE_RPC_URL, []);
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new BitgetWalletAdapter(),
    new SalmonWalletAdapter(),
  ], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
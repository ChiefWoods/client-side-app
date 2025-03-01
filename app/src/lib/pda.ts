import { PublicKey } from '@solana/web3.js';
import idl from '@/idl/mess.json';

export function getChatPda(owner: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('global'), owner.toBuffer()],
    new PublicKey(idl.address)
  )[0];
}

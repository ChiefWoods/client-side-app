import {
  AddressLookupTableAccount,
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import idl from '@/idl/mess.json';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  getExplorerLink,
  getSimulationComputeUnits,
} from '@solana-developers/helpers';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function deriveChatPda(owner: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('global'), owner.toBuffer()],
    new PublicKey(idl.address)
  )[0];
}

export function truncateAddress(address: string): string {
  return `${address.slice(0, 4)}....${address.slice(-4)}`;
}

export async function setComputeUnitLimitAndPrice(
  connection: Connection,
  instructions: TransactionInstruction[],
  payer: PublicKey,
  lookupTables: Array<AddressLookupTableAccount> | []
): Promise<Transaction> {
  const tx = new Transaction();

  const units = await getSimulationComputeUnits(
    connection,
    instructions,
    payer,
    lookupTables
  );

  if (units) {
    tx.add(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: Math.ceil(units * 1.1),
      })
    );
  }

  const recentFees = await connection.getRecentPrioritizationFees();
  const priorityFee =
    recentFees.reduce(
      (acc, { prioritizationFee }) => acc + prioritizationFee,
      0
    ) / recentFees.length;

  tx.add(
    ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: BigInt(Math.ceil(priorityFee)),
    }),
    ...instructions
  );

  return tx;
}

export function getTransactionLink(signature: string): string {
  return getExplorerLink('tx', signature, import.meta.env.VITE_RPC_CLUSTER);
}

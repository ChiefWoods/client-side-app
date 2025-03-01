import {
  getExplorerLink,
  getSimulationComputeUnits,
} from '@solana-developers/helpers';
import { connection } from './constants';
import {
  AddressLookupTableAccount,
  ComputeBudgetProgram,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';

export async function buildTx(ixs: TransactionInstruction[], payer: PublicKey) {
  const altPubkey = import.meta.env.VITE_ADDRESS_LOOKUP_TABLE;
  const alt: AddressLookupTableAccount[] = [];

  if (altPubkey) {
    const { value } = await connection.getAddressLookupTable(
      new PublicKey(altPubkey)
    );

    if (value) {
      alt.push(value);
    }
  }

  const units = await getSimulationComputeUnits(connection, ixs, payer, alt);

  if (!units) {
    throw new Error('Unable to get compute limits.');
  }

  const recentFees = await connection.getRecentPrioritizationFees();
  const priorityFee = Math.floor(
    recentFees.reduce(
      (acc, { prioritizationFee }) => acc + prioritizationFee,
      0
    ) / recentFees.length
  );

  const ixsWithCompute = [
    ComputeBudgetProgram.setComputeUnitLimit({
      units: Math.ceil(units * 1.1),
    }),
    ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: priorityFee,
    }),
    ...ixs,
  ];

  const messageV0 = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
    instructions: ixsWithCompute,
  }).compileToV0Message(alt);

  return new VersionedTransaction(messageV0);
}

export function getTransactionLink(signature: string): string {
  return getExplorerLink('tx', signature, import.meta.env.VITE_RPC_CLUSTER);
}

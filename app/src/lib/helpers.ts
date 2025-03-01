import {
  getExplorerLink,
  getSimulationComputeUnits,
} from '@solana-developers/helpers';
import { connection } from './constants';
import {
  ComputeBudgetProgram,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';

export async function buildTx(ixs: TransactionInstruction[], payer: PublicKey) {
  const latPubkey = import.meta.env.VITE_MESS_LAT;
  const lat = (await connection.getAddressLookupTable(new PublicKey(latPubkey)))
    .value;
  const latArr = lat ? [lat] : [];

  const units = await getSimulationComputeUnits(connection, ixs, payer, latArr);

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
  }).compileToV0Message(latArr);

  return new VersionedTransaction(messageV0);
}

export function getTransactionLink(signature: string): string {
  return getExplorerLink('tx', signature, import.meta.env.VITE_RPC_CLUSTER);
}

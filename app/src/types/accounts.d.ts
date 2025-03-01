import { IdlAccounts } from '@coral-xyz/anchor';
import { Mess } from './mess';

export type Chat = IdlAccounts<Mess>['chat'];

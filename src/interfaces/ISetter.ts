import { TransactionType } from "../models/Transactions";

export interface ISetter<T> {
	createOne(transaction: TransactionType): Promise<T | null>;
}
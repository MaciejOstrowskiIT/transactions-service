export interface TransactionType {
	id: string;
	debit: number | string;
	credit: number | string;
	date: Date | string;
	senderName: string;
	senderAccount: string;
	receiverName: string;
	receiverAccount: string;
	value: string;
	additionalData: {
		street: string,
		city: string,
		gender: string
	};
	bookedAt: string | null;
}

export type TransactionDb = Omit<TransactionType, "id"> & { _id: string }

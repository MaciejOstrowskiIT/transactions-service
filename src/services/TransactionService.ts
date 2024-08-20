import { TransactionType } from "../models/Transactions";
import { Transaction } from "../domain/Transaction";
import { DataMapper } from "../models/DataMapper";
import { v4 as uuidv4 } from "uuid";
import { AMQP } from "../amqp/config";

export class TransactionService {
	constructor(private transactions: DataMapper<Transaction>, private amqp: AMQP) {}

	async seedTransactions() {
		const transactions = [];
		for (let i = 0; i < 10; i++) {
			const transaction = {
				debit: `Account ${Math.floor(Math.random() * 100)}`,
				credit: `Account ${Math.floor(Math.random() * 100)}`,
				date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
				senderName: `Sender ${Math.floor(Math.random() * 100)}`,
				senderAccount: `Account ${Math.floor(Math.random() * 100)}`,
				receiverName: `Receiver ${Math.floor(Math.random() * 100)}`,
				receiverAccount: `Account ${Math.floor(Math.random() * 100)}`,
				value: String(Math.floor(Math.random() * 1000)),
				additionalData: {
					street: `Street ${Math.floor(Math.random() * 100)}`,
					city: `City ${Math.floor(Math.random() * 100)}`,
					gender: Math.random() < 0.5 ? 'Male' : 'Female',
				},
				bookedAt: String(new Date(Date.now() - Math.floor(Math.random() * 1000000000))),
			};
			transactions.push(transaction);
		}

		for (const transaction of transactions) {
			await this.create(transaction);
		}
		this.amqp.send('transactions', 'create-transaction', {message: 'zrobilismy se transakcje'})
		// this.amqp.send('transactions', 'create-transaction', {message: 'zrobilismy se transakcje'})
		// this.amqp.send('transactions', 'create-transaction', {message: 'zrobilismy se transakcje'})
		// this.amqp.send('transactions', 'create-transaction', {message: 'zrobilismy se transakcje'})
		// this.amqp.send('transactions', 'create-transaction', {message: 'zrobilismy se transakcje'})
		// this.amqp.send('transactions', 'create-transaction', {message: 'zrobilismy se transakcje'})
		// this.amqp.send('transactions', 'create-transaction', {message: 'zrobilismy se transakcje'})
		// this.amqp.send('transactions', 'create-transaction', {message: 'zrobilismy se transakcje'})

	}

	async create(request: Omit<TransactionType, "id">) {
		const transaction = new Transaction(
			uuidv4(),
			request.debit,
			request.credit,
			request.date,
			request.senderName,
			request.senderAccount,
			request.receiverName,
			request.receiverAccount,
			request.value,
			request.additionalData,
			request.bookedAt,
		);
		await this.transactions.insert(transaction);
	}

	async fetch(id: string) {
		return await this.transactions.fetch(id);
	}

	async bookTransaction(id: string) {
		const transaction = await this.fetch(id);
		if (!transaction) {
			return;
		}
		transaction.bookTransaction("12-12-2000");
		await this.transactions.update(transaction);
		return "updated";
	}

	async getUserData(id: string) {
		const user = await this.fetch(id);
		if (!user) return; //obsluga bledu
		return user.getUserData(); // nasza metoda .mapToUserData()

		/*jak osbluzyc nowa logike biznesowa korzystajac z tego template'u aplikacji
		1. Tworzymy nowy route.
		2. Tworzymy nowa metode w controllerze, ktory bedzie callowany przez ten route
		3. tworzymy nowa metode na poziomie service (np. getUserAddress, bo mamy tylko fetch, ktory pobiera calego usera, a my calego nie chcemy)
		4. dodajemy nowa metoda na poziomie Entity/domeny (User), ktora na podstawie danych naszej instancji (entity/klasy) zwraca tylko te dane, ktorych
		oczekujemy. np metoda mapUserAddress(), ktora zwroci nam tylko adres usera
		5. returnujemy te dane z servicu do controllera
		6. controller zwraca je jako response
		//////////////////////////////////
		jakie dodatkowe korzysci daje ten template:
		1. jesli chcemy, zeby user od dzisiaj mial w sobie numer telefonu to dodajemy numer telefonu w modelu i w entity w serializerze i w metodzie mapToJson();
		*/
	}

	async fetchAll() {
		return await this.transactions.fetchAll();
	}

	async correctTransaction(id: string, newValue: string) {
		const transaction = await this.transactions.fetch(id);
		if (!transaction) {
			throw new Error("User not found");
		}
		transaction.correct(newValue);
		await this.transactions.update(transaction);
	}

	// async getAll() {
	// 	return await this.collection.find().toArray();
	// }

	// async getOneById(id: ObjectId): Promise<TransactionType | null> {
	// 	return await this.collection.findOne( id );
	// }

	// async createOne(transaction: User): Promise<TransactionType | null> {

	// 	const newTransactionId = await this.collection.insertOne( this.mapToDb(transaction) );

	//  	return await this.collection.findOne({_id: newTransactionId.insertedId})
	// }

	// private mapToEntity() {

	// }

	// private mapToDb(entity: User) {
	// 	return {_id: entity.getId(), ...entity}

	// }
}
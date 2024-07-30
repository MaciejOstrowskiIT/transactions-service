import { Collection, ObjectId, InsertOneResult } from "mongodb";
import { IGetter } from "../interfaces/IGetter";
import { TransactionDb, TransactionType } from "../models/Transactions";
import { ISetter } from "../interfaces/ISetter";
import { Transaction } from "../domain/Transaction";
import { DataMapper } from "../models/DataMapper";
import {v4 as uuidv4} from 'uuid'

export class TransactionService
{
	constructor(private transactions: DataMapper<Transaction>) {}


	async create(request: Omit<TransactionType, 'id'>) {
		const transaction = new Transaction(uuidv4(), request.debit, request.credit, request.date, request.senderName,
			request.senderAccount, request.receiverName, request.receiverAccount, request.value
		)
		await this.transactions.insert(transaction)
	}

	async fetch(id: string) {
		return await this.transactions.fetch(id);
	}

	async bookTransaction(id: string) {
		const transaction = await this.fetch(id);
		if(!transaction) {
			return;
		}
		transaction.bookTransaction('12-12-2000');
		await this.transactions.update(transaction);
		return 'updated'
	}

	async getUserData(id: string) {
		const user = await this.fetch(id);
		if(!user) return; //obsluga bledu
		return user.getUserData() // nasza metoda .mapToUserData()

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
		if(!transaction) {
			throw new Error('Transaction not found')
		}
		transaction.correct(newValue);
		await this.transactions.update(transaction)
	}
	// async getAll() {
	// 	return await this.collection.find().toArray();
	// }

	// async getOneById(id: ObjectId): Promise<TransactionType | null> {
	// 	return await this.collection.findOne( id );
	// }

	// async createOne(transaction: Transaction): Promise<TransactionType | null> {

	// 	const newTransactionId = await this.collection.insertOne( this.mapToDb(transaction) );
		
	//  	return await this.collection.findOne({_id: newTransactionId.insertedId})
	// }

	// private mapToEntity() {

	// }

	// private mapToDb(entity: Transaction) {
	// 	return {_id: entity.getId(), ...entity}

	// }
}
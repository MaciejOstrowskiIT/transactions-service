import { Transaction } from '../domain/Transaction';
import { TransactionDb, TransactionType } from '../models/Transactions';
import { Serializer } from './Serializer';

//TransactionDb powinno nazywac sie TransactionDbSchema
export class MongoTransactionSerializer implements Serializer<TransactionDb, Transaction> {

  mapToEntity(document: TransactionDb): Transaction {
    return new Transaction(
        document._id,
        document.debit,
        document.credit,
        document.date,
        document.senderName,
        document.senderAccount,
        document.receiverName,
        document.receiverAccount,
        document.value,
        document.additionalData,
        document.bookedAt
    );
  }

  mapToDb(entity: Transaction): TransactionDb {
    return { _id: entity.getId(), ...entity.mapToJson() }; //tutaj krzyczy bo w metodie mapToJson nie zwracamy wszystkiego
  }

}

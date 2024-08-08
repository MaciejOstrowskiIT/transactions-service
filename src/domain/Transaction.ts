import { TransactionType } from "../models/Transactions";
import {IDomain} from './IDomain';

type TransactionKeys = keyof TransactionType

export class Transaction implements IDomain<TransactionType>{
    constructor(
        private id: string,
        private debit: number | string,
        private credit: number | string,
        private date: Date | string,
        private senderName: string,
        private senderAccount: string,
        private receiverName: string,
        private receiverAccount: string,
        private value: string,
        private additionalData: {
            street: string,
            city: string,
            gender: string
        },
        private bookedAt: string|null = null
    ){}

    getId():string {
        return this.id
    }

    mapToJson():TransactionType {
        return {
            id: this.id,
            debit: this.debit,
            credit: this.credit,
            date: this.date,
            senderName: this.senderName,
            senderAccount: this.senderAccount,
            receiverName: this.receiverName,
            receiverAccount: this.receiverAccount,
            value: this.value,
            additionalData: this.additionalData,
            bookedAt: this.bookedAt,
        }
    }

    correct(newValue: string) {
        this.value = newValue;
    }


    // fixProblem(key: TransactionKeys, value: string) {
    //     this[key] = value
    // }

    bookTransaction(date: string) {
        this.bookedAt = date
    }


    getUserData() {
        return {
            id: this.id,
            address: {
                street: this.additionalData.street,
                city: this.additionalData.city
            }
        }
    }

    // transformUserData() {
    //     return {
    //         email: this.email,
    //         username: this.username
    //     }
    // }


}
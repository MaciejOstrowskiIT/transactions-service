import { Request, Response } from "express";
import { TransactionType } from "../models/Transactions";
import { TransactionService } from "../services/TransactionService";
import { rmSync } from "fs";

export class Controller {
	constructor(private service: TransactionService) {}

	public async getTransactions(req: Request, res: Response) {
		try {
			const transactions = this.service.fetchAll()
			res.status(200).send(transactions);
		} catch(err) {
			res.status(504).send(err);
		}
	}

	public async createTransaction(req: Request, res: Response) {
		try {
			const { debit, credit, value, senderName, senderAccount, receiverName, receiverAccount } = req.body;
		
			const transaction: Omit<TransactionType, 'id'> = {
				debit,
				credit,
				date: new Date().toISOString(),
				value,
				senderName,
				senderAccount,
				receiverName,
				receiverAccount
			};
			await this.service.create( transaction );
			res.status( 200 ).json( { message: 'Object has been created successfuly' } );
		} catch ( error ) {
			res.status( 500 ).json( { error: "Internal server error" } );
		}
	}

	public async fetchSingleTransaction(req: Request, res: Response) {
		try {
			const id = req.params.id
			if(!id) {
				throw new Error('No id provided')
			}
			const transaction = await this.service.fetch(id)
			res.status(200).send(transaction)
		} catch(err) {
			res.status(504).send(err)
		}
	}

	public async correctSingleTransaction(req: Request, res: Response) {
		try {
			const id = req.params.id;
			if(!id) {
				throw new Error('No id provided')
			}
			const newValue = req.body.newValue;
			await this.service.correctTransaction(id, newValue)
			const updatedTransaction = this.service.fetch(id);
			res.status(200).send(updatedTransaction);
		}catch(err) {
			res.status(504).send(err)
		}
	}

	public async getUserDetails(req: Request, res: Response) {
		try {
			const userId = req.params.id;
		if(!userId) {
			throw new Error('User not found')
		}
			const user = await this.service.getUserData(userId);
			res.status(200).send(user);
		}
		catch (err) {
			res.status(504).send(err);
		}

	}
}

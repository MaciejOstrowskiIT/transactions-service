import express from 'express';
import cors from 'cors';
import { logger } from './utils/logs';
import { MongoClient } from 'mongodb';
import { Controller } from './controllers/Controller';
import { TransactionType } from './models/Transactions';
import { TransactionService } from './services/TransactionService';
import { registerRoutes } from './utils/registerRoutes';
import { MongoMapper } from './mappers/MongoMapper';
import { MongoTransactionSerializer } from './mappers/MongoTransactionSerializer';
import { AMQP, Exchange } from './amqp/config';

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));


( async () => {

  try {
    const mongoClient = await new MongoClient(process.env.MONGO_URL!).connect();
    const database = mongoClient.db('bankTS');
    const exchanges: Exchange[] = [
      {name: 'transactions', queues: ['create-transactions']}
    ]
    const amqp = new AMQP(exchanges);
    await amqp.config(); 

    app.listen(process.env.PORT, () => {
      logger('info', 'Microservice is working fine at port ' + process.env.PORT);
      logger('info', '[Transactions] Connected');
    });

    const service = new TransactionService(new MongoMapper(database.collection(process.env.COLLECTION_NAME!), new MongoTransactionSerializer()), amqp );
    const transactionsController = new Controller(service);

    await service.seedTransactions();

    registerRoutes(app, transactionsController);

  } catch (err) {
    console.log('App crashed due to an error: ' + err);
  }
} )();
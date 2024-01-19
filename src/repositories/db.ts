import { MongoClient } from 'mongodb';
import { config } from '../config';

class MongoDB {
  mongoClient = new MongoClient(config.MONGO_URL, { authSource: 'admin' });

  async connect() {
    try {
      console.log('Connecting to MongoDB..');
      await this.mongoClient.connect();

      console.log('Successfuly connected to MongoDB');
    } catch (err: any) {
      console.error('Failed to connect to MongoDB');
      console.error(err.stack);
      throw err;
    }
  }

  get db() {
    return this.mongoClient.db(config.MONGO_DB_NAME);
  }
}

const mongo = new MongoDB();

export default mongo;

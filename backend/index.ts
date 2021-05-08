import { config } from 'dotenv';
import { connect, disconnect } from 'mongoose';

import { ListModel, ListRoomModel } from './models';

import {
  MONGODB_ADMIN,
  MONGODB_CLUSTER_URL,
  MONGODB_PASSWORD
} from './constants';

if (process.env.NODE_ENV === 'development') {
  config({
    path: '.env.development.local'
  });
}

// Replace the uri string with your MongoDB deployment's connection string.
const uri = `mongodb+srv://${MONGODB_ADMIN}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER_URL}?retryWrites=true&writeConcern=majority`;

async function run() {
  try {
    // Connect Mongoose to MongoDB Atlas.
    await connect(uri);

    const listSchema = new ListModel({});
  } finally {
    await disconnect();
  }
}
run().catch(console.dir);

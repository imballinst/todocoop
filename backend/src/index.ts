import express from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';

import { connect, disconnect } from 'mongoose';

import {
  MONGODB_ADMIN,
  MONGODB_CLUSTER_URL,
  MONGODB_PASSWORD,
  MONGODB_DB_NAME
} from '../constants';
import { roomsRouter } from './routes';

// Initialize the express app.
const app = express();
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cors());

app.use(roomsRouter);

// Replace the URI string with your MongoDB deployment's connection string.
const URI = `mongodb+srv://${MONGODB_ADMIN}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER_URL}/${MONGODB_DB_NAME}?retryWrites=true&w=majority`;
const PORT = 3000;

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);

  // Connect Mongoose to MongoDB Atlas.
  await connect(URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });
});

// Cleanup connection on exit.
process.on('exit', async () => {
  await disconnect();
});

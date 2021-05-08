import express from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';

import { connect, disconnect } from 'mongoose';

import { ListModel, ListRoomModel } from './models';

import {
  MONGODB_ADMIN,
  MONGODB_CLUSTER_URL,
  MONGODB_PASSWORD,
  MONGODB_DB_NAME
} from './constants';

// Initialize the express app.
const app = express();
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cors());

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

  const listRoomWatcher = ListRoomModel.watch();
  listRoomWatcher.on('change', (json) => {
    console.log(json);
  });

  await run();
  await update();

  await disconnect();
});

async function run() {
  const listRoom = new ListRoomModel({
    name: 'test123',
    password: 'test',
    created_at: new Date(),
    updated_at: new Date(),
    list: [
      {
        text: 'do this',
        is_checked: false
      }
    ]
  });

  const response = await listRoom.save();
  console.log(response);
}

async function update() {
  const listQuery = ListRoomModel.find();
  const list = await listQuery.exec();
  console.log(list);

  const listRoomQuery = ListRoomModel.updateOne(
    {
      name: 'test'
    },
    {
      $set: {
        password: 'test123'
      }
    }
  );
  const listRoom = await listRoomQuery.exec();
  console.log(listRoom);
}

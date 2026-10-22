import { subMinutes } from 'date-fns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import { RoomModel } from '../lib/models';

const configPath = path.resolve(import.meta.dirname, '../.env.development.local');
if (fs.existsSync(configPath)) {
  dotenv.config({
    path: configPath
  });
}

const {
  MONGODB_ADMIN,
  MONGODB_PASSWORD,
  MONGODB_CLUSTER_URL,
  MONGODB_DB_NAME
} = process.env;

if (
  !MONGODB_ADMIN ||
  !MONGODB_PASSWORD ||
  !MONGODB_CLUSTER_URL ||
  !MONGODB_DB_NAME
) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.development.local'
  );
}

const URI = `mongodb+srv://${MONGODB_ADMIN}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER_URL}/${MONGODB_DB_NAME}?retryWrites=true&w=majority`;

(async () => {
  try {
    await mongoose.connect(URI);

    const response = await RoomModel.deleteMany({
      updatedAt: {
        // Older than one day.
        $lte: subMinutes(new Date(), 60 * 24)
      }
    });
    console.log('Deleted:', response);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
})();

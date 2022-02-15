import subMinutes from 'date-fns/subMinutes';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import { RoomModel } from '../lib/models';

const configPath = path.resolve(__dirname, '../.env.development.local');
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
    mongoose.connection.close();
  }
})();

// Resolve isolatedModules error. Source: https://stackoverflow.com/questions/56577201/why-is-isolatedmodules-error-fixed-by-any-import/56577324.
export {};

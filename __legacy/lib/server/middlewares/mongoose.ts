import { NextApiResponse } from 'next';
import mongoose from 'mongoose';

import { ExtendedNextApiRequest, NextHandler } from '../types';

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
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

const URI = `mongodb+srv://${MONGODB_ADMIN}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER_URL}/${MONGODB_DB_NAME}?retryWrites=true&w=majority`;

// Source: https://dev.to/raphaelchaula/adding-mongodb-mongoose-to-next-js-apis-3af.
// With some modificaiton.
export const withDB =
  (handler: NextHandler) =>
  async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    if (mongoose.connections[0].readyState === 0) {
      // When the connection doesn't exist, create a new one.
      await mongoose.connect(URI);
    }

    return handler(req, res);
  };

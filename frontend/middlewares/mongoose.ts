import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import getConfig from 'next/config';

import { NextHandler } from '../types';

const {
  serverRuntimeConfig: {
    MONGODB_ADMIN,
    MONGODB_PASSWORD,
    MONGODB_CLUSTER_URL,
    MONGODB_DB_NAME
  }
} = getConfig();

const URI = `mongodb+srv://${MONGODB_ADMIN}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER_URL}/${MONGODB_DB_NAME}?retryWrites=true&w=majority`;

// Source: https://dev.to/raphaelchaula/adding-mongodb-mongoose-to-next-js-apis-3af.
export const connectDB = (handler: NextHandler) => async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (mongoose.connections[0].readyState) {
    // Use current db connection.
    return handler(req, res);
  }

  // When the connection doesn't exist, create a new one.
  await mongoose.connect(URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
  return handler(req, res);
};

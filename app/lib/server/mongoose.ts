import mongoose from 'mongoose';

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

mongoose.connect(URI).catch((err) => {
  throw err;
});

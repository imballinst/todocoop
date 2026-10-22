import mongoose from 'mongoose';

let connection: typeof mongoose | null = null;

function getMongoUri() {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
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
      'Please define the MONGODB_* environment variables for the API function'
    );
  }

  return `mongodb+srv://${MONGODB_ADMIN}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER_URL}/${MONGODB_DB_NAME}?retryWrites=true&w=majority`;
}

export async function connectDB() {
  if (connection) return connection;

  connection = await mongoose.connect(getMongoUri());

  return connection;
}

const dotenv = require('dotenv');

try {
  // This is relative to the root project, which is `backend` folder.
  dotenv.config({
    path:
      process.env.NODE_ENV === 'development' ? '.env.development.local' : '.env'
  });
} catch (err) {
  console.warn(
    "No environment variable file was found. Environment variables will now lookup to the system's environment variables."
  );
}

module.exports = {
  serverRuntimeConfig: {
    MONGODB_ADMIN: process.env.MONGODB_ADMIN,
    MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
    MONGODB_CLUSTER_URL: process.env.MONGODB_CLUSTER_URL,
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME
  }
};

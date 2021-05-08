import { config } from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  config({
    path: '.env.development.local'
  });
}

export const MONGODB_ADMIN = process.env.MONGODB_ADMIN;
export const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
export const MONGODB_CLUSTER_URL = process.env.MONGODB_CLUSTER_URL;
export const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

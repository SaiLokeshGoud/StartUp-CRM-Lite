import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Use a public DNS resolver if the local resolver cannot resolve MongoDB SRV records.
// This is useful when Node's c-ares-based SRV lookup fails even though the host is reachable.
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load environment variables from .env file into process.env
dotenv.config();

/**
 * Connect to MongoDB Atlas using the configured connection string.
 * Logs connection success and exits the process on fatal connection errors.
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI environment variable is required');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);

    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

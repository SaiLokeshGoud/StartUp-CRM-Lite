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
 * Logs connection success and warns without crashing when the database is unavailable.
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('MONGODB_URI environment variable is not set. Continuing without database connection.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error.message || error);
    return false;
  }
}

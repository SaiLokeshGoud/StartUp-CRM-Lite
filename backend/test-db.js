import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const uri = process.env.MONGODB_URI;

console.log('Testing connection to:', uri);

try {
  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log('Mongoose connected successfully to host:', conn.connection.host);

  // Try finding a user
  console.log('Trying to query User model...');
  const user = await User.findOne({ email: 'sailokeshgoudk@gmail.com' });
  console.log('Query result:', user);

  await mongoose.disconnect();
  console.log('Disconnected.');
} catch (err) {
  console.error('Error occurred:', err);
  process.exit(1);
}

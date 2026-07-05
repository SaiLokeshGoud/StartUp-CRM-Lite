import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const uri = process.env.MONGODB_URI;

console.log('Connecting to database...');

try {
  await mongoose.connect(uri);
  console.log('Connected.');

  const emailsToTest = ['testuser999@gmail.com', 'kdurgarupesh@gmail.com', 'sailokeshgoudk@gmail.com'];

  for (const email of emailsToTest) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log(`User [${email}]: DOES NOT EXIST`);
    } else {
      const hasHash = user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$'));
      console.log(`User [${email}]: EXISTS`);
      console.log(`  - Name: ${user.name}`);
      console.log(`  - Has valid password hash: ${hasHash ? 'YES' : 'NO'} (${user.password})`);
    }
  }

  await mongoose.disconnect();
  console.log('Done.');
} catch (err) {
  console.error('Error:', err);
  process.exit(1);
}

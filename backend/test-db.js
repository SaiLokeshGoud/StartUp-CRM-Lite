import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import { Lead } from './models/Lead.js';

// Use a public DNS resolver if the local resolver cannot resolve MongoDB SRV records.
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const uri = process.env.MONGODB_URI;

console.log('Connecting to database...');

try {
  await mongoose.connect(uri);
  console.log('Connected.\n');

  console.log('Searching for leads in the database...');
  
  // Aggregate leads by owner and count them
  const leadGroups = await Lead.aggregate([
    {
      $group: {
        _id: '$owner',
        count: { $sum: 1 }
      }
    }
  ]);

  if (leadGroups.length === 0) {
    console.log('No leads found in the database.');
  } else {
    console.log(`Found leads grouped by owner (${leadGroups.length} accounts):`);
    for (const group of leadGroups) {
      const ownerId = group._id;
      const leadCount = group.count;

      if (!ownerId) {
        console.log(`- Owner ID: [undefined/null] | Leads: ${leadCount}`);
        continue;
      }

      const user = await User.findById(ownerId);
      if (user) {
        console.log(`- User: ${user.name} (${user.email}) | Owner ID: ${ownerId} | Leads: ${leadCount}`);
      } else {
        console.log(`- User ID: ${ownerId} (User not found in db!) | Leads: ${leadCount}`);
      }
    }
  }

  await mongoose.disconnect();
  console.log('\nDisconnected.');
} catch (err) {
  console.error('Error occurred:', err);
  process.exit(1);
}

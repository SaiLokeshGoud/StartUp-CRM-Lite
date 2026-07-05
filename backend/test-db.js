import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import { Lead } from './models/Lead.js';
import sampleLeads from '../frontend/src/data/sampleLeads.js';

// Use public DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const uri = process.env.MONGODB_URI;

// SET THIS to the email you want to seed the leads to
const TARGET_EMAIL = 'kdurgarupesh@gmail.com';

console.log('Connecting to database...');

try {
  await mongoose.connect(uri);
  console.log('Connected.\n');

  // Find the target user
  const user = await User.findOne({ email: TARGET_EMAIL.toLowerCase().trim() });
  if (!user) {
    console.error(`Error: User with email [${TARGET_EMAIL}] not found in the database.`);
    console.log('Please register this email first or change TARGET_EMAIL in this script.');
    console.log('Available users are:');
    const allUsers = await User.find({});
    allUsers.forEach(u => console.log(`  - ${u.email}`));
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log(`Target User found: ${user.name} (${user.email}) | ID: ${user._id}`);

  // Delete existing leads for this user to avoid duplicates
  console.log(`Clearing existing leads for ${user.email}...`);
  const deleteResult = await Lead.deleteMany({ owner: user._id });
  console.log(`Cleared ${deleteResult.deletedCount} existing leads.`);

  // Map and prepare sample leads for database insertion
  console.log(`Preparing ${sampleLeads.length} sample leads...`);
  const leadsToInsert = sampleLeads.map((lead) => {
    return {
      name: lead.name,
      company: lead.company || 'Unknown',
      email: lead.email,
      phone: lead.phone || '',
      status: lead.status || 'New',
      source: lead.source || 'Other',
      value: lead.value || 0,
      owner: user._id,
      createdAt: lead.createdAt ? new Date(lead.createdAt) : new Date(),
    };
  });

  // Insert leads in bulk
  console.log('Inserting leads into database...');
  const insertResult = await Lead.insertMany(leadsToInsert);
  console.log(`Successfully seeded ${insertResult.length} leads!`);

  // Final verification
  const totalLeadsForUser = await Lead.countDocuments({ owner: user._id });
  console.log(`Total leads now owned by ${user.email}: ${totalLeadsForUser}`);

  await mongoose.disconnect();
  console.log('\nDisconnected.');
} catch (err) {
  console.error('Error occurred:', err);
  process.exit(1);
}

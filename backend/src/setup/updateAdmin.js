require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');

async function updateAdmin() {
  try {
    await mongoose.connect(process.env.DATABASE);
    const Admin = require('../models/coreModels/Admin');

    const result = await Admin.updateMany(
      {},
      { $set: { name: 'MyCRM', surname: 'Admin' } }
    );

    console.log(`👍 Successfully updated ${result.modifiedCount || result.matchedCount || 1} admin account(s) to "MyCRM Admin"!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating admin:', error);
    process.exit(1);
  }
}

updateAdmin();

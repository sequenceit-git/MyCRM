require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { generate: uniqueId } = require('shortid');
const mongoose = require('mongoose');

async function createGuestAdmin() {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log(' Connected to MongoDB...');

    const Admin = require('../models/coreModels/Admin');
    const AdminPassword = require('../models/coreModels/AdminPassword');

    // 1. Ensure Main Admin is MyCRM Admin
    let superAdmin = await Admin.findOne({ email: 'admin@admin.com' });
    if (!superAdmin) {
      superAdmin = await new Admin({
        email: 'admin@admin.com',
        name: 'MyCRM',
        surname: 'Admin',
        enabled: true,
        role: 'owner',
      }).save();

      const newAdminPassword = new AdminPassword();
      const salt = uniqueId();
      const passwordHash = newAdminPassword.generateHash(salt, 'admin123');

      await new AdminPassword({
        password: passwordHash,
        emailVerified: true,
        salt: salt,
        user: superAdmin._id,
      }).save();
      console.log('👍 Super Admin created: admin@admin.com / admin123 (Owner)');
    } else {
      superAdmin.name = 'MyCRM';
      superAdmin.surname = 'Admin';
      superAdmin.role = 'owner';
      await superAdmin.save();
      console.log('👍 Super Admin verified: admin@admin.com / admin123 (Owner)');
    }

    // 2. Create or Update Dedicated Guest Admin
    const guestEmails = ['guest@admin.com', 'guest@mycrm.com'];
    for (const email of guestEmails) {
      let guestAdmin = await Admin.findOne({ email });
      if (!guestAdmin) {
        guestAdmin = await new Admin({
          email,
          name: 'Guest',
          surname: 'Admin',
          enabled: true,
          role: 'guest',
        }).save();

        const newPass = new AdminPassword();
        const salt = uniqueId();
        const passwordHash = newPass.generateHash(salt, 'guest123');

        await new AdminPassword({
          password: passwordHash,
          emailVerified: true,
          salt: salt,
          user: guestAdmin._id,
        }).save();
        console.log(`👍 Dedicated Guest Admin created: ${email} / guest123 (Role: guest)`);
      } else {
        guestAdmin.name = 'Guest';
        guestAdmin.surname = 'Admin';
        guestAdmin.role = 'guest';
        await guestAdmin.save();

        let passDoc = await AdminPassword.findOne({ user: guestAdmin._id });
        if (passDoc) {
          const salt = uniqueId();
          passDoc.salt = salt;
          passDoc.password = passDoc.generateHash(salt, 'guest123');
          await passDoc.save();
        }
        console.log(`👍 Dedicated Guest Admin updated: ${email} / guest123 (Role: guest)`);
      }
    }

    console.log('\n Accounts Ready:');
    console.log('  1. Super Admin: admin@admin.com / admin123 (Full Access)');
    console.log('  2. Guest Admin: guest@admin.com / guest123 (View-Only Mode)');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up guest admin:', error);
    process.exit(1);
  }
}

createGuestAdmin();

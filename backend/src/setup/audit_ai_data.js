require('module-alias/register');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const mongoose = require('mongoose');
const { globSync } = require('glob');
const path = require('path');

// Load all models
const modelsFiles = globSync('./src/models/**/*.js');
for (const filePath of modelsFiles) {
  require(path.resolve(filePath));
}

async function auditAllData() {
  await mongoose.connect(process.env.DATABASE);
  console.log('⚡ Connected to DB for Full AI Data Audit...\n');

  const entities = [
    { name: 'Invoices', model: 'Invoice' },
    { name: 'Quotes', model: 'Quote' },
    { name: 'Offers for Leads', model: 'Offer' },
    { name: 'Clients / Customers', model: 'Client' },
    { name: 'Sales Leads', model: 'Lead' },
    { name: 'People (Contacts)', model: 'People' },
    { name: 'Companies', model: 'Company' },
    { name: 'Products', model: 'Product' },
    { name: 'Product Categories', model: 'ProductCategory' },
    { name: 'Orders', model: 'Order' },
    { name: 'Expenses', model: 'Expense' },
    { name: 'Expense Categories', model: 'ExpenseCategory' },
    { name: 'Payments', model: 'Payment' },
    { name: 'Payment Modes', model: 'PaymentMode' },
    { name: 'Taxes', model: 'Taxes' },
    { name: 'Admin Staff', model: 'Admin' },
    { name: 'Settings', model: 'Setting' },
  ];

  const results = [];

  for (const ent of entities) {
    try {
      const Model = mongoose.model(ent.model);
      const count = await Model.countDocuments({ removed: false });
      const sample = await Model.findOne({ removed: false }).lean();
      results.push({
        Entity: ent.name,
        Model: ent.model,
        RecordCount: count,
        Accessible: '✅ Connected',
        SampleIdentifier: sample ? (sample.number ? `#${sample.number}` : sample.name || sample.email || sample.title || sample._id.toString()) : 'None',
      });
    } catch (err) {
      results.push({
        Entity: ent.name,
        Model: ent.model,
        RecordCount: 0,
        Accessible: '❌ Error',
        SampleIdentifier: err.message,
      });
    }
  }

  console.table(results);
  await mongoose.disconnect();
}

auditAllData();

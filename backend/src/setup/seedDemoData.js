require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');
const { globSync } = require('glob');
const fs = require('fs');

async function seedMassiveData() {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log('⚡ Connected to MongoDB Atlas...');

    const Admin = require('../models/coreModels/Admin');
    const AdminPassword = require('../models/coreModels/AdminPassword');
    const Setting = require('../models/coreModels/Setting');
    const Client = require('../models/appModels/Client');
    const People = require('../models/appModels/People');
    const Company = require('../models/appModels/Company');
    const Lead = require('../models/appModels/Lead');
    const Offer = require('../models/appModels/Offer');
    const Invoice = require('../models/appModels/Invoice');
    const Payment = require('../models/appModels/Payment');
    const Quote = require('../models/appModels/Quote');
    const PaymentMode = require('../models/appModels/PaymentMode');
    const Taxes = require('../models/appModels/Taxes');
    const ProductCategory = require('../models/appModels/ProductCategory');
    const Product = require('../models/appModels/Product');
    const Order = require('../models/appModels/Order');
    const ExpenseCategory = require('../models/appModels/ExpenseCategory');
    const Expense = require('../models/appModels/Expense');

    const { generate: uniqueId } = require('shortid');

    // 1. Ensure Super Admin
    let superAdmin = await Admin.findOne({ email: 'admin@admin.com' });
    if (!superAdmin) {
      superAdmin = await new Admin({
        email: 'admin@admin.com',
        name: 'MyCRM',
        surname: 'Admin',
        enabled: true,
        role: 'owner',
      }).save();

      const newPass = new AdminPassword();
      const salt = uniqueId();
      const passwordHash = newPass.generateHash(salt, 'admin123');

      await new AdminPassword({
        password: passwordHash,
        emailVerified: true,
        salt: salt,
        user: superAdmin._id,
      }).save();
    } else {
      superAdmin.name = 'MyCRM';
      superAdmin.surname = 'Admin';
      superAdmin.role = 'owner';
      await superAdmin.save();
    }
    console.log('👍 Super Admin verified: admin@admin.com (Owner - Full Access)');

    // 2. Ensure Dedicated Guest Admin (View Only)
    const guestEmails = ['guest@admin.com', 'guest@mycrm.com'];
    for (const gEmail of guestEmails) {
      let guestAdmin = await Admin.findOne({ email: gEmail });
      if (!guestAdmin) {
        guestAdmin = await new Admin({
          email: gEmail,
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
      } else {
        guestAdmin.name = 'Guest';
        guestAdmin.surname = 'Admin';
        guestAdmin.role = 'guest';
        await guestAdmin.save();
      }
    }
    console.log('👍 Guest Admin verified: guest@admin.com (Guest - View-Only Mode)');

    // 3. SEED SETTINGS IF NOT PRESENT
    const existingSettings = await Setting.countDocuments();
    if (existingSettings === 0) {
      const settingFiles = [];
      const settingsFiles = globSync('./src/setup/defaultSettings/**/*.json');
      for (const filePath of settingsFiles) {
        const file = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        settingFiles.push(...file);
      }
      if (settingFiles.length > 0) {
        await Setting.insertMany(settingFiles);
        console.log(`👍 Default Settings seeded (${settingFiles.length} keys)`);
      }
    }

    // 4. SEED PAYMENT MODES
    await PaymentMode.deleteMany();
    const paymentModes = await PaymentMode.insertMany([
      { name: 'Bank Transfer', description: 'Wire Transfer / ACH / Direct Deposit', isDefault: true, enabled: true },
      { name: 'Credit Card', description: 'Visa / MasterCard / AMEX / Stripe', isDefault: false, enabled: true },
      { name: 'PayPal', description: 'PayPal Checkout Gateway', isDefault: false, enabled: true },
      { name: 'Cash', description: 'Direct Cash Payment', isDefault: false, enabled: true },
      { name: 'Stripe Gateway', description: 'Online Automated Card Processing', isDefault: false, enabled: true },
      { name: 'Check / Cheque', description: 'Corporate Bank Check', isDefault: false, enabled: true },
    ]);
    console.log(`👍 Payment Modes seeded: ${paymentModes.length} modes`);

    // 5. SEED TAXES
    await Taxes.deleteMany();
    const taxList = await Taxes.insertMany([
      { taxName: 'Tax 0%', taxValue: 0, isDefault: true, enabled: true },
      { taxName: 'Standard VAT (20%)', taxValue: 20, isDefault: false, enabled: true },
      { taxName: 'Reduced VAT (10%)', taxValue: 10, isDefault: false, enabled: true },
      { taxName: 'US Sales Tax (8.25%)', taxValue: 8.25, isDefault: false, enabled: true },
      { taxName: 'GST (18%)', taxValue: 18, isDefault: false, enabled: true },
    ]);
    console.log(`👍 Taxes seeded: ${taxList.length} tax rates`);

    // 6. SEED PRODUCT CATEGORIES & PRODUCTS
    await ProductCategory.deleteMany();
    const prodCategories = await ProductCategory.insertMany([
      { name: 'Cloud & Infrastructure', description: 'Cloud servers, clusters, databases', color: '#1677ff', enabled: true },
      { name: 'Software Development', description: 'Frontend, backend, mobile dev sprints', color: '#52c41a', enabled: true },
      { name: 'Cybersecurity', description: 'Security audits, penetration testing & SSO', color: '#fa8c16', enabled: true },
      { name: 'Consulting & Support', description: 'Architecture consulting, workshops & SLA', color: '#722ed1', enabled: true },
    ]);
    console.log(`👍 Product Categories seeded: ${prodCategories.length} categories`);

    await Product.deleteMany();
    const products = await Product.insertMany([
      { name: 'Enterprise Cloud Server Node', category: prodCategories[0]._id, price: 1200, currency: 'USD', description: 'High-memory compute instance with 99.99% SLA', ref: 'PROD-SRV-01', enabled: true },
      { name: 'Kubernetes Cluster Provisioning', category: prodCategories[0]._id, price: 3500, currency: 'USD', description: 'Multi-region automated Kubernetes rollout', ref: 'PROD-K8S-02', enabled: true },
      { name: 'Full-Stack Web App Development Sprint', category: prodCategories[1]._id, price: 5000, currency: 'USD', description: '2-week dedicated React + Node sprint', ref: 'PROD-DEV-01', enabled: true },
      { name: 'Mobile App Feature Milestone (iOS/Android)', category: prodCategories[1]._id, price: 4200, currency: 'USD', description: 'Cross-platform feature development', ref: 'PROD-DEV-02', enabled: true },
      { name: 'AI LLM Fine-Tuning & Knowledge Base', category: prodCategories[1]._id, price: 6500, currency: 'USD', description: 'Custom RAG system and vector search pipeline', ref: 'PROD-AI-01', enabled: true },
      { name: 'SOC2 & HIPAA Security Compliance Audit', category: prodCategories[2]._id, price: 4800, currency: 'USD', description: 'Full vulnerability scan, code audit & policy report', ref: 'PROD-SEC-01', enabled: true },
      { name: 'Single Sign-On (SSO / Okta / SAML)', category: prodCategories[2]._id, price: 2900, currency: 'USD', description: 'Enterprise identity sync & multi-factor setup', ref: 'PROD-SEC-02', enabled: true },
      { name: '24/7 Dedicated Server Monitoring SLA', category: prodCategories[3]._id, price: 1500, currency: 'USD', description: 'Monthly response guarantee & incident triage', ref: 'PROD-SUP-01', enabled: true },
      { name: 'Technical Architecture Workshop (5 Days)', category: prodCategories[3]._id, price: 2800, currency: 'USD', description: 'Hands-on architectural review and refactoring', ref: 'PROD-CON-01', enabled: true },
    ]);
    console.log(`👍 Products seeded: ${products.length} products`);

    // 7. SEED EXPENSE CATEGORIES & EXPENSES
    await ExpenseCategory.deleteMany();
    const expCategories = await ExpenseCategory.insertMany([
      { name: 'Cloud Infrastructure & Hosting', description: 'AWS, GCP, Vercel & Atlas billing', color: '#1677ff', enabled: true },
      { name: 'Software Subscriptions & SaaS', description: 'GitHub, Figma, Jira, Slack, Resend', color: '#722ed1', enabled: true },
      { name: 'Office & Operations', description: 'Rent, equipment, hardware, internet', color: '#fa8c16', enabled: true },
      { name: 'Marketing & Sales', description: 'Advertising, sponsorships, events', color: '#52c41a', enabled: true },
      { name: 'Legal & Accounting', description: 'Corporate filings, CPA, bookkeeping', color: '#eb2f96', enabled: true },
    ]);
    console.log(`👍 Expense Categories seeded: ${expCategories.length} categories`);

    await Expense.deleteMany();
    const expenses = await Expense.insertMany([
      { name: 'AWS Production Cloud Compute', category: expCategories[0]._id, amount: 2450, currency: 'USD', ref: 'EXP-AWS-2026', date: new Date(), description: 'Monthly production cluster & database billing', createdBy: superAdmin._id, enabled: true },
      { name: 'MongoDB Atlas Dedicated Cluster', category: expCategories[0]._id, amount: 680, currency: 'USD', ref: 'EXP-MNG-2026', date: new Date(), description: 'Database cluster replica set tier', createdBy: superAdmin._id, enabled: true },
      { name: 'GitHub Enterprise & Copilot Seats', category: expCategories[1]._id, amount: 450, currency: 'USD', ref: 'EXP-GH-2026', date: new Date(), description: 'Developer tooling & CI/CD minutes', createdBy: superAdmin._id, enabled: true },
      { name: 'Figma & Design Workspace Licenses', category: expCategories[1]._id, amount: 220, currency: 'USD', ref: 'EXP-FIG-2026', date: new Date(), description: 'Product design team licenses', createdBy: superAdmin._id, enabled: true },
      { name: 'High-Performance Workstation Hardware', category: expCategories[2]._id, amount: 3200, currency: 'USD', ref: 'EXP-HW-2026', date: new Date(), description: 'Developer laptops and 4K displays', createdBy: superAdmin._id, enabled: true },
      { name: 'Google Ads & LinkedIn Sponsored Posts', category: expCategories[3]._id, amount: 1850, currency: 'USD', ref: 'EXP-MKT-2026', date: new Date(), description: 'Q1 B2B Customer acquisition campaigns', createdBy: superAdmin._id, enabled: true },
      { name: 'Corporate Legal & Annual Audit', category: expCategories[4]._id, amount: 1600, currency: 'USD', ref: 'EXP-LGL-2026', date: new Date(), description: 'Annual compliance review and filings', createdBy: superAdmin._id, enabled: true },
    ]);
    console.log(`👍 Expenses seeded: ${expenses.length} expenses`);

    // 8. SEED CLIENTS
    await Client.deleteMany();
    const clientData = [
      { name: 'TechCorp Solutions', email: 'billing@techcorp.io', phone: '+1 (415) 555-0192', country: 'United States', address: '100 Market St, San Francisco, CA 94105' },
      { name: 'Nexus Digital Media', email: 'accounts@nexusmedia.com', phone: '+1 (416) 555-0143', country: 'Canada', address: '450 Bay St, Toronto, ON M5H 2V6' },
      { name: 'Apex Global Innovations', email: 'finance@apexglobal.co.uk', phone: '+44 20 7946 0912', country: 'United Kingdom', address: '22 Bishopsgate, London EC2N 4BQ' },
      { name: 'Quantum Byte Labs', email: 'rechnung@quantumbyte.de', phone: '+49 30 12345678', country: 'Germany', address: 'Friedrichstraße 43, 10117 Berlin' },
      { name: 'Horizon Retail Group', email: 'mscott@horizonretail.com', phone: '+1 (570) 555-0177', country: 'United States', address: '1725 Slough Ave, Scranton, PA 18508' },
      { name: 'Starlight Interactive', email: 'contact@starlightgames.jp', phone: '+81 3 5555 0188', country: 'Japan', address: 'Roppongi Hills Mori Tower, Tokyo' },
      { name: 'Vanguard Cyber Defense', email: 'billing@vanguardsecurity.com', phone: '+1 (202) 555-0199', country: 'United States', address: '1200 K St NW, Washington, DC 20005' },
      { name: 'Nordic Cloud Systems', email: 'faktura@nordiccloud.se', phone: '+46 8 555 1234', country: 'Sweden', address: 'Kungsgatan 14, Stockholm' },
      { name: 'AeroDynamics Propulsion', email: 'accounts@aerodynamics.fr', phone: '+33 1 42 68 55 00', country: 'France', address: '12 Rue de la Paix, Paris' },
      { name: 'Pacific Rim Logistics', email: 'invoice@pacificlogistics.sg', phone: '+65 6789 0123', country: 'Singapore', address: '10 Marina Boulevard, Singapore' },
      { name: 'Summit Healthcare Tech', email: 'finance@summithealth.org', phone: '+1 (617) 555-0120', country: 'United States', address: '300 Longwood Ave, Boston, MA 02115' },
      { name: 'Solaria Clean Energy', email: 'cuentas@solariaenergy.es', phone: '+34 91 555 4321', country: 'Spain', address: 'Paseo de la Castellana 89, Madrid' },
      { name: 'BlueWave Fintech Ventures', email: 'payables@bluewavefin.com', phone: '+1 (212) 555-0182', country: 'United States', address: '40 Wall St, New York, NY 10005' },
      { name: 'Velocity Auto Dynamics', email: 'info@velocityauto.it', phone: '+39 02 5555 9876', country: 'Italy', address: 'Via Montenapoleone 8, Milano' },
      { name: 'Silverline Architecture', email: 'accounts@silverlinearch.com.au', phone: '+61 2 9555 0144', country: 'Australia', address: '100 George St, Sydney NSW 2000' },
      { name: 'BioGenix Diagnostics', email: 'finance@biogenixdx.ch', phone: '+41 22 555 7890', country: 'Switzerland', address: 'Route de Pré-Bois 20, Genève' },
    ];

    const clients = await Client.insertMany(
      clientData.map((c) => ({
        ...c,
        createdBy: superAdmin._id,
        assigned: superAdmin._id,
        enabled: true,
        removed: false,
      }))
    );
    console.log(`👍 Clients seeded: ${clients.length} clients`);

    // 9. SEED PEOPLES (Contacts)
    await People.deleteMany();
    const peopleData = [
      { firstname: 'Alexander', lastname: 'Wright', company: 'TechCorp Solutions', email: 'alex.wright@techcorp.io', phone: '+1 (415) 555-0111', country: 'United States', address: 'San Francisco, CA' },
      { firstname: 'Elena', lastname: 'Rostova', company: 'Nexus Digital Media', email: 'elena.r@nexusmedia.com', phone: '+1 (416) 555-0122', country: 'Canada', address: 'Toronto, ON' },
      { firstname: 'James', lastname: 'Sterling', company: 'Apex Global Innovations', email: 'j.sterling@apexglobal.co.uk', phone: '+44 20 7946 0999', country: 'United Kingdom', address: 'London' },
      { firstname: 'Klaus', lastname: 'Mueller', company: 'Quantum Byte Labs', email: 'k.mueller@quantumbyte.de', phone: '+49 30 12349999', country: 'Germany', address: 'Berlin' },
      { firstname: 'Sarah', lastname: 'Connor', company: 'Vanguard Cyber Defense', email: 'sconnor@vanguardsecurity.com', phone: '+1 (202) 555-0188', country: 'United States', address: 'Washington, DC' },
      { firstname: 'Kenji', lastname: 'Takahashi', company: 'Starlight Interactive', email: 'kenji@starlightgames.jp', phone: '+81 3 5555 0199', country: 'Japan', address: 'Tokyo' },
      { firstname: 'Astrid', lastname: 'Lindgren', company: 'Nordic Cloud Systems', email: 'astrid@nordiccloud.se', phone: '+46 8 555 9988', country: 'Sweden', address: 'Stockholm' },
      { firstname: 'Claire', lastname: 'Dubois', company: 'AeroDynamics Propulsion', email: 'claire@aerodynamics.fr', phone: '+33 1 42 68 99 00', country: 'France', address: 'Paris' },
    ];
    const peoples = await People.insertMany(
      peopleData.map((p) => ({
        ...p,
        createdBy: superAdmin._id,
        assigned: superAdmin._id,
        enabled: true,
        removed: false,
      }))
    );
    console.log(`👍 Peoples seeded: ${peoples.length} contacts`);

    // 10. SEED COMPANIES
    await Company.deleteMany();
    const companyData = [
      { name: 'TechCorp Solutions Inc', contact: 'Alexander Wright', email: 'contact@techcorp.io', phone: '+1 (415) 555-0192', website: 'https://techcorp.io', country: 'United States', address: '100 Market St, San Francisco' },
      { name: 'Nexus Media Group Ltd', contact: 'Elena Rostova', email: 'info@nexusmedia.com', phone: '+1 (416) 555-0143', website: 'https://nexusmedia.com', country: 'Canada', address: '450 Bay St, Toronto' },
      { name: 'Apex Global Enterprises', contact: 'James Sterling', email: 'office@apexglobal.co.uk', phone: '+44 20 7946 0912', website: 'https://apexglobal.co.uk', country: 'United Kingdom', address: '22 Bishopsgate, London' },
      { name: 'Quantum Byte Technologies', contact: 'Klaus Mueller', email: 'contact@quantumbyte.de', phone: '+49 30 12345678', website: 'https://quantumbyte.de', country: 'Germany', address: 'Friedrichstraße 43, Berlin' },
      { name: 'Starlight Studios Inc', contact: 'Kenji Takahashi', email: 'hello@starlightgames.jp', phone: '+81 3 5555 0188', website: 'https://starlightgames.jp', country: 'Japan', address: 'Roppongi Hills, Tokyo' },
      { name: 'Vanguard Security Corp', contact: 'Sarah Connor', email: 'security@vanguardsecurity.com', phone: '+1 (202) 555-0199', website: 'https://vanguardsecurity.com', country: 'United States', address: '1200 K St NW, DC' },
    ];
    const companies = await Company.insertMany(
      companyData.map((c) => ({
        ...c,
        createdBy: superAdmin._id,
        assigned: superAdmin._id,
        enabled: true,
        removed: false,
      }))
    );
    console.log(`👍 Companies seeded: ${companies.length} companies`);

    // 11. SEED LEADS
    await Lead.deleteMany();
    const leadData = [
      { name: 'CloudScale Logistics Inc', email: 'leads@cloudscalelog.com', phone: '+1 (312) 555-0144', country: 'United States', source: 'linkedin', status: 'in_negociation', notes: 'Interested in enterprise cloud migration' },
      { name: 'Hyperion BioPharma', email: 'procure@hyperionbio.com', phone: '+1 (617) 555-0188', country: 'United States', source: 'sales', status: 'won', notes: 'Closed contract for compliance audit' },
      { name: 'CyberShield Systems GmbH', email: 'info@cybershield.de', phone: '+49 89 5555 1234', country: 'Germany', source: 'professionals_network', status: 'new', notes: 'Requested demo of security dashboard' },
      { name: 'Fintech Spark Australia', email: 'partners@fintechspark.com.au', phone: '+61 2 9555 8877', country: 'Australia', source: 'social_media', status: 'in_negociation', notes: 'Evaluating AI fine-tuning capabilities' },
      { name: 'Atlas Global Shipping', email: 'contact@atlascargo.sg', phone: '+65 6789 9988', country: 'Singapore', source: 'advertising', status: 'new', notes: 'Interested in API orchestration' },
      { name: 'Optima Retailers UK', email: 'buyer@optimaretail.co.uk', phone: '+44 20 7946 5544', country: 'United Kingdom', source: 'customer_referral', status: 'won', notes: 'Referred by Apex Global' },
      { name: 'Quantum Core AI', email: 'founders@quantumcore.ai', phone: '+1 (415) 555-9011', country: 'United States', source: 'linkedin', status: 'on_hold', notes: 'Waiting for Q2 budget release' },
      { name: 'Solaris Energy Solutions', email: 'proposals@solarisenergy.eu', phone: '+33 1 42 55 66 77', country: 'France', source: 'sales', status: 'new', notes: 'Inquired about SLA tech support' },
    ];
    const leads = await Lead.insertMany(
      leadData.map((l) => ({
        ...l,
        createdBy: superAdmin._id,
        assigned: superAdmin._id,
        enabled: true,
        removed: false,
      }))
    );
    console.log(`👍 Leads seeded: ${leads.length} leads`);

    // 12. SEED OFFERS FOR LEADS
    await Offer.deleteMany();
    const currentYear = new Date().getFullYear();
    const today = new Date();
    const daysAgo = (d) => new Date(today.getTime() - d * 24 * 60 * 60 * 1000);
    const daysAhead = (d) => new Date(today.getTime() + d * 24 * 60 * 60 * 1000);

    const offerTemplates = [
      { leadIdx: 0, title: 'Cloud Infrastructure & Kubernetes Rollout', desc: 'AWS EKS cluster setup, terraform scripts & CI/CD', price: 8500, status: 'sent', daysAgo: 14 },
      { leadIdx: 1, title: 'HIPAA & SOC2 Compliance Blueprint', desc: 'Audit preparation, encryption policies & logging', price: 6200, status: 'accepted', daysAgo: 10 },
      { leadIdx: 2, title: 'Enterprise Cyber Threat Detection Setup', desc: 'Endpoint protection, SIEM telemetry integration', price: 9400, status: 'pending', daysAgo: 8 },
      { leadIdx: 3, title: 'AI RAG Pipeline & Knowledge Indexing', desc: 'Vector database setup with OpenAI embeddings', price: 11500, status: 'draft', daysAgo: 6 },
      { leadIdx: 4, title: 'Global Multi-Region CDN & Edge Acceleration', desc: 'Cloudflare Workers & automated DDoS mitigation', price: 5400, status: 'sent', daysAgo: 5 },
      { leadIdx: 5, title: 'ERP Custom Inventory & Barcode Suite', desc: 'Warehouse inventory tracking & real-time sync', price: 14000, status: 'accepted', daysAgo: 3 },
      { leadIdx: 6, title: 'Scalable Micro-Frontend Architecture', desc: 'Webpack Module Federation and UI component library', price: 7800, status: 'pending', daysAgo: 2 },
      { leadIdx: 7, title: '24/7 Dedicated SRE & Infrastructure SLA', desc: 'Yearly managed hosting and emergency escalation', price: 4500, status: 'sent', daysAgo: 1 },
    ];

    const offers = [];
    for (let i = 0; i < offerTemplates.length; i++) {
      const tmpl = offerTemplates[i];
      const lead = leads[tmpl.leadIdx % leads.length];
      const offNumber = i + 1;
      const offDate = daysAgo(tmpl.daysAgo);
      const offExpire = daysAhead(30 - tmpl.daysAgo);

      const newOffer = await new Offer({
        number: offNumber,
        year: currentYear,
        lead: lead._id,
        leadName: lead.name,
        date: offDate,
        expiredDate: offExpire,
        currency: 'USD',
        items: [
          {
            itemName: tmpl.title,
            description: tmpl.desc,
            quantity: 1,
            price: tmpl.price,
            total: tmpl.price,
          },
        ],
        subTotal: tmpl.price,
        taxRate: 0,
        taxTotal: 0,
        total: tmpl.price,
        status: tmpl.status,
        notes: `Proposal #${offNumber} prepared for ${lead.name}`,
        createdBy: superAdmin._id,
      }).save();

      offers.push(newOffer);
    }
    console.log(`👍 Offers for Leads seeded: ${offers.length} offers`);

    // 13. SEED ORDERS
    await Order.deleteMany();
    const orders = [];
    for (let i = 0; i < 8; i++) {
      const client = clients[i % clients.length];
      const prod = products[i % products.length];
      const qty = (i % 3) + 1;
      const total = prod.price * qty;

      const newOrder = await new Order({
        number: i + 1,
        year: currentYear,
        client: client._id,
        clientName: client.name,
        date: daysAgo(i * 3 + 1),
        products: [
          {
            product: prod._id,
            itemName: prod.name,
            quantity: qty,
            price: prod.price,
            total: total,
          },
        ],
        subTotal: total,
        taxTotal: 0,
        total: total,
        currency: 'USD',
        status: i % 3 === 0 ? 'completed' : i % 3 === 1 ? 'processing' : 'pending',
        notes: `Order #${i + 1} for ${client.name}`,
        createdBy: superAdmin._id,
      }).save();
      orders.push(newOrder);
    }
    console.log(`👍 Orders seeded: ${orders.length} orders`);

    // 14. SEED INVOICES & PAYMENTS
    await Invoice.deleteMany();
    await Payment.deleteMany();
    await Quote.deleteMany();

    const invoiceTemplates = [
      {
        items: [
          { itemName: 'Full-Stack Web App Development', description: 'React, Node.js, and MongoDB API Architecture', quantity: 1, price: 5400, total: 5400 },
          { itemName: 'UI/UX Interactive Prototyping', description: 'Figma high-fidelity responsive design system', quantity: 1, price: 1600, total: 1600 },
        ],
        subTotal: 7000,
        total: 7000,
        currency: 'USD',
        paymentStatus: 'paid',
        status: 'sent',
        daysAgo: 75,
      },
      {
        items: [
          { itemName: 'Cloud Infrastructure & Kubernetes Setup', description: 'AWS EKS cluster with Terraform automation', quantity: 1, price: 4200, total: 4200 },
          { itemName: 'CI/CD Pipeline Automation', description: 'GitHub Actions deployment workflows', quantity: 1, price: 1200, total: 1200 },
        ],
        subTotal: 5400,
        total: 5400,
        currency: 'USD',
        paymentStatus: 'paid',
        status: 'sent',
        daysAgo: 68,
      },
      {
        items: [
          { itemName: 'Enterprise Data Migration Service', description: 'ETL migration of 2M+ records to PostgreSQL', quantity: 1, price: 3800, total: 3800 },
        ],
        subTotal: 3800,
        total: 3800,
        currency: 'USD',
        paymentStatus: 'paid',
        status: 'sent',
        daysAgo: 60,
      },
      {
        items: [
          { itemName: 'AI Chatbot & LLM Fine-Tuning', description: 'Custom RAG pipeline on proprietary corporate docs', quantity: 1, price: 8500, total: 8500 },
          { itemName: 'Vector DB Indexing & Embeddings', description: 'Pinecone / Qdrant knowledge integration', quantity: 1, price: 1500, total: 1500 },
        ],
        subTotal: 10000,
        total: 10000,
        currency: 'USD',
        paymentStatus: 'partially',
        paidAmount: 5000,
        status: 'sent',
        daysAgo: 50,
      },
      {
        items: [
          { itemName: 'Mobile App Development (iOS & Android)', description: 'React Native native cross-platform build', quantity: 1, price: 9200, total: 9200 },
        ],
        subTotal: 9200,
        total: 9200,
        currency: 'USD',
        paymentStatus: 'paid',
        status: 'sent',
        daysAgo: 45,
      },
      {
        items: [
          { itemName: 'Quarterly Cybersecurity & Penetration Test', description: 'Full vulnerability scan and SOC2 readiness audit', quantity: 1, price: 6000, total: 6000 },
        ],
        subTotal: 6000,
        total: 6000,
        currency: 'USD',
        paymentStatus: 'unpaid',
        status: 'sent',
        daysAgo: 40,
      },
      {
        items: [
          { itemName: 'CRM Custom Modules & Webhooks', description: 'Lead tracking, deal pipelines and reporting dashboards', quantity: 1, price: 4800, total: 4800 },
        ],
        subTotal: 4800,
        total: 4800,
        currency: 'USD',
        paymentStatus: 'paid',
        status: 'sent',
        daysAgo: 35,
      },
      {
        items: [
          { itemName: 'Monthly SLA Dedicated Tech Support', description: '24/7 Server uptime monitoring and emergency response', quantity: 1, price: 2000, total: 2000 },
        ],
        subTotal: 2000,
        total: 2000,
        currency: 'USD',
        paymentStatus: 'paid',
        status: 'sent',
        daysAgo: 30,
      },
      {
        items: [
          { itemName: 'Payment Gateway & Stripe Connect Sync', description: 'Automated recurring billing and subscription webhooks', quantity: 1, price: 3200, total: 3200 },
        ],
        subTotal: 3200,
        total: 3200,
        currency: 'USD',
        paymentStatus: 'partially',
        paidAmount: 1600,
        status: 'sent',
        daysAgo: 25,
      },
      {
        items: [
          { itemName: 'SEO & Content Growth Strategy', description: 'Technical site audit, speed optimization and keyword blueprint', quantity: 1, price: 2500, total: 2500 },
        ],
        subTotal: 2500,
        total: 2500,
        currency: 'USD',
        paymentStatus: 'unpaid',
        status: 'sent',
        daysAgo: 20,
      },
      {
        items: [
          { itemName: 'E-Commerce Marketplace Customization', description: 'Multi-vendor catalog, checkout flow & inventory syncing', quantity: 1, price: 7800, total: 7800 },
        ],
        subTotal: 7800,
        total: 7800,
        currency: 'USD',
        paymentStatus: 'paid',
        status: 'sent',
        daysAgo: 18,
      },
      {
        items: [
          { itemName: 'Database Performance Tuning & Indexing', description: 'Query optimization, connection pooling & redis caching', quantity: 1, price: 1800, total: 1800 },
        ],
        subTotal: 1800,
        total: 1800,
        currency: 'USD',
        paymentStatus: 'unpaid',
        status: 'pending',
        daysAgo: 14,
      },
      {
        items: [
          { itemName: 'REST & GraphQL API Gateway', description: 'Microservices architecture with OAuth2 security layer', quantity: 1, price: 6400, total: 6400 },
        ],
        subTotal: 6400,
        total: 6400,
        currency: 'USD',
        paymentStatus: 'partially',
        paidAmount: 3200,
        status: 'sent',
        daysAgo: 12,
      },
      {
        items: [
          { itemName: 'Automated Invoice PDF Engine', description: 'Server-side PDF generator with company templating', quantity: 1, price: 1500, total: 1500 },
        ],
        subTotal: 1500,
        total: 1500,
        currency: 'USD',
        paymentStatus: 'paid',
        status: 'sent',
        daysAgo: 10,
      },
      {
        items: [
          { itemName: 'Frontend Performance & Core Web Vitals Sprint', description: 'Lighthouse 95+ score optimization, bundle splitting', quantity: 1, price: 2200, total: 2200 },
        ],
        subTotal: 2200,
        total: 2200,
        currency: 'USD',
        paymentStatus: 'unpaid',
        status: 'sent',
        daysAgo: 8,
      },
      {
        items: [
          { itemName: 'Custom Analytics Dashboard', description: 'Real-time WebSocket metric charts & export features', quantity: 1, price: 4500, total: 4500 },
        ],
        subTotal: 4500,
        total: 4500,
        currency: 'USD',
        paymentStatus: 'unpaid',
        status: 'draft',
        daysAgo: 7,
      },
    ];

    let paymentCounter = 1;
    const createdInvoices = [];
    const createdPayments = [];

    for (let i = 0; i < invoiceTemplates.length; i++) {
      const tmpl = invoiceTemplates[i];
      const client = clients[i % clients.length];
      const invNumber = i + 1;
      const invDate = daysAgo(tmpl.daysAgo);
      const dueDate = daysAhead(30 - tmpl.daysAgo);

      const paidCredit =
        tmpl.paymentStatus === 'paid'
          ? tmpl.total
          : tmpl.paymentStatus === 'partially'
            ? tmpl.paidAmount || tmpl.total / 2
            : 0;

      const newInv = await new Invoice({
        number: invNumber,
        year: currentYear,
        createdBy: superAdmin._id,
        client: client._id,
        date: invDate,
        expiredDate: dueDate,
        currency: tmpl.currency,
        items: tmpl.items,
        taxRate: 0,
        taxTotal: 0,
        subTotal: tmpl.subTotal,
        total: tmpl.total,
        credit: paidCredit,
        discount: 0,
        paymentStatus: tmpl.paymentStatus,
        status: tmpl.status,
        approved: true,
        notes: `Invoice #${invNumber} for ${client.name} - Project milestones`,
      }).save();

      if (paidCredit > 0) {
        const mode = paymentModes[i % paymentModes.length];
        const newPayment = await new Payment({
          number: paymentCounter++,
          createdBy: superAdmin._id,
          client: client._id,
          invoice: newInv._id,
          date: new Date(invDate.getTime() + 2 * 24 * 60 * 60 * 1000),
          amount: paidCredit,
          currency: tmpl.currency,
          paymentMode: mode._id,
          ref: `PAY-REF-${1000 + paymentCounter}`,
          description: `Payment received for Invoice #${invNumber} via ${mode.name}`,
        }).save();

        newInv.payment = [newPayment._id];
        await newInv.save();
        createdPayments.push(newPayment);
      }

      createdInvoices.push(newInv);
    }
    console.log(`👍 Invoices seeded: ${createdInvoices.length} invoices`);
    console.log(`👍 Payments seeded: ${createdPayments.length} payments`);

    // 15. SEED QUOTES
    const quoteTemplates = [
      { title: 'Native Mobile App Ecosystem', desc: 'iOS and Android app with biometric auth', price: 14500, status: 'accepted', daysAgo: 25 },
      { title: 'Complete Enterprise ERP Overhaul', desc: 'Inventory, HRM, Accounting, and Logistics', price: 24000, status: 'pending', daysAgo: 18 },
      { title: 'AI Automated Customer Support Engine', desc: 'Voice & text AI agent with automated ticket escalation', price: 9800, status: 'sent', daysAgo: 15 },
      { title: 'SOC2 & HIPAA Compliance Infrastructure', desc: 'End-to-end encrypted storage, audit trails and logging', price: 11200, status: 'accepted', daysAgo: 14 },
      { title: 'Global Multi-Region CDN & Edge Caching', desc: 'Cloudflare Workers edge caching and global DDoS mitigation', price: 5200, status: 'draft', daysAgo: 12 },
      { title: 'Financial Ledger & Real-Time Reporting', desc: 'Double-entry bookkeeping engine with automated tax calculation', price: 8400, status: 'sent', daysAgo: 10 },
      { title: 'B2B Wholesale Portal & Supplier Network', desc: 'Custom quote builder, volume discounts and purchase orders', price: 16500, status: 'pending', daysAgo: 9 },
      { title: 'Zero-Trust Network Access Architecture', desc: 'WireGuard VPN mesh, biometric MFA and endpoint validation', price: 7600, status: 'accepted', daysAgo: 8 },
      { title: 'Real-Time Inventory RFID Tracking System', desc: 'Hardware scanner integration and real-time socket events', price: 13000, status: 'declined', daysAgo: 7 },
      { title: 'Custom Headless CMS & Marketing Site', desc: 'Next.js static generation with automated preview deployment', price: 6800, status: 'sent', daysAgo: 6 },
      { title: 'Automated Payroll & Tax Filing Integration', desc: 'Direct bank debit, pay stub generation and tax reporting', price: 9500, status: 'pending', daysAgo: 5 },
      { title: 'IoT Sensor Telemetry Dashboard', desc: 'Time-series database with Grafana dashboards & alerts', price: 8900, status: 'draft', daysAgo: 4 },
    ];

    const quotes = [];
    for (let i = 0; i < quoteTemplates.length; i++) {
      const q = quoteTemplates[i];
      const client = clients[i % clients.length];
      const qNumber = i + 1;
      const qDate = daysAgo(q.daysAgo);
      const qExpire = daysAhead(30 - q.daysAgo);

      const newQuote = await new Quote({
        number: qNumber,
        year: currentYear,
        createdBy: superAdmin._id,
        client: client._id,
        date: qDate,
        expiredDate: qExpire,
        currency: 'USD',
        items: [
          {
            itemName: q.title,
            description: q.desc,
            quantity: 1,
            price: q.price,
            total: q.price,
          },
        ],
        subTotal: q.price,
        taxRate: 0,
        taxTotal: 0,
        total: q.price,
        status: q.status,
        notes: `Proposal #${qNumber} for ${client.name}`,
      }).save();

      quotes.push(newQuote);
    }
    console.log(`👍 Quotes seeded: ${quotes.length} quotes`);

    console.log('\n=============================================');
    console.log('🎉 FULL DATA SEEDING COMPLETE FOR ALL CRM/ERP MODULES');
    console.log(`   - 🏢 Clients:            ${clients.length}`);
    console.log(`   - 👤 Peoples:            ${peoples.length}`);
    console.log(`   - 🏛️ Companies:          ${companies.length}`);
    console.log(`   - 🎯 Leads:              ${leads.length}`);
    console.log(`   - 📋 Offers for Leads:   ${offers.length}`);
    console.log(`   - 📦 Product Categories: ${prodCategories.length}`);
    console.log(`   - 🏷️ Products:           ${products.length}`);
    console.log(`   - 🛒 Orders:             ${orders.length}`);
    console.log(`   - 📑 Expense Categories: ${expCategories.length}`);
    console.log(`   - 💸 Expenses:           ${expenses.length}`);
    console.log(`   - 📄 Invoices:           ${createdInvoices.length}`);
    console.log(`   - 💳 Payments:           ${createdPayments.length}`);
    console.log(`   - 📝 Quotes:             ${quotes.length}`);
    console.log(`   - 🏷️ Taxes:              ${taxList.length}`);
    console.log(`   - 💵 Payment Modes:      ${paymentModes.length}`);
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during data seeding:', error);
    process.exit(1);
  }
}

seedMassiveData();

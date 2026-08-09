require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');

async function seedMassiveData() {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log(' Connected to MongoDB...');

    const Admin = require('../models/coreModels/Admin');
    const Client = require('../models/appModels/Client');
    const Invoice = require('../models/appModels/Invoice');
    const Payment = require('../models/appModels/Payment');
    const Quote = require('../models/appModels/Quote');
    const PaymentMode = require('../models/appModels/PaymentMode');
    const Taxes = require('../models/appModels/Taxes');

    const AdminPassword = require('../models/coreModels/AdminPassword');
    const { generate: uniqueId } = require('shortid');

    // 1. Ensure Super Admin
    let superAdmin = await Admin.findOne({ email: 'admin@admin.com' });
    if (superAdmin) {
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

    // 1. SEED PAYMENT MODES (6 modes)
    await PaymentMode.deleteMany();
    const paymentModes = await PaymentMode.insertMany([
      {
        name: 'Bank Transfer',
        description: 'Wire Transfer / ACH / Direct Deposit',
        isDefault: true,
        enabled: true,
      },
      {
        name: 'Credit Card',
        description: 'Visa / MasterCard / AMEX / Stripe',
        isDefault: false,
        enabled: true,
      },
      {
        name: 'PayPal',
        description: 'PayPal Checkout Gateway',
        isDefault: false,
        enabled: true,
      },
      {
        name: 'Cash',
        description: 'Direct Cash Payment',
        isDefault: false,
        enabled: true,
      },
      {
        name: 'Stripe Gateway',
        description: 'Online Automated Card Processing',
        isDefault: false,
        enabled: true,
      },
      {
        name: 'Check / Cheque',
        description: 'Corporate Bank Check',
        isDefault: false,
        enabled: true,
      },
    ]);
    console.log(`👍 Payment Modes seeded: ${paymentModes.length} modes`);

    // 2. SEED TAXES (5 tax rates)
    await Taxes.deleteMany();
    const taxList = await Taxes.insertMany([
      { taxName: 'Tax 0%', taxValue: 0, isDefault: true, enabled: true },
      { taxName: 'Standard VAT (20%)', taxValue: 20, isDefault: false, enabled: true },
      { taxName: 'Reduced VAT (10%)', taxValue: 10, isDefault: false, enabled: true },
      { taxName: 'US Sales Tax (8.25%)', taxValue: 8.25, isDefault: false, enabled: true },
      { taxName: 'GST (18%)', taxValue: 18, isDefault: false, enabled: true },
    ]);
    console.log(`👍 Taxes seeded: ${taxList.length} tax rates`);

    // 3. SEED CLIENTS (16 Companies across global regions)
    await Client.deleteMany();
    const clientData = [
      {
        name: 'TechCorp Solutions',
        email: 'billing@techcorp.io',
        phone: '+1 (415) 555-0192',
        country: 'United States',
        address: '100 Market St, Suite 400, San Francisco, CA 94105',
      },
      {
        name: 'Nexus Digital Media',
        email: 'accounts@nexusmedia.com',
        phone: '+1 (416) 555-0143',
        country: 'Canada',
        address: '450 Bay St, Suite 1200, Toronto, ON M5H 2V6',
      },
      {
        name: 'Apex Global Innovations',
        email: 'finance@apexglobal.co.uk',
        phone: '+44 20 7946 0912',
        country: 'United Kingdom',
        address: '22 Bishopsgate, London EC2N 4BQ',
      },
      {
        name: 'Quantum Byte Labs',
        email: 'rechnung@quantumbyte.de',
        phone: '+49 30 12345678',
        country: 'Germany',
        address: 'Friedrichstraße 43, 10117 Berlin',
      },
      {
        name: 'Horizon Retail Group',
        email: 'mscott@horizonretail.com',
        phone: '+1 (570) 555-0177',
        country: 'United States',
        address: '1725 Slough Ave, Scranton, PA 18508',
      },
      {
        name: 'Starlight Interactive',
        email: 'contact@starlightgames.jp',
        phone: '+81 3 5555 0188',
        country: 'Japan',
        address: 'Roppongi Hills Mori Tower 18F, Minato City, Tokyo',
      },
      {
        name: 'Vanguard Cyber Defense',
        email: 'billing@vanguardsecurity.com',
        phone: '+1 (202) 555-0199',
        country: 'United States',
        address: '1200 K St NW, Washington, DC 20005',
      },
      {
        name: 'Nordic Cloud Systems',
        email: 'faktura@nordiccloud.se',
        phone: '+46 8 555 1234',
        country: 'Sweden',
        address: 'Kungsgatan 14, 111 43 Stockholm',
      },
      {
        name: 'AeroDynamics Propulsion',
        email: 'accounts@aerodynamics.fr',
        phone: '+33 1 42 68 55 00',
        country: 'France',
        address: '12 Rue de la Paix, 75002 Paris',
      },
      {
        name: 'Pacific Rim Logistics',
        email: 'invoice@pacificlogistics.sg',
        phone: '+65 6789 0123',
        country: 'Singapore',
        address: '10 Marina Boulevard, Marina Bay Financial Centre, Singapore',
      },
      {
        name: 'Summit Healthcare Tech',
        email: 'finance@summithealth.org',
        phone: '+1 (617) 555-0120',
        country: 'United States',
        address: '300 Longwood Ave, Boston, MA 02115',
      },
      {
        name: 'Solaria Clean Energy',
        email: 'cuentas@solariaenergy.es',
        phone: '+34 91 555 4321',
        country: 'Spain',
        address: 'Paseo de la Castellana 89, 28046 Madrid',
      },
      {
        name: 'BlueWave Fintech Ventures',
        email: 'payables@bluewavefin.com',
        phone: '+1 (212) 555-0182',
        country: 'United States',
        address: '40 Wall St, 28th Floor, New York, NY 10005',
      },
      {
        name: 'Velocity Auto Dynamics',
        email: 'info@velocityauto.it',
        phone: '+39 02 5555 9876',
        country: 'Italy',
        address: 'Via Montenapoleone 8, 20121 Milano',
      },
      {
        name: 'Silverline Architecture',
        email: 'accounts@silverlinearch.com.au',
        phone: '+61 2 9555 0144',
        country: 'Australia',
        address: '100 George St, Sydney NSW 2000',
      },
      {
        name: 'BioGenix Diagnostics',
        email: 'finance@biogenixdx.ch',
        phone: '+41 22 555 7890',
        country: 'Switzerland',
        address: 'Route de Pré-Bois 20, 1215 Genève',
      },
    ];

    const clients = await Client.insertMany(
      clientData.map((c) => ({
        ...c,
        createdBy: admin._id,
        assigned: admin._id,
        enabled: true,
        removed: false,
      }))
    );
    console.log(`👍 Clients seeded: ${clients.length} clients`);

    // Clean existing transactions
    await Invoice.deleteMany();
    await Payment.deleteMany();
    await Quote.deleteMany();

    const currentYear = new Date().getFullYear();
    const today = new Date();
    const daysAgo = (d) => new Date(today.getTime() - d * 24 * 60 * 60 * 1000);
    const daysAhead = (d) => new Date(today.getTime() + d * 24 * 60 * 60 * 1000);

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
      {
        items: [
          { itemName: 'Hardware IoT Device Integration', description: 'MQTT broker setup and telemetry data ingestion', quantity: 1, price: 5800, total: 5800 },
        ],
        subTotal: 5800,
        total: 5800,
        currency: 'USD',
        paymentStatus: 'paid',
        status: 'sent',
        daysAgo: 6,
      },
      {
        items: [
          { itemName: 'Staff Training & Technical Workshops', description: '5-day remote training on system architecture & code base', quantity: 1, price: 3000, total: 3000 },
        ],
        subTotal: 3000,
        total: 3000,
        currency: 'USD',
        paymentStatus: 'unpaid',
        status: 'pending',
        daysAgo: 5,
      },
      {
        items: [
          { itemName: 'Brand Identity & Web Assets Package', description: 'Vector logos, brand style guide & iconography pack', quantity: 1, price: 2400, total: 2400 },
        ],
        subTotal: 2400,
        total: 2400,
        currency: 'USD',
        paymentStatus: 'paid',
        status: 'sent',
        daysAgo: 4,
      },
      {
        items: [
          { itemName: 'Disaster Recovery & Backup Automation', description: 'Multi-region S3 backups with automated failover testing', quantity: 1, price: 3500, total: 3500 },
        ],
        subTotal: 3500,
        total: 3500,
        currency: 'USD',
        paymentStatus: 'unpaid',
        status: 'sent',
        daysAgo: 3,
      },
      {
        items: [
          { itemName: 'Custom ERP Inventory Management', description: 'Barcode scanning, stock levels & reordering triggers', quantity: 1, price: 6200, total: 6200 },
        ],
        subTotal: 6200,
        total: 6200,
        currency: 'USD',
        paymentStatus: 'partially',
        paidAmount: 3100,
        status: 'sent',
        daysAgo: 2,
      },
      {
        items: [
          { itemName: 'Email Newsletter Automation Engine', description: 'SendGrid / Resend dynamic template trigger system', quantity: 1, price: 1400, total: 1400 },
        ],
        subTotal: 1400,
        total: 1400,
        currency: 'USD',
        paymentStatus: 'paid',
        status: 'sent',
        daysAgo: 1,
      },
      {
        items: [
          { itemName: 'Scalable Micro-Frontend Architecture', description: 'Webpack Module Federation implementation', quantity: 1, price: 7500, total: 7500 },
        ],
        subTotal: 7500,
        total: 7500,
        currency: 'USD',
        paymentStatus: 'unpaid',
        status: 'draft',
        daysAgo: 1,
      },
      {
        items: [
          { itemName: 'Single Sign-On (SSO) & SAML/Okta Integration', description: 'Enterprise user authentication & directory sync', quantity: 1, price: 4100, total: 4100 },
        ],
        subTotal: 4100,
        total: 4100,
        currency: 'USD',
        paymentStatus: 'unpaid',
        status: 'pending',
        daysAgo: 0,
      },
    ];

    let paymentCounter = 1;
    const createdInvoices = [];
    const createdPayments = [];

    // 4. SEED INVOICES & PAYMENTS
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
        createdBy: admin._id,
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

      // Create payments if paid or partially paid
      if (paidCredit > 0) {
        const mode = paymentModes[i % paymentModes.length];
        const newPayment = await new Payment({
          number: paymentCounter++,
          createdBy: admin._id,
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

    // 5. SEED QUOTES (16 Detailed Quotes)
    const quoteTemplates = [
      {
        title: 'Native Mobile App Ecosystem',
        desc: 'iOS and Android app with biometric authentication & cloud sync',
        price: 14500,
        status: 'accepted',
        daysAgo: 25,
      },
      {
        title: 'Complete Enterprise ERP Overhaul',
        desc: 'Inventory, HRM, Accounting, and Warehouse logistics integration',
        price: 24000,
        status: 'pending',
        daysAgo: 18,
      },
      {
        title: 'AI Automated Customer Support Engine',
        desc: 'Voice & text AI agent with automated ticket escalation',
        price: 9800,
        status: 'sent',
        daysAgo: 15,
      },
      {
        title: 'SOC2 & HIPAA Compliance Infrastructure',
        desc: 'End-to-end encrypted storage, audit trails and access logging',
        price: 11200,
        status: 'accepted',
        daysAgo: 14,
      },
      {
        title: 'Global Multi-Region CDN & Edge Caching',
        desc: 'Cloudflare Workers edge caching and global DDoS mitigation',
        price: 5200,
        status: 'draft',
        daysAgo: 12,
      },
      {
        title: 'Financial Ledger & Real-Time Reporting',
        desc: 'Double-entry bookkeeping engine with automated tax calculation',
        price: 8400,
        status: 'sent',
        daysAgo: 10,
      },
      {
        title: 'B2B Wholesale Portal & Supplier Network',
        desc: 'Custom quote builder, volume discounts and purchase orders',
        price: 16500,
        status: 'pending',
        daysAgo: 9,
      },
      {
        title: 'Zero-Trust Network Access Architecture',
        desc: 'WireGuard VPN mesh, biometric MFA and endpoint validation',
        price: 7600,
        status: 'accepted',
        daysAgo: 8,
      },
      {
        title: 'Real-Time Inventory RFID Tracking System',
        desc: 'Hardware scanner integration and real-time socket events',
        price: 13000,
        status: 'declined',
        daysAgo: 7,
      },
      {
        title: 'Custom Headless CMS & Marketing Site',
        desc: 'Next.js static generation with automated preview deployment',
        price: 6800,
        status: 'sent',
        daysAgo: 6,
      },
      {
        title: 'Automated Payroll & Tax Filing Integration',
        desc: 'Direct bank debit, pay stub generation and tax reporting',
        price: 9500,
        status: 'pending',
        daysAgo: 5,
      },
      {
        title: 'IoT Sensor Telemetry Dashboard',
        desc: 'Time-series database with Grafana dashboards & alerts',
        price: 8900,
        status: 'draft',
        daysAgo: 4,
      },
      {
        title: 'Predictive Analytics & Machine Learning Models',
        desc: 'Churn prediction and customer lifetime value regression models',
        price: 18000,
        status: 'sent',
        daysAgo: 3,
      },
      {
        title: 'High-Throughput Payment Processing Microservice',
        desc: '10k+ TPS transaction queue with idempotent retries',
        price: 12800,
        status: 'accepted',
        daysAgo: 2,
      },
      {
        title: 'Executive KPI Reporting Suite',
        desc: 'Automated executive summary generation and Slack/Email digests',
        price: 4900,
        status: 'pending',
        daysAgo: 1,
      },
      {
        title: 'Web Security Penetration & Red Team Assessment',
        desc: 'Manual black-box testing and remediated patch advisory',
        price: 7200,
        status: 'sent',
        daysAgo: 0,
      },
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
        createdBy: admin._id,
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
    console.log('🎉 MASSIVE DEMO DATA SEEDING COMPLETE (75+ Total Records)');
    console.log(`   - 🏢 Clients:       ${clients.length}`);
    console.log(`   - 📄 Invoices:      ${createdInvoices.length}`);
    console.log(`   - 💳 Payments:      ${createdPayments.length}`);
    console.log(`   - 📝 Quotes:        ${quotes.length}`);
    console.log(`   - 🏷️ Taxes:         ${taxList.length}`);
    console.log(`   - 💵 Payment Modes: ${paymentModes.length}`);
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during data seeding:', error);
    process.exit(1);
  }
}

seedMassiveData();

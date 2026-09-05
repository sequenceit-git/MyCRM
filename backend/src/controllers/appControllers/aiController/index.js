const mongoose = require('mongoose');
const OpenAI = require('openai');

// Helper to check guest mode
const isGuest = (req) =>
  req.headers['x-guest-mode'] === 'true' ||
  req.admin?.role === 'guest' ||
  req.admin?.email?.startsWith('guest');

// CRM Tool Definitions & Execution Functions
const toolDefinitions = [
  {
    type: 'function',
    function: {
      name: 'get_crm_summary',
      description: 'Fetch executive financial KPI metrics, including total invoiced, collected revenue, unpaid balance, active quotes, offers, and operating expenses.',
      parameters: {
        type: 'object',
        properties: {
          period: {
            type: 'string',
            enum: ['all', 'month', 'week', 'year'],
            description: 'Time period for summary calculation',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_top_ranked_crm_data',
      description: 'Fetch top-performing, highest revenue, top ordered, premium, or top spending clients, biggest invoices, top quotes, biggest expenses, or top priced products.',
      parameters: {
        type: 'object',
        properties: {
          metric: {
            type: 'string',
            enum: [
              'top_clients_by_revenue',
              'top_clients_by_orders',
              'biggest_invoices',
              'biggest_unpaid_invoices',
              'biggest_quotes',
              'highest_expenses',
              'top_products_by_price',
            ],
            description: 'The analytical ranking metric to calculate',
          },
          limit: {
            type: 'number',
            description: 'Number of top records to return (default: 5)',
          },
        },
        required: ['metric'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'query_crm_data',
      description: 'Query, search, or list CRM records for any entity. NOTE: search parameter should ONLY be used for exact names or emails (e.g. "TechCorp", "alex@corp.com"), NOT for analytical words like "top", "premium", or "ordered".',
      parameters: {
        type: 'object',
        properties: {
          entity: {
            type: 'string',
            enum: [
              'invoice',
              'quote',
              'offer',
              'client',
              'lead',
              'product',
              'order',
              'expense',
              'people',
              'company',
            ],
            description: 'The entity to query',
          },
          status: {
            type: 'string',
            description: 'Status filter (e.g. paid, unpaid, pending, sent, draft, accepted, declined, won)',
          },
          search: {
            type: 'string',
            description: 'Specific proper name or email to search for (leave blank for broad list/top queries)',
          },
          limit: {
            type: 'number',
            description: 'Max records to return (default: 10)',
          },
        },
        required: ['entity'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'create_crm_record',
      description: 'Create a new CRM record such as a Lead, Client, Invoice, Quote, Offer, Expense, Product, or Order.',
      parameters: {
        type: 'object',
        properties: {
          entity: {
            type: 'string',
            enum: [
              'lead',
              'client',
              'invoice',
              'quote',
              'offer',
              'expense',
              'product',
              'order',
              'people',
              'company',
            ],
            description: 'Entity type to create',
          },
          data: {
            type: 'object',
            description: 'Record fields and values to create',
          },
        },
        required: ['entity', 'data'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_crm_record',
      description: 'Update fields, status, prices, or details of an existing CRM record by ID or Number.',
      parameters: {
        type: 'object',
        properties: {
          entity: {
            type: 'string',
            description: 'Entity type to update',
          },
          idOrNumber: {
            type: 'string',
            description: 'The record _id or document number (e.g. invoice number, quote number)',
          },
          data: {
            type: 'object',
            description: 'Fields and values to update (e.g. { paymentStatus: "paid", status: "accepted" })',
          },
        },
        required: ['entity', 'idOrNumber', 'data'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'delete_crm_record',
      description: 'Soft-delete / remove a CRM record by ID or Number.',
      parameters: {
        type: 'object',
        properties: {
          entity: {
            type: 'string',
            description: 'Entity type',
          },
          idOrNumber: {
            type: 'string',
            description: 'Record ID or Number to remove',
          },
        },
        required: ['entity', 'idOrNumber'],
      },
    },
  },
];

// Entity to Mongoose model name mapping
const getModelName = (entity) => {
  const map = {
    invoice: 'Invoice',
    quote: 'Quote',
    offer: 'Offer',
    client: 'Client',
    lead: 'Lead',
    product: 'Product',
    productcategory: 'ProductCategory',
    order: 'Order',
    expense: 'Expense',
    expensecategory: 'ExpenseCategory',
    people: 'People',
    company: 'Company',
    admin: 'Admin',
    payment: 'Payment',
  };
  return map[entity.toLowerCase()] || entity;
};

// 1. Tool Executor: Summary
async function executeSummary() {
  try {
    const Invoice = mongoose.model('Invoice');
    const Payment = mongoose.model('Payment');
    const Quote = mongoose.model('Quote');
    const Offer = mongoose.model('Offer');
    const Expense = mongoose.model('Expense');
    const Client = mongoose.model('Client');
    const Lead = mongoose.model('Lead');

    const [invoices, payments, quotes, offers, expenses, clientCount, leadCount] = await Promise.all([
      Invoice.find({ removed: false }),
      Payment.find({ removed: false }),
      Quote.find({ removed: false }),
      Offer.find({ removed: false }),
      Expense.find({ removed: false }),
      Client.countDocuments({ removed: false }),
      Lead.countDocuments({ removed: false }),
    ]);

    const totalInvoiced = invoices.reduce((sum, i) => sum + (i.total || 0), 0);
    const totalCollected = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalUnpaid = invoices
      .filter((i) => i.paymentStatus !== 'paid')
      .reduce((sum, i) => sum + ((i.total || 0) - (i.credit || 0)), 0);
    const totalQuotes = quotes.reduce((sum, q) => sum + (q.total || 0), 0);
    const totalOffers = offers.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const netIncome = totalCollected - totalExpenses;
    const collectionRate = totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0;

    return {
      totalInvoiced,
      totalCollected,
      totalUnpaid,
      totalQuotes,
      totalOffers,
      totalExpenses,
      netIncome,
      collectionRate: `${collectionRate}%`,
      clientCount,
      leadCount,
      invoiceCount: invoices.length,
      quoteCount: quotes.length,
      offerCount: offers.length,
    };
  } catch (err) {
    return { error: err.message };
  }
}

// 2. Tool Executor: Top Ranked & Analytical Aggregations
async function executeRankings({ metric = 'top_clients_by_revenue', limit = 5 }) {
  try {
    const Invoice = mongoose.model('Invoice');
    const Order = mongoose.model('Order');
    const Expense = mongoose.model('Expense');
    const Quote = mongoose.model('Quote');
    const Product = mongoose.model('Product');

    if (metric === 'top_clients_by_revenue' || metric === 'top_clients_by_orders' || metric.includes('client') || metric.includes('customer')) {
      const [invoices, orders] = await Promise.all([
        Invoice.find({ removed: false }).populate('client'),
        Order.find({ removed: false }).populate('client'),
      ]);

      const clientMap = {};

      invoices.forEach((inv) => {
        const clientObj = inv.client;
        const clientId = clientObj?._id?.toString() || inv.client?.toString() || 'unknown';
        const clientName = clientObj?.name || clientObj?.company || `Client #${inv.number}`;
        const clientEmail = clientObj?.email || 'N/A';
        const clientCountry = clientObj?.country || 'N/A';

        if (!clientMap[clientId]) {
          clientMap[clientId] = {
            id: clientId,
            name: clientName,
            email: clientEmail,
            country: clientCountry,
            totalInvoiced: 0,
            totalPaid: 0,
            invoiceCount: 0,
            orderCount: 0,
          };
        }
        clientMap[clientId].totalInvoiced += inv.total || 0;
        if (inv.paymentStatus === 'paid') {
          clientMap[clientId].totalPaid += inv.total || 0;
        } else if (inv.credit) {
          clientMap[clientId].totalPaid += inv.credit;
        }
        clientMap[clientId].invoiceCount += 1;
      });

      orders.forEach((ord) => {
        const clientObj = ord.client;
        const clientId = clientObj?._id?.toString() || ord.client?.toString() || 'unknown';
        if (clientMap[clientId]) {
          clientMap[clientId].orderCount += 1;
        }
      });

      const ranked = Object.values(clientMap).sort((a, b) => {
        if (metric === 'top_clients_by_orders') {
          return b.orderCount - a.orderCount || b.totalInvoiced - a.totalInvoiced;
        }
        return b.totalInvoiced - a.totalInvoiced;
      });

      return {
        metric,
        count: Math.min(ranked.length, limit),
        rankings: ranked.slice(0, limit),
      };
    } else if (metric === 'biggest_invoices' || metric === 'biggest_unpaid_invoices') {
      const query = { removed: false };
      if (metric === 'biggest_unpaid_invoices') {
        query.paymentStatus = { $ne: 'paid' };
      }
      const records = await Invoice.find(query).sort({ total: -1 }).limit(limit).populate('client');
      return { metric, count: records.length, records };
    } else if (metric === 'highest_expenses') {
      const records = await Expense.find({ removed: false }).sort({ amount: -1 }).limit(limit).populate('category');
      return { metric, count: records.length, records };
    } else if (metric === 'top_products_by_price') {
      const records = await Product.find({ removed: false }).sort({ price: -1 }).limit(limit).populate('category');
      return { metric, count: records.length, records };
    } else if (metric === 'biggest_quotes') {
      const records = await Quote.find({ removed: false }).sort({ total: -1 }).limit(limit).populate('client');
      return { metric, count: records.length, records };
    }

    return { error: `Unsupported ranking metric: ${metric}` };
  } catch (err) {
    return { error: err.message };
  }
}

// 3. Tool Executor: Query with Dynamic Normalization
async function executeQuery({ entity, status, search, limit = 15 }) {
  try {
    const modelName = getModelName(entity);
    const Model = mongoose.model(modelName);

    // Filter word cleansing
    let cleanSearch = (search || '').trim();
    const rankingKeywords = /\b(top|ordered|orderd|premium|best|vip|highest|biggest|most|spender|spend|client|clients|customer|customers|lead|leads|invoice|invoices|product|products|expense|expenses|quote|quotes|active|all)\b/gi;
    
    // Check if the search term is entirely ranking filler words
    const strippedWords = cleanSearch.replace(rankingKeywords, '').trim();
    
    // If user asked for top clients / premium clients via query_crm_data
    if ((modelName === 'Client' || modelName === 'Company') && cleanSearch.match(/\b(top|ordered|orderd|premium|best|highest|spend)\b/i) && strippedWords.length === 0) {
      const isOrders = cleanSearch.match(/\b(order|ordered|orderd)\b/i);
      return await executeRankings({
        metric: isOrders ? 'top_clients_by_orders' : 'top_clients_by_revenue',
        limit: Math.min(limit, 10),
      });
    }

    let query = { removed: false };

    if (status) {
      const s = status.toLowerCase().trim();
      if (s === 'active' || s === 'all' || s === 'open' || s === 'pipeline') {
        if (modelName === 'Lead') {
          query.status = { $nin: ['lost'] };
        } else if (modelName === 'Invoice') {
          query.paymentStatus = { $ne: 'paid' };
        } else if (modelName === 'Quote' || modelName === 'Offer') {
          query.status = { $nin: ['declined', 'expired'] };
        } else if (modelName === 'Order') {
          query.status = { $nin: ['cancelled'] };
        }
      } else if (s === 'unpaid') {
        query.$or = [
          { paymentStatus: 'unpaid' },
          { paymentStatus: 'partially' },
          { status: 'unpaid' },
        ];
      } else if (s === 'paid') {
        query.$or = [
          { paymentStatus: 'paid' },
          { status: 'paid' },
        ];
      } else {
        query.$or = [
          { status: new RegExp(status, 'i') },
          { paymentStatus: new RegExp(status, 'i') },
        ];
      }
    }

    if (strippedWords.length > 0) {
      const searchRegex = new RegExp(strippedWords, 'i');
      query.$or = [
        { name: searchRegex },
        { title: searchRegex },
        { email: searchRegex },
        { ref: searchRegex },
        { firstname: searchRegex },
        { lastname: searchRegex },
      ];
      if (!isNaN(Number(strippedWords))) {
        query.$or.push({ number: Number(strippedWords) });
      }
    }

    const records = await Model.find(query).limit(Math.min(limit, 30)).sort({ created: -1 });
    return {
      entity,
      count: records.length,
      records: records.map((r) => {
        const obj = r.toObject();
        delete obj.__v;
        return obj;
      }),
    };
  } catch (err) {
    return { error: err.message };
  }
}

// 4. Tool Executor: Create
async function executeCreate({ entity, data }, adminId) {
  try {
    const modelName = getModelName(entity);
    const Model = mongoose.model(modelName);

    if (['Invoice', 'Quote', 'Offer', 'Order'].includes(modelName) && !data.number) {
      const lastDoc = await Model.findOne().sort({ number: -1 });
      data.number = lastDoc ? (lastDoc.number || 0) + 1 : 1;
      data.year = data.year || new Date().getFullYear();
    }

    if (!data.date) data.date = new Date();
    if (adminId) data.createdBy = adminId;

    const newDoc = await new Model(data).save();
    return {
      success: true,
      message: `Successfully created ${modelName} record #${newDoc.number || newDoc._id}`,
      record: newDoc.toObject(),
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// 5. Tool Executor: Update
async function executeUpdate({ entity, idOrNumber, data }) {
  try {
    const modelName = getModelName(entity);
    const Model = mongoose.model(modelName);

    let query = {};
    if (mongoose.Types.ObjectId.isValid(idOrNumber)) {
      query._id = idOrNumber;
    } else if (!isNaN(Number(idOrNumber))) {
      query.number = Number(idOrNumber);
    } else {
      query.$or = [{ name: idOrNumber }, { ref: idOrNumber }];
    }

    const updated = await Model.findOneAndUpdate(
      query,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return { success: false, error: `Could not find ${modelName} matching ${idOrNumber}` };
    }

    return {
      success: true,
      message: `Successfully updated ${modelName} record`,
      record: updated.toObject(),
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// 6. Tool Executor: Delete
async function executeDelete({ entity, idOrNumber }) {
  try {
    const modelName = getModelName(entity);
    const Model = mongoose.model(modelName);

    let query = {};
    if (mongoose.Types.ObjectId.isValid(idOrNumber)) {
      query._id = idOrNumber;
    } else if (!isNaN(Number(idOrNumber))) {
      query.number = Number(idOrNumber);
    } else {
      query.name = idOrNumber;
    }

    const removed = await Model.findOneAndUpdate(
      query,
      { $set: { removed: true, enabled: false } },
      { new: true }
    );

    if (!removed) {
      return { success: false, error: `Could not find ${modelName} to delete` };
    }

    return {
      success: true,
      message: `Successfully removed ${modelName} #${removed.number || removed.name || removed._id}`,
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Dispatcher for Tool Calls
async function dispatchTool(toolName, args, adminId) {
  if (toolName === 'get_crm_summary') {
    return await executeSummary(args);
  } else if (toolName === 'get_top_ranked_crm_data') {
    return await executeRankings(args);
  } else if (toolName === 'query_crm_data') {
    return await executeQuery(args);
  } else if (toolName === 'create_crm_record') {
    return await executeCreate(args, adminId);
  } else if (toolName === 'update_crm_record') {
    return await executeUpdate(args);
  } else if (toolName === 'delete_crm_record') {
    return await executeDelete(args);
  }
  return { error: `Unknown tool: ${toolName}` };
}

// Smart Local Fallback Parser
async function localFallbackAgent(userMessage, adminId) {
  const lower = userMessage.toLowerCase();
  const actionsTaken = [];

  // 1. Top Ordered / Top Premium / Highest Revenue Clients
  if (
    lower.includes('top order') ||
    lower.includes('top ordered') ||
    lower.includes('most order') ||
    lower.includes('premium client') ||
    lower.includes('top client') ||
    lower.includes('top customer') ||
    lower.includes('biggest customer') ||
    lower.includes('top spender')
  ) {
    const isOrders = lower.includes('order');
    const metric = isOrders ? 'top_clients_by_orders' : 'top_clients_by_revenue';
    actionsTaken.push(`Called get_top_ranked_crm_data(metric: "${metric}")`);
    const rankRes = await executeRankings({ metric, limit: 6 });
    const list = rankRes.rankings || [];

    let table = isOrders
      ? `### 🛒 Top Customers by Order Volume & Value\n\n`
      : `### 💎 Top Premium Clients by Total Invoiced & Revenue\n\n`;
    table += '| # | Client / Company | Total Invoiced | Total Paid | Orders | Invoices | Country |\n';
    table += '| :-: | :--- | :--- | :--- | :-: | :-: | :--- |\n';
    list.forEach((c, idx) => {
      table += `| **${idx + 1}** | **${c.name}** | **$${c.totalInvoiced?.toLocaleString()}** | $${c.totalPaid?.toLocaleString()} | \`${c.orderCount}\` | \`${c.invoiceCount}\` | ${c.country} |\n`;
    });

    return {
      actionsTaken,
      reply: table + `\n> 💡 **Summary**: Found **${list.length}** top clients ranked by commercial value and order history.`,
    };
  }

  // 2. Revenue & Financial Summary
  if (lower.includes('revenue') || lower.includes('summary') || lower.includes('kpi') || lower.includes('overview') || lower.includes('financial')) {
    actionsTaken.push('Called get_crm_summary');
    const sum = await executeSummary();
    return {
      actionsTaken,
      reply: `### 📊 Real-Time Financial & CRM Summary

| Metric | Amount / Value |
| :--- | :--- |
| **Gross Total Invoiced** | **$${sum.totalInvoiced?.toLocaleString()}** |
| **Total Revenue Collected** | **$${sum.totalCollected?.toLocaleString()}** |
| **Outstanding Unpaid Invoices** | **$${sum.totalUnpaid?.toLocaleString()}** |
| **Active Quotes Pipeline** | **$${sum.totalQuotes?.toLocaleString()}** |
| **Offers for Leads Pipeline** | **$${sum.totalOffers?.toLocaleString()}** |
| **Total Operating Expenses** | **$${sum.totalExpenses?.toLocaleString()}** |
| **Net Operating Income** | **$${sum.netIncome?.toLocaleString()}** |
| **Collection Efficiency Rate** | **${sum.collectionRate}** |

- 🏢 **Active Clients**: ${sum.clientCount}
- 🎯 **Active Leads**: ${sum.leadCount}
- 📄 **Total Invoices**: ${sum.invoiceCount}
- 📝 **Total Quotes**: ${sum.quoteCount}`,
    };
  }

  // 3. Unpaid Invoices
  if (lower.includes('unpaid') && lower.includes('invoice')) {
    actionsTaken.push('Called query_crm_data(entity: invoice, status: unpaid)');
    const res = await executeQuery({ entity: 'invoice', status: 'unpaid', limit: 10 });
    const records = res.records || [];
    let table = `### 📄 Outstanding Unpaid Invoices (${records.length} Records)\n\n`;
    table += '| # | Client / Email | Amount | Due Date | Status |\n';
    table += '| :--- | :--- | :--- | :--- | :--- |\n';
    records.forEach((r) => {
      table += `| **#${r.number}** | ${r.client?.name || r.notes || 'N/A'} | **$${r.total?.toLocaleString()}** | ${r.expiredDate ? new Date(r.expiredDate).toLocaleDateString() : 'N/A'} | \`${r.paymentStatus || r.status}\` |\n`;
    });
    return { actionsTaken, reply: table };
  }

  // 4. Invoices
  if (lower.includes('invoice')) {
    actionsTaken.push('Called query_crm_data(entity: invoice)');
    const res = await executeQuery({ entity: 'invoice', limit: 8 });
    const records = res.records || [];
    let table = `### 📄 Recent Invoices (${records.length} Found)\n\n`;
    table += '| # | Client | Amount | Status | Payment |\n';
    table += '| :--- | :--- | :--- | :--- | :--- |\n';
    records.forEach((r) => {
      table += `| **#${r.number}** | ${r.client?.name || 'N/A'} | **$${r.total?.toLocaleString()}** | \`${r.status}\` | \`${r.paymentStatus}\` |\n`;
    });
    return { actionsTaken, reply: table };
  }

  // 5. Leads
  if (lower.includes('lead')) {
    actionsTaken.push('Called query_crm_data(entity: lead)');
    const res = await executeQuery({ entity: 'lead', status: 'active', limit: 10 });
    const records = res.records || [];
    let table = `### 🎯 Lead Pipeline (${records.length} Leads)\n\n`;
    table += '| Lead Name | Email | Country | Source | Status |\n';
    table += '| :--- | :--- | :--- | :--- | :--- |\n';
    records.forEach((r) => {
      table += `| **${r.name}** | ${r.email || 'N/A'} | ${r.country || 'N/A'} | \`${r.source}\` | \`${r.status}\` |\n`;
    });
    return { actionsTaken, reply: table };
  }

  // 6. Clients
  if (lower.includes('client') || lower.includes('customer')) {
    actionsTaken.push('Called query_crm_data(entity: client)');
    const res = await executeQuery({ entity: 'client', limit: 8 });
    const records = res.records || [];
    let table = `### 👥 Clients Directory (${records.length} Clients)\n\n`;
    table += '| Company / Client | Email | Phone | Country |\n';
    table += '| :--- | :--- | :--- | :--- | :--- |\n';
    records.forEach((r) => {
      table += `| **${r.name}** | ${r.email || 'N/A'} | ${r.phone || 'N/A'} | ${r.country || 'N/A'} |\n`;
    });
    return { actionsTaken, reply: table };
  }

  // 7. Quotes & Offers
  if (lower.includes('quote') || lower.includes('proposal') || lower.includes('offer')) {
    actionsTaken.push('Called query_crm_data(entity: quote)');
    const res = await executeQuery({ entity: 'quote', limit: 8 });
    const records = res.records || [];
    let table = `### 📝 Commercial Quotes (${records.length} Quotes)\n\n`;
    table += '| # | Title | Client | Amount | Status |\n';
    table += '| :--- | :--- | :--- | :--- | :--- |\n';
    records.forEach((r) => {
      table += `| **#${r.number}** | ${r.items?.[0]?.itemName || 'Proposal'} | ${r.client?.name || 'N/A'} | **$${r.total?.toLocaleString()}** | \`${r.status}\` |\n`;
    });
    return { actionsTaken, reply: table };
  }

  // 8. Orders
  if (lower.includes('order')) {
    actionsTaken.push('Called query_crm_data(entity: order)');
    const res = await executeQuery({ entity: 'order', limit: 8 });
    const records = res.records || [];
    let table = `### 🛒 Orders List (${records.length} Orders)\n\n`;
    table += '| Order # | Total | Status | Notes |\n';
    table += '| :--- | :--- | :--- | :--- |\n';
    records.forEach((r) => {
      table += `| **#${r.number}** | **$${r.total?.toLocaleString()}** | \`${r.status}\` | ${r.notes || 'N/A'} |\n`;
    });
    return { actionsTaken, reply: table };
  }

  // 9. Expenses
  if (lower.includes('expense')) {
    actionsTaken.push('Called query_crm_data(entity: expense)');
    const res = await executeQuery({ entity: 'expense', limit: 8 });
    const records = res.records || [];
    let table = `### 💸 Operating Expenses (${records.length} Entries)\n\n`;
    table += '| Expense Description | Amount | Ref | Category |\n';
    table += '| :--- | :--- | :--- | :--- |\n';
    records.forEach((r) => {
      table += `| **${r.name}** | **$${r.amount?.toLocaleString()}** | \`${r.ref}\` | ${r.category?.name || 'Operations'} |\n`;
    });
    return { actionsTaken, reply: table };
  }

  // Default Guidance
  const hasKey = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 10);
  const keyNotice = hasKey
    ? ''
    : '\n\n> 💡 *Note: To enable arbitrary conversational GPT-4o reasoning, add your `OPENAI_API_KEY` in `backend/.env`.*';

  return {
    actionsTaken,
    reply: `👋 Hello! I am your **MyCRM AI Assistant**. I can control and query your entire CRM/ERP system.

Here are a few things you can ask me:
- 📊 **"Show me the financial and revenue summary"**
- 💎 **"Who is our top premium client?"**
- 🛒 **"Show top ordered customers"**
- 📄 **"List all unpaid invoices"**
- 🎯 **"Show active leads in the pipeline"**
- 👥 **"List all clients and contact details"**
- 💸 **"List our operating expenses"**${keyNotice}`,
  };
}

// Main AI Chat Handler
const chat = async (req, res) => {
  try {
    const { message: userMessage, conversationHistory = [] } = req.body;

    if (!userMessage || typeof userMessage !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Message string is required in request body',
      });
    }

    require('dotenv').config({ path: '.env' });
    const rawKey = process.env.OPENAI_API_KEY || '';
    const openAiApiKey = rawKey.replace(/["'\r\n]/g, '').trim();
    const adminId = req.admin?._id;

    // Check if guest user is trying to make modifications
    if (isGuest(req)) {
      const lower = userMessage.toLowerCase();
      if (lower.startsWith('delete') || lower.startsWith('create') || lower.startsWith('update') || lower.startsWith('remove')) {
        return res.status(200).json({
          success: true,
          actionsTaken: ['Blocked modification in Guest View-Only mode'],
          reply: '🔒 **View-Only Guest Mode**: Modifying, creating, or deleting records is disabled in guest preview. You can still query, search, and view all CRM summaries and analytics!',
        });
      }
    }

    // 1. If OpenAI API key is set and valid, use OpenAI Function Calling Agent Loop
    if (openAiApiKey && !openAiApiKey.includes('your open_ai') && (openAiApiKey.startsWith('sk-') || openAiApiKey.length > 20)) {
      try {
        const openai = new OpenAI({ apiKey: openAiApiKey });

        const messages = [
          {
            role: 'system',
            content: `You are MyCRM AI, an intelligent executive CRM/ERP copilot with direct database tool access.
TOOL GUIDELINES:
- For questions about "top customers", "top ordered customer", "premium clients", "highest revenue", "biggest spenders", "biggest invoices", "top products", ALWAYS call 'get_top_ranked_crm_data' with the appropriate metric ('top_clients_by_revenue', 'top_clients_by_orders', 'biggest_invoices', 'highest_expenses', etc.).
- NEVER pass analytical words like "top", "premium", "ordered", "best", "biggest" into the query_crm_data 'search' parameter.
- The 'search' parameter in query_crm_data is ONLY for exact proper names (e.g., "TechCorp Solutions") or email addresses.

Database Schema & Status Guide:
- Lead: statuses are 'new', 'in_negociation', 'won', 'lost', 'on_hold'. For "active leads", query without status or use 'active'.
- Invoice: paymentStatus are 'unpaid', 'paid', 'partially'; statuses are 'draft', 'pending', 'sent'.
- Quote / Offer: statuses are 'draft', 'pending', 'sent', 'accepted', 'declined', 'expired'.
- Order: statuses are 'pending', 'processing', 'completed', 'cancelled'.

Always format answers with markdown tables, bold values, and concise summaries.`,
          },
          ...conversationHistory.slice(-6).map((m) => ({
            role: m.role || 'user',
            content: m.content || m.message,
          })),
          { role: 'user', content: userMessage },
        ];

        const actionsTaken = [];

        // First tool-calling step
        let response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages,
          tools: toolDefinitions,
          tool_choice: 'auto',
          temperature: 0.3,
        });

        let responseMessage = response.choices[0].message;

        // If model wants to call tools
        if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
          messages.push(responseMessage);

          for (const toolCall of responseMessage.tool_calls) {
            const toolName = toolCall.function.name;
            const toolArgs = JSON.parse(toolCall.function.arguments || '{}');
            actionsTaken.push(`Executed ${toolName}(${JSON.stringify(toolArgs)})`);

            const toolResult = await dispatchTool(toolName, toolArgs, adminId);

            messages.push({
              tool_call_id: toolCall.id,
              role: 'tool',
              name: toolName,
              content: JSON.stringify(toolResult),
            });
          }

          // Second completion with tool execution results
          const secondResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages,
            temperature: 0.3,
          });

          return res.status(200).json({
            success: true,
            actionsTaken,
            reply: secondResponse.choices[0].message.content,
          });
        }

        return res.status(200).json({
          success: true,
          actionsTaken: [],
          reply: responseMessage.content,
        });
      } catch (openAiError) {
        console.warn('OpenAI API call fallback:', openAiError.message);
        const localResult = await localFallbackAgent(userMessage, adminId);
        return res.status(200).json({
          success: true,
          actionsTaken: localResult.actionsTaken,
          reply: localResult.reply,
        });
      }
    }

    // 2. Built-in Local CRM Intelligence Engine
    const localResult = await localFallbackAgent(userMessage, adminId);
    return res.status(200).json({
      success: true,
      actionsTaken: localResult.actionsTaken,
      reply: localResult.reply,
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
      reply: `❌ An error occurred while processing your request: ${error.message}`,
    });
  }
};

module.exports = {
  chat,
};

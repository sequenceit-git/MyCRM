const mongoose = require('mongoose');
const moment = require('moment');

const Model = mongoose.model('Invoice');

const { loadSettings } = require('@/middlewares/settings');

const summary = async (req, res) => {
  let defaultType = 'month';

  const { type } = req.query;

  let dateFilter = {};
  if (type === 'yesterday') {
    dateFilter = {
      date: {
        $gte: moment().subtract(1, 'days').startOf('day').toDate(),
        $lte: moment().subtract(1, 'days').endOf('day').toDate(),
      },
    };
  } else if (type === 'week' || type === 'last_week') {
    dateFilter = {
      date: {
        $gte: moment().subtract(7, 'days').startOf('day').toDate(),
        $lte: moment().endOf('day').toDate(),
      },
    };
  } else if (type === 'month' || type === 'last_month') {
    dateFilter = {
      date: {
        $gte: moment().subtract(30, 'days').startOf('day').toDate(),
        $lte: moment().endOf('day').toDate(),
      },
    };
  } else if (type === 'year' || type === 'last_year') {
    dateFilter = {
      date: {
        $gte: moment().subtract(365, 'days').startOf('day').toDate(),
        $lte: moment().endOf('day').toDate(),
      },
    };
  }

  const statuses = ['draft', 'pending', 'overdue', 'paid', 'unpaid', 'partially'];

  const response = await Model.aggregate([
    {
      $match: {
        removed: false,
        ...dateFilter,
      },
    },
    {
      $facet: {
        totalInvoice: [
          {
            $group: {
              _id: null,
              total: {
                $sum: '$total',
              },
              count: {
                $sum: 1,
              },
            },
          },
          {
            $project: {
              _id: 0,
              total: '$total',
              count: '$count',
            },
          },
        ],
        statusCounts: [
          {
            $group: {
              _id: '$status',
              count: {
                $sum: 1,
              },
            },
          },
          {
            $project: {
              _id: 0,
              status: '$_id',
              count: '$count',
            },
          },
        ],
        paymentStatusCounts: [
          {
            $group: {
              _id: '$paymentStatus',
              count: {
                $sum: 1,
              },
            },
          },
          {
            $project: {
              _id: 0,
              status: '$_id',
              count: '$count',
            },
          },
        ],
        overdueCounts: [
          {
            $match: {
              expiredDate: {
                $lt: new Date(),
              },
            },
          },
          {
            $group: {
              _id: '$status',
              count: {
                $sum: 1,
              },
            },
          },
          {
            $project: {
              _id: 0,
              status: '$_id',
              count: '$count',
            },
          },
        ],
      },
    },
  ]);

  let result = [];

  const totalInvoices = response[0].totalInvoice ? response[0].totalInvoice[0] : 0;
  const statusResult = response[0].statusCounts || [];
  const paymentStatusResult = response[0].paymentStatusCounts || [];
  const overdueResult = response[0].overdueCounts || [];

  const statusResultMap = statusResult.map((item) => {
    return {
      ...item,
      percentage: Math.round((item.count / totalInvoices.count) * 100),
    };
  });

  const paymentStatusResultMap = paymentStatusResult.map((item) => {
    return {
      ...item,
      percentage: Math.round((item.count / totalInvoices.count) * 100),
    };
  });

  const overdueResultMap = overdueResult.map((item) => {
    return {
      ...item,
      status: 'overdue',
      percentage: Math.round((item.count / totalInvoices.count) * 100),
    };
  });

  statuses.forEach((status) => {
    const found = [...paymentStatusResultMap, ...statusResultMap, ...overdueResultMap].find(
      (item) => item.status === status
    );
    if (found) {
      result.push(found);
    }
  });

  const unpaid = await Model.aggregate([
    {
      $match: {
        removed: false,

        // date: {
        //   $gte: startDate.toDate(),
        //   $lte: endDate.toDate(),
        // },
        paymentStatus: {
          $in: ['unpaid', 'partially'],
        },
      },
    },
    {
      $group: {
        _id: null,
        total_amount: {
          $sum: {
            $subtract: ['$total', '$credit'],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        total_amount: '$total_amount',
      },
    },
  ]);

  const finalResult = {
    total: totalInvoices?.total,
    total_undue: unpaid.length > 0 ? unpaid[0].total_amount : 0,
    type,
    performance: result,
  };

  return res.status(200).json({
    success: true,
    result: finalResult,
    message: `Successfully found all invoices for the last ${defaultType}`,
  });
};

module.exports = summary;

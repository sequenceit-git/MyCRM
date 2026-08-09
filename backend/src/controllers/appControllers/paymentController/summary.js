const mongoose = require('mongoose');
const moment = require('moment');

const Model = mongoose.model('Payment');
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

  // get total amount of invoices
  const result = await Model.aggregate([
    {
      $match: {
        removed: false,
        ...dateFilter,
      },
    },
    {
      $group: {
        _id: null, // Group all documents into a single group
        count: {
          $sum: 1,
        },
        total: {
          $sum: '$amount',
        },
      },
    },
    {
      $project: {
        _id: 0, // Exclude _id from the result
        count: 1,
        total: 1,
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    result: result.length > 0 ? result[0] : { count: 0, total: 0 },
    message: `Successfully fetched the summary of payment invoices for the last ${defaultType}`,
  });
};

module.exports = summary;

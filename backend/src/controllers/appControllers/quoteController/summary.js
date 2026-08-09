const mongoose = require('mongoose');
const moment = require('moment');

const summary = async (req, res) => {
  try {
    const Model = mongoose.model('Quote');
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

    const statuses = ['draft', 'pending', 'sent', 'declined', 'accepted', 'expired'];

    const response = await Model.aggregate([
      {
        $match: {
          removed: false,
          ...dateFilter,
        },
      },
      {
        $facet: {
          totalQuote: [
            {
              $group: {
                _id: null,
                total: { $sum: '$total' },
                count: { $sum: 1 },
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
                count: { $sum: 1 },
                totalAmount: { $sum: '$total' },
              },
            },
            {
              $project: {
                _id: 0,
                status: '$_id',
                count: '$count',
                totalAmount: '$totalAmount',
              },
            },
          ],
        },
      },
    ]);

    let totalQuotes = response[0].totalQuote[0] ? response[0].totalQuote[0].total : 0;
    let totalCount = response[0].totalQuote[0] ? response[0].totalQuote[0].count : 0;
    let statusCounts = response[0].statusCounts || [];

    const performance = statuses.map((status) => {
      const match = statusCounts.find((item) => item.status === status);
      const count = match ? match.count : 0;
      const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
      const total = match ? match.totalAmount : 0;
      return {
        status,
        percentage,
        count,
        total,
      };
    });

    return res.status(200).json({
      success: true,
      result: {
        total: totalQuotes,
        total_count: totalCount,
        performance,
      },
      message: 'Successfully fetched quote summary statistics',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};

module.exports = summary;

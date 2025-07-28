const express = require('express');
const Service = require('../models/Service');
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const [
      todayServices,
      monthlyServices,
      recentServices
    ] = await Promise.all([
      // Today's statistics
      Service.aggregate([
        {
          $match: {
            serviceDate: { $gte: startOfDay, $lt: endOfDay },
            status: { $ne: 'cancelled' }
          }
        },
        {
          $group: {
            _id: null,
            totalCustomers: { $sum: 1 },
            totalIncome: { $sum: '$price' }
          }
        }
      ]),

      // Monthly statistics
      Service.aggregate([
        {
          $match: {
            serviceDate: { $gte: startOfMonth, $lt: endOfMonth },
            status: { $ne: 'cancelled' }
          }
        },
        {
          $group: {
            _id: null,
            totalCustomers: { $sum: 1 },
            totalIncome: { $sum: '$price' }
          }
        }
      ]),

      // Recent services
      Service.find()
        .populate('customerId', 'name phone vehiclePlate')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    const todayStats = todayServices[0] || { totalCustomers: 0, totalIncome: 0 };
    const monthlyStats = monthlyServices[0] || { totalCustomers: 0, totalIncome: 0 };

    const dashboardStats = {
      todayCustomers: todayStats.totalCustomers,
      todayIncome: todayStats.totalIncome,
      monthlyCustomers: monthlyStats.totalCustomers,
      monthlyIncome: monthlyStats.totalIncome,
      recentServices: recentServices.map(service => ({
        id: service._id,
        customerId: service.customerId._id,
        customer: {
          name: service.customerId.name,
          phone: service.customerId.phone,
          vehiclePlate: service.customerId.vehiclePlate
        },
        serviceType: service.serviceType,
        price: service.price,
        serviceDate: service.serviceDate,
        status: service.status,
        createdAt: service.createdAt
      }))
    };

    res.json(dashboardStats);
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/monthly
// @desc    Get monthly analytics
// @access  Private
router.get('/monthly', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month ? parseInt(month) - 1 : currentDate.getMonth();
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();

    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const endOfMonth = new Date(targetYear, targetMonth + 1, 1);

    const [dailyIncome, serviceTypeBreakdown] = await Promise.all([
      // Daily income for the month
      Service.aggregate([
        {
          $match: {
            serviceDate: { $gte: startOfMonth, $lt: endOfMonth },
            status: { $ne: 'cancelled' }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$serviceDate'
              }
            },
            income: { $sum: '$price' },
            customers: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]),

      // Service type breakdown
      Service.aggregate([
        {
          $match: {
            serviceDate: { $gte: startOfMonth, $lt: endOfMonth },
            status: { $ne: 'cancelled' }
          }
        },
        {
          $group: {
            _id: '$serviceType',
            count: { $sum: 1 },
            revenue: { $sum: '$price' }
          }
        }
      ])
    ]);

    const analyticsData = {
      dailyIncome: dailyIncome.map(item => ({
        date: item._id,
        income: item.income,
        customers: item.customers
      })),
      serviceTypeBreakdown: serviceTypeBreakdown.map(item => ({
        type: item._id,
        count: item.count,
        revenue: item.revenue
      }))
    };

    res.json(analyticsData);
  } catch (error) {
    console.error('Monthly analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/service-types
// @desc    Get service type breakdown for date range
// @access  Private
router.get('/service-types', auth, async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    
    let matchQuery = { status: { $ne: 'cancelled' } };
    
    if (dateFrom || dateTo) {
      matchQuery.serviceDate = {};
      if (dateFrom) matchQuery.serviceDate.$gte = new Date(dateFrom);
      if (dateTo) matchQuery.serviceDate.$lte = new Date(dateTo);
    }

    const serviceTypeBreakdown = await Service.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$serviceType',
          count: { $sum: 1 },
          revenue: { $sum: '$price' }
        }
      },
      {
        $sort: { revenue: -1 }
      }
    ]);

    res.json(
      serviceTypeBreakdown.map(item => ({
        type: item._id,
        count: item.count,
        revenue: item.revenue
      }))
    );
  } catch (error) {
    console.error('Service type analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
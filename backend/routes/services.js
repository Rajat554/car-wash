const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Service = require('../models/Service');
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/services
// @desc    Get all services with pagination, search, and filters
// @access  Private
router.get('/', [
  auth,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('serviceType').optional().isIn(['basic-wash', 'deep-clean', 'waxing', 'interior-clean', 'engine-wash', 'full-service']),
  query('status').optional().isIn(['pending', 'in-progress', 'completed', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { search, serviceType, status, dateFrom, dateTo } = req.query;
    
    const skip = (page - 1) * limit;

    // Build filter query
    let filterQuery = {};
    
    if (serviceType) filterQuery.serviceType = serviceType;
    if (status) filterQuery.status = status;
    
    if (dateFrom || dateTo) {
      filterQuery.serviceDate = {};
      if (dateFrom) filterQuery.serviceDate.$gte = new Date(dateFrom);
      if (dateTo) filterQuery.serviceDate.$lte = new Date(dateTo);
    }

    const [services, total] = await Promise.all([
      Service.find(filterQuery)
        .populate('customerId', 'name phone vehiclePlate')
        .populate('createdBy', 'name')
        .sort({ serviceDate: -1 })
        .skip(skip)
        .limit(limit),
      Service.countDocuments(filterQuery)
    ]);

    res.json({
      services,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/services/:id
// @desc    Get service by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('customerId')
      .populate('createdBy', 'name');
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error('Get service error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid service ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/services
// @desc    Create a new service
// @access  Private
router.post('/', [
  auth,
  body('customerId').optional().isMongoId().withMessage('Invalid customer ID'),
  body('customerData.name').if(body('customerId').not().exists()).trim().isLength({ min: 2, max: 100 }).withMessage('Customer name required'),
  body('customerData.phone').if(body('customerId').not().exists()).isMobilePhone().withMessage('Valid phone required'),
  body('customerData.address').if(body('customerId').not().exists()).trim().isLength({ min: 5, max: 200 }).withMessage('Customer address required'),
  body('customerData.vehicleNumber').if(body('customerId').not().exists()).trim().isLength({ min: 1 }).withMessage('Vehicle number required'),
  body('customerData.vehiclePlate').if(body('customerId').not().exists()).trim().isLength({ min: 1 }).withMessage('Vehicle plate required'),
  body('serviceType').isIn(['basic-wash', 'deep-clean', 'waxing', 'interior-clean', 'engine-wash', 'full-service']).withMessage('Invalid service type'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('serviceDate').isISO8601().withMessage('Valid service date required'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes too long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { customerId, customerData, serviceType, price, serviceDate, notes } = req.body;

    // If no customerId provided, create new customer
    if (!customerId && customerData) {
      const existingCustomer = await Customer.findOne({
        $or: [
          { phone: customerData.phone },
          { vehiclePlate: customerData.vehiclePlate }
        ]
      });

      if (existingCustomer) {
        customerId = existingCustomer._id;
      } else {
        const newCustomer = new Customer(customerData);
        await newCustomer.save();
        customerId = newCustomer._id;
      }
    }

    if (!customerId) {
      return res.status(400).json({ message: 'Customer ID or customer data required' });
    }

    const service = new Service({
      customerId,
      serviceType,
      price,
      serviceDate: new Date(serviceDate),
      notes,
      createdBy: req.user._id
    });

    await service.save();
    
    // Populate the response
    await service.populate('customerId');
    await service.populate('createdBy', 'name');

    res.status(201).json(service);
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/services/:id
// @desc    Update service
// @access  Private
router.put('/:id', [
  auth,
  body('serviceType').optional().isIn(['basic-wash', 'deep-clean', 'waxing', 'interior-clean', 'engine-wash', 'full-service']),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('serviceDate').optional().isISO8601().withMessage('Valid service date required'),
  body('status').optional().isIn(['pending', 'in-progress', 'completed', 'cancelled']),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes too long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateData = { ...req.body };
    if (updateData.serviceDate) {
      updateData.serviceDate = new Date(updateData.serviceDate);
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('customerId').populate('createdBy', 'name');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error('Update service error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid service ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/services/:id
// @desc    Delete service
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid service ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
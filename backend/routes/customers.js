const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/customers
// @desc    Get all customers with pagination and search
// @access  Private
router.get('/', [
  auth,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isLength({ max: 100 }).withMessage('Search term too long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    const skip = (page - 1) * limit;

    // Build search query
    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { vehiclePlate: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const [customers, total] = await Promise.all([
      Customer.find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Customer.countDocuments(searchQuery)
    ]);

    res.json({
      customers,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/customers/:id
// @desc    Get customer by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Get customer error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid customer ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/customers
// @desc    Create a new customer
// @access  Private
router.post('/', [
  auth,
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('phone').isMobilePhone().withMessage('Please enter a valid phone number'),
  body('address').trim().isLength({ min: 5, max: 200 }).withMessage('Address must be between 5 and 200 characters'),
  body('vehicleNumber').trim().isLength({ min: 1, max: 20 }).withMessage('Vehicle number is required'),
  body('vehiclePlate').trim().isLength({ min: 1, max: 15 }).withMessage('Vehicle plate is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, address, vehicleNumber, vehiclePlate } = req.body;

    // Check if customer with same phone or vehicle plate exists
    const existingCustomer = await Customer.findOne({
      $or: [{ phone }, { vehiclePlate }]
    });

    if (existingCustomer) {
      return res.status(400).json({ 
        message: 'Customer with this phone number or vehicle plate already exists' 
      });
    }

    const customer = new Customer({
      name,
      phone,
      address,
      vehicleNumber,
      vehiclePlate
    });

    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/customers/:id
// @desc    Update customer
// @access  Private
router.put('/:id', [
  auth,
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('phone').optional().isMobilePhone().withMessage('Please enter a valid phone number'),
  body('address').optional().trim().isLength({ min: 5, max: 200 }).withMessage('Address must be between 5 and 200 characters'),
  body('vehicleNumber').optional().trim().isLength({ min: 1, max: 20 }).withMessage('Vehicle number is required'),
  body('vehiclePlate').optional().trim().isLength({ min: 1, max: 15 }).withMessage('Vehicle plate is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Update customer error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid customer ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/customers/:id
// @desc    Delete customer
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid customer ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
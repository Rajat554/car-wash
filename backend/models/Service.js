const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer ID is required']
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    enum: ['basic-wash', 'deep-clean', 'waxing', 'interior-clean', 'engine-wash', 'full-service']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  serviceDate: {
    type: Date,
    required: [true, 'Service date is required']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
serviceSchema.index({ serviceDate: -1 });
serviceSchema.index({ status: 1 });
serviceSchema.index({ customerId: 1 });

module.exports = mongoose.model('Service', serviceSchema);
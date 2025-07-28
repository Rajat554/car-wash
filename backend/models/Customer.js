const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    maxlength: [200, 'Address cannot be more than 200 characters']
  },
  vehicleNumber: {
    type: String,
    required: [true, 'Vehicle number is required'],
    uppercase: true,
    trim: true
  },
  vehiclePlate: {
    type: String,
    required: [true, 'Vehicle plate is required'],
    uppercase: true,
    trim: true
  }
}, {
  timestamps: true
});

// Create index for faster searches
customerSchema.index({ phone: 1 });
customerSchema.index({ vehiclePlate: 1 });

module.exports = mongoose.model('Customer', customerSchema);
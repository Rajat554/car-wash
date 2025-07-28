# WashWizard Backend API

A complete Node.js/Express.js backend for the Car Wash Management System with MongoDB integration.

## 🚀 Features

- **User Authentication** (Register/Login with JWT)
- **Customer Management** (CRUD operations)
- **Service Management** (Booking, tracking, status updates)
- **Analytics Dashboard** (Revenue, customer stats)
- **Data Validation** (Input sanitization and validation)
- **Error Handling** (Comprehensive error responses)
- **Security** (Password hashing, JWT tokens)

## 📦 Installation

1. **Clone/Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your values:
   ```env
   MONGODB_URI=mongodb://localhost:27017/washwizard
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   JWT_EXPIRES_IN=7d
   PORT=5000
   NODE_ENV=development
   BCRYPT_ROUNDS=12
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env with Atlas connection string
   ```

5. **Run the server**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Customers
- `GET /api/customers` - Get all customers (with pagination/search)
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Services
- `GET /api/services` - Get all services (with filters)
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/monthly` - Monthly analytics
- `GET /api/analytics/service-types` - Service type breakdown

## 🔐 Authentication

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📊 Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['owner', 'employee'],
  createdAt: Date,
  updatedAt: Date
}
```

### Customers Collection
```javascript
{
  name: String,
  phone: String,
  address: String,
  vehicleNumber: String,
  vehiclePlate: String (unique),
  createdAt: Date,
  updatedAt: Date
}
```

### Services Collection
```javascript
{
  customerId: ObjectId (ref: Customer),
  serviceType: Enum ['basic-wash', 'deep-clean', 'waxing', 'interior-clean', 'engine-wash', 'full-service'],
  price: Number,
  serviceDate: Date,
  status: Enum ['pending', 'in-progress', 'completed', 'cancelled'],
  notes: String,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠️ Testing the API

Use tools like Postman, Insomnia, or curl to test endpoints:

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Car Wash Owner",
    "email": "owner@carwash.com",
    "password": "password123",
    "role": "owner"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@carwash.com",
    "password": "password123"
  }'

# Health check
curl http://localhost:5000/api/health
```

## 🔧 Integration with Frontend

Update your frontend API base URL to connect to this backend:

```javascript
// In your frontend .env file
REACT_APP_API_URL=http://localhost:5000/api
```

## 📈 Production Deployment

1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Use secure `JWT_SECRET`
   - Configure production MongoDB URI
   - Set appropriate `CORS_ORIGIN`

2. **Security Considerations**
   - Use HTTPS in production
   - Implement rate limiting
   - Add request logging
   - Configure proper CORS settings
   - Use environment-specific secrets

3. **Hosting Options**
   - Heroku, Railway, DigitalOcean
   - MongoDB Atlas for database
   - PM2 for process management

## 📝 Notes

- Default admin user can be created via `/api/auth/register`
- All passwords are hashed using bcrypt
- JWT tokens expire based on `JWT_EXPIRES_IN` setting
- Soft deletes are not implemented (actual deletion)
- File uploads not included (add multer if needed)

## 🐛 Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **JWT Token Issues**
   - Ensure `JWT_SECRET` is set and consistent
   - Check token expiration
   - Verify Authorization header format

3. **CORS Errors**
   - Update `CORS_ORIGIN` in `.env`
   - Ensure frontend and backend URLs match
# Poult Profit Pulse Backend

This is the backend API for Poult Profit Pulse, a poultry management system.

## Features

- User authentication and authorization
- Pen management
- Feed and medicine record tracking
- Financial and production reporting

## Tech Stack

- NestJS
- MongoDB with Mongoose
- JWT Authentication
- Swagger API Documentation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

## Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies

```bash
npm install
```

4. Create a `.env` file in the root directory with the following variables:

```
# Application
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/poult-profit-pulse

# Authentication
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRATION=1d
```

## Running the Application

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm run build
npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:

```
http://localhost:3000/api
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login with email/username and password
- `GET /auth/profile` - Get current user profile

### Users

- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get a user by ID
- `PATCH /users/:id` - Update a user
- `DELETE /users/:id` - Delete a user (admin only)

### Pens

- `POST /pens` - Create a new pen
- `GET /pens` - Get all pens
- `GET /pens/:id` - Get a pen by ID
- `PATCH /pens/:id` - Update a pen
- `DELETE /pens/:id` - Delete a pen
- `GET /pens/stats` - Get pen statistics

### Records

- `POST /records/feed` - Create a new feed record
- `POST /records/medicine` - Create a new medicine record
- `GET /records` - Get all records
- `GET /records/:id` - Get a record by ID
- `PATCH /records/feed/:id` - Update a feed record
- `PATCH /records/medicine/:id` - Update a medicine record
- `DELETE /records/:id` - Delete a record
- `GET /records/stats` - Get record statistics

### Reports

- `GET /reports/financial` - Get financial report
- `GET /reports/production` - Get production report
- `GET /reports/dashboard` - Get dashboard summary data
- `GET /reports/export` - Export reports data (farmer only)

## License

This project is licensed under the MIT License.
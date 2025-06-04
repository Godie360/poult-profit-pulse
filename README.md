# Poult Profit Pulse

A comprehensive poultry management system for tracking pens, feed, medicine, and generating reports. This application helps poultry farmers efficiently manage their operations, track expenses, monitor production, and make data-driven decisions.

![Poult Profit Pulse Logo](https://placeholder-for-logo.com)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage Guide](#usage-guide)
  - [User Roles](#user-roles)
  - [Authentication](#authentication)
  - [Dashboard](#dashboard)
  - [Pens Management](#pens-management)
  - [Records Management](#records-management)
  - [Reports](#reports)
  - [Team Management](#team-management)
- [API Documentation](#api-documentation)
- [Authentication and Authorization](#authentication-and-authorization)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

Poult Profit Pulse is designed to help poultry farmers manage their operations more efficiently. The system provides tools for tracking pens, monitoring feed and medicine usage, recording daily activities, generating financial and production reports, and managing team members with different access levels.

## Features

- **User Authentication and Authorization**
  - Secure login and registration
  - Role-based access control (Farmer, Worker, Veterinarian)
  - Team member management with access codes

- **Pen Management**
  - Create, update, and delete pens
  - Track pen types (layers, broilers, chicks)
  - Monitor bird count and mortality

- **Feed and Medicine Record Tracking**
  - Record feed purchases and usage
  - Track medicine inventory and treatments
  - Calculate expenses by category

- **Daily Logs**
  - Record daily egg collection
  - Track poultry deaths and sales
  - Monitor daily activities

- **Financial and Production Reporting**
  - Generate financial summaries
  - Track production metrics
  - Export reports to Excel
  - Customizable date ranges

- **Team Collaboration**
  - Farmers can register workers and veterinarians
  - Workers can submit daily logs
  - Veterinarians can record treatments
  - Farmers can view all data from their team

## System Architecture

The application follows a client-server architecture with a clear separation between the frontend and backend:

### Backend (API Server)

- Built with NestJS framework
- RESTful API endpoints
- MongoDB database for data storage
- JWT-based authentication
- Role-based access control
- Swagger API documentation

### Frontend (Web Application)

- React single-page application
- TypeScript for type safety
- Component-based architecture
- State management with React Query
- Form handling with React Hook Form
- Responsive design with Tailwind CSS

### Integration

The frontend communicates with the backend through RESTful API calls. Authentication is handled via JWT tokens that are stored in the browser's local storage and included in the Authorization header of API requests.

## Technologies Used

### Backend

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications
- **MongoDB**: NoSQL database for storing application data
- **Mongoose**: MongoDB object modeling for Node.js
- **Passport.js**: Authentication middleware for Node.js
- **JWT**: JSON Web Tokens for secure authentication
- **bcryptjs**: Library for hashing passwords
- **class-validator**: Validation library
- **ExcelJS**: Library for generating Excel reports
- **Swagger**: API documentation

### Frontend

- **React**: JavaScript library for building user interfaces
- **TypeScript**: Typed superset of JavaScript
- **Vite**: Next-generation frontend tooling
- **React Router**: Routing library for React
- **React Hook Form**: Forms with easy-to-use validation
- **Zod**: TypeScript-first schema validation
- **Axios**: Promise-based HTTP client
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Reusable UI components built with Radix UI
- **Recharts**: Composable charting library
- **React Query**: Data fetching library
- **date-fns**: Date utility library

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or pnpm package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/poult-profit-pulse.git
   cd poult-profit-pulse
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   # or with pnpm
   pnpm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   # or with pnpm
   pnpm install
   ```

### Configuration

#### Backend Configuration

1. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=3002
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/poult-profit-pulse
   JWT_SECRET=your_jwt_secret_key_change_in_production
   JWT_EXPIRATION=1d
   ```

2. Adjust the MongoDB connection string as needed for your environment.

#### Frontend Configuration

1. The frontend is configured to connect to the backend at `http://localhost:3002` by default. If you need to change this, update the `baseURL` in `frontend/src/api/apiClient.ts`.

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run start:dev
   # or with pnpm
   pnpm run start:dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   # or with pnpm
   pnpm run dev
   ```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3002
   - Swagger API documentation: http://localhost:3002/api

## Usage Guide

### User Roles

The system supports three user roles:

1. **Farmer (Owner)**: Has full access to all features, can manage pens, records, and team members.
2. **Worker**: Can submit daily logs and view assigned pens.
3. **Veterinarian**: Can record treatments and view health-related information.

### Authentication

1. **Registration**:
   - Farm owners can register directly
   - Workers and veterinarians need an access code from a farmer

2. **Login**:
   - Users can log in with their username/email and password
   - The system redirects to the appropriate dashboard based on the user's role

3. **Access Codes**:
   - Farmers can generate access codes for workers and veterinarians
   - These codes are used during registration to assign the appropriate role

### Dashboard

The dashboard provides an overview of the farm's operations:

- Financial summary (expenses, income, profit)
- Production metrics (egg collection, mortality rates)
- Recent activities from team members
- Quick access to common tasks

### Pens Management

Farmers can manage their poultry pens:

- Create new pens with details like name, type, and bird count
- Update pen information as needed
- Track mortality and production by pen
- Assign pens to specific workers

### Records Management

The system allows tracking of various records:

- **Feed Records**: Track feed purchases, including type, quantity, price, and supplier
- **Medicine Records**: Record medicine purchases and treatments
- **Daily Logs**: Record daily activities like egg collection and sales

### Reports

Generate comprehensive reports for better decision-making:

- **Financial Reports**: Track expenses, income, and profit
- **Production Reports**: Monitor egg production and bird health
- **Export to Excel**: Download reports for offline analysis
- **Custom Date Ranges**: Filter reports by daily, weekly, monthly, or custom periods

### Team Management

Farmers can manage their team members:

- Generate access codes for workers and veterinarians
- View team member activities
- Manage access permissions

## API Documentation

The backend API is documented using Swagger. Once the backend is running, you can access the documentation at:

```
http://localhost:3002/api
```

The API is organized into the following main sections:

- **Auth**: Authentication endpoints (login, register)
- **Users**: User management endpoints
- **Pens**: Pen management endpoints
- **Records**: Feed and medicine record endpoints
- **Dashboard**: Daily log and dashboard data endpoints
- **Reports**: Reporting endpoints

## Authentication and Authorization

### Authentication Flow

1. User registers or logs in
2. Server validates credentials and returns a JWT token
3. Frontend stores the token in local storage
4. Token is included in the Authorization header for subsequent API requests
5. Server validates the token for each protected endpoint

### Role-Based Access Control

The system implements role-based access control through:

1. **JWT Payload**: Contains user role and permissions
2. **Guards**: NestJS guards that check user roles for protected endpoints
3. **Frontend Routing**: Restricts access to certain pages based on user role

### Team Member Registration

1. Farmer generates an access code for a worker or veterinarian
2. Worker/veterinarian registers using the code
3. System assigns the appropriate role and links the user to the farmer
4. Farmer can see data submitted by their team members

## Deployment

### Backend Deployment

1. Build the production version:
   ```bash
   cd backend
   npm run build
   ```

2. Set up environment variables for production:
   ```
   PORT=3002
   NODE_ENV=production
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_secure_jwt_secret
   JWT_EXPIRATION=1d
   ```

3. Start the production server:
   ```bash
   npm run start:prod
   ```

### Frontend Deployment

1. Build the production version:
   ```bash
   cd frontend
   npm run build
   ```

2. The build output will be in the `dist` directory, which can be served by any static file server.

3. Make sure to update the API base URL in `apiClient.ts` to point to your production backend.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

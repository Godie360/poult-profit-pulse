# Poult Profit Pulse

A comprehensive poultry management system for tracking pens, feed, medicine, and generating reports.

## Project Structure

This project consists of two main parts:

- **Frontend**: A React application built with Vite, TypeScript, and Tailwind CSS
- **Backend**: A NestJS API with MongoDB database

## Features

- User authentication and authorization
- Pen management
- Feed and medicine record tracking
- Financial and production reporting
- Role-based access control (Farmer, Worker, Veterinarian)

## Integration Status

The backend API is fully implemented and ready to be used by the frontend. The frontend currently uses mock data, but API services have been created to connect to the backend.

### Completed Integration Work

- Backend API with all necessary endpoints
- CORS configuration to allow frontend requests
- API client and services in the frontend
- Data models that match between frontend and backend
- Authentication flow implementation

### Next Steps for Complete Integration

1. Replace the mock data and simulated API calls in the frontend components with calls to the API services
2. Update the components to handle loading states, errors, and success responses from the API
3. Test the integration to ensure data is properly fetched from and sent to the backend

## Running the Project

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/poult-profit-pulse
   JWT_SECRET=your_jwt_secret_key_change_in_production
   JWT_EXPIRATION=1d
   ```

4. Start the backend server:
   ```
   npm run start:dev
   ```

5. The API will be available at http://localhost:3000
   - Swagger documentation: http://localhost:3000/api

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

4. The frontend will be available at http://localhost:5173

## API Documentation

Once the backend is running, you can access the Swagger API documentation at:

```
http://localhost:3000/api
```

## License

This project is licensed under the MIT License.
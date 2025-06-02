# Frontend-Backend Integration

This directory contains the API services that connect the frontend to the backend. These services handle all communication with the backend API, including authentication, data fetching, and data manipulation.

## API Client

The `apiClient.ts` file sets up an Axios instance with the base URL pointing to the backend API. It also includes an interceptor that automatically adds the authentication token to all requests.

## Services

### Authentication Service

The `authService.ts` file provides functions for authentication-related operations:

- `login`: Authenticates a user with email/username and password
- `register`: Registers a new user
- `logout`: Logs out the current user
- `getCurrentUser`: Gets the current user from localStorage
- `isAuthenticated`: Checks if a user is authenticated

### Pens Service

The `pensService.ts` file provides functions for pen-related operations:

- `getAllPens`: Gets all pens
- `getPenById`: Gets a pen by ID
- `createPen`: Creates a new pen
- `updatePen`: Updates an existing pen
- `deletePen`: Deletes a pen
- `getPenStats`: Gets pen statistics

### Records Service

The `recordsService.ts` file provides functions for record-related operations:

- `getAllRecords`: Gets all records, optionally filtered by type
- `getRecordById`: Gets a record by ID
- `createFeedRecord`: Creates a new feed record
- `createMedicineRecord`: Creates a new medicine record
- `updateFeedRecord`: Updates an existing feed record
- `updateMedicineRecord`: Updates an existing medicine record
- `deleteRecord`: Deletes a record
- `getRecordStats`: Gets record statistics

### Reports Service

The `reportsService.ts` file provides functions for report-related operations:

- `getFinancialReport`: Gets financial report data
- `getProductionReport`: Gets production report data
- `getDashboardSummary`: Gets dashboard summary data
- `exportReports`: Exports report data

## Usage

To use these services in your components, import them from the `api` directory:

```typescript
import { authService, pensService, recordsService, reportsService } from '@/api';

// Example: Login
const handleLogin = async (data) => {
  try {
    const response = await authService.login(data);
    // Handle successful login
  } catch (error) {
    // Handle error
  }
};

// Example: Get all pens
const fetchPens = async () => {
  try {
    const pens = await pensService.getAllPens();
    // Update state with pens
  } catch (error) {
    // Handle error
  }
};
```

## Integration Status

The backend API is fully implemented and ready to be used by the frontend. The frontend currently uses mock data, but the API services in this directory provide all the necessary functions to connect to the backend.

To complete the integration:

1. Replace the mock data and simulated API calls in the frontend components with calls to these API services.
2. Update the components to handle loading states, errors, and success responses from the API.
3. Ensure the authentication flow works correctly by using the authService for login, registration, and logout.
4. Test the integration to make sure data is being properly fetched from and sent to the backend.
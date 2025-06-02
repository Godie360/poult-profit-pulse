import apiClient from './apiClient';
import authService from './authService';
import pensService from './pensService';
import recordsService from './recordsService';
import reportsService from './reportsService';
import dashboardService from './dashboardService';

export {
  apiClient,
  authService,
  pensService,
  recordsService,
  reportsService,
  dashboardService
};

// Re-export types
export * from './authService';
export * from './pensService';
export * from './recordsService';
export * from './reportsService';
export * from './dashboardService';

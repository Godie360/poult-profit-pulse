import apiClient from './apiClient';
import { MedicineRecord } from './recordsService';

export interface DailyLog {
  _id?: string;
  date: string;
  penId: string;
  penName?: string;
  eggsCollected: number;
  poultryDeaths: number;
  poultrySold?: number;
  salesAmount?: number;
}

export interface VetWorkerData {
  treatments: MedicineRecord[];
  dailyLogs: DailyLog[];
}

const dashboardService = {
  /**
   * Create a new daily log entry
   * @param data The daily log data
   * @returns The created daily log
   */
  createDailyLog: async (data: {
    date: Date;
    penId: string;
    eggsCollected: number;
    poultryDeaths: number;
    poultrySold?: number;
    salesAmount?: number;
  }): Promise<DailyLog> => {
    const response = await apiClient.post<DailyLog>('/dashboard/daily-log', data);
    return response.data;
  },

  /**
   * Get daily logs for the current user
   * @returns Array of daily logs
   */
  getUserDailyLogs: async (): Promise<DailyLog[]> => {
    const response = await apiClient.get<DailyLog[]>('/dashboard/daily-logs');
    return response.data;
  },
  /**
   * Get combined vet and worker data for the farmer dashboard
   * This includes recent treatments from vets and daily logs from workers
   */
  getVetWorkerData: async (): Promise<VetWorkerData> => {
    try {
      // Make API call to get combined vet and worker data
      const response = await apiClient.get<VetWorkerData>('/dashboard/vet-worker-data');
      return response.data;
    } catch (error) {
      console.error('Error fetching vet and worker data:', error);

      // If API call fails, return empty data
      return {
        treatments: [],
        dailyLogs: []
      };
    }
  }
};

export default dashboardService;

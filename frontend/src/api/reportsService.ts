import apiClient from './apiClient';

export enum ReportPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom',
}

export interface ReportFilter {
  period?: ReportPeriod;
  startDate?: string;
  endDate?: string;
}

export interface FinancialReport {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  financialSummary: {
    totalExpense: number;
    totalIncome: number;
    profit: number;
    expenseBreakdown: {
      feed: number;
      medicine: number;
    };
  };
  recordCounts: {
    total: number;
    feed: number;
    medicine: number;
  };
}

export interface ProductionReport {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  productionSummary: {
    totalBirds: number;
    eggsProduced: number;
    eggsSold: number;
    mortality: number;
  };
  penSummary: {
    totalPens: number;
    pensByType: {
      layers: number;
      broilers: number;
      chicks: number;
    };
  };
}

export interface DashboardSummary {
  financialSummary: {
    totalExpense: number;
    totalIncome: number;
    profit: number;
    expenseBreakdown: {
      feed: number;
      medicine: number;
    };
  };
  productionSummary: {
    totalBirds: number;
    eggsProduced: number;
    eggsSold: number;
    mortality: number;
  };
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface ExportData {
  financialReport: FinancialReport;
  productionReport: ProductionReport;
  exportedAt: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

const reportsService = {
  getFinancialReport: async (filter: ReportFilter = {}): Promise<FinancialReport> => {
    const params = new URLSearchParams();
    if (filter.period) params.append('period', filter.period);
    if (filter.startDate) params.append('startDate', filter.startDate);
    if (filter.endDate) params.append('endDate', filter.endDate);

    const url = `/reports/financial?${params.toString()}`;
    const response = await apiClient.get<FinancialReport>(url);
    return response.data;
  },

  getProductionReport: async (filter: ReportFilter = {}): Promise<ProductionReport> => {
    const params = new URLSearchParams();
    if (filter.period) params.append('period', filter.period);
    if (filter.startDate) params.append('startDate', filter.startDate);
    if (filter.endDate) params.append('endDate', filter.endDate);

    const url = `/reports/production?${params.toString()}`;
    const response = await apiClient.get<ProductionReport>(url);
    return response.data;
  },

  getDashboardSummary: async (): Promise<DashboardSummary> => {
    const response = await apiClient.get<DashboardSummary>('/reports/dashboard');
    return response.data;
  },

  exportReports: async (filter: ReportFilter = {}): Promise<ExportData> => {
    const params = new URLSearchParams();
    if (filter.period) params.append('period', filter.period);
    if (filter.startDate) params.append('startDate', filter.startDate);
    if (filter.endDate) params.append('endDate', filter.endDate);

    const url = `/reports/export?${params.toString()}`;
    const response = await apiClient.get<ExportData>(url);
    return response.data;
  },

  /**
   * Download reports as Excel file
   * @param filter Optional filter parameters
   */
  downloadReports: async (filter: ReportFilter = {}): Promise<void> => {
    const params = new URLSearchParams();
    if (filter.period) params.append('period', filter.period);
    if (filter.startDate) params.append('startDate', filter.startDate);
    if (filter.endDate) params.append('endDate', filter.endDate);

    const url = `/reports/download?${params.toString()}`;

    try {
      // Use axios directly to get the response as a blob
      const response = await apiClient.get(url, {
        responseType: 'blob',
      });

      // Create a URL for the blob
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const downloadUrl = window.URL.createObjectURL(blob);

      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'poultry-report.xlsx';

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      // Clean up
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading report:', error);
      throw error;
    }
  }
};

export default reportsService;

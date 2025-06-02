import apiClient from './apiClient';

export enum RecordType {
  FEED = 'feed',
  MEDICINE = 'medicine',
}

export interface Record {
  _id: string;
  date: string;
  price: number;
  supplier: string;
  recordType: RecordType;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedRecord extends Record {
  feedType: string;
  quantity: number;
}

export interface MedicineRecord extends Record {
  medicine: string;
  quantity: string;
}

export interface CreateFeedRecordRequest {
  date: Date;
  feedType: string;
  quantity: number;
  price: number;
  supplier: string;
}

export interface CreateMedicineRecordRequest {
  date: Date;
  medicine: string;
  quantity: string;
  price: number;
  supplier: string;
}

export interface UpdateFeedRecordRequest {
  date?: Date;
  feedType?: string;
  quantity?: number;
  price?: number;
  supplier?: string;
}

export interface UpdateMedicineRecordRequest {
  date?: Date;
  medicine?: string;
  quantity?: string;
  price?: number;
  supplier?: string;
}

export interface RecordStats {
  totalRecords: number;
  totalExpense: number;
  feedExpense: number;
  medicineExpense: number;
  recordsByType: {
    feed: number;
    medicine: number;
  };
  recentRecords: Record[];
}

const recordsService = {
  getAllRecords: async (type?: RecordType): Promise<Record[]> => {
    const url = type ? `/records?type=${type}` : '/records';
    const response = await apiClient.get<Record[]>(url);
    return response.data;
  },
  
  getRecordById: async (id: string): Promise<Record> => {
    const response = await apiClient.get<Record>(`/records/${id}`);
    return response.data;
  },
  
  createFeedRecord: async (data: CreateFeedRecordRequest): Promise<FeedRecord> => {
    const response = await apiClient.post<FeedRecord>('/records/feed', data);
    return response.data;
  },
  
  createMedicineRecord: async (data: CreateMedicineRecordRequest): Promise<MedicineRecord> => {
    const response = await apiClient.post<MedicineRecord>('/records/medicine', data);
    return response.data;
  },
  
  updateFeedRecord: async (id: string, data: UpdateFeedRecordRequest): Promise<FeedRecord> => {
    const response = await apiClient.patch<FeedRecord>(`/records/feed/${id}`, data);
    return response.data;
  },
  
  updateMedicineRecord: async (id: string, data: UpdateMedicineRecordRequest): Promise<MedicineRecord> => {
    const response = await apiClient.patch<MedicineRecord>(`/records/medicine/${id}`, data);
    return response.data;
  },
  
  deleteRecord: async (id: string): Promise<void> => {
    await apiClient.delete(`/records/${id}`);
  },
  
  getRecordStats: async (): Promise<RecordStats> => {
    const response = await apiClient.get<RecordStats>('/records/stats');
    return response.data;
  }
};

export default recordsService;
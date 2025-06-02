import apiClient from './apiClient';

export interface Pen {
  _id: string;
  name: string;
  birdCount: number;
  type: string;
  age: number;
  dailyEggAvg: number;
  mortality: number;
  status: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePenRequest {
  name: string;
  birdCount: number;
  type: string;
  age: number;
  dailyEggAvg?: number;
  mortality?: number;
  status?: string;
}

export interface UpdatePenRequest {
  name?: string;
  birdCount?: number;
  type?: string;
  age?: number;
  dailyEggAvg?: number;
  mortality?: number;
  status?: string;
}

export interface PenStats {
  totalPens: number;
  totalBirds: number;
  totalEggs: number;
  avgMortality: number;
  pensByType: {
    layers: number;
    broilers: number;
    chicks: number;
  };
}

const pensService = {
  getAllPens: async (): Promise<Pen[]> => {
    const response = await apiClient.get<Pen[]>('/pens');
    return response.data;
  },
  
  getPenById: async (id: string): Promise<Pen> => {
    const response = await apiClient.get<Pen>(`/pens/${id}`);
    return response.data;
  },
  
  createPen: async (data: CreatePenRequest): Promise<Pen> => {
    const response = await apiClient.post<Pen>('/pens', data);
    return response.data;
  },
  
  updatePen: async (id: string, data: UpdatePenRequest): Promise<Pen> => {
    const response = await apiClient.patch<Pen>(`/pens/${id}`, data);
    return response.data;
  },
  
  deletePen: async (id: string): Promise<void> => {
    await apiClient.delete(`/pens/${id}`);
  },
  
  getPenStats: async (): Promise<PenStats> => {
    const response = await apiClient.get<PenStats>('/pens/stats');
    return response.data;
  }
};

export default pensService;
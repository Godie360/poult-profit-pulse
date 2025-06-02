import apiClient from './apiClient';

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  username: string;
  role: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    username: string;
    role: string;
    lastLogin: string;
    createdAt: string;
    updatedAt: string;
  };
}

const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    
    // Store token and user info in localStorage
    localStorage.setItem('dgpoultry_user', JSON.stringify({
      ...response.data.user,
      token: response.data.accessToken
    }));
    
    return response.data;
  },
  
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    
    // Store token and user info in localStorage
    localStorage.setItem('dgpoultry_user', JSON.stringify({
      ...response.data.user,
      token: response.data.accessToken
    }));
    
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('dgpoultry_user');
  },
  
  getCurrentUser: () => {
    const userInfo = localStorage.getItem('dgpoultry_user');
    if (userInfo) {
      try {
        return JSON.parse(userInfo);
      } catch (error) {
        console.error('Error parsing user info:', error);
        return null;
      }
    }
    return null;
  },
  
  isAuthenticated: () => {
    return localStorage.getItem('dgpoultry_user') !== null;
  }
};

export default authService;
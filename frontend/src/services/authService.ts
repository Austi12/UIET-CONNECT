import apiClient from './api';

export interface SignupData {
  email: string;
  password: string;
  name: string;
  department?: string;
  year?: number;
  rollNumber?: string;
  phoneNumber?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  signup: async (data: SignupData) => {
    const response = await apiClient.post('/auth/signup', data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<SignupData>) => {
    const response = await apiClient.put('/auth/profile', data);
    return response.data;
  },
};

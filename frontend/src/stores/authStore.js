import { create } from 'zustand';
import api from '../api/axios';
import toast from 'react-hot-toast';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', { username, email, password });
      set({ isLoading: false });
      toast.success('Account created successfully!');
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      set({ isLoading: false, error: msg });
      toast.error(msg);
      throw error;
    }
  },

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { username, password });
      const { accessToken, user } = response.data;
      
      localStorage.setItem('token', accessToken);
      set({ user, token: accessToken, isAuthenticated: true, isLoading: false });
      toast.success('Logged in successfully!');
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      set({ isLoading: false, error: msg });
      toast.error(msg);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
    toast.success('Signed out');
  },

  getMe: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/auth/me');
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error("Session expired or invalid token:", error);
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
  
  clearError: () => set({ error: null })
}));

export default useAuthStore;

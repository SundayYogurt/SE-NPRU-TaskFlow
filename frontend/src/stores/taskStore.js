import { create } from 'zustand';
import api from '../api/axios';
import toast from 'react-hot-toast';

const useTaskStore = create((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/tasks');
      set({ tasks: response.data.tasks || [], isLoading: false });
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to fetch tasks';
      set({ isLoading: false, error: msg });
      toast.error(msg);
    }
  },

  addTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/tasks', taskData);
      set((state) => ({ tasks: [response.data.task, ...state.tasks], isLoading: false }));
      toast.success('Task created successfully');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to add task';
      set({ isLoading: false, error: msg });
      toast.error(msg);
      throw error;
    }
  },

  updateTask: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/tasks/${id}`, updates);
      set((state) => ({ tasks: state.tasks.map((t) => (t._id === id ? response.data.task : t)), isLoading: false }));
      toast.success('Task updated successfully');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update task';
      set({ isLoading: false, error: msg });
      toast.error(msg);
      throw error;
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/tasks/${id}`);
      set((state) => ({ tasks: state.tasks.filter((t) => t._id !== id), isLoading: false }));
      toast.success('Task deleted');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete task';
      set({ isLoading: false, error: msg });
      toast.error(msg);
      throw error;
    }
  },
  
  clearError: () => set({ error: null })
}));

export default useTaskStore;

import { create } from 'zustand';
import { type Job } from '../lib/database';

interface JobsState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  currentJob: Job | null;
  filters: {
    search: string;
    status: string;
    page: number;
    pageSize: number;
  };
  pagination: {
    total: number;
    totalPages: number;
  };
  
  // Actions
  setJobs: (jobs: Job[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentJob: (job: Job | null) => void;
  updateFilters: (filters: Partial<JobsState['filters']>) => void;
  setPagination: (pagination: Partial<JobsState['pagination']>) => void;
  addJob: (job: Job) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  removeJob: (id: string) => void;
  reorderJob: (id: string, newOrder: number) => void;
}

export const useJobsStore = create<JobsState>((set) => ({
  jobs: [],
  loading: false,
  error: null,
  currentJob: null,
  filters: {
    search: '',
    status: '',
    page: 1,
    pageSize: 10,
  },
  pagination: {
    total: 0,
    totalPages: 0,
  },

  setJobs: (jobs) => set({ jobs }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCurrentJob: (currentJob) => set({ currentJob }),
  
  updateFilters: (newFilters) => 
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    })),

  setPagination: (newPagination) =>
    set((state) => ({
      pagination: { ...state.pagination, ...newPagination }
    })),

  addJob: (job) =>
    set((state) => ({
      jobs: [...state.jobs, job],
      pagination: { ...state.pagination, total: state.pagination.total + 1 }
    })),

  updateJob: (id, updates) =>
    set((state) => ({
      jobs: state.jobs.map(job => 
        job.id === id ? { ...job, ...updates } : job
      ),
      currentJob: state.currentJob?.id === id 
        ? { ...state.currentJob, ...updates } 
        : state.currentJob
    })),

  removeJob: (id) =>
    set((state) => ({
      jobs: state.jobs.filter(job => job.id !== id),
      currentJob: state.currentJob?.id === id ? null : state.currentJob,
      pagination: { ...state.pagination, total: state.pagination.total - 1 }
    })),

  reorderJob: (id, newOrder) =>
    set((state) => ({
      jobs: state.jobs.map(job =>
        job.id === id ? { ...job, order: newOrder } : job
      )
    })),
}));
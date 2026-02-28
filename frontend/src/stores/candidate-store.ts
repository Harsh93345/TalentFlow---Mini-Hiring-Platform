import { create } from 'zustand';
import { type Candidate, type CandidateTimeline } from '../lib/database';

interface CandidatesState {
  candidates: Candidate[];
  loading: boolean;
  error: string | null;
  currentCandidate: Candidate | null;
  timeline: CandidateTimeline[];
  filters: {
    search: string;
    stage: string;
    jobId: string;
    page: number;
    pageSize: number;
  };
  pagination: {
    total: number;
    totalPages: number;
  };
  
  // Actions
  setCandidates: (candidates: Candidate[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentCandidate: (candidate: Candidate | null) => void;
  setTimeline: (timeline: CandidateTimeline[]) => void;
  updateFilters: (filters: Partial<CandidatesState['filters']>) => void;
  setPagination: (pagination: Partial<CandidatesState['pagination']>) => void;
  addCandidate: (candidate: Candidate) => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  removeCandidate: (id: string) => void;
  moveCandidateStage: (id: string, newStage: Candidate['stage']) => void;
}

export const useCandidatesStore = create<CandidatesState>((set) => ({
  candidates: [],
  loading: false,
  error: null,
  currentCandidate: null,
  timeline: [],
  filters: {
    search: '',
    stage: '',
    jobId: '',
    page: 1,
    pageSize: 50,
  },
  pagination: {
    total: 0,
    totalPages: 0,
  },

  setCandidates: (candidates) => set({ candidates }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCurrentCandidate: (currentCandidate) => set({ currentCandidate }),
  setTimeline: (timeline) => set({ timeline }),
  
  updateFilters: (newFilters) => 
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    })),

  setPagination: (newPagination) =>
    set((state) => ({
      pagination: { ...state.pagination, ...newPagination }
    })),

  addCandidate: (candidate) =>
    set((state) => ({
      candidates: [...state.candidates, candidate],
      pagination: { ...state.pagination, total: state.pagination.total + 1 }
    })),

  updateCandidate: (id, updates) =>
    set((state) => ({
      candidates: state.candidates.map(candidate => 
        candidate.id === id ? { ...candidate, ...updates } : candidate
      ),
      currentCandidate: state.currentCandidate?.id === id 
        ? { ...state.currentCandidate, ...updates } 
        : state.currentCandidate
    })),

  removeCandidate: (id) =>
    set((state) => ({
      candidates: state.candidates.filter(candidate => candidate.id !== id),
      currentCandidate: state.currentCandidate?.id === id ? null : state.currentCandidate,
      pagination: { ...state.pagination, total: state.pagination.total - 1 }
    })),

  moveCandidateStage: (id, newStage) =>
    set((state) => ({
      candidates: state.candidates.map(candidate =>
        candidate.id === id ? { ...candidate, stage: newStage } : candidate
      ),
      currentCandidate: state.currentCandidate?.id === id
        ? { ...state.currentCandidate, stage: newStage }
        : state.currentCandidate
    })),
}));
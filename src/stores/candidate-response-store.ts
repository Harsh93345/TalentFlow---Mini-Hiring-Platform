import { create } from 'zustand';

interface CandidateResponses {
  [questionId: string]: any;
}

interface UseCandidateStore {
  responses: CandidateResponses;
  setResponse: (questionId: string, value: any) => void;
  resetResponses: () => void;
}

export const useCandidateStore = create<UseCandidateStore>((set) => ({
  responses: {},
  setResponse: (questionId, value) =>
    set((state) => ({ responses: { ...state.responses, [questionId]: value } })),
  resetResponses: () => set({ responses: {} }),
}));
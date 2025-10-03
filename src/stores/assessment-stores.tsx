import { create } from 'zustand';
import { type Assessment, type AssessmentResponse } from '../lib/database';

interface AssessmentsState {
  assessments: Record<string, Assessment>;
  responses: Record<string, AssessmentResponse>;
  loading: boolean;
  error: string | null;
  currentAssessment: Assessment | null;
  builderState: Assessment | null;
  previewMode: boolean;
  
  // Actions
  setAssessment: (jobId: string, assessment: Assessment) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentAssessment: (assessment: Assessment | null) => void;
  setBuilderState: (assessment: Assessment | null) => void;
  setPreviewMode: (previewMode: boolean) => void;
  updateBuilderState: (updates: Partial<Assessment>) => void;
  addSection: (section: any) => void;
  updateSection: (sectionId: string, updates: any) => void;
  removeSection: (sectionId: string) => void;
  addQuestion: (sectionId: string, question: any) => void;
  updateQuestion: (sectionId: string, questionId: string, updates: any) => void;
  removeQuestion: (sectionId: string, questionId: string) => void;
  saveResponse: (assessmentId: string, response: AssessmentResponse) => void;
}

export const useAssessmentsStore = create<AssessmentsState>((set) => ({
  assessments: {},
  responses: {},
  loading: false,
  error: null,
  currentAssessment: null,
  builderState: null,
  previewMode: false,

  setAssessment: (jobId, assessment) =>
    set((state) => ({
      assessments: { ...state.assessments, [jobId]: assessment }
    })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCurrentAssessment: (currentAssessment) => set({ currentAssessment }),
  setBuilderState: (builderState) => set({ builderState }),
  setPreviewMode: (previewMode) => set({ previewMode }),

  updateBuilderState: (updates) =>
    set((state) => ({
      builderState: state.builderState ? { ...state.builderState, ...updates } : null
    })),

  addSection: (section) =>
    set((state) => {
      if (!state.builderState) return state;
      return {
        builderState: {
          ...state.builderState,
          sections: [...state.builderState.sections, section]
        }
      };
    }),

  updateSection: (sectionId, updates) =>
    set((state) => {
      if (!state.builderState) return state;
      return {
        builderState: {
          ...state.builderState,
          sections: state.builderState.sections.map(section =>
            section.id === sectionId ? { ...section, ...updates } : section
          )
        }
      };
    }),

  removeSection: (sectionId) =>
    set((state) => {
      if (!state.builderState) return state;
      return {
        builderState: {
          ...state.builderState,
          sections: state.builderState.sections.filter(section => section.id !== sectionId)
        }
      };
    }),

  addQuestion: (sectionId, question) =>
    set((state) => {
      if (!state.builderState) return state;
      return {
        builderState: {
          ...state.builderState,
          sections: state.builderState.sections.map(section =>
            section.id === sectionId
              ? { ...section, questions: [...section.questions, question] }
              : section
          )
        }
      };
    }),

  updateQuestion: (sectionId, questionId, updates) =>
    set((state) => {
      if (!state.builderState) return state;
      return {
        builderState: {
          ...state.builderState,
          sections: state.builderState.sections.map(section =>
            section.id === sectionId
              ? {
                  ...section,
                  questions: section.questions.map(question =>
                    question.id === questionId ? { ...question, ...updates } : question
                  )
                }
              : section
          )
        }
      };
    }),

  removeQuestion: (sectionId, questionId) =>
    set((state) => {
      if (!state.builderState) return state;
      return {
        builderState: {
          ...state.builderState,
          sections: state.builderState.sections.map(section =>
            section.id === sectionId
              ? {
                  ...section,
                  questions: section.questions.filter(question => question.id !== questionId)
                }
              : section
          )
        }
      };
    }),

  saveResponse: (assessmentId, response) =>
    set((state) => ({
      responses: { ...state.responses, [assessmentId]: response }
    })),
}));
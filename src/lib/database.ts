import Dexie, { type Table } from 'dexie';

export interface Job {
  id: string;
  title: string;
  slug: string;
  status: 'active' | 'archived';
  tags: string[];
  order: number;
  description?: string;
  location?: string;
  department?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  stage: 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected';
  jobId: string;
  resume?: string;
  notes?: CandidateNote[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CandidateNote {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  mentions: string[];
  createdAt: Date;
}

export interface CandidateTimeline {
  id: string;
  candidateId: string;
  type: 'stage_change' | 'note_added' | 'assessment_completed' | 'interview_scheduled';
  fromStage?: string;
  toStage?: string;
  description: string;
  createdAt: Date;
}

export interface Assessment {
  id: string;
  jobId: string;
  title: string;
  description?: string;
  sections: AssessmentSection[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentSection {
  id: string;
  title: string;
  description?: string;
  questions: AssessmentQuestion[];
  order: number;
}

export interface AssessmentQuestion {
  id: string;
  type: 'single-choice' | 'multi-choice' | 'short-text' | 'long-text' | 'numeric' | 'file-upload';
  question: string;
  description?: string;
  required: boolean;
  order: number;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    maxLength?: number;
  };
  conditionalLogic?: {
    dependsOnQuestionId: string;
    showWhen: string | string[];
  };
}

export interface AssessmentResponse {
  id: string;
  assessmentId: string;
  candidateId: string;
  responses: Record<string, any>;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class TalentFlowDB extends Dexie {
  jobs!: Table<Job>;
  candidates!: Table<Candidate>;
  candidateTimeline!: Table<CandidateTimeline>;
  assessments!: Table<Assessment>;
  assessmentResponses!: Table<AssessmentResponse>;

  constructor() {
    super('TalentFlowDB');
    this.version(1).stores({
      jobs: 'id, title, status, *tags, order, createdAt',
      candidates: 'id, name, email, stage, jobId, createdAt',
      candidateTimeline: 'id, candidateId, type, createdAt',
      assessments: 'id, jobId, title, isActive, createdAt',
      assessmentResponses: 'id, assessmentId, candidateId, completedAt, createdAt'
    });
  }
}

export const db = new TalentFlowDB();
import { http, HttpResponse, delay } from 'msw';
import { db } from './database.ts';
import { faker } from '@faker-js/faker';

// Simulate network latency and occasional failures
const simulateNetwork = async () => {
  await delay(faker.number.int({ min: 200, max: 1200 }));
  
  // 5-10% error rate on write operations
  const shouldError = faker.number.float() < 0.075;
  if (shouldError) {
    throw new HttpResponse(null, { 
      status: 500, 
      statusText: 'Internal Server Error' 
    });
  }
};

export const handlers = [
  // Jobs endpoints
  http.get('/api/jobs', async ({ request }) => {
    // await simulateNetwork();
    
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const sort = url.searchParams.get('sort') || 'order';

    let jobs = await db.jobs.orderBy(sort).toArray();

    // Apply filters
    if (search) {
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }
    if (status) {
      jobs = jobs.filter(job => job.status === status);
    }

    const total = jobs.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedJobs = jobs.slice(startIndex, startIndex + pageSize);

    return HttpResponse.json({
      data: paginatedJobs,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    });
  }),

  http.get('/api/jobs/:id', async ({ params }) => {
    // await simulateNetwork();
    
    const job = await db.jobs.get(params.id as string);
    if (!job) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(job);
  }),

  http.post('/api/jobs', async ({ request }) => {
    await simulateNetwork();
    
    const jobData = await request.json() as any;
    const newJob = {
      id: faker.string.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...jobData
    };
    
    await db.jobs.add(newJob);
    return HttpResponse.json(newJob, { status: 201 });
  }),

  http.patch('/api/jobs/:id', async ({ params, request }) => {
    await simulateNetwork();
    
    const updates = await request.json() as any;
    const id = params.id as string;
    
    await db.jobs.update(id, {
      ...updates,
      updatedAt: new Date()
    });
    
    const updatedJob = await db.jobs.get(id);
    return HttpResponse.json(updatedJob);
  }),

  http.patch('/api/jobs/:id/reorder', async ({ params, request }) => {
    await simulateNetwork();
    
    const { fromOrder, toOrder } = await request.json() as any;
    const id = params.id as string;
    
    // Update job order
    await db.jobs.update(id, { order: toOrder, updatedAt: new Date() });
    
    // Adjust other jobs' order
    if (fromOrder < toOrder) {
      await db.jobs.where('order').between(fromOrder + 1, toOrder).modify(job => {
        job.order -= 1;
        job.updatedAt = new Date();
      });
    } else {
      await db.jobs.where('order').between(toOrder, fromOrder - 1).modify(job => {
        job.order += 1;
        job.updatedAt = new Date();
      });
    }
    
    const updatedJob = await db.jobs.get(id);
    return HttpResponse.json(updatedJob);
  }),

  // Candidates endpoints
  http.get('/api/candidates', async ({ request }) => {
    // await simulateNetwork();
    
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const stage = url.searchParams.get('stage') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '50');

    let candidates = await db.candidates.orderBy('createdAt').reverse().toArray();

    // Apply filters
    if (search) {
      candidates = candidates.filter(candidate =>
        candidate.name.toLowerCase().includes(search.toLowerCase()) ||
        candidate.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (stage) {
      candidates = candidates.filter(candidate => candidate.stage === stage);
    }

    const total = candidates.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedCandidates = candidates.slice(startIndex, startIndex + pageSize);

    return HttpResponse.json({
      data: paginatedCandidates,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    });
  }),

  http.get('/api/candidates/:id', async ({ params }) => {
    // await simulateNetwork();
    
    const candidate = await db.candidates.get(params.id as string);
    if (!candidate) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(candidate);
  }),

  http.get('/api/candidates/:id/timeline', async ({ params }) => {
    await simulateNetwork();
    
    const timeline = await db.candidateTimeline
      .where('candidateId')
      .equals(params.id as string)
      .reverse()
      .sortBy('createdAt');
    
    return HttpResponse.json(timeline);
  }),

  http.patch('/api/candidates/:id', async ({ params, request }) => {
    await simulateNetwork();
    
    const updates = await request.json() as any;
    const id = params.id as string;
    
    const candidate = await db.candidates.get(id);
    if (!candidate) {
      return new HttpResponse(null, { status: 404 });
    }

    // Add timeline entry for stage changes
    if (updates.stage && updates.stage !== candidate.stage) {
      await db.candidateTimeline.add({
        id: faker.string.uuid(),
        candidateId: id,
        type: 'stage_change',
        fromStage: candidate.stage,
        toStage: updates.stage,
        description: `Moved from ${candidate.stage} to ${updates.stage}`,
        createdAt: new Date()
      });
    }
    
    await db.candidates.update(id, {
      ...updates,
      updatedAt: new Date()
    });
    
    const updatedCandidate = await db.candidates.get(id);
    return HttpResponse.json(updatedCandidate);
  }),

  // Assessments endpoints
  http.get('/api/assessments/:jobId', async ({ params }) => {
    await simulateNetwork();
    
    const assessment = await db.assessments
      .where('jobId')
      .equals(params.jobId as string)
      .first();
    
    return HttpResponse.json(assessment || null);
  }),

  http.put('/api/assessments/:jobId', async ({ params, request }) => {
    await simulateNetwork();
    
    const assessmentData = await request.json() as any;
    const jobId = params.jobId as string;
    
    // Check if assessment exists
    const existing = await db.assessments.where('jobId').equals(jobId).first();
    
    if (existing) {
      await db.assessments.update(existing.id, {
        ...assessmentData,
        updatedAt: new Date()
      });
      const updatedAssessment = await db.assessments.get(existing.id);
      return HttpResponse.json(updatedAssessment);
    } else {
      const newAssessment = {
        id: faker.string.uuid(),
        jobId,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...assessmentData
      };
      
      await db.assessments.add(newAssessment);
      return HttpResponse.json(newAssessment, { status: 201 });
    }
  }),

  http.post('/api/assessments/:jobId/submit', async ({ params, request }) => {
    await simulateNetwork();
    
    const responseData = await request.json() as any;
    const assessmentId = params.jobId as string; // Simplified for now
    
    const newResponse = {
      id: faker.string.uuid(),
      assessmentId,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: new Date(),
      ...responseData
    };
    
    await db.assessmentResponses.add(newResponse);
    return HttpResponse.json(newResponse, { status: 201 });
  }),
];
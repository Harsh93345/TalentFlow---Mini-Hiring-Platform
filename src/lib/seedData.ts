import { faker } from '@faker-js/faker';
import { db, type Job, type Candidate, type Assessment, type CandidateTimeline } from './database';

const CANDIDATE_STAGES = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'] as const;
const JOB_STATUSES = ['active', 'archived'] as const;

const TECH_SKILLS = [
  'React', 'Vue', 'Angular', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java',
  'C#', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'PHP', 'SQL', 'MongoDB', 'PostgreSQL',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'DevOps', 'Machine Learning', 'AI'
];

const JOB_TITLES = [
  'Senior Frontend Developer', 'Full Stack Engineer', 'Backend Developer', 'DevOps Engineer',
  'Product Manager', 'UX Designer', 'Data Scientist', 'Software Architect', 'QA Engineer',
  'Mobile Developer', 'Security Engineer', 'Site Reliability Engineer', 'Technical Writer',
  'Engineering Manager', 'Principal Engineer', 'VP of Engineering', 'CTO', 'UI Designer',
  'Data Engineer', 'ML Engineer', 'Cloud Architect', 'Solutions Architect', 'Platform Engineer'
];

const DEPARTMENTS = [
  'Engineering', 'Product', 'Design', 'Data', 'DevOps', 'Security', 'Marketing', 'Sales'
];

const LOCATIONS = [
  'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA',
  'Denver, CO', 'Remote', 'Los Angeles, CA', 'Chicago, IL', 'Portland, OR'
];

export async function seedDatabase() {
  // Clear existing data
  await Promise.all([
    db.jobs.clear(),
    db.candidates.clear(),
    db.candidateTimeline.clear(),
    db.assessments.clear(),
    db.assessmentResponses.clear()
  ]);

  // Seed Jobs (25 jobs)
  const jobs: Job[] = [];
  for (let i = 0; i < 25; i++) {
    const job: Job = {
      id: faker.string.uuid(),
      title: faker.helpers.arrayElement(JOB_TITLES),
      slug: faker.helpers.slugify(faker.helpers.arrayElement(JOB_TITLES)).toLowerCase(),
      status: faker.helpers.arrayElement(JOB_STATUSES),
      tags: faker.helpers.arrayElements(TECH_SKILLS, { min: 2, max: 6 }),
      order: i + 1,
      description: faker.lorem.paragraphs(3),
      location: faker.helpers.arrayElement(LOCATIONS),
      department: faker.helpers.arrayElement(DEPARTMENTS),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent({ days: 30 })
    };
    jobs.push(job);
  }
  
  await db.jobs.bulkAdd(jobs);
  console.log('✅ Seeded 25 jobs');

  // Seed Candidates (1000 candidates)
  const candidates: Candidate[] = [];
  const timelines: CandidateTimeline[] = [];
  
  for (let i = 0; i < 1000; i++) {
    const job = faker.helpers.arrayElement(jobs);
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const createdAt = faker.date.past({ years: 1 });
    
    const candidate: Candidate = {
      id: faker.string.uuid(),
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      phone: faker.phone.number(),
      stage: faker.helpers.arrayElement(CANDIDATE_STAGES),
      jobId: job.id,
      createdAt,
      updatedAt: faker.date.between({ from: createdAt, to: new Date() })
    };
    
    candidates.push(candidate);

    // Create initial timeline entry
    timelines.push({
      id: faker.string.uuid(),
      candidateId: candidate.id,
      type: 'stage_change',
      toStage: candidate.stage,
      description: `Application received for ${job.title}`,
      createdAt: candidate.createdAt
    });

    // Add some additional timeline entries for progression
    if (faker.datatype.boolean(0.3)) {
      const progressions = ['applied', 'screen', 'tech', 'offer'];
      const currentIndex = progressions.indexOf(candidate.stage as any);
      
      for (let j = 0; j < currentIndex; j++) {
        timelines.push({
          id: faker.string.uuid(),
          candidateId: candidate.id,
          type: 'stage_change',
          fromStage: progressions[j],
          toStage: progressions[j + 1],
          description: `Progressed from ${progressions[j]} to ${progressions[j + 1]}`,
          createdAt: faker.date.between({ 
            from: candidate.createdAt, 
            to: candidate.updatedAt 
          })
        });
      }
    }
  }
  
  await db.candidates.bulkAdd(candidates);
  await db.candidateTimeline.bulkAdd(timelines);
  console.log('✅ Seeded 1000 candidates with timelines');

  // Seed Assessments (3 comprehensive assessments)
  const assessments: Assessment[] = [
    {
      id: faker.string.uuid(),
      jobId: jobs.find(j => j.title.includes('Frontend'))?.id || jobs[0].id,
      title: 'Frontend Developer Assessment',
      description: 'Comprehensive assessment for frontend development skills',
      isActive: true,
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent({ days: 7 }),
      sections: [
        {
          id: faker.string.uuid(),
          title: 'Technical Knowledge',
          description: 'Questions about frontend technologies and best practices',
          order: 1,
          questions: [
            {
              id: faker.string.uuid(),
              type: 'single-choice',
              question: 'Which of the following is the correct way to handle state in React functional components?',
              required: true,
              order: 1,
              options: ['useState hook', 'setState method', 'this.state', 'componentDidMount']
            },
            {
              id: faker.string.uuid(),
              type: 'multi-choice',
              question: 'Which CSS preprocessors have you used? (Select all that apply)',
              required: true,
              order: 2,
              options: ['Sass/SCSS', 'Less', 'Stylus', 'PostCSS', 'None']
            },
            {
              id: faker.string.uuid(),
              type: 'numeric',
              question: 'How many years of React experience do you have?',
              required: true,
              order: 3,
              validation: { min: 0, max: 20 }
            }
          ]
        },
        {
          id: faker.string.uuid(),
          title: 'Problem Solving',
          description: 'Scenario-based questions to assess problem-solving skills',
          order: 2,
          questions: [
            {
              id: faker.string.uuid(),
              type: 'long-text',
              question: 'Describe how you would optimize the performance of a React application that is rendering slowly.',
              required: true,
              order: 1,
              validation: { maxLength: 1000 }
            },
            {
              id: faker.string.uuid(),
              type: 'short-text',
              question: 'What is your preferred state management solution for large React applications?',
              required: false,
              order: 2,
              validation: { maxLength: 100 }
            }
          ]
        }
      ]
    },
    {
      id: faker.string.uuid(),
      jobId: jobs.find(j => j.title.includes('Backend'))?.id || jobs[1].id,
      title: 'Backend Developer Assessment',
      description: 'Assessment focusing on server-side development and system design',
      isActive: true,
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent({ days: 7 }),
      sections: [
        {
          id: faker.string.uuid(),
          title: 'Database Design',
          description: 'Questions about database design and optimization',
          order: 1,
          questions: [
            {
              id: faker.string.uuid(),
              type: 'single-choice',
              question: 'Which database type would you choose for a social media application with complex relationships?',
              required: true,
              order: 1,
              options: ['SQL (PostgreSQL/MySQL)', 'NoSQL (MongoDB)', 'Graph (Neo4j)', 'Key-Value (Redis)']
            },
            {
              id: faker.string.uuid(),
              type: 'long-text',
              question: 'Design a database schema for an e-commerce platform. Include tables for users, products, orders, and payments.',
              required: true,
              order: 2,
              validation: { maxLength: 2000 }
            }
          ]
        },
        {
          id: faker.string.uuid(),
          title: 'API Design',
          description: 'REST API and system architecture questions',
          order: 2,
          questions: [
            {
              id: faker.string.uuid(),
              type: 'multi-choice',
              question: 'Which HTTP status codes would you use for the following scenarios? (Select all appropriate)',
              required: true,
              order: 1,
              options: ['200 - Success', '201 - Created', '400 - Bad Request', '401 - Unauthorized', '404 - Not Found', '500 - Server Error']
            }
          ]
        }
      ]
    },
    {
      id: faker.string.uuid(),
      jobId: jobs.find(j => j.title.includes('Product Manager'))?.id || jobs[2].id,
      title: 'Product Manager Assessment',
      description: 'Assessment for product management skills and strategic thinking',
      isActive: true,
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent({ days: 7 }),
      sections: [
        {
          id: faker.string.uuid(),
          title: 'Strategic thinking',
          description: 'Questions about product strategy and market analysis',
          order: 1,
          questions: [
            {
              id: faker.string.uuid(),
              type: 'long-text',
              question: 'How would you approach launching a new feature in a competitive market? Describe your go-to-market strategy.',
              required: true,
              order: 1,
              validation: { maxLength: 1500 }
            },
            {
              id: faker.string.uuid(),
              type: 'single-choice',
              question: 'Which metric is most important for measuring product success in the early stages?',
              required: true,
              order: 2,
              options: ['Daily Active Users', 'Revenue', 'Customer Satisfaction', 'Feature Adoption Rate']
            }
          ]
        }
      ]
    }
  ];

  await db.assessments.bulkAdd(assessments);
//   console.log('✅ Seeded 3 comprehensive assessments');

//   console.log('🚀 Database seeded successfully!');
  return { jobs: jobs.length, candidates: candidates.length, assessments: assessments.length };
}

export async function checkAndSeedDatabase() {
  const jobCount = await db.jobs.count();
  const candidateCount = await db.candidates.count();
  const assessmentCount = await db.assessments.count();
  
  if (jobCount === 0 || candidateCount === 0 || assessmentCount === 0) {
    console.log('🌱 Seeding database with initial data...');
    return await seedDatabase();
  }
  
  console.log(`📊 Database already populated: ${jobCount} jobs, ${candidateCount} candidates, ${assessmentCount} assessments`);
  return { jobs: jobCount, candidates: candidateCount, assessments: assessmentCount };
}
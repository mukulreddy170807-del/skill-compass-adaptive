import type { CareerQuestion } from '@/types';

export const careerQuestions: CareerQuestion[] = [
  {
    id: 'cq-1', text: 'Which area interests you the most?', category: 'interest',
    options: [
      { label: 'Technology & Software', value: 'tech', tags: ['tech', 'engineering'] },
      { label: 'Business & Strategy', value: 'business', tags: ['business', 'leadership'] },
      { label: 'Design & Creativity', value: 'design', tags: ['design', 'creative'] },
      { label: 'Data & Analytics', value: 'data', tags: ['data', 'analytics'] },
    ],
  },
  {
    id: 'cq-2', text: 'What is your preferred work style?', category: 'workstyle',
    options: [
      { label: 'Hands-on building & coding', value: 'builder', tags: ['tech', 'engineering'] },
      { label: 'Collaborating & leading teams', value: 'leader', tags: ['leadership', 'business'] },
      { label: 'Visual & user-focused work', value: 'visual', tags: ['design', 'creative'] },
      { label: 'Research & analysis', value: 'researcher', tags: ['data', 'analytics'] },
    ],
  },
  {
    id: 'cq-3', text: 'Which strength best describes you?', category: 'strength',
    options: [
      { label: 'Logical & problem-solving', value: 'logical', tags: ['tech', 'engineering', 'data'] },
      { label: 'Creative & imaginative', value: 'creative', tags: ['design', 'creative'] },
      { label: 'Communication & persuasion', value: 'communicator', tags: ['business', 'leadership'] },
      { label: 'Detail-oriented & analytical', value: 'analytical', tags: ['data', 'analytics'] },
    ],
  },
  {
    id: 'cq-4', text: 'What is your current education level?', category: 'education',
    options: [
      { label: 'High School / Self-taught', value: 'high-school', tags: ['entry'] },
      { label: 'Bachelor\'s Degree', value: 'bachelors', tags: ['mid'] },
      { label: 'Master\'s / PhD', value: 'masters', tags: ['advanced'] },
      { label: 'Bootcamp / Certifications', value: 'bootcamp', tags: ['practical'] },
    ],
  },
  {
    id: 'cq-5', text: 'What are your long-term career goals?', category: 'goal',
    options: [
      { label: 'Become a technical expert', value: 'expert', tags: ['tech', 'engineering'] },
      { label: 'Lead a team or company', value: 'leader', tags: ['leadership', 'business'] },
      { label: 'Create impactful products', value: 'creator', tags: ['design', 'creative', 'tech'] },
      { label: 'Drive decisions with data', value: 'data-driven', tags: ['data', 'analytics'] },
    ],
  },
  {
    id: 'cq-6', text: 'Which tools or subjects excite you?', category: 'interest',
    options: [
      { label: 'Programming languages & frameworks', value: 'programming', tags: ['tech', 'engineering'] },
      { label: 'Spreadsheets, SQL & dashboards', value: 'data-tools', tags: ['data', 'analytics'] },
      { label: 'Design tools (Figma, Sketch)', value: 'design-tools', tags: ['design', 'creative'] },
      { label: 'Strategy decks & presentations', value: 'strategy', tags: ['business', 'leadership'] },
    ],
  },
  {
    id: 'cq-7', text: 'How do you approach problems?', category: 'strength',
    options: [
      { label: 'Break them into logical steps', value: 'systematic', tags: ['tech', 'engineering'] },
      { label: 'Brainstorm creative solutions', value: 'brainstorm', tags: ['design', 'creative'] },
      { label: 'Analyze data for patterns', value: 'analyze', tags: ['data', 'analytics'] },
      { label: 'Discuss with stakeholders', value: 'discuss', tags: ['business', 'leadership'] },
    ],
  },
  {
    id: 'cq-8', text: 'What industry appeals to you most?', category: 'interest',
    options: [
      { label: 'Software / SaaS', value: 'saas', tags: ['tech', 'engineering'] },
      { label: 'Finance / Consulting', value: 'finance', tags: ['business', 'analytics'] },
      { label: 'Healthcare / Biotech', value: 'healthcare', tags: ['data', 'analytics'] },
      { label: 'Media / Entertainment', value: 'media', tags: ['design', 'creative'] },
    ],
  },
  {
    id: 'cq-9', text: 'How comfortable are you with math?', category: 'strength',
    options: [
      { label: 'Very comfortable — love algorithms', value: 'math-strong', tags: ['tech', 'data', 'engineering'] },
      { label: 'Comfortable with basic statistics', value: 'math-ok', tags: ['analytics', 'business'] },
      { label: 'Prefer qualitative reasoning', value: 'qualitative', tags: ['design', 'creative', 'leadership'] },
      { label: 'Prefer no math at all', value: 'no-math', tags: ['creative', 'leadership'] },
    ],
  },
  {
    id: 'cq-10', text: 'Where do you see yourself in 5 years?', category: 'goal',
    options: [
      { label: 'Senior Engineer / Architect', value: 'senior-eng', tags: ['tech', 'engineering'] },
      { label: 'Product / Design Lead', value: 'design-lead', tags: ['design', 'creative'] },
      { label: 'Data / AI Specialist', value: 'data-specialist', tags: ['data', 'analytics'] },
      { label: 'Business / Department Head', value: 'biz-head', tags: ['business', 'leadership'] },
    ],
  },
  {
    id: 'cq-11', text: 'Do you prefer working independently or in teams?', category: 'workstyle',
    options: [
      { label: 'Deep solo focus work', value: 'solo', tags: ['tech', 'engineering', 'data'] },
      { label: 'Collaborative team environment', value: 'team', tags: ['leadership', 'business'] },
      { label: 'Mix of both', value: 'mix', tags: ['design', 'creative'] },
      { label: 'Leading and mentoring others', value: 'mentor', tags: ['leadership', 'business'] },
    ],
  },
  {
    id: 'cq-12', text: 'What motivates you the most?', category: 'goal',
    options: [
      { label: 'Solving complex technical challenges', value: 'challenges', tags: ['tech', 'engineering'] },
      { label: 'Making things beautiful & usable', value: 'beauty', tags: ['design', 'creative'] },
      { label: 'Understanding patterns in data', value: 'patterns', tags: ['data', 'analytics'] },
      { label: 'Growing a business or product', value: 'growth', tags: ['business', 'leadership'] },
    ],
  },
];

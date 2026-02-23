import { careerPaths } from '@/data/mockData';
import type { CareerPath } from '@/types';

export interface CareerMatch {
  career: CareerPath;
  matchScore: number; // 0-100
}

// Tag-to-career mapping for rule-based matching
const careerTagMap: Record<string, string[]> = {
  'career-1': ['tech', 'engineering'],               // Software Engineer
  'career-2': ['data', 'analytics'],                  // Data Scientist
  'career-3': ['tech', 'data', 'engineering'],         // AI Engineer
  'career-4': ['design', 'creative'],                 // UI/UX Designer
  'career-5': ['design', 'creative'],                 // Product Designer
  'career-6': ['business', 'leadership'],             // Product Manager
  'career-7': ['business', 'analytics'],              // Business Analyst
  'career-8': ['tech', 'engineering'],                // DevOps Engineer
  'career-9': ['tech', 'engineering'],                // Cybersecurity Analyst
  'career-10': ['tech', 'creative', 'engineering'],    // Mobile App Developer
};

export function getCareerRecommendations(answers: Record<string, string[]>): CareerMatch[] {
  // Collect all tags from answers
  const tagCounts: Record<string, number> = {};
  Object.values(answers).forEach(tags => {
    tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const totalTags = Object.values(tagCounts).reduce((a, b) => a + b, 0);
  if (totalTags === 0) return [];

  // Score each career path
  const matches: CareerMatch[] = careerPaths.map(career => {
    const careerTags = careerTagMap[career.id] || [];
    let matchCount = 0;
    careerTags.forEach(tag => {
      matchCount += tagCounts[tag] || 0;
    });
    const matchScore = Math.min(100, Math.round((matchCount / totalTags) * 100 * (careerTags.length > 0 ? 2 : 1)));
    return { career, matchScore };
  });

  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

export interface RoadmapStep {
  phase: string;
  title: string;
  description: string;
  skills: string[];
  duration: string;
}

export function generateRoadmap(career: CareerPath): RoadmapStep[] {
  const skills = career.requiredSkills;
  const third = Math.ceil(skills.length / 3);

  return [
    {
      phase: 'Foundation',
      title: 'Build Core Skills',
      description: `Start with the fundamentals needed for ${career.title}`,
      skills: skills.slice(0, third),
      duration: '1-3 months',
    },
    {
      phase: 'Intermediate',
      title: 'Deepen Knowledge',
      description: 'Develop intermediate proficiency and work on projects',
      skills: skills.slice(third, third * 2),
      duration: '3-6 months',
    },
    {
      phase: 'Advanced',
      title: 'Specialize & Certify',
      description: `Earn certifications and build a portfolio for ${career.title}`,
      skills: skills.slice(third * 2),
      duration: '6-12 months',
    },
  ];
}

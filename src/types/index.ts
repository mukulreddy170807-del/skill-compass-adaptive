export type Role = 'admin' | 'employee' | 'manager' | 'hr' | 'student';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  jobRole: string;
  avatar: string;
  managerId?: string; // Only for employees
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface EmployeeSkill {
  skillId: string;
  level: SkillLevel;
  targetLevel: SkillLevel;
  lastAssessed: string;
  score: number;
}

export interface Question {
  id: string;
  skillId: string;
  text: string;
  options: string[];
  correctAnswer: number;
  difficulty: Difficulty;
  explanation: string;
}

export interface Assessment {
  id: string;
  employeeId: string;
  skillId: string;
  date: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  difficulty: Difficulty;
  status: 'completed' | 'in-progress' | 'pending';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  skillId: string;
  duration: string;
  level: SkillLevel;
  provider: string;
  url: string;
  thumbnail: string;
}

export interface Certification {
  id: string;
  name: string;
  provider: string;
  skillId: string;
  earnedDate: string;
  expiryDate: string;
  status: 'active' | 'expiring' | 'expired';
}

export interface EmployeeCourse {
  courseId: string;
  employeeId: string;
  progress: number;
  startedDate: string;
  completedDate?: string;
  status: 'not-started' | 'in-progress' | 'completed';
}

export interface EmployeeCertification {
  certificationId: string;
  employeeId: string;
  earnedDate: string;
  expiryDate: string;
}

export interface JobRole {
  id: string;
  title: string;
  department: string;
  requiredSkills: { skillId: string; requiredLevel: SkillLevel }[];
}

export interface Department {
  id: string;
  name: string;
  managerId: string;
}

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  certifications: string[];
  courses: string[];
  timeline: string;
  salaryRange: string;
}

export interface CareerQuestion {
  id: string;
  text: string;
  category: 'interest' | 'workstyle' | 'strength' | 'education' | 'goal';
  options: { label: string; value: string; tags: string[] }[];
}

export const SKILL_LEVEL_VALUES: Record<SkillLevel, number> = {
  beginner: 25,
  intermediate: 50,
  advanced: 75,
  expert: 100,
};

export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

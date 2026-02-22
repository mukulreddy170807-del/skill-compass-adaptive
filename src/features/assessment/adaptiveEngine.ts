import type { Difficulty, Question } from '@/types';
import { questions as allQuestions } from '@/data/mockData';

export interface AdaptiveState {
  currentDifficulty: Difficulty;
  questionIndex: number;
  questionsAnswered: Question[];
  correctCount: number;
  totalCount: number;
}

export function getNextDifficulty(current: Difficulty, wasCorrect: boolean): Difficulty {
  if (wasCorrect) {
    if (current === 'easy') return 'medium';
    if (current === 'medium') return 'hard';
    return 'hard';
  } else {
    if (current === 'hard') return 'medium';
    if (current === 'medium') return 'easy';
    return 'easy';
  }
}

export function getNextQuestion(
  skillId: string,
  difficulty: Difficulty,
  answeredIds: string[]
): Question | null {
  const available = allQuestions.filter(
    (q) => q.skillId === skillId && q.difficulty === difficulty && !answeredIds.includes(q.id)
  );
  if (available.length > 0) return available[Math.floor(Math.random() * available.length)];

  // Fallback: try any difficulty for this skill
  const fallback = allQuestions.filter(
    (q) => q.skillId === skillId && !answeredIds.includes(q.id)
  );
  if (fallback.length > 0) return fallback[Math.floor(Math.random() * fallback.length)];

  return null;
}

export function calculateScore(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function getSkillRating(score: number): string {
  if (score >= 90) return 'Expert';
  if (score >= 70) return 'Advanced';
  if (score >= 50) return 'Intermediate';
  return 'Beginner';
}

import type { Difficulty, Question } from '@/types';
import { questions as allQuestions } from '@/data/mockData';
import { generateAdaptiveQuestion, analyzePerformance } from '@/services/geminiService';

export interface AdaptiveState {
  currentDifficulty: Difficulty;
  questionIndex: number;
  questionsAnswered: Question[];
  correctCount: number;
  totalCount: number;
  useAI: boolean;
  previousQuestions: string[];
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

/**
 * Get next question - either from static data or AI-generated
 */
export async function getNextQuestionAsync(
  skillName: string,
  skillId: string,
  difficulty: Difficulty,
  answeredIds: string[],
  useAI: boolean = true,
  previousQuestions: string[] = []
): Promise<Question | null> {
  // Try AI-generated question first if enabled
  if (useAI) {
    try {
      const aiQuestion = await generateAdaptiveQuestion({
        skillName,
        difficulty,
        previousQuestions,
      });

      // Convert AI response to Question format
      const generatedQuestion: Question = {
        id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        skillId,
        text: aiQuestion.question,
        options: aiQuestion.options,
        correctAnswer: aiQuestion.correctAnswer,
        difficulty: aiQuestion.difficulty,
        explanation: aiQuestion.explanation,
      };

      return generatedQuestion;
    } catch (error) {
      console.error('Failed to generate AI question, falling back to static questions:', error);
      // Fall through to static questions
    }
  }

  // Fallback to static questions
  return getNextQuestion(skillId, difficulty, answeredIds);
}

/**
 * Legacy function for static questions (kept for backward compatibility)
 */
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

/**
 * Get AI-powered performance analysis
 */
export async function getPerformanceAnalysis(data: {
  skill: string;
  correctAnswers: number;
  totalQuestions: number;
  difficulty: string;
  timeSpent: number;
}) {
  try {
    return await analyzePerformance(data);
  } catch (error) {
    console.error('Failed to get AI performance analysis:', error);
    // Return fallback analysis
    const score = Math.round((data.correctAnswers / data.totalQuestions) * 100);
    return {
      feedback: `You scored ${score}% on the ${data.skill} assessment. ${
        score >= 70 ? 'Great job!' : 'Keep practicing to improve.'
      }`,
      strengths: ['Completed the assessment', 'Showed determination'],
      improvements: score < 70 ? ['Review core concepts', 'Practice more problems'] : [],
      nextSteps: ['Continue learning', 'Take more assessments', 'Apply skills in projects'],
    };
  }
}

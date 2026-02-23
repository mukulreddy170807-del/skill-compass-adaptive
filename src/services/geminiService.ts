/**
 * Gemini AI Service for ASTRA - Adaptive Skills Training and Resource Application
 * Handles all AI-powered interactions using Google's Gemini API
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface QuestionGenerationRequest {
  skillName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  previousQuestions?: string[];
  userLevel?: string;
}

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface CareerAnalysisRequest {
  answers: Record<string, any>;
  userProfile?: {
    education?: string;
    experience?: string;
    interests?: string[];
  };
}

export interface CareerRecommendation {
  title: string;
  matchScore: number;
  reasoning: string;
  requiredSkills: string[];
  timeline: string;
  salary: {
    min: number;
    max: number;
  };
}

export interface RoadmapRequest {
  careerPath: string;
  currentSkills: string[];
  timeframe: string;
  learningStyle?: string;
}

export interface RoadmapPhase {
  phase: string;
  title: string;
  description: string;
  skills: string[];
  resources: string[];
  projects: string[];
  duration: string;
  milestones: string[];
}

export interface GuidanceRequest {
  context: string;
  question: string;
  userProgress?: any;
}

/**
 * Make a request to Gemini API
 */
async function callGeminiAPI(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file');
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data: GeminiResponse = await response.json();
    const text = data.candidates[0]?.content?.parts[0]?.text;
    
    if (!text) {
      throw new Error('No response from Gemini API');
    }

    return text;
  } catch (error) {
    console.error('Gemini API call failed:', error);
    throw error;
  }
}

/**
 * Generate an adaptive assessment question using AI
 */
export async function generateAdaptiveQuestion(request: QuestionGenerationRequest): Promise<GeneratedQuestion> {
  const prompt = `You are an expert assessment creator for the ASTRA adaptive learning platform.

Generate a ${request.difficulty} level multiple-choice question about ${request.skillName}.

Requirements:
- Create exactly 4 answer options
- One correct answer and three plausible distractors
- Include a detailed explanation of why the answer is correct
- Make the question practical and relevant to real-world scenarios
- ${request.userLevel ? `Adjust for user level: ${request.userLevel}` : ''}

${request.previousQuestions && request.previousQuestions.length > 0 ? `
Previous questions to avoid duplicating:
${request.previousQuestions.join('\n')}
` : ''}

Return ONLY a valid JSON object in this exact format (no markdown, no backticks):
{
  "question": "The question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "Detailed explanation of the correct answer",
  "difficulty": "${request.difficulty}"
}`;

  const response = await callGeminiAPI(prompt);
  
  try {
    // Clean the response to extract JSON
    let cleanedResponse = response.trim();
    
    // Remove markdown code blocks if present
    cleanedResponse = cleanedResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Find JSON object
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }
    
    const parsed = JSON.parse(cleanedResponse);
    return parsed as GeneratedQuestion;
  } catch (error) {
    console.error('Failed to parse AI response:', response);
    throw new Error('Failed to parse AI generated question');
  }
}

/**
 * Analyze career questionnaire responses and provide AI-powered recommendations
 */
export async function analyzeCareerPath(request: CareerAnalysisRequest): Promise<CareerRecommendation[]> {
  const prompt = `You are a career counselor AI for the ASTRA adaptive learning platform.

Analyze the following questionnaire responses and provide personalized career recommendations:

User Responses:
${JSON.stringify(request.answers, null, 2)}

${request.userProfile ? `
User Profile:
- Education: ${request.userProfile.education || 'Not specified'}
- Experience: ${request.userProfile.experience || 'Not specified'}
- Interests: ${request.userProfile.interests?.join(', ') || 'Not specified'}
` : ''}

Provide 5 career recommendations that match the user's profile. Consider:
- Their interests and work style preferences
- Educational background and career goals
- Industry preferences and problem-solving approaches
- Current job market trends and growth potential

Return ONLY a valid JSON array in this exact format (no markdown, no backticks):
[
  {
    "title": "Career Title (e.g., Software Engineer, Data Scientist)",
    "matchScore": 95,
    "reasoning": "Detailed explanation of why this career fits",
    "requiredSkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
    "timeline": "6-12 months to entry level",
    "salary": {
      "min": 70000,
      "max": 120000
    }
  }
]`;

  const response = await callGeminiAPI(prompt);
  
  try {
    let cleanedResponse = response.trim();
    cleanedResponse = cleanedResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    const jsonMatch = cleanedResponse.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }
    
    const parsed = JSON.parse(cleanedResponse);
    return parsed as CareerRecommendation[];
  } catch (error) {
    console.error('Failed to parse AI career analysis:', response);
    throw new Error('Failed to parse AI career recommendations');
  }
}

/**
 * Generate a personalized learning roadmap using AI
 */
export async function generatePersonalizedRoadmap(request: RoadmapRequest): Promise<RoadmapPhase[]> {
  const prompt = `You are a learning path designer for the ASTRA adaptive learning platform.

Create a detailed, personalized learning roadmap for:
- Career Path: ${request.careerPath}
- Current Skills: ${request.currentSkills.join(', ')}
- Target Timeframe: ${request.timeframe}
${request.learningStyle ? `- Learning Style: ${request.learningStyle}` : ''}

Create a 3-phase roadmap (Foundation, Intermediate, Advanced) with:
- Specific skills to learn in each phase
- Recommended learning resources
- Practical projects to build
- Clear milestones to track progress
- Realistic time estimates

Return ONLY a valid JSON array in this exact format (no markdown, no backticks):
[
  {
    "phase": "Foundation",
    "title": "Build Core Skills",
    "description": "Detailed description of this phase",
    "skills": ["Skill 1", "Skill 2", "Skill 3"],
    "resources": ["Resource 1", "Resource 2", "Resource 3"],
    "projects": ["Project 1", "Project 2"],
    "duration": "1-3 months",
    "milestones": ["Milestone 1", "Milestone 2", "Milestone 3"]
  }
]`;

  const response = await callGeminiAPI(prompt);
  
  try {
    let cleanedResponse = response.trim();
    cleanedResponse = cleanedResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    const jsonMatch = cleanedResponse.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }
    
    const parsed = JSON.parse(cleanedResponse);
    return parsed as RoadmapPhase[];
  } catch (error) {
    console.error('Failed to parse AI roadmap:', response);
    throw new Error('Failed to parse AI generated roadmap');
  }
}

/**
 * Provide AI-powered learning guidance and support
 */
export async function getAIGuidance(request: GuidanceRequest): Promise<string> {
  const prompt = `You are an AI learning assistant for the ASTRA adaptive learning platform.

Context: ${request.context}

${request.userProgress ? `User Progress: ${JSON.stringify(request.userProgress)}` : ''}

User Question: ${request.question}

Provide helpful, encouraging, and actionable guidance. Be specific and practical.
Include examples, tips, and next steps when appropriate.

Keep your response conversational and supportive (max 500 words).`;

  const response = await callGeminiAPI(prompt);
  return response.trim();
}

/**
 * Analyze assessment performance and provide adaptive feedback
 */
export async function analyzePerformance(data: {
  skill: string;
  correctAnswers: number;
  totalQuestions: number;
  difficulty: string;
  timeSpent: number;
}): Promise<{
  feedback: string;
  strengths: string[];
  improvements: string[];
  nextSteps: string[];
}> {
  const prompt = `You are a performance analyst for the ASTRA adaptive learning platform.

Analyze this assessment performance:
- Skill: ${data.skill}
- Score: ${data.correctAnswers}/${data.totalQuestions} (${Math.round((data.correctAnswers / data.totalQuestions) * 100)}%)
- Difficulty Level: ${data.difficulty}
- Time Spent: ${Math.round(data.timeSpent / 1000)} seconds

Provide:
1. Encouraging feedback on performance
2. Identified strengths (2-3 points)
3. Areas for improvement (2-3 points)
4. Specific next steps to improve (3-4 actionable items)

Return ONLY a valid JSON object in this exact format (no markdown, no backticks):
{
  "feedback": "Encouraging paragraph about their performance",
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["Area 1", "Area 2"],
  "nextSteps": ["Action 1", "Action 2", "Action 3"]
}`;

  const response = await callGeminiAPI(prompt);
  
  try {
    let cleanedResponse = response.trim();
    cleanedResponse = cleanedResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }
    
    const parsed = JSON.parse(cleanedResponse);
    return parsed;
  } catch (error) {
    console.error('Failed to parse AI performance analysis:', response);
    throw new Error('Failed to parse AI performance analysis');
  }
}
/**
 * Generate a complete assessment with multiple questions
 */
export interface AssessmentExam {
  questions: GeneratedQuestion[];
  totalQuestions: number;
  passPercentage: number;
  timeLimit?: number; // in minutes
}

export async function generateAssessment(
  courseName: string,
  skillName: string,
  questionCount: number = 5
): Promise<AssessmentExam> {
  const prompt = `You are an expert assessment creator for the ASTRA adaptive learning platform.

Generate a comprehensive assessment for a course on "${courseName}" (${skillName} skill).

Create ${questionCount} multiple-choice questions that:
- Cover different aspects of the course material
- Progress from basic to advanced concepts
- Include practical, real-world scenarios
- Have exactly 4 options each
- Include detailed explanations

Return ONLY a valid JSON object (no markdown, no backticks):
{
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation",
      "difficulty": "medium"
    }
  ],
  "passPercentage": 70
}`;

  const response = await callGeminiAPI(prompt);
  
  try {
    let cleanedResponse = response.trim();
    cleanedResponse = cleanedResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }
    
    const parsed = JSON.parse(cleanedResponse);
    return {
      questions: parsed.questions || [],
      totalQuestions: questionCount,
      passPercentage: parsed.passPercentage || 70,
      timeLimit: questionCount * 3, // 3 minutes per question
    };
  } catch (error) {
    console.error('Failed to parse AI assessment:', response);
    throw new Error('Failed to generate AI assessment');
  }
}

/**
 * Generate a certification exam (harder than regular assessment)
 */
export async function generateCertificationExam(
  courseName: string,
  skillName: string,
  questionCount: number = 10
): Promise<AssessmentExam> {
  const prompt = `You are an expert certification exam creator for the ASTRA adaptive learning platform.

Generate a professional certification examination for "${courseName}" (${skillName} skill).

Create ${questionCount} challenging multiple-choice questions that:
- Test deep understanding and advanced concepts
- Include complex real-world scenarios
- Require critical thinking and problem-solving
- Have exactly 4 options each with plausible distractors
- Include comprehensive explanations
- Are suitable for professional certification

Return ONLY a valid JSON object (no markdown, no backticks):
{
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation",
      "difficulty": "hard"
    }
  ],
  "passPercentage": 75
}`;

  const response = await callGeminiAPI(prompt);
  
  try {
    let cleanedResponse = response.trim();
    cleanedResponse = cleanedResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }
    
    const parsed = JSON.parse(cleanedResponse);
    return {
      questions: parsed.questions || [],
      totalQuestions: questionCount,
      passPercentage: parsed.passPercentage || 75,
      timeLimit: questionCount * 4, // 4 minutes per question for certification
    };
  } catch (error) {
    console.error('Failed to parse AI certification exam:', response);
    throw new Error('Failed to generate AI certification exam');
  }
}

/**
 * Evaluate user's answers and provide detailed feedback
 */
export interface ExamResult {
  score: number;
  percentage: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  feedback: string;
  strengths: string[];
  areasForImprovement: string[];
}

export async function evaluateExamResults(
  questions: GeneratedQuestion[],
  userAnswers: number[],
  examType: 'assessment' | 'certification',
  passPercentage: number
): Promise<ExamResult> {
  let correctAnswers = 0;
  const results = questions.map((q, idx) => ({
    question: q.question,
    correct: q.correctAnswer === userAnswers[idx],
    difficulty: q.difficulty,
  }));

  correctAnswers = results.filter(r => r.correct).length;
  const percentage = Math.round((correctAnswers / questions.length) * 100);
  const passed = percentage >= passPercentage;

  // Get AI feedback
  const prompt = `You are an expert instructor providing feedback on a ${examType} exam.

Exam Results:
- Total Questions: ${questions.length}
- Correct Answers: ${correctAnswers}
- Score: ${percentage}%
- Status: ${passed ? 'PASSED' : 'FAILED'}
- Pass Threshold: ${passPercentage}%

Question Performance:
${results.map((r, i) => `${i + 1}. ${r.correct ? '✓' : '✗'} ${r.difficulty} - ${r.question.substring(0, 60)}...`).join('\n')}

Provide encouraging feedback and actionable insights.

Return ONLY a valid JSON object (no markdown, no backticks):
{
  "feedback": "Overall personalized feedback message (2-3 sentences)",
  "strengths": ["strength 1", "strength 2"],
  "areasForImprovement": ["area 1", "area 2"]
}`;

  try {
    const response = await callGeminiAPI(prompt);
    let cleanedResponse = response.trim();
    cleanedResponse = cleanedResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }
    
    const parsed = JSON.parse(cleanedResponse);
    
    return {
      score: percentage,
      percentage,
      passed,
      correctAnswers,
      totalQuestions: questions.length,
      feedback: parsed.feedback || `You scored ${percentage}%. ${passed ? 'Congratulations on passing!' : 'Keep studying and try again.'}`,
      strengths: parsed.strengths || [],
      areasForImprovement: parsed.areasForImprovement || [],
    };
  } catch (error) {
    console.error('Failed to get AI feedback:', error);
    // Return basic result without AI feedback
    return {
      score: percentage,
      percentage,
      passed,
      correctAnswers,
      totalQuestions: questions.length,
      feedback: `You scored ${percentage}%. ${passed ? 'Congratulations on passing!' : 'Keep studying and try again.'}`,
      strengths: [],
      areasForImprovement: [],
    };
  }
}
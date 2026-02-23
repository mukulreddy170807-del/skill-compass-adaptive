import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, Clock, CheckCircle2, XCircle, Award, TrendingUp, TrendingDown } from 'lucide-react';
import type { GeneratedQuestion } from '@/services/geminiService';
import type { ExamResult } from '@/services/geminiService';

interface AIExamProps {
  questions: GeneratedQuestion[];
  examType: 'assessment' | 'certification';
  courseName: string;
  timeLimit?: number;
  onComplete: (result: ExamResult, answers: number[]) => void;
  onCancel: () => void;
}

export function AIExam({ questions, examType, courseName, timeLimit, onComplete, onCancel }: AIExamProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [timeRemaining, setTimeRemaining] = useState(timeLimit ? timeLimit * 60 : null); // Convert to seconds
  const [showResults, setShowResults] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const allQuestionsAnswered = userAnswers.every(a => a !== -1);

  // Timer effect
  useEffect(() => {
    if (!timeRemaining || showResults) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, showResults]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    // Calculate results
    let correctAnswers = 0;
    questions.forEach((q, idx) => {
      if (q.correctAnswer === userAnswers[idx]) {
        correctAnswers++;
      }
    });

    const percentage = Math.round((correctAnswers / questions.length) * 100);
    const passPercentage = examType === 'certification' ? 75 : 70;
    const passed = percentage >= passPercentage;

    // Create basic result (AI feedback happens in parent component)
    const result: ExamResult = {
      score: percentage,
      percentage,
      passed,
      correctAnswers,
      totalQuestions: questions.length,
      feedback: '',
      strengths: [],
      areasForImprovement: [],
    };

    setExamResult(result);
    setShowResults(true);
    onComplete(result, userAnswers);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults && examResult) {
    return (
      <div className="space-y-4">
        <Card className={examResult.passed ? 'border-success/50 bg-success/5' : 'border-destructive/50 bg-destructive/5'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {examResult.passed ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-success" />
                  {examType === 'certification' ? 'Certification Earned!' : 'Assessment Passed!'}
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-destructive" />
                  {examType === 'certification' ? 'Certification Not Earned' : 'Assessment Not Passed'}
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{examResult.percentage}%</p>
                <p className="text-xs text-muted-foreground">Score</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{examResult.correctAnswers}/{examResult.totalQuestions}</p>
                <p className="text-xs text-muted-foreground">Correct Answers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{examType === 'certification' ? '75%' : '70%'}</p>
                <p className="text-xs text-muted-foreground">Pass Threshold</p>
              </div>
            </div>

            <Progress value={examResult.percentage} className="h-3" />

            {examResult.feedback && (
              <Alert>
                <AlertDescription>{examResult.feedback}</AlertDescription>
              </Alert>
            )}

            {examResult.strengths.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <p className="text-sm font-medium">Strengths</p>
                </div>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {examResult.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {examResult.areasForImprovement.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-accent" />
                  <p className="text-sm font-medium">Areas for Improvement</p>
                </div>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {examResult.areasForImprovement.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Detailed Results */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Question Results:</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {questions.map((q, idx) => {
                  const userAnswer = userAnswers[idx];
                  const isCorrect = q.correctAnswer === userAnswer;
                  return (
                    <Card key={idx} className={isCorrect ? 'border-success/30' : 'border-destructive/30'}>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-2">
                          {isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium mb-2">{q.question}</p>
                            <div className="space-y-1">
                              <p className="text-xs">
                                <span className="text-muted-foreground">Your answer: </span>
                                <span className={isCorrect ? 'text-success' : 'text-destructive'}>
                                  {userAnswer >= 0 ? q.options[userAnswer] : 'Not answered'}
                                </span>
                              </p>
                              {!isCorrect && (
                                <p className="text-xs">
                                  <span className="text-muted-foreground">Correct answer: </span>
                                  <span className="text-success">{q.options[q.correctAnswer]}</span>
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground italic">{q.explanation}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{courseName}</h3>
          <p className="text-sm text-muted-foreground">
            {examType === 'certification' ? 'Certification Exam' : 'Course Assessment'}
          </p>
        </div>
        {timeRemaining !== null && (
          <Badge variant={timeRemaining < 300 ? 'destructive' : 'default'} className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            {formatTime(timeRemaining)}
          </Badge>
        )}
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-muted-foreground">
            {userAnswers.filter(a => a !== -1).length} answered
          </span>
        </div>
        <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} />
      </div>

      {/* Question */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-base">{currentQuestion.question}</CardTitle>
            <Badge variant="outline">{currentQuestion.difficulty}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={userAnswers[currentQuestionIndex]?.toString() || ''}
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
          >
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => (
                <div
                  key={idx}
                  className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                    userAnswers[currentQuestionIndex] === idx
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                  <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          {!isLastQuestion && (
            <Button onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered}
            className={examType === 'certification' ? 'bg-success hover:bg-success/90' : ''}
          >
            {examType === 'certification' ? (
              <>
                <Award className="w-4 h-4 mr-2" />
                Submit for Certification
              </>
            ) : (
              'Submit Assessment'
            )}
          </Button>
        </div>
      </div>

      {/* Question Navigator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Question Navigator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`
                  aspect-square rounded-md text-xs font-medium transition-colors
                  ${idx === currentQuestionIndex 
                    ? 'bg-primary text-primary-foreground' 
                    : userAnswers[idx] !== -1
                    ? 'bg-success/20 text-success hover:bg-success/30'
                    : 'bg-muted hover:bg-muted/80'
                  }
                `}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

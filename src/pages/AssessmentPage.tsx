import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { skills, employeeSkills } from '@/data/mockData';
import { getNextQuestion, getNextDifficulty, calculateScore, getSkillRating } from '@/features/assessment/adaptiveEngine';
import type { Difficulty, Question } from '@/types';
import { ClipboardCheck, Clock, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

type AssessmentPhase = 'select' | 'running' | 'result';

export default function AssessmentPage() {
  const user = useAuthStore((s) => s.user)!;
  const mySkills = employeeSkills[user.id] || [];

  const [phase, setPhase] = useState<AssessmentPhase>('select');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [answeredIds, setAnsweredIds] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [startTime] = useState(Date.now());
  const maxQuestions = 5;

  const startAssessment = (skillId: string) => {
    setSelectedSkill(skillId);
    setPhase('running');
    setDifficulty('easy');
    setAnsweredIds([]);
    setCorrectCount(0);
    setTotalCount(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    const q = getNextQuestion(skillId, 'easy', []);
    setCurrentQuestion(q);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null || !currentQuestion) return;
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setShowFeedback(true);

    setTimeout(() => {
      const newCorrect = isCorrect ? correctCount + 1 : correctCount;
      const newTotal = totalCount + 1;
      const newAnswered = [...answeredIds, currentQuestion.id];
      const newDifficulty = getNextDifficulty(difficulty, isCorrect);

      setCorrectCount(newCorrect);
      setTotalCount(newTotal);
      setAnsweredIds(newAnswered);
      setDifficulty(newDifficulty);
      setSelectedAnswer(null);
      setShowFeedback(false);

      if (newTotal >= maxQuestions) {
        setPhase('result');
        return;
      }

      const next = getNextQuestion(selectedSkill, newDifficulty, newAnswered);
      if (!next) {
        setPhase('result');
        return;
      }
      setCurrentQuestion(next);
    }, 1500);
  };

  const score = calculateScore(correctCount, totalCount || 1);
  const rating = getSkillRating(score);
  const skillName = skills.find((s) => s.id === selectedSkill)?.name || '';

  if (phase === 'select') {
    const availableSkills = skills.filter((s) => mySkills.some((ms) => ms.skillId === s.id));
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Skill Assessments</h1>
          <p className="text-muted-foreground text-sm mt-1">Take an adaptive assessment to evaluate your skills</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableSkills.map((skill) => {
            const es = mySkills.find((ms) => ms.skillId === skill.id);
            return (
              <Card key={skill.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => startAssessment(skill.id)}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-sm">{skill.name}</h3>
                      <p className="text-xs text-muted-foreground">{skill.category}</p>
                    </div>
                    <ClipboardCheck className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{skill.description}</p>
                  {es && (
                    <div className="flex items-center gap-2">
                      <Progress value={es.score} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground">{es.score}%</span>
                    </div>
                  )}
                  <Button size="sm" className="w-full mt-3">Start Assessment</Button>
                </CardContent>
              </Card>
            );
          })}
          {availableSkills.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center py-10">No skills assigned yet.</p>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    return (
      <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-xl font-bold">Assessment Complete</h2>
            <p className="text-muted-foreground text-sm">{skillName}</p>
            <div className="text-5xl font-bold text-gradient-accent">{score}%</div>
            <Badge className="text-sm px-3 py-1">{rating}</Badge>
            <div className="text-sm text-muted-foreground">
              {correctCount} / {totalCount} questions correct
            </div>
            <div className="flex gap-3 justify-center pt-4">
              <Button variant="outline" onClick={() => { setPhase('select'); }}><RotateCcw className="w-4 h-4 mr-2" />Try Again</Button>
              <Button onClick={() => setPhase('select')}>Back to Skills</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Running phase
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">{skillName} Assessment</h1>
          <p className="text-xs text-muted-foreground">Question {totalCount + 1} of {maxQuestions}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">
            Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {Math.floor((Date.now() - startTime) / 1000)}s
          </div>
        </div>
      </div>

      <Progress value={((totalCount) / maxQuestions) * 100} className="h-2" />

      {currentQuestion && (
        <Card>
          <CardContent className="p-6 space-y-5">
            <p className="text-base font-medium">{currentQuestion.text}</p>
            <div className="space-y-2">
              {currentQuestion.options.map((option, i) => {
                let optionClass = 'p-3 rounded-md border border-border cursor-pointer transition-colors text-sm';
                if (showFeedback) {
                  if (i === currentQuestion.correctAnswer) optionClass += ' border-success bg-success/10';
                  else if (i === selectedAnswer) optionClass += ' border-destructive bg-destructive/10';
                } else if (i === selectedAnswer) {
                  optionClass += ' border-primary bg-primary/5';
                } else {
                  optionClass += ' hover:bg-muted/50';
                }
                return (
                  <button
                    key={i}
                    className={`${optionClass} w-full text-left flex items-center gap-3`}
                    onClick={() => !showFeedback && setSelectedAnswer(i)}
                    disabled={showFeedback}
                  >
                    <span className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-xs font-medium flex-shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {option}
                    {showFeedback && i === currentQuestion.correctAnswer && <CheckCircle2 className="w-4 h-4 text-success ml-auto" />}
                    {showFeedback && i === selectedAnswer && i !== currentQuestion.correctAnswer && <XCircle className="w-4 h-4 text-destructive ml-auto" />}
                  </button>
                );
              })}
            </div>
            {showFeedback && (
              <p className="text-xs text-muted-foreground p-3 rounded-md bg-muted/50">{currentQuestion.explanation}</p>
            )}
            {!showFeedback && (
              <Button onClick={submitAnswer} disabled={selectedAnswer === null} className="w-full">
                Submit Answer <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

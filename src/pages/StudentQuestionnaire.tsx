import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { careerQuestions } from '@/features/student/questionnaireData';
import { getCareerRecommendations } from '@/features/student/careerEngine';

export default function StudentQuestionnaire() {
  const user = useAuthStore((s) => s.user)!;
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const question = careerQuestions[current];
  const total = careerQuestions.length;
  const progress = ((current + 1) / total) * 100;

  const handleSelect = (value: string) => {
    setAnswers(prev => ({ ...prev, [question.id]: value }));
  };

  const handleNext = () => {
    if (current < total - 1) {
      setCurrent(current + 1);
    }
  };

  const handleBack = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleSubmit = () => {
    // Build tag map from answers
    const tagMap: Record<string, string[]> = {};
    Object.entries(answers).forEach(([qId, value]) => {
      const q = careerQuestions.find(cq => cq.id === qId);
      if (q) {
        const opt = q.options.find(o => o.value === value);
        if (opt) tagMap[qId] = opt.tags;
      }
    });

    const results = getCareerRecommendations(tagMap);
    const topResults = results.slice(0, 5).map(r => ({ title: r.career.title, matchScore: r.matchScore, careerId: r.career.id }));

    localStorage.setItem(`career-results-${user.id}`, JSON.stringify(topResults));
    navigate('/student/roadmap');
  };

  const isLastQuestion = current === total - 1;
  const selectedValue = answers[question.id];
  const allAnswered = Object.keys(answers).length === total;

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Career Questionnaire</h1>
        <p className="text-muted-foreground text-sm mt-1">Question {current + 1} of {total}</p>
      </div>

      <Progress value={progress} className="h-2" />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{question.text}</CardTitle>
          <p className="text-xs text-muted-foreground capitalize">{question.category}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {question.options.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`w-full text-left p-4 rounded-lg border transition-colors text-sm ${
                selectedValue === opt.value
                  ? 'border-primary bg-primary/5 font-medium'
                  : 'border-border hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{opt.label}</span>
                {selectedValue === opt.value && <CheckCircle className="w-4 h-4 text-primary" />}
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleBack} disabled={current === 0}>
          <ChevronLeft className="w-4 h-4 mr-1" />Back
        </Button>
        {isLastQuestion ? (
          <Button onClick={handleSubmit} disabled={!allAnswered}>
            Get Results <CheckCircle className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={!selectedValue}>
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronLeft, ChevronRight, CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import { careerQuestions } from '@/features/student/questionnaireData';
import { getCareerRecommendations, getAICareerRecommendations } from '@/features/student/careerEngine';

export default function StudentQuestionnaire() {
  const user = useAuthStore((s) => s.user)!;
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [useAI, setUseAI] = useState(true);

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

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Build tag map from answers
      const tagMap: Record<string, string[]> = {};
      Object.entries(answers).forEach(([qId, value]) => {
        const q = careerQuestions.find(cq => cq.id === qId);
        if (q) {
          const opt = q.options.find(o => o.value === value);
          if (opt) tagMap[qId] = opt.tags;
        }
      });

      let results;
      
      if (useAI) {
        // Use AI for career recommendations
        results = await getAICareerRecommendations(tagMap, {
          education: answers['cq-4'], // Education level
          interests: tagMap['cq-1'] || [], // Primary interests
        });
      } else {
        // Use rule-based recommendations
        results = getCareerRecommendations(tagMap);
      }

      const topResults = results.slice(0, 5).map(r => ({ 
        title: r.career.title, 
        matchScore: r.matchScore, 
        careerId: r.career.id,
        reasoning: r.reasoning,
        requiredSkills: r.career.requiredSkills,
        salary: r.career.avgSalary
      }));

      localStorage.setItem(`career-results-${user.id}`, JSON.stringify(topResults));
      localStorage.setItem(`career-answers-${user.id}`, JSON.stringify(answers));
      // Clear cached roadmaps so fresh ones are generated
      localStorage.removeItem(`career-roadmaps-${user.id}`);
      navigate('/student/roadmap');
    } catch (error) {
      console.error('Failed to get career recommendations:', error);
      // Fallback to rule-based if AI fails
      const tagMap: Record<string, string[]> = {};
      Object.entries(answers).forEach(([qId, value]) => {
        const q = careerQuestions.find(cq => cq.id === qId);
        if (q) {
          const opt = q.options.find(o => o.value === value);
          if (opt) tagMap[qId] = opt.tags;
        }
      });
      
      const results = getCareerRecommendations(tagMap);
      const topResults = results.slice(0, 5).map(r => ({ 
        title: r.career.title, 
        matchScore: r.matchScore, 
        careerId: r.career.id,
        requiredSkills: r.career.requiredSkills,
        salary: r.career.avgSalary
      }));

      localStorage.setItem(`career-results-${user.id}`, JSON.stringify(topResults));
      localStorage.setItem(`career-answers-${user.id}`, JSON.stringify(answers));
      // Clear cached roadmaps so fresh ones are generated
      localStorage.removeItem(`career-roadmaps-${user.id}`);
      navigate('/student/roadmap');
    } finally {
      setLoading(false);
    }
  };

  const isLastQuestion = current === total - 1;
  const selectedValue = answers[question.id];
  const allAnswered = Object.keys(answers).length === total;

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI-Powered Career Questionnaire</h1>
          <p className="text-muted-foreground text-sm mt-1">Question {current + 1} of {total}</p>
        </div>
        <Button
          variant={useAI ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUseAI(!useAI)}
          className="gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {useAI ? 'AI Mode: ON' : 'AI Mode: OFF'}
        </Button>
      </div>

      {useAI && current === 0 && (
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertDescription>
            AI Mode provides personalized career recommendations based on advanced analysis of your responses, interests, and goals.
          </AlertDescription>
        </Alert>
      )}

      <Progress value={progress} className="h-2" />

      {loading ? (
        <Card>
          <CardContent className="p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <p className="text-sm text-muted-foreground">Analyzing your responses with AI...</p>
            <p className="text-xs text-muted-foreground">This may take a few moments</p>
          </CardContent>
        </Card>
      ) : (
        <>
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
              <Button onClick={handleSubmit} disabled={!allAnswered || loading} className="gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Get Results
                    {useAI && <Sparkles className="w-4 h-4" />}
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!selectedValue}>
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

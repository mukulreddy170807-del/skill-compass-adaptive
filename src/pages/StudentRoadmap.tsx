import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, BookOpen, Award, Clock, DollarSign, Sparkles, Loader2, Target, FolderKanban, Lightbulb } from 'lucide-react';
import { careerPaths } from '@/data/mockData';
import { generateRoadmap, generateAIRoadmap, type RoadmapStep } from '@/features/student/careerEngine';

export default function StudentRoadmap() {
  const user = useAuthStore((s) => s.user)!;
  const navigate = useNavigate();
  const [useAI, setUseAI] = useState(true);
  const [loading, setLoading] = useState(false);
  const [roadmaps, setRoadmaps] = useState<Record<string, RoadmapStep[]>>({});

  const storageKey = `career-results-${user.id}`;
  const roadmapsStorageKey = `career-roadmaps-${user.id}`;
  const savedResults = localStorage.getItem(storageKey);

  useEffect(() => {
    if (savedResults && useAI) {
      // Check if roadmaps are already cached
      const cachedRoadmaps = localStorage.getItem(roadmapsStorageKey);
      
      if (cachedRoadmaps) {
        // Load cached roadmaps instead of regenerating
        try {
          const parsedRoadmaps = JSON.parse(cachedRoadmaps);
          setRoadmaps(parsedRoadmaps);
        } catch (error) {
          console.error('Failed to load cached roadmaps:', error);
          generateAIRoadmaps();
        }
      } else {
        // No cache found, generate new roadmaps
        generateAIRoadmaps();
      }
    }
  }, [savedResults, useAI]);

  const generateAIRoadmaps = async () => {
    if (!savedResults) return;
    
    const results: { title: string; matchScore: number; careerId: string; requiredSkills?: string[] }[] = JSON.parse(savedResults);
    setLoading(true);
    
    const newRoadmaps: Record<string, RoadmapStep[]> = {};
    
    for (const result of results) {
      const career = careerPaths.find(c => c.id === result.careerId);
      if (career) {
        try {
          const aiRoadmap = await generateAIRoadmap(
            career, 
            [], // Current skills - could be populated from user profile
            '6-12 months'
          );
          newRoadmaps[result.careerId] = aiRoadmap;
        } catch (error) {
          console.error(`Failed to generate AI roadmap for ${career.title}:`, error);
          newRoadmaps[result.careerId] = generateRoadmap(career);
        }
      }
    }
    
    setRoadmaps(newRoadmaps);
    // Save generated roadmaps to localStorage for future visits
    localStorage.setItem(roadmapsStorageKey, JSON.stringify(newRoadmaps));
    setLoading(false);
  };

  if (!savedResults) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-muted-foreground">No career results found.</p>
        <Button onClick={() => navigate('/student/questionnaire')}>Take Questionnaire</Button>
      </div>
    );
  }

  const results: { title: string; matchScore: number; careerId: string; reasoning?: string; requiredSkills?: string[]; salary?: { min: number; max: number } }[] = JSON.parse(savedResults);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/student')}>
            <ArrowLeft className="w-4 h-4 mr-1" />Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Your AI-Powered Career Roadmap</h1>
            <p className="text-muted-foreground text-sm mt-1">Personalized learning paths based on your results</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Clear cache and regenerate roadmaps
              localStorage.removeItem(roadmapsStorageKey);
              setRoadmaps({});
              generateAIRoadmaps();
            }}
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Regenerate
          </Button>
          <Button
            variant={useAI ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setUseAI(!useAI);
              if (!useAI) {
                const cachedRoadmaps = localStorage.getItem(roadmapsStorageKey);
                if (cachedRoadmaps) {
                  setRoadmaps(JSON.parse(cachedRoadmaps));
                } else {
                  generateAIRoadmaps();
                }
              }
            }}
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {useAI ? 'AI Mode: ON' : 'AI Mode: OFF'}
          </Button>
        </div>
      </div>

      {useAI && (
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertDescription>
            AI Mode generates detailed, personalized roadmaps with resources, projects, and milestones tailored to your career goals.
          </AlertDescription>
        </Alert>
      )}

      {loading && (
        <Card>
          <CardContent className="p-10 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <p className="text-sm text-muted-foreground">Generating AI-powered roadmaps...</p>
          </CardContent>
        </Card>
      )}

      {!loading && results.map((result, idx) => {
        const career = careerPaths.find(c => c.id === result.careerId);
        if (!career) return null;
        
        const roadmap = useAI && roadmaps[result.careerId] 
          ? roadmaps[result.careerId]
          : generateRoadmap(career);

        return (
          <Card key={career.id} className={idx === 0 ? 'border-primary/30' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {idx === 0 && <Badge className="text-[10px]">Top Match</Badge>}
                    {career.title}
                    {useAI && <Sparkles className="w-4 h-4 text-accent" />}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{career.description}</p>
                  {result.reasoning && (
                    <p className="text-xs text-accent/80 mt-2 italic">"{result.reasoning}"</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">{result.matchScore}%</p>
                  <p className="text-[10px] text-muted-foreground">match</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {career.timeline || '6-12 months'}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {result.salary 
                    ? `$${(result.salary.min / 1000).toFixed(0)}k - $${(result.salary.max / 1000).toFixed(0)}k`
                    : career.salaryRange || 'Varies'
                  }
                </span>
              </div>

              {/* Required Skills */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Required Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {(result.requiredSkills || career.requiredSkills).map(s => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
                </div>
              </div>

              {/* Roadmap Phases */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Learning Roadmap</p>
                <div className="space-y-3">
                  {roadmap.map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          i === 0 ? 'bg-primary text-primary-foreground' : i === 1 ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'
                        }`}>{i + 1}</div>
                        {i < roadmap.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                      </div>
                      <div className="flex-1 pb-3">
                        <p className="text-sm font-medium">{step.phase}: {step.title}</p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Duration: {step.duration}</p>
                        
                        {/* Skills */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {step.skills.map(s => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                        </div>

                        {/* AI-Enhanced: Resources */}
                        {step.resources && step.resources.length > 0 && (
                          <div className="mt-2">
                            <p className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1 mb-1">
                              <BookOpen className="w-3 h-3" />Resources
                            </p>
                            <ul className="text-[10px] text-muted-foreground space-y-0.5">
                              {step.resources.map((r, idx) => <li key={idx}>• {r}</li>)}
                            </ul>
                          </div>
                        )}

                        {/* AI-Enhanced: Projects */}
                        {step.projects && step.projects.length > 0 && (
                          <div className="mt-2">
                            <p className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1 mb-1">
                              <FolderKanban className="w-3 h-3" />Projects
                            </p>
                            <ul className="text-[10px] text-muted-foreground space-y-0.5">
                              {step.projects.map((p, idx) => <li key={idx}>• {p}</li>)}
                            </ul>
                          </div>
                        )}

                        {/* AI-Enhanced: Milestones */}
                        {step.milestones && step.milestones.length > 0 && (
                          <div className="mt-2">
                            <p className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1 mb-1">
                              <Target className="w-3 h-3" />Milestones
                            </p>
                            <ul className="text-[10px] text-muted-foreground space-y-0.5">
                              {step.milestones.map((m, idx) => <li key={idx}>✓ {m}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications & Courses */}
              {(career.certifications || career.courses) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {career.certifications && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Award className="w-3 h-3" />Certifications
                      </p>
                      <ul className="text-xs space-y-1">
                        {career.certifications.map(c => <li key={c} className="text-muted-foreground">• {c}</li>)}
                      </ul>
                    </div>
                  )}
                  {career.courses && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />Courses
                      </p>
                      <ul className="text-xs space-y-1">
                        {career.courses.map(c => <li key={c} className="text-muted-foreground">• {c}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, BookOpen, Award, Clock, DollarSign } from 'lucide-react';
import { careerPaths } from '@/data/mockData';
import { generateRoadmap } from '@/features/student/careerEngine';

export default function StudentRoadmap() {
  const user = useAuthStore((s) => s.user)!;
  const navigate = useNavigate();

  const storageKey = `career-results-${user.id}`;
  const savedResults = localStorage.getItem(storageKey);

  if (!savedResults) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-muted-foreground">No career results found.</p>
        <Button onClick={() => navigate('/student/questionnaire')}>Take Questionnaire</Button>
      </div>
    );
  }

  const results: { title: string; matchScore: number; careerId: string }[] = JSON.parse(savedResults);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/student')}>
          <ArrowLeft className="w-4 h-4 mr-1" />Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Your Career Roadmap</h1>
          <p className="text-muted-foreground text-sm mt-1">Personalized learning paths based on your results</p>
        </div>
      </div>

      {results.map((result, idx) => {
        const career = careerPaths.find(c => c.id === result.careerId);
        if (!career) return null;
        const roadmap = generateRoadmap(career);

        return (
          <Card key={career.id} className={idx === 0 ? 'border-primary/30' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {idx === 0 && <Badge className="text-[10px]">Top Match</Badge>}
                    {career.title}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{career.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">{result.matchScore}%</p>
                  <p className="text-[10px] text-muted-foreground">match</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{career.timeline}</span>
                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{career.salaryRange}</span>
              </div>

              {/* Required Skills */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Required Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {career.requiredSkills.map(s => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
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
                        <div className="flex flex-wrap gap-1 mt-1">
                          {step.skills.map(s => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications & Courses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1"><Award className="w-3 h-3" />Certifications</p>
                  <ul className="text-xs space-y-1">
                    {career.certifications.map(c => <li key={c} className="text-muted-foreground">• {c}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1"><BookOpen className="w-3 h-3" />Courses</p>
                  <ul className="text-xs space-y-1">
                    {career.courses.map(c => <li key={c} className="text-muted-foreground">• {c}</li>)}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

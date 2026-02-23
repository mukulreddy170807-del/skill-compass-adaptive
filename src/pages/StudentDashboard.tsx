import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, Compass, BookOpen, CheckCircle } from 'lucide-react';
import { AIGuidance } from '@/components/AIGuidance';

export default function StudentDashboard() {
  const user = useAuthStore((s) => s.user)!;
  const navigate = useNavigate();

  // Check if student has completed questionnaire (stored in localStorage)
  const storageKey = `career-results-${user.id}`;
  const savedResults = localStorage.getItem(storageKey);
  const hasResults = !!savedResults;

  let topCareers: { title: string; matchScore: number }[] = [];
  if (hasResults) {
    try {
      const parsed = JSON.parse(savedResults!);
      topCareers = parsed.slice(0, 3);
    } catch { /* ignore */ }
  }

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
          <p className="text-muted-foreground text-sm mt-1">Your personalized AI-powered career guidance hub</p>
        </div>

        {!hasResults ? (
          <Card className="border-dashed border-2 border-primary/30">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <Compass className="w-12 h-12 text-primary/60" />
              <div>
                <h2 className="text-lg font-semibold">Discover Your Career Path</h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">Take our AI-powered career questionnaire to get personalized career recommendations and a learning roadmap.</p>
              </div>
              <Button onClick={() => navigate('/student/questionnaire')}>
                <GraduationCap className="w-4 h-4 mr-2" />Start Questionnaire
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="stat-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><GraduationCap className="w-5 h-5 text-primary" /></div>
                <div><p className="text-2xl font-bold">{topCareers.length}</p><p className="text-xs text-muted-foreground">Top Matches</p></div>
              </div>
            </div>
            <div className="stat-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-accent" /></div>
                <div><p className="text-2xl font-bold">{topCareers[0]?.matchScore || 0}%</p><p className="text-xs text-muted-foreground">Best Match Score</p></div>
              </div>
            </div>
            <div className="stat-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center"><BookOpen className="w-5 h-5 text-success" /></div>
                <div><p className="text-2xl font-bold">Ready</p><p className="text-xs text-muted-foreground">Roadmap Available</p></div>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Your Career Matches</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {topCareers.map((c, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-md border border-border">
                  <span className="text-lg font-bold text-primary w-8">#{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{c.title}</p>
                    <Progress value={c.matchScore} className="h-1.5 mt-1" />
                  </div>
                  <Badge variant={c.matchScore >= 70 ? 'default' : 'secondary'} className="text-xs">{c.matchScore}% match</Badge>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/student/roadmap')}>View Full Roadmap</Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/student/questionnaire')}>Retake Questionnaire</Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
      </div>

      {/* Floating AI Assistant */}
      <AIGuidance 
        context="student career dashboard"
        userProgress={{ hasResults, topCareers }}
        compact={true}
      />
    </>
  );
}

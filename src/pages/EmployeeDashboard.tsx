import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, BookOpen, Award, TrendingUp } from 'lucide-react';
import { employeeSkills, skills, employeeCourses, courses, employeeCertifications, certifications, assessmentHistory } from '@/data/mockData';
import { SKILL_LEVEL_LABELS } from '@/types';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function EmployeeDashboard() {
  const user = useAuthStore((s) => s.user)!;

  const mySkills = employeeSkills[user.id] || [];
  const myCourses = employeeCourses.filter((c) => c.employeeId === user.id);
  const myCerts = employeeCertifications.filter((c) => c.employeeId === user.id);
  const myAssessments = assessmentHistory.filter((a) => a.employeeId === user.id);

  const completedCourses = myCourses.filter((c) => c.status === 'completed').length;
  const avgScore = myAssessments.length > 0 ? Math.round(myAssessments.reduce((sum, a) => sum + a.score, 0) / myAssessments.length) : 0;

  const radarData = mySkills.map((es) => {
    const skill = skills.find((s) => s.id === es.skillId);
    return { skill: skill?.name || '', score: es.score, fullMark: 100 };
  });

  const trendData = myAssessments
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((a) => {
      const skill = skills.find((s) => s.id === a.skillId);
      return { date: a.date.slice(5), score: a.score, skill: skill?.name || '' };
    });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user.name.split(' ')[0]}</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's your skill development overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mySkills.length}</p>
              <p className="text-xs text-muted-foreground">Skills Tracked</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{avgScore}%</p>
              <p className="text-xs text-muted-foreground">Avg Assessment Score</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedCourses}</p>
              <p className="text-xs text-muted-foreground">Courses Completed</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{myCerts.length}</p>
              <p className="text-xs text-muted-foreground">Certifications</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Skill Radar</CardTitle>
          </CardHeader>
          <CardContent>
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="Score" dataKey="score" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground py-10 text-center">No skills data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Score Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Assessment Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground py-10 text-center">No assessments yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Skills List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Skill Proficiency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mySkills.map((es) => {
              const skill = skills.find((s) => s.id === es.skillId);
              const gapExists = es.level !== es.targetLevel;
              return (
                <div key={es.skillId} className="flex items-center gap-4">
                  <div className="w-28 flex-shrink-0">
                    <p className="text-sm font-medium">{skill?.name}</p>
                    <p className="text-[10px] text-muted-foreground">{skill?.category}</p>
                  </div>
                  <div className="flex-1">
                    <Progress value={es.score} className="h-2" />
                  </div>
                  <Badge variant={gapExists ? 'destructive' : 'default'} className="text-[10px] w-24 justify-center">
                    {SKILL_LEVEL_LABELS[es.level]}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground w-20 text-right">
                    Target: {SKILL_LEVEL_LABELS[es.targetLevel]}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Active Courses */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Active Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myCourses.filter((c) => c.status === 'in-progress').map((ec) => {
              const course = courses.find((c) => c.id === ec.courseId);
              return (
                <div key={ec.courseId} className="flex items-center gap-4 p-3 rounded-md border border-border">
                  <BookOpen className="w-4 h-4 text-accent flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{course?.title}</p>
                    <p className="text-[10px] text-muted-foreground">{course?.provider} · {course?.duration}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Progress value={ec.progress} className="h-1.5 w-20" />
                    <span className="text-xs font-medium text-muted-foreground">{ec.progress}%</span>
                  </div>
                </div>
              );
            })}
            {myCourses.filter((c) => c.status === 'in-progress').length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No active courses</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

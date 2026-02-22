import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { users, employeeSkills, skills, assessmentHistory, jobRoles } from '@/data/mockData';
import { SKILL_LEVEL_LABELS, SKILL_LEVEL_VALUES } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function ManagerDashboard() {
  const user = useAuthStore((s) => s.user)!;
  const teamMembers = users.filter((u) => u.role === 'employee' && u.department === user.department);

  const teamSkillData: Record<string, number[]> = {};
  teamMembers.forEach((member) => {
    const memberSkills = employeeSkills[member.id] || [];
    memberSkills.forEach((es) => {
      const skill = skills.find((s) => s.id === es.skillId);
      if (skill) {
        if (!teamSkillData[skill.name]) teamSkillData[skill.name] = [];
        teamSkillData[skill.name].push(es.score);
      }
    });
  });

  const avgSkillData = Object.entries(teamSkillData).map(([name, scores]) => ({
    skill: name,
    avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
  }));

  const skillGaps = teamMembers.flatMap((member) => {
    const memberSkills = employeeSkills[member.id] || [];
    return memberSkills
      .filter((es) => es.level !== es.targetLevel)
      .map((es) => ({
        employee: member.name,
        skill: skills.find((s) => s.id === es.skillId)?.name || '',
        current: es.level,
        target: es.targetLevel,
        gap: SKILL_LEVEL_VALUES[es.targetLevel] - SKILL_LEVEL_VALUES[es.level],
      }));
  }).sort((a, b) => b.gap - a.gap);

  const performanceData = teamMembers.map((member) => {
    const memberAssessments = assessmentHistory.filter((a) => a.employeeId === member.id);
    const avg = memberAssessments.length > 0 ? Math.round(memberAssessments.reduce((sum, a) => sum + a.score, 0) / memberAssessments.length) : 0;
    return { name: member.name.split(' ')[0], score: avg };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Team Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">{user.department} Department · {teamMembers.length} members</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="w-5 h-5 text-primary" /></div>
            <div><p className="text-2xl font-bold">{teamMembers.length}</p><p className="text-xs text-muted-foreground">Team Members</p></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center"><Target className="w-5 h-5 text-accent" /></div>
            <div><p className="text-2xl font-bold">{avgSkillData.length}</p><p className="text-xs text-muted-foreground">Skills Tracked</p></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-warning" /></div>
            <div><p className="text-2xl font-bold">{skillGaps.length}</p><p className="text-xs text-muted-foreground">Skill Gaps</p></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Team Skill Overview</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={avgSkillData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Avg Score" dataKey="avgScore" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Performance Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Skill Gap Analysis</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {skillGaps.slice(0, 8).map((gap, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-md border border-border">
                <div className="w-28 flex-shrink-0">
                  <p className="text-sm font-medium">{gap.employee}</p>
                </div>
                <div className="w-24 flex-shrink-0">
                  <p className="text-sm">{gap.skill}</p>
                </div>
                <Badge variant="outline" className="text-[10px]">{SKILL_LEVEL_LABELS[gap.current]}</Badge>
                <span className="text-muted-foreground text-xs">→</span>
                <Badge className="text-[10px]">{SKILL_LEVEL_LABELS[gap.target]}</Badge>
                <div className="flex-1">
                  <Progress value={100 - gap.gap} className="h-1.5" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

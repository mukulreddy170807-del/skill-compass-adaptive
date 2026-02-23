import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { employeeSkills, skills, assessmentHistory, getEmployeesForManager } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

export default function ManagerAnalyticsPage() {
  const user = useAuthStore((s) => s.user)!;
  const teamMembers = getEmployeesForManager(user.id);

  // Team assessment trend
  const months = ['10', '11', '12', '01'];
  const trendData = months.map((m) => {
    const assessments = assessmentHistory.filter((a) => {
      const emp = teamMembers.find((tm) => tm.id === a.employeeId);
      return emp && a.date.includes(`-${m}-`);
    });
    const avg = assessments.length > 0 ? Math.round(assessments.reduce((s, a) => s + a.score, 0) / assessments.length) : 0;
    return { month: `2025-${m}`, avgScore: avg, assessments: assessments.length };
  });

  // Skill breakdown
  const skillBreakdown: Record<string, { total: number; count: number }> = {};
  teamMembers.forEach((m) => {
    (employeeSkills[m.id] || []).forEach((es) => {
      const skill = skills.find((s) => s.id === es.skillId);
      if (skill) {
        if (!skillBreakdown[skill.name]) skillBreakdown[skill.name] = { total: 0, count: 0 };
        skillBreakdown[skill.name].total += es.score;
        skillBreakdown[skill.name].count += 1;
      }
    });
  });
  const skillData = Object.entries(skillBreakdown).map(([name, d]) => ({
    skill: name,
    avgScore: Math.round(d.total / d.count),
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Team Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">{user.department} Department Performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Assessment Score Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="avgScore" stroke="hsl(var(--primary))" strokeWidth={2} name="Avg Score" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Skill Proficiency Breakdown</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={skillData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="skill" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="avgScore" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Avg Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

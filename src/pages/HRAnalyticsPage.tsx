import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { users, employeeSkills, skills, departments, employeeCertifications, certifications, assessmentHistory } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';

const COLORS = ['hsl(220, 70%, 25%)', 'hsl(175, 65%, 38%)', 'hsl(38, 92%, 50%)', 'hsl(152, 60%, 40%)', 'hsl(340, 65%, 55%)'];

export default function HRAnalyticsPage() {
  const employees = users.filter((u) => u.role === 'employee');

  // Department distribution
  const deptData = departments.map((d) => ({
    name: d.name,
    value: employees.filter((e) => e.department === d.name).length,
  }));

  // Skill level distribution across org
  const levelDist = { beginner: 0, intermediate: 0, advanced: 0, expert: 0 };
  Object.values(employeeSkills).forEach((es) => {
    es.forEach((s) => { levelDist[s.level]++; });
  });
  const levelData = Object.entries(levelDist).map(([level, count]) => ({
    level: level.charAt(0).toUpperCase() + level.slice(1),
    count,
  }));

  // Assessment volume trend
  const monthlyAssessments: Record<string, number> = {};
  assessmentHistory.forEach((a) => {
    const month = a.date.slice(0, 7);
    monthlyAssessments[month] = (monthlyAssessments[month] || 0) + 1;
  });
  const assessmentTrend = Object.entries(monthlyAssessments)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Organization Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Company-wide performance insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Employees by Department</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={deptData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Skill Level Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={levelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="level" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Assessment Volume Trend</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={assessmentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} name="Assessments" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

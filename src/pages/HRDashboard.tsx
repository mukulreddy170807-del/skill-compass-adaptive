import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Award, Target, ShieldCheck } from 'lucide-react';
import { users, employeeSkills, skills, employeeCertifications, certifications, departments } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const CHART_COLORS = ['hsl(220, 70%, 25%)', 'hsl(175, 65%, 38%)', 'hsl(38, 92%, 50%)', 'hsl(152, 60%, 40%)', 'hsl(340, 65%, 55%)'];

export default function HRDashboard() {
  const employees = users.filter((u) => u.role === 'employee');
  const totalCerts = employeeCertifications.length;
  const activeCerts = employeeCertifications.filter((ec) => {
    const cert = certifications.find((c) => c.id === ec.certificationId);
    return cert && cert.status === 'active';
  }).length;
  const expiredCerts = totalCerts - activeCerts;

  // Skill coverage by department
  const deptSkillData = departments.map((dept) => {
    const deptEmployees = employees.filter((e) => e.department === dept.name);
    const totalSkills = deptEmployees.reduce((sum, e) => sum + (employeeSkills[e.id]?.length || 0), 0);
    const avgScore = deptEmployees.length > 0
      ? Math.round(deptEmployees.reduce((sum, e) => {
          const es = employeeSkills[e.id] || [];
          return sum + (es.length > 0 ? es.reduce((s, sk) => s + sk.score, 0) / es.length : 0);
        }, 0) / deptEmployees.length)
      : 0;
    return { department: dept.name, avgScore, employees: deptEmployees.length, skills: totalSkills };
  });

  // Cert compliance pie
  const certPieData = [
    { name: 'Active', value: activeCerts },
    { name: 'Expired/Expiring', value: expiredCerts },
  ];

  // Skill distribution across org
  const skillDistribution: Record<string, number> = {};
  Object.values(employeeSkills).forEach((empSkills) => {
    empSkills.forEach((es) => {
      const skill = skills.find((s) => s.id === es.skillId);
      if (skill) {
        skillDistribution[skill.name] = (skillDistribution[skill.name] || 0) + 1;
      }
    });
  });
  const skillBarData = Object.entries(skillDistribution)
    .map(([name, count]) => ({ skill: name, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">HR Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Organization-wide skill analytics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="w-5 h-5 text-primary" /></div>
            <div><p className="text-2xl font-bold">{employees.length}</p><p className="text-xs text-muted-foreground">Total Employees</p></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center"><Target className="w-5 h-5 text-accent" /></div>
            <div><p className="text-2xl font-bold">{skills.length}</p><p className="text-xs text-muted-foreground">Skills Tracked</p></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center"><Award className="w-5 h-5 text-success" /></div>
            <div><p className="text-2xl font-bold">{totalCerts}</p><p className="text-xs text-muted-foreground">Certifications</p></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-warning" /></div>
            <div><p className="text-2xl font-bold">{Math.round((activeCerts / Math.max(totalCerts, 1)) * 100)}%</p><p className="text-xs text-muted-foreground">Cert Compliance</p></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Avg Skill Score by Department</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={deptSkillData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="department" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="avgScore" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Certification Compliance</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={certPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {certPieData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Skill Coverage Across Organization</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillBarData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis type="category" dataKey="skill" width={100} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

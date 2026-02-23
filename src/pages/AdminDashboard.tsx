import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, GraduationCap, Shield, BookOpen, Award, ClipboardCheck, TrendingUp } from 'lucide-react';
import { users, getAllManagers, getAllEmployees, getAllStudents, getEmployeesForManager } from '@/data/mockData';
import { useUserStore } from '@/store/userStore';
import { useCourseStore } from '@/store/courseStore';
import { useCertificationStore } from '@/store/certificationStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const dynamicUsers = useUserStore((s) => s.dynamicUsers); // Subscribe to user changes
  const managers = getAllManagers();
  const employees = getAllEmployees();
  const students = getAllStudents();
  const { courses: allCourses } = useCourseStore();
  const { certifications: allCertifications } = useCertificationStore();

  const empPerManager = managers.map(m => ({
    name: m.name.split(' ')[0],
    employees: getEmployeesForManager(m.id).length,
  }));

  // Calculate learning metrics
  const totalCoursesAssigned = allCourses.length;
  const completedCourses = allCourses.filter((c) => c.status === 'completed');
  const assessmentsCompleted = allCourses.filter((c) => c.assessmentCompleted);
  const avgAssessmentScore = assessmentsCompleted.length > 0
    ? Math.round(
        assessmentsCompleted
          .filter((c) => c.assessmentScore)
          .reduce((sum, c) => sum + (c.assessmentScore || 0), 0) / assessmentsCompleted.length
      )
    : 0;
  const totalCertifications = allCertifications.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">System overview & user management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Shield className="w-5 h-5 text-primary" /></div>
            <div><p className="text-2xl font-bold">{managers.length}</p><p className="text-xs text-muted-foreground">Managers</p></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center"><Users className="w-5 h-5 text-accent" /></div>
            <div><p className="text-2xl font-bold">{employees.length}</p><p className="text-xs text-muted-foreground">Employees</p></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center"><GraduationCap className="w-5 h-5 text-success" /></div>
            <div><p className="text-2xl font-bold">{students.length}</p><p className="text-xs text-muted-foreground">Students</p></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center"><UserCheck className="w-5 h-5 text-warning" /></div>
            <div><p className="text-2xl font-bold">{users.length}</p><p className="text-xs text-muted-foreground">Total Users</p></div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Employees per Manager</CardTitle></CardHeader>
        <CardContent>
          {empPerManager.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={empPerManager}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="employees" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
              No managers available yet
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Learning & Development Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalCoursesAssigned}</p>
                  <p className="text-xs text-muted-foreground">Courses Assigned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{assessmentsCompleted.length}</p>
                  <p className="text-xs text-muted-foreground">Assessments Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{avgAssessmentScore}%</p>
                  <p className="text-xs text-muted-foreground">Avg Assessment Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalCertifications}</p>
                  <p className="text-xs text-muted-foreground">Certifications Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {completedCourses.length > 0 && (
        <Card className="border-accent/30">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">{completedCourses.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Courses Completed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-success">
                  {Math.round((completedCourses.length / totalCoursesAssigned) * 100)}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">Completion Rate</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-warning">{totalCertifications}</p>
                <p className="text-sm text-muted-foreground mt-1">Professional Certifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

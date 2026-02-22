import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { users, employeeSkills, skills, employeeCertifications, certifications } from '@/data/mockData';

export default function HREmployeesPage() {
  const employees = users.filter((u) => u.role === 'employee');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">All Employees</h1>
        <p className="text-muted-foreground text-sm mt-1">{employees.length} employees across all departments</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Department</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Skills</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Avg Score</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Certs</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => {
                  const es = employeeSkills[emp.id] || [];
                  const avg = es.length > 0 ? Math.round(es.reduce((s, e) => s + e.score, 0) / es.length) : 0;
                  const certs = employeeCertifications.filter((c) => c.employeeId === emp.id).length;
                  return (
                    <tr key={emp.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">{emp.avatar}</div>
                          <div>
                            <p className="font-medium text-sm">{emp.name}</p>
                            <p className="text-[10px] text-muted-foreground">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3"><Badge variant="secondary" className="text-[10px]">{emp.department}</Badge></td>
                      <td className="p-3 text-center">{es.length}</td>
                      <td className="p-3 text-center">
                        <span className={`font-medium ${avg >= 70 ? 'text-success' : avg >= 50 ? 'text-warning' : 'text-destructive'}`}>{avg}%</span>
                      </td>
                      <td className="p-3 text-center">{certs}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

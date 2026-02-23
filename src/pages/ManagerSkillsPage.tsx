import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { employeeSkills, skills, getEmployeesForManager } from '@/data/mockData';
import { SKILL_LEVEL_LABELS } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';

export default function ManagerSkillsPage() {
  const user = useAuthStore((s) => s.user)!;
  const dynamicUsers = useUserStore((s) => s.dynamicUsers); // Subscribe to user changes
  const teamMembers = getEmployeesForManager(user.id);

  // Build heatmap data: rows = employees, columns = skills
  const allSkillIds = new Set<string>();
  teamMembers.forEach((m) => {
    (employeeSkills[m.id] || []).forEach((es) => allSkillIds.add(es.skillId));
  });
  const skillList = Array.from(allSkillIds).map((id) => skills.find((s) => s.id === id)!).filter(Boolean);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Team Skills</h1>
        <p className="text-muted-foreground text-sm mt-1">{user.department} · Skill Heatmap</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Skill Heatmap</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left p-2 font-medium text-muted-foreground">Employee</th>
                {skillList.map((s) => (
                  <th key={s.id} className="text-center p-2 font-medium text-muted-foreground whitespace-nowrap">{s.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => {
                const ms = employeeSkills[member.id] || [];
                return (
                  <tr key={member.id} className="border-t border-border">
                    <td className="p-2 font-medium">{member.name}</td>
                    {skillList.map((skill) => {
                      const es = ms.find((s) => s.skillId === skill.id);
                      const score = es?.score || 0;
                      let bg = 'bg-muted';
                      if (score >= 80) bg = 'bg-success/20';
                      else if (score >= 60) bg = 'bg-accent/20';
                      else if (score >= 40) bg = 'bg-warning/20';
                      else if (score > 0) bg = 'bg-destructive/20';
                      return (
                        <td key={skill.id} className="p-2 text-center">
                          {score > 0 ? (
                            <span className={`inline-block px-2 py-1 rounded text-[10px] font-medium ${bg}`}>
                              {score}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

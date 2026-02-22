import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { employeeSkills, skills, jobRoles } from '@/data/mockData';
import { SKILL_LEVEL_LABELS, SKILL_LEVEL_VALUES } from '@/types';

export default function SkillsPage() {
  const user = useAuthStore((s) => s.user)!;
  const mySkills = employeeSkills[user.id] || [];
  const myJobRole = jobRoles.find((r) => r.id === user.jobRole);

  const requiredSkills = myJobRole?.requiredSkills || [];
  const gapAnalysis = requiredSkills.map((req) => {
    const current = mySkills.find((s) => s.skillId === req.skillId);
    const skill = skills.find((s) => s.id === req.skillId);
    const currentValue = current ? SKILL_LEVEL_VALUES[current.level] : 0;
    const requiredValue = SKILL_LEVEL_VALUES[req.requiredLevel];
    return {
      skill: skill?.name || '',
      category: skill?.category || '',
      currentLevel: current?.level || 'beginner',
      requiredLevel: req.requiredLevel,
      currentScore: current?.score || 0,
      gap: Math.max(0, requiredValue - currentValue),
      hasGap: currentValue < requiredValue,
    };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">My Skills</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Role: {myJobRole?.title || 'N/A'} · {mySkills.length} skills tracked
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Skill Gap Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gapAnalysis.map((item) => (
              <div key={item.skill} className="p-4 rounded-md border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{item.skill}</p>
                    <p className="text-[10px] text-muted-foreground">{item.category}</p>
                  </div>
                  <Badge variant={item.hasGap ? 'destructive' : 'default'} className="text-[10px]">
                    {item.hasGap ? 'Gap' : 'Met'}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                      <span>Current: {SKILL_LEVEL_LABELS[item.currentLevel as keyof typeof SKILL_LEVEL_LABELS]}</span>
                      <span>Required: {SKILL_LEVEL_LABELS[item.requiredLevel]}</span>
                    </div>
                    <div className="relative">
                      <Progress value={item.currentScore} className="h-2" />
                      <div
                        className="absolute top-0 h-2 border-r-2 border-dashed border-foreground/30"
                        style={{ left: `${SKILL_LEVEL_VALUES[item.requiredLevel]}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-mono font-medium w-12 text-right">{item.currentScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">All Tracked Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mySkills.map((es) => {
              const skill = skills.find((s) => s.id === es.skillId);
              return (
                <div key={es.skillId} className="p-3 rounded-md border border-border flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{skill?.name}</p>
                    <p className="text-[10px] text-muted-foreground">Last assessed: {es.lastAssessed}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] flex-shrink-0">
                    {SKILL_LEVEL_LABELS[es.level]}
                  </Badge>
                  <span className="text-sm font-mono font-medium">{es.score}%</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

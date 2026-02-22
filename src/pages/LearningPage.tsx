import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, ExternalLink } from 'lucide-react';
import { employeeCourses, courses, employeeSkills, skills } from '@/data/mockData';
import { SKILL_LEVEL_LABELS } from '@/types';

export default function LearningPage() {
  const user = useAuthStore((s) => s.user)!;
  const myCourses = employeeCourses.filter((c) => c.employeeId === user.id);
  const mySkills = employeeSkills[user.id] || [];

  // Recommendations: courses for skills where user has gaps
  const weakSkills = mySkills.filter((es) => es.score < 60);
  const recommendedCourses = courses.filter((c) =>
    weakSkills.some((ws) => ws.skillId === c.skillId) &&
    !myCourses.some((mc) => mc.courseId === c.id)
  );

  const activeCourses = myCourses.filter((c) => c.status === 'in-progress');
  const completedCourses = myCourses.filter((c) => c.status === 'completed');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Learning Path</h1>
        <p className="text-muted-foreground text-sm mt-1">Personalized courses and recommendations</p>
      </div>

      {recommendedCourses.length > 0 && (
        <Card className="border-accent/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Recommended for You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recommendedCourses.map((course) => {
                const skill = skills.find((s) => s.id === course.skillId);
                return (
                  <div key={course.id} className="p-4 rounded-md border border-border space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{course.title}</p>
                        <p className="text-[10px] text-muted-foreground">{course.provider} · {course.duration}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] flex-shrink-0 ml-2">{SKILL_LEVEL_LABELS[course.level]}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge className="text-[10px] bg-accent/10 text-accent border-0">{skill?.name}</Badge>
                      <Button size="sm" variant="outline" className="text-xs h-7">
                        Enroll <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">In Progress ({activeCourses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeCourses.map((ec) => {
              const course = courses.find((c) => c.id === ec.courseId);
              return (
                <div key={ec.courseId} className="flex items-center gap-4 p-3 rounded-md border border-border">
                  <BookOpen className="w-5 h-5 text-accent flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{course?.title}</p>
                    <p className="text-[10px] text-muted-foreground">{course?.provider} · Started {ec.startedDate}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Progress value={ec.progress} className="h-1.5 w-24" />
                    <span className="text-xs font-medium w-10 text-right">{ec.progress}%</span>
                  </div>
                </div>
              );
            })}
            {activeCourses.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No courses in progress</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Completed ({completedCourses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {completedCourses.map((ec) => {
              const course = courses.find((c) => c.id === ec.courseId);
              return (
                <div key={ec.courseId} className="flex items-center gap-4 p-3 rounded-md border border-border">
                  <BookOpen className="w-5 h-5 text-success flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{course?.title}</p>
                    <p className="text-[10px] text-muted-foreground">{course?.provider} · Completed {ec.completedDate}</p>
                  </div>
                  <Badge className="text-[10px]">Complete</Badge>
                </div>
              );
            })}
            {completedCourses.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No completed courses yet</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

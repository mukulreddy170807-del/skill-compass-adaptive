import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCourseStore } from '@/store/courseStore';
import { useCertificationStore } from '@/store/certificationStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, UserPlus, CheckCircle, Clock, Award, TrendingUp } from 'lucide-react';
import { courses, skills, getEmployeesForManager } from '@/data/mockData';
import { SKILL_LEVEL_LABELS } from '@/types';
import type { Course } from '@/types';

export default function ManagerCoursesPage() {
  const user = useAuthStore((s) => s.user)!;
  const { courses: allCourses, addCourse } = useCourseStore();
  const { certifications: allCertifications } = useCertificationStore();
  const teamMembers = getEmployeesForManager(user.id);
  
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const handleAssignCourse = () => {
    if (!selectedEmployee || !selectedCourse) return;

    const newAssignment = {
      courseId: selectedCourse,
      employeeId: selectedEmployee,
      progress: 0,
      startedDate: new Date().toISOString().split('T')[0],
      status: 'not-started' as const,
      assignedBy: user.id,
      assignedDate: new Date().toISOString().split('T')[0],
      assessmentCompleted: false,
      certificationEligible: false,
    };

    addCourse(newAssignment);
    setIsAssignDialogOpen(false);
    setSelectedEmployee('');
    setSelectedCourse('');
  };

  // Get courses assigned by this manager
  const managerAssignedCourses = allCourses.filter(
    (ec) => ec.assignedBy === user.id
  );

  // Get certifications earned by team members
  const teamMemberIds = teamMembers.map((m) => m.id);
  const teamCertifications = allCertifications.filter((cert) => 
    teamMemberIds.includes(cert.employeeId)
  );

  // Calculate average completion percentage
  const completedCourses = managerAssignedCourses.filter((c) => c.status === 'completed');
  const avgScore = completedCourses.length > 0
    ? Math.round(
        completedCourses
          .filter((c) => c.assessmentCompleted && c.assessmentScore)
          .reduce((sum, c) => sum + (c.assessmentScore || 0), 0) /
        completedCourses.filter((c) => c.assessmentCompleted).length
      )
    : 0;

  // Group by employee
  const coursesByEmployee: Record<string, typeof allCourses> = {};
  teamMembers.forEach((member) => {
    coursesByEmployee[member.id] = managerAssignedCourses.filter(
      (ec) => ec.employeeId === member.id
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="text-[10px] bg-success/20 text-success border-0">Completed</Badge>;
      case 'in-progress':
        return <Badge className="text-[10px] bg-accent/20 text-accent border-0">In Progress</Badge>;
      default:
        return <Badge className="text-[10px] bg-muted text-muted-foreground border-0">Not Started</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Course Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Assign courses to your team members</p>
        </div>
        
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Assign Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Course to Employee</DialogTitle>
              <DialogDescription>
                Select an employee and a course to assign
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Employee</label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Course</label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => {
                      const skill = skills.find((s) => s.id === course.skillId);
                      return (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title} ({skill?.name})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {selectedCourse && (
                <Card className="border-accent/20">
                  <CardContent className="pt-4">
                    {(() => {
                      const course = courses.find((c) => c.id === selectedCourse);
                      const skill = skills.find((s) => s.id === course?.skillId);
                      return course ? (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">{course.title}</p>
                          <p className="text-xs text-muted-foreground">{course.description}</p>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline" className="text-[10px]">{skill?.name}</Badge>
                            <Badge variant="outline" className="text-[10px]">{SKILL_LEVEL_LABELS[course.level]}</Badge>
                            <Badge variant="outline" className="text-[10px]">{course.duration}</Badge>
                            <Badge variant="outline" className="text-[10px]">{course.provider}</Badge>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </CardContent>
                </Card>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssignCourse} disabled={!selectedEmployee || !selectedCourse}>
                Assign Course
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{managerAssignedCourses.length}</p>
                <p className="text-xs text-muted-foreground">Total Assigned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {managerAssignedCourses.filter((c) => c.status === 'in-progress').length}
                </p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {managerAssignedCourses.filter((c) => c.status === 'completed').length}
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
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
                <p className="text-2xl font-bold">{teamCertifications.length}</p>
                <p className="text-xs text-muted-foreground">Certifications Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {avgScore > 0 && (
        <Card className="border-accent/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm font-medium">Team Average Assessment Score</p>
                <p className="text-2xl font-bold text-accent">{avgScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {teamMembers.map((member) => {
        const memberCourses = coursesByEmployee[member.id] || [];
        if (memberCourses.length === 0) return null;

        return (
          <Card key={member.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{member.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{member.jobRole}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {memberCourses.map((ec) => {
                  const course = courses.find((c) => c.id === ec.courseId);
                  const skill = skills.find((s) => s.id === course?.skillId);
                  return (
                    <div
                      key={ec.courseId}
                      className="flex items-center gap-4 p-3 rounded-md border border-border"
                    >
                      <BookOpen className="w-5 h-5 text-accent flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{course?.title}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {course?.provider} · Assigned {ec.assignedDate}
                        </p>
                        {skill && (
                          <Badge variant="outline" className="text-[10px] mt-1">
                            {skill.name}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <div className="text-xs font-medium">{ec.progress}%</div>
                          {ec.assessmentCompleted && (
                            <div className="text-[10px] text-success">
                              Assessment: {ec.assessmentScore}%
                            </div>
                          )}
                          {ec.certificationEligible && (
                            <div className="flex items-center gap-1 text-[10px] text-warning">
                              <Award className="w-3 h-3" />
                              Certified
                            </div>
                          )}
                        </div>
                        {getStatusBadge(ec.status)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {managerAssignedCourses.length === 0 && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center space-y-3">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">No courses assigned yet</p>
              <Button onClick={() => setIsAssignDialogOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Assign Your First Course
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

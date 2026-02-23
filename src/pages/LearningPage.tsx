import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useCourseStore } from '@/store/courseStore';
import { useCertificationStore } from '@/store/certificationStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, ExternalLink, ClipboardCheck, Award, CheckCircle, UserCheck, Star, PlayCircle, Loader2 } from 'lucide-react';
import { CourseContentViewer } from '@/components/CourseContentViewer';
import { AIExam } from '@/components/AIExam';
import { generateAssessment, generateCertificationExam, evaluateExamResults, type GeneratedQuestion, type ExamResult } from '@/services/geminiService';
import { courses, employeeSkills, skills, certifications } from '@/data/mockData';
import { SKILL_LEVEL_LABELS } from '@/types';
import type { EmployeeCourse, Course, EmployeeCertification } from '@/types';

export default function LearningPage() {
  const user = useAuthStore((s) => s.user)!;
  const navigate = useNavigate();
  const { courses: allCourses, addCourse, updateCourse, markContentComplete } = useCourseStore();
  const { addCertification } = useCertificationStore();
  const myCourses = allCourses.filter((c) => c.employeeId === user.id);
  const mySkills = employeeSkills[user.id] || [];

  const [selectedCourse, setSelectedCourse] = useState<EmployeeCourse | null>(null);
  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false);
  const [certificationDialogOpen, setCertificationDialogOpen] = useState(false);
  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [isLoadingExam, setIsLoadingExam] = useState(false);
  const [assessmentQuestions, setAssessmentQuestions] = useState<GeneratedQuestion[]>([]);
  const [certificationQuestions, setCertificationQuestions] = useState<GeneratedQuestion[]>([]);

  // Recommendations: courses for skills where user has gaps
  const weakSkills = mySkills.filter((es) => es.score < 60);
  const recommendedCourses = courses.filter((c) =>
    weakSkills.some((ws) => ws.skillId === c.skillId) &&
    !myCourses.some((mc) => mc.courseId === c.id)
  );

  const assignedCourses = myCourses.filter((c) => c.assignedBy);
  const activeCourses = myCourses.filter((c) => c.status === 'in-progress');
  const completedCourses = myCourses.filter((c) => c.status === 'completed');

  // Simulate course enrollment
  const handleEnroll = (courseId: string) => {
    const newCourse: EmployeeCourse = {
      courseId,
      employeeId: user.id,
      progress: 0,
      startedDate: new Date().toISOString().split('T')[0],
      status: 'in-progress',
      assessmentCompleted: false,
      certificationEligible: false,
    };
    addCourse(newCourse);
  };

  // Simulate course progress update
  const handleUpdateProgress = (courseId: string, newProgress: number) => {
    updateCourse(courseId, user.id, {
      progress: newProgress,
      status: newProgress === 100 ? 'completed' : 'in-progress',
      completedDate: newProgress === 100 ? new Date().toISOString().split('T')[0] : undefined,
    });
  };

  // Handle assessment
  const handleTakeAssessment = async (course: EmployeeCourse) => {
    setSelectedCourse(course);
    setIsLoadingExam(true);
    setAssessmentDialogOpen(true);

    const courseData = courses.find((c) => c.id === course.courseId);
    const skillData = skills.find((s) => s.id === courseData?.skillId);

    try {
      const exam = await generateAssessment(
        courseData?.title || 'Course',
        skillData?.name || 'General',
        5
      );
      setAssessmentQuestions(exam.questions);
    } catch (error) {
      console.error('Failed to generate assessment:', error);
      alert('Failed to generate assessment. Please try again.');
      setAssessmentDialogOpen(false);
      setSelectedCourse(null);
    } finally {
      setIsLoadingExam(false);
    }
  };

  const handleCompleteAssessment = async (result: ExamResult, answers: number[]) => {
    if (!selectedCourse) return;

    // Get AI feedback
    const courseData = courses.find((c) => c.id === selectedCourse.courseId);
    const skillData = skills.find((s) => s.id === courseData?.skillId);

    try {
      const detailedResult = await evaluateExamResults(
        assessmentQuestions,
        answers,
        'assessment',
        70
      );

      updateCourse(selectedCourse.courseId, user.id, {
        assessmentCompleted: true,
        assessmentScore: detailedResult.percentage,
        certificationEligible: detailedResult.passed,
      });

      // Update the result state with AI feedback
      setTimeout(() => {
        setAssessmentDialogOpen(false);
        setSelectedCourse(null);
        setAssessmentQuestions([]);
      }, 5000);
    } catch (error) {
      console.error('Failed to evaluate assessment:', error);
      // Fallback: just use the basic result
      updateCourse(selectedCourse.courseId, user.id, {
        assessmentCompleted: true,
        assessmentScore: result.percentage,
        certificationEligible: result.passed,
      });
      setTimeout(() => {
        setAssessmentDialogOpen(false);
        setSelectedCourse(null);
        setAssessmentQuestions([]);
      }, 5000);
    }
  };

  // Handle certification exam
  const handleTakeCertificationExam = async (course: EmployeeCourse) => {
    setSelectedCourse(course);
    setIsLoadingExam(true);
    setCertificationDialogOpen(true);

    const courseData = courses.find((c) => c.id === course.courseId);
    const skillData = skills.find((s) => s.id === courseData?.skillId);

    try {
      const exam = await generateCertificationExam(
        courseData?.title || 'Course',
        skillData?.name || 'General',
        10
      );
      setCertificationQuestions(exam.questions);
    } catch (error) {
      console.error('Failed to generate certification exam:', error);
      alert('Failed to generate certification exam. Please try again.');
      setCertificationDialogOpen(false);
      setSelectedCourse(null);
    } finally {
      setIsLoadingExam(false);
    }
  };

  const handleCompleteCertification = async (result: ExamResult, answers: number[]) => {
    if (!selectedCourse) return;

    const courseData = courses.find((c) => c.id === selectedCourse.courseId);
    const skillData = skills.find((s) => s.id === courseData?.skillId);

    try {
      const detailedResult = await evaluateExamResults(
        certificationQuestions,
        answers,
        'certification',
        75
      );

      if (detailedResult.passed) {
        // Find an existing certification for this skill or use a generic one
        let certId = certifications.find((cert) => cert.skillId === courseData?.skillId)?.id;
        
        // If no certification exists for this skill, create a reference to a course completion cert
        if (!certId) {
          certId = `cert-course-${courseData?.id || 'unknown'}`;
        }

        // Add certification to the store
        const newCertification: EmployeeCertification = {
          certificationId: certId,
          employeeId: user.id,
          earnedDate: new Date().toISOString().split('T')[0],
          expiryDate: new Date(Date.now() + 365 * 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 years
        };
        addCertification(newCertification);
      }

      // Update course with certification attempt
      updateCourse(selectedCourse.courseId, user.id, {
        certificationEligible: detailedResult.passed,
      });

      // Keep dialog open for 10 seconds to show results
      setTimeout(() => {
        setCertificationDialogOpen(false);
        setSelectedCourse(null);
        setCertificationQuestions([]);
      }, 10000);
    } catch (error) {
      console.error('Failed to evaluate certification:', error);
      // Fallback
      if (result.passed) {
        let certId = certifications.find((cert) => cert.skillId === courseData?.skillId)?.id;
        if (!certId) {
          certId = `cert-course-${courseData?.id || 'unknown'}`;
        }

        const newCertification: EmployeeCertification = {
          certificationId: certId,
          employeeId: user.id,
          earnedDate: new Date().toISOString().split('T')[0],
          expiryDate: new Date(Date.now() + 365 * 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        };
        addCertification(newCertification);
      }
      setTimeout(() => {
        setCertificationDialogOpen(false);
        setSelectedCourse(null);
        setCertificationQuestions([]);
      }, 10000);
    }
  };

  // Handle viewing course content
  const handleViewContent = (employeeCourse: EmployeeCourse) => {
    setSelectedCourse(employeeCourse);
    setContentDialogOpen(true);
  };

  const handleContentComplete = (contentId: string) => {
    if (!selectedCourse) return;
    const courseData = courses.find((c) => c.id === selectedCourse.courseId);
    if (!courseData?.contents) return;
    markContentComplete(selectedCourse.courseId, user.id, contentId, courseData.contents.length);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Learning Path</h1>
        <p className="text-muted-foreground text-sm mt-1">Personalized courses and recommendations</p>
      </div>

      {/* Assigned Courses Section */}
      {assignedCourses.length > 0 && (
        <Card className="border-primary/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-primary" />
              Assigned by Manager
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignedCourses.map((ec) => {
                const course = courses.find((c) => c.id === ec.courseId);
                const skill = skills.find((s) => s.id === course?.skillId);
                const canTakeAssessment = ec.progress === 100 && !ec.assessmentCompleted;
                const canTakeCertification = ec.assessmentCompleted && ec.certificationEligible;

                return (
                  <div key={ec.courseId} className="p-4 rounded-md border border-border space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium">{course?.title}</p>
                          <Badge className="text-[10px] bg-primary/20 text-primary border-0">Assigned</Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          {course?.provider} · {course?.duration} · Assigned {ec.assignedDate}
                        </p>
                        {skill && (
                          <Badge variant="outline" className="text-[10px] mt-1">
                            {skill.name}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Progress</span>
                        <span className="text-xs font-medium">{ec.progress}%</span>
                      </div>
                      <Progress value={ec.progress} className="h-2" />
                    </div>

                    {ec.assessmentCompleted && (
                      <Alert className="bg-success/10 border-success/20">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <AlertDescription className="text-xs">
                          Assessment Complete: {ec.assessmentScore}%
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      {course?.contents && course.contents.length > 0 && (
                        <Button
                          size="sm"
                          variant="default"
                          className="text-xs h-7"
                          onClick={() => handleViewContent(ec)}
                        >
                          <PlayCircle className="w-3 h-3 mr-1" />
                          View Content ({course.contents.length})
                        </Button>
                      )}
                      
                      {ec.progress < 100 && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7"
                          onClick={() => handleUpdateProgress(ec.courseId, Math.min(100, ec.progress + 25))}
                        >
                          <BookOpen className="w-3 h-3 mr-1" />
                          Continue Learning (+25%)
                        </Button>
                      )}

                      {canTakeAssessment && (
                        <Button
                          size="sm"
                          className="text-xs h-7 bg-accent hover:bg-accent/90"
                          onClick={() => handleTakeAssessment(ec)}
                        >
                          <ClipboardCheck className="w-3 h-3 mr-1" />
                          Take Assessment
                        </Button>
                      )}

                      {canTakeCertification && (
                        <Button
                          size="sm"
                          className="text-xs h-7 bg-success hover:bg-success/90"
                          onClick={() => handleTakeCertificationExam(ec)}
                        >
                          <Award className="w-3 h-3 mr-1" />
                          Take Certification Exam
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Courses */}
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
              {recommendedCourses.slice(0, 4).map((course) => {
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
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7"
                        onClick={() => handleEnroll(course.id)}
                      >
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

      {/* In Progress Courses */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">In Progress ({activeCourses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeCourses.map((ec) => {
              const course = courses.find((c) => c.id === ec.courseId);
              const canTakeAssessment = ec.progress === 100 && !ec.assessmentCompleted;
              const hasContent = course?.contents && course.contents.length > 0;

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
                  {hasContent && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7"
                      onClick={() => handleViewContent(ec)}
                    >
                      <PlayCircle className="w-3 h-3 mr-1" />
                      Content
                    </Button>
                  )}
                  {canTakeAssessment && (
                    <Button
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => handleTakeAssessment(ec)}
                    >
                      <ClipboardCheck className="w-3 h-3 mr-1" />
                      Assess
                    </Button>
                  )}
                </div>
              );
            })}
            {activeCourses.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No courses in progress</p>}
          </div>
        </CardContent>
      </Card>

      {/* Completed Courses */}
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
                    {ec.assessmentCompleted && (
                      <p className="text-[10px] text-success">Assessment: {ec.assessmentScore}%</p>
                    )}
                  </div>
                  <Badge className="text-[10px]">Complete</Badge>
                </div>
              );
            })}
            {completedCourses.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No completed courses yet</p>}
          </div>
        </CardContent>
      </Card>

      {/* Assessment Dialog */}
      <Dialog open={assessmentDialogOpen} onOpenChange={(open) => {
        if (!open && !isLoadingExam) {
          setAssessmentDialogOpen(false);
          setSelectedCourse(null);
          setAssessmentQuestions([]);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI-Powered Course Assessment</DialogTitle>
            <DialogDescription>
              Complete this AI-generated assessment to validate your learning
            </DialogDescription>
          </DialogHeader>
          
          {isLoadingExam ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground">Generating AI assessment questions...</p>
              </div>
            </div>
          ) : assessmentQuestions.length > 0 && selectedCourse ? (
            <AIExam
              questions={assessmentQuestions}
              examType="assessment"
              courseName={courses.find((c) => c.id === selectedCourse.courseId)?.title || 'Course'}
              timeLimit={15}
              onComplete={handleCompleteAssessment}
              onCancel={() => {
                setAssessmentDialogOpen(false);
                setSelectedCourse(null);
                setAssessmentQuestions([]);
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Certification Exam Dialog */}
      <Dialog open={certificationDialogOpen} onOpenChange={(open) => {
        if (!open && !isLoadingExam) {
          setCertificationDialogOpen(false);
          setSelectedCourse(null);
          setCertificationQuestions([]);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI-Powered Certification Examination</DialogTitle>
            <DialogDescription>
              Complete this professional certification exam to earn your certificate
            </DialogDescription>
          </DialogHeader>
          
          {isLoadingExam ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground">Generating AI certification exam...</p>
              </div>
            </div>
          ) : certificationQuestions.length > 0 && selectedCourse ? (
            <AIExam
              questions={certificationQuestions}
              examType="certification"
              courseName={courses.find((c) => c.id === selectedCourse.courseId)?.title || 'Course'}
              timeLimit={40}
              onComplete={handleCompleteCertification}
              onCancel={() => {
                setCertificationDialogOpen(false);
                setSelectedCourse(null);
                setCertificationQuestions([]);
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Course Content Viewer Dialog */}
      <Dialog open={contentDialogOpen} onOpenChange={setContentDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedCourse && courses.find((c) => c.id === selectedCourse.courseId)?.title}
            </DialogTitle>
            <DialogDescription>
              Watch videos and complete content to track your progress
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 overflow-y-auto">
            {selectedCourse && (() => {
              const courseData = courses.find((c) => c.id === selectedCourse.courseId);
              if (!courseData?.contents) {
                return <p className="text-center text-muted-foreground">No content available for this course</p>;
              }
              return (
                <CourseContentViewer
                  contents={courseData.contents}
                  completedContents={selectedCourse.completedContents || []}
                  onContentComplete={handleContentComplete}
                />
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

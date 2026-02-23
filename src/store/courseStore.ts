import { create } from 'zustand';
import { employeeCourses as initialCourses } from '@/data/mockData';
import type { EmployeeCourse } from '@/types';

interface CourseStore {
  courses: EmployeeCourse[];
  addCourse: (course: EmployeeCourse) => void;
  updateCourse: (courseId: string, employeeId: string, updates: Partial<EmployeeCourse>) => void;
  markContentComplete: (courseId: string, employeeId: string, contentId: string, totalContents: number) => void;
  getCoursesByEmployee: (employeeId: string) => EmployeeCourse[];
  getCoursesByAssigner: (assignerId: string) => EmployeeCourse[];
}

export const useCourseStore = create<CourseStore>((set, get) => ({
  courses: initialCourses,
  
  addCourse: (course) => {
    set((state) => ({
      courses: [...state.courses, course],
    }));
  },
  
  updateCourse: (courseId, employeeId, updates) => {
    set((state) => ({
      courses: state.courses.map((c) =>
        c.courseId === courseId && c.employeeId === employeeId
          ? { ...c, ...updates }
          : c
      ),
    }));
  },
  
  markContentComplete: (courseId, employeeId, contentId, totalContents) => {
    set((state) => ({
      courses: state.courses.map((c) => {
        if (c.courseId === courseId && c.employeeId === employeeId) {
          const completedContents = c.completedContents || [];
          if (!completedContents.includes(contentId)) {
            const newCompletedContents = [...completedContents, contentId];
            const newProgress = Math.round((newCompletedContents.length / totalContents) * 100);
            return {
              ...c,
              completedContents: newCompletedContents,
              progress: newProgress,
              status: newProgress === 100 ? 'completed' : 'in-progress',
              completedDate: newProgress === 100 ? new Date().toISOString().split('T')[0] : c.completedDate,
            };
          }
        }
        return c;
      }),
    }));
  },
  
  getCoursesByEmployee: (employeeId) => {
    return get().courses.filter((c) => c.employeeId === employeeId);
  },
  
  getCoursesByAssigner: (assignerId) => {
    return get().courses.filter((c) => c.assignedBy === assignerId);
  },
}));

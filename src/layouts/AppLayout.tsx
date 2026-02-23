import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore, getRoleDashboardPath } from '@/store/authStore';
import {
  LayoutDashboard, Target, BookOpen, Award, BarChart3, Users, Settings,
  LogOut, ChevronLeft, ChevronRight, Shield, ClipboardCheck, GraduationCap, Compass, Map
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Role } from '@/types';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles: Role[];
}

const navItems: NavItem[] = [
  // Admin
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, roles: ['admin'] },
  { label: 'Managers', path: '/admin/managers', icon: Shield, roles: ['admin'] },
  { label: 'Employees', path: '/admin/employees', icon: Users, roles: ['admin'] },
  // Employee
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['employee'] },
  { label: 'My Skills', path: '/skills', icon: Target, roles: ['employee'] },
  { label: 'Assessments', path: '/assessments', icon: ClipboardCheck, roles: ['employee'] },
  { label: 'Learning', path: '/learning', icon: BookOpen, roles: ['employee'] },
  { label: 'Certifications', path: '/certifications', icon: Award, roles: ['employee'] },
  // Manager
  { label: 'Dashboard', path: '/manager', icon: LayoutDashboard, roles: ['manager'] },
  { label: 'Team Skills', path: '/manager/skills', icon: Target, roles: ['manager'] },
  { label: 'Team Analytics', path: '/manager/analytics', icon: BarChart3, roles: ['manager'] },
  // HR
  { label: 'Dashboard', path: '/hr', icon: LayoutDashboard, roles: ['hr'] },
  { label: 'Employees', path: '/hr/employees', icon: Users, roles: ['hr'] },
  { label: 'Org Analytics', path: '/hr/analytics', icon: BarChart3, roles: ['hr'] },
  { label: 'Certifications', path: '/hr/certifications', icon: Award, roles: ['hr'] },
  // Student
  { label: 'Dashboard', path: '/student', icon: LayoutDashboard, roles: ['student'] },
  { label: 'Questionnaire', path: '/student/questionnaire', icon: Compass, roles: ['student'] },
  { label: 'Roadmap', path: '/student/roadmap', icon: Map, roles: ['student'] },
];

const roleLabels: Record<Role, string> = {
  admin: 'Admin',
  employee: 'Employee',
  manager: 'Manager',
  hr: 'HR Admin',
  student: 'Student',
};

export default function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const filteredNav = navItems.filter((item) => item.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <aside
        className={`sidebar-gradient flex flex-col transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-60'
        } flex-shrink-0`}
      >
        <div className="flex items-center gap-2 px-4 h-14 border-b border-sidebar-border">
          <Shield className="w-6 h-6 text-sidebar-primary flex-shrink-0" />
          {!collapsed && <span className="font-bold text-sidebar-foreground text-sm tracking-tight">SkillTrack Pro</span>}
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {filteredNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                } ${collapsed ? 'justify-center' : ''}`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-3 space-y-2">
          {!collapsed && (
            <div className="flex items-center gap-2 px-1 mb-2">
              <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-xs font-semibold text-sidebar-primary">
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-sidebar-foreground truncate">{user.name}</p>
                <p className="text-[10px] text-sidebar-muted">{roleLabels[user.role]}</p>
              </div>
            </div>
          )}
          <div className={`flex ${collapsed ? 'flex-col items-center gap-1' : 'items-center gap-1'}`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 h-8 px-2"
            >
              <LogOut className="w-4 h-4" />
              {!collapsed && <span className="ml-2 text-xs">Logout</span>}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 h-8 px-2 ml-auto"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card">
          <div />
          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium">{roleLabels[user.role]}</span>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
              {user.avatar}
            </div>
          </div>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

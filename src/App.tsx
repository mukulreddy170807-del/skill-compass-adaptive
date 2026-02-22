import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore, getRoleDashboardPath } from "@/store/authStore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AppLayout from "@/layouts/AppLayout";
import Login from "@/pages/Login";
import EmployeeDashboard from "@/pages/EmployeeDashboard";
import ManagerDashboard from "@/pages/ManagerDashboard";
import HRDashboard from "@/pages/HRDashboard";
import AssessmentPage from "@/pages/AssessmentPage";
import SkillsPage from "@/pages/SkillsPage";
import LearningPage from "@/pages/LearningPage";
import CertificationsPage from "@/pages/CertificationsPage";
import ManagerSkillsPage from "@/pages/ManagerSkillsPage";
import ManagerAnalyticsPage from "@/pages/ManagerAnalyticsPage";
import HREmployeesPage from "@/pages/HREmployeesPage";
import HRAnalyticsPage from "@/pages/HRAnalyticsPage";
import HRCertificationsPage from "@/pages/HRCertificationsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function RootRedirect() {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  return <Navigate to={getRoleDashboardPath(user.role)} replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RootRedirect />} />

          {/* Employee routes */}
          <Route element={<ProtectedRoute allowedRoles={['employee']}><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<EmployeeDashboard />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/assessments" element={<AssessmentPage />} />
            <Route path="/learning" element={<LearningPage />} />
            <Route path="/certifications" element={<CertificationsPage />} />
          </Route>

          {/* Manager routes */}
          <Route element={<ProtectedRoute allowedRoles={['manager']}><AppLayout /></ProtectedRoute>}>
            <Route path="/manager" element={<ManagerDashboard />} />
            <Route path="/manager/skills" element={<ManagerSkillsPage />} />
            <Route path="/manager/analytics" element={<ManagerAnalyticsPage />} />
          </Route>

          {/* HR routes */}
          <Route element={<ProtectedRoute allowedRoles={['hr']}><AppLayout /></ProtectedRoute>}>
            <Route path="/hr" element={<HRDashboard />} />
            <Route path="/hr/employees" element={<HREmployeesPage />} />
            <Route path="/hr/analytics" element={<HRAnalyticsPage />} />
            <Route path="/hr/certifications" element={<HRCertificationsPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

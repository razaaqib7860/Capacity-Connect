import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TraineeDashboard } from './pages/trainee/TraineeDashboard';
import { TraineeProfilePage } from './pages/trainee/TraineeProfilePage';
import { CompetencyMatrixPage } from './pages/trainee/CompetencyMatrixPage';
import { CourseCatalogPage } from './pages/trainee/CourseCatalogPage';
import { CourseDetailPage } from './pages/trainee/CourseDetailPage';
import { AssessmentQuizPage } from './pages/trainee/AssessmentQuizPage';
import { CertificatesPage } from './pages/trainee/CertificatesPage';
import { TrainerDashboard } from './pages/trainer/TrainerDashboard';
import { TrainerApplicationPage } from './pages/trainer/TrainerApplicationPage';
import { CreateCoursePage } from './pages/trainer/CreateCoursePage';
import { CreateAssessmentPage } from './pages/trainer/CreateAssessmentPage';
import { TrainerTraineesPage } from './pages/trainer/TrainerTraineesPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminAnnouncementsPage } from './pages/admin/AdminAnnouncementsPage';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-teal-400 font-mono text-sm">Loading user session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/courses" element={<CourseCatalogPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/trainer/apply" element={
            <ProtectedRoute>
              <TrainerApplicationPage />
            </ProtectedRoute>
          } />

          {/* Trainee Protected Routes */}
          <Route path="/trainee/dashboard" element={
            <ProtectedRoute allowedRoles={['trainee', 'admin']}>
              <TraineeDashboard />
            </ProtectedRoute>
          } />
          <Route path="/trainee/profile" element={
            <ProtectedRoute allowedRoles={['trainee', 'admin']}>
              <TraineeProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/trainee/competencies" element={
            <ProtectedRoute allowedRoles={['trainee', 'admin']}>
              <CompetencyMatrixPage />
            </ProtectedRoute>
          } />
          <Route path="/trainee/certificates" element={
            <ProtectedRoute allowedRoles={['trainee', 'admin']}>
              <CertificatesPage />
            </ProtectedRoute>
          } />
          <Route path="/assessments/:id" element={
            <ProtectedRoute allowedRoles={['trainee', 'admin']}>
              <AssessmentQuizPage />
            </ProtectedRoute>
          } />

          {/* Trainer Protected Routes */}
          <Route path="/trainer/dashboard" element={
            <ProtectedRoute allowedRoles={['trainer', 'admin']}>
              <TrainerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/trainer/courses/create" element={
            <ProtectedRoute allowedRoles={['trainer', 'admin']}>
              <CreateCoursePage />
            </ProtectedRoute>
          } />
          <Route path="/trainer/assessments/create" element={
            <ProtectedRoute allowedRoles={['trainer', 'admin']}>
              <CreateAssessmentPage />
            </ProtectedRoute>
          } />
          <Route path="/trainer/trainees" element={
            <ProtectedRoute allowedRoles={['trainer', 'admin']}>
              <TrainerTraineesPage />
            </ProtectedRoute>
          } />

          {/* Admin Protected Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsersPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/announcements" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAnnouncementsPage />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import DashboardRouter from './components/Dashboard/DashboardRouter';
import ResourceList from './components/Resources/ResourceList';
import RequestList from './components/Requests/RequestList';
import AdminRequests from './components/Admin/AdminRequests';
import AdminAnalytics from './components/Admin/AdminAnalytics';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // or a spinner if you want
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user is admin (you can modify this logic based on your needs)
  const isAdmin = user.email.includes('admin');
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Main Layout Component
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// App Component
const AppContent = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardRouter />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/resources" element={
          <ProtectedRoute>
            <MainLayout>
              <ResourceList />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/requests" element={
          <ProtectedRoute>
            <MainLayout>
              <RequestList />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin/requests" element={
          <AdminRoute>
            <MainLayout>
              <AdminRequests />
            </MainLayout>
          </AdminRoute>
        } />
        
        <Route path="/admin/analytics" element={
          <AdminRoute>
            <MainLayout>
              <AdminAnalytics />
            </MainLayout>
          </AdminRoute>
        } />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </Router>
  );
};

// Root App Component with Auth Provider
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;

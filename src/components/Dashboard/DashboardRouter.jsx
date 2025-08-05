import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import FacultyDashboard from './FacultyDashboard';
import StudentDashboard from './StudentDashboard';

const DashboardRouter = () => {
  const { user, userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // If userRole is available from context, use it immediately
    if (userRole) {
      setRole(userRole);
      setLoading(false);
      return;
    }
    // If user exists but no userRole, fetch from server (fallback)
    const getRole = async () => {
      if (user?.email) {
        try {
          const res = await fetch(`http://localhost:3000/users/${user.email}`);
          if (res.ok) {
            const userData = await res.json();
            setRole(userData.role);
          }
        } catch (err) {
          setRole(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    getRole();
  }, [user, userRole]);

  if (!user) return <div>Loading...</div>;
  if (loading) return <div>Loading dashboard...</div>;
  if (!role) return <div>User role not found.</div>;
  if (role === 'admin') return <AdminDashboard />;
  if (role === 'faculty') return <FacultyDashboard />;
  return <StudentDashboard />;
};

export default DashboardRouter;
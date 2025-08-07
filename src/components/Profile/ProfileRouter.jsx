import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import FacultyProfile from './FacultyProfile';
import StudentProfile from './StudentProfile';
import AdminProfile from './AdminProfile';

const ProfileRouter = () => {
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
  if (loading) return <div>Loading profile...</div>;
  if (!role) return <div>User role not found.</div>;
  
  // Route to appropriate profile component based on role
  switch (role) {
    case 'admin':
      return <AdminProfile />;
    case 'faculty':
      return <FacultyProfile />;
    case 'student':
      return <StudentProfile />;
    default:
      return <div>Invalid user role.</div>;
  }
};

export default ProfileRouter; 
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotificationCenter from './NotificationCenter';
import { 
  BookOpen, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Settings,
  BarChart3,
  ClipboardList
} from 'lucide-react';

const Navbar = () => {
  const { user, userRole, signOutUser } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOutUser();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const getDisplayRole = () => {
    if (!userRole) return 'User';
    return userRole.charAt(0).toUpperCase() + userRole.slice(1);
  };

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </div>
          {isMenuOpen && (
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
              <li><Link to="/resources" onClick={() => setIsMenuOpen(false)}>Resources</Link></li>
              <li><Link to="/requests" onClick={() => setIsMenuOpen(false)}>My Requests</Link></li>
              <li><Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link></li>
              {userRole === 'admin' && (
                <>
                  <li><Link to="/admin/requests" onClick={() => setIsMenuOpen(false)}>Manage Requests</Link></li>
                  <li><Link to="/admin/resources" onClick={() => setIsMenuOpen(false)}>Manage Resources</Link></li>
                  <li><Link to="/admin/analytics" onClick={() => setIsMenuOpen(false)}>Analytics</Link></li>
                </>
              )}
            </ul>
          )}
        </div>
        <Link to="/dashboard" className="btn btn-ghost text-xl">
          <BookOpen className="mr-2" />
          EduResource
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/resources">Resources</Link></li>
          <li><Link to="/requests">My Requests</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          {userRole === 'admin' && (
            <>
              <li><Link to="/admin/requests">Manage Requests</Link></li>
              <li><Link to="/admin/resources">Manage Resources</Link></li>
              <li><Link to="/admin/analytics">Analytics</Link></li>
            </>
          )}
        </ul>
      </div>
      
      <div className="navbar-end">
        {/* Notification Center */}
        <NotificationCenter />
        
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img alt="User" src={user?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.displayName || 'User'}`} />
            </div>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li className="menu-title">
              <span className="text-sm font-semibold">{user?.displayName}</span>
              <span className="text-xs text-gray-500">{getDisplayRole()}</span>
            </li>
            <li><Link to="/profile"><User size={16} /> Profile</Link></li>
            <li><Link to="/settings"><Settings size={16} /> Settings</Link></li>
            <li><button onClick={handleLogout}><LogOut size={16} /> Logout</button></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar; 
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TrendingUp,
  Users,
  Package
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalResources: 45,
    availableResources: 32,
    pendingRequests: 8,
    approvedRequests: 15,
    rejectedRequests: 3,
    overdueItems: 2
  });

  const getRoleFromEmail = (email) => {
    if (email.includes('admin')) return 'Admin';
    if (email.includes('faculty')) return 'Faculty';
    return 'Student';
  };

  const userRole = user ? getRoleFromEmail(user.email) : 'Student';

  const recentRequests = [
    {
      id: 1,
      resource: 'Projector Epson EX3260',
      user: 'John Doe',
      status: 'pending',
      date: '2024-01-15',
      duration: '2 days'
    },
    {
      id: 2,
      resource: 'Laptop Dell XPS 13',
      user: 'Jane Smith',
      status: 'approved',
      date: '2024-01-14',
      duration: '1 week'
    },
    {
      id: 3,
      resource: 'Microscope Olympus',
      user: 'Mike Johnson',
      status: 'rejected',
      date: '2024-01-13',
      duration: '3 days'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'approved':
        return 'badge-success';
      case 'rejected':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.displayName || 'User'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your departmental resources today.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat bg-white shadow-lg rounded-lg p-6">
          <div className="stat-figure text-primary">
            <Package className="h-8 w-8" />
          </div>
          <div className="stat-title">Total Resources</div>
          <div className="stat-value text-primary">{stats.totalResources}</div>
          <div className="stat-desc">Available for checkout</div>
        </div>

        <div className="stat bg-white shadow-lg rounded-lg p-6">
          <div className="stat-figure text-success">
            <CheckCircle className="h-8 w-8" />
          </div>
          <div className="stat-title">Available</div>
          <div className="stat-value text-success">{stats.availableResources}</div>
          <div className="stat-desc">Ready for use</div>
        </div>

        <div className="stat bg-white shadow-lg rounded-lg p-6">
          <div className="stat-figure text-warning">
            <Clock className="h-8 w-8" />
          </div>
          <div className="stat-title">Pending Requests</div>
          <div className="stat-value text-warning">{stats.pendingRequests}</div>
          <div className="stat-desc">Awaiting approval</div>
        </div>

        <div className="stat bg-white shadow-lg rounded-lg p-6">
          <div className="stat-figure text-error">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div className="stat-title">Overdue Items</div>
          <div className="stat-value text-error">{stats.overdueItems}</div>
          <div className="stat-desc">Past due date</div>
        </div>
      </div>

      {/* Role-based Content */}
      {userRole === 'Admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Admin Quick Actions */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="btn btn-primary w-full">
                <BookOpen className="h-4 w-4 mr-2" />
                Review Pending Requests
              </button>
              <button className="btn btn-secondary w-full">
                <Package className="h-4 w-4 mr-2" />
                Add New Resource
              </button>
              <button className="btn btn-accent w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-sm">New user registration</span>
                </div>
                <span className="text-xs text-gray-500">2 min ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <Package className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Resource returned</span>
                </div>
                <span className="text-xs text-gray-500">15 min ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                  <span className="text-sm">New request submitted</span>
                </div>
                <span className="text-xs text-gray-500">1 hour ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Requests Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Recent Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Resource</th>
                <th>User</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Status</th>
                {userRole === 'Admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((request) => (
                <tr key={request.id}>
                  <td className="font-medium">{request.resource}</td>
                  <td>{request.user}</td>
                  <td>{request.date}</td>
                  <td>{request.duration}</td>
                  <td>
                    <div className="flex items-center">
                      {getStatusIcon(request.status)}
                      <span className={`badge ${getStatusColor(request.status)} ml-2`}>
                        {request.status}
                      </span>
                    </div>
                  </td>
                  {userRole === 'Admin' && (
                    <td>
                      <div className="flex space-x-2">
                        <button className="btn btn-sm btn-success">Approve</button>
                        <button className="btn btn-sm btn-error">Reject</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
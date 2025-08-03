import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart
} from 'lucide-react';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 156,
    totalResources: 45,
    totalRequests: 234,
    approvedRequests: 189,
    rejectedRequests: 23,
    pendingRequests: 22,
    averageResponseTime: '2.3 hours',
    resourceUtilization: 78,
    monthlyRequests: [45, 52, 38, 67, 89, 76, 54, 78, 65, 82, 91, 88],
    categoryDistribution: [
      { category: 'Electronics', count: 15, percentage: 33 },
      { category: 'Computers', count: 12, percentage: 27 },
      { category: 'Lab Equipment', count: 8, percentage: 18 },
      { category: 'Stationery', count: 6, percentage: 13 },
      { category: 'Other', count: 4, percentage: 9 }
    ],
    topResources: [
      { name: 'Projector Epson EX3260', requests: 23, utilization: 85 },
      { name: 'Laptop Dell XPS 13', requests: 19, utilization: 92 },
      { name: 'Microscope Olympus', requests: 15, utilization: 78 },
      { name: 'Camera Canon EOS R5', requests: 12, utilization: 65 },
      { name: '3D Printer Ultimaker', requests: 8, utilization: 45 }
    ]
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100';
      case 'rejected':
        return 'bg-red-100';
      case 'pending':
        return 'bg-yellow-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Comprehensive overview of resource management metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat bg-white shadow-lg rounded-lg p-6">
          <div className="stat-figure text-primary">
            <Users className="h-8 w-8" />
          </div>
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-primary">{analytics.totalUsers}</div>
          <div className="stat-desc">
            <TrendingUp className="h-4 w-4 text-green-500 inline mr-1" />
            +12% from last month
          </div>
        </div>

        <div className="stat bg-white shadow-lg rounded-lg p-6">
          <div className="stat-figure text-secondary">
            <Package className="h-8 w-8" />
          </div>
          <div className="stat-title">Total Resources</div>
          <div className="stat-value text-secondary">{analytics.totalResources}</div>
          <div className="stat-desc">
            <TrendingUp className="h-4 w-4 text-green-500 inline mr-1" />
            +3 new this month
          </div>
        </div>

        <div className="stat bg-white shadow-lg rounded-lg p-6">
          <div className="stat-figure text-accent">
            <BarChart3 className="h-8 w-8" />
          </div>
          <div className="stat-title">Total Requests</div>
          <div className="stat-value text-accent">{analytics.totalRequests}</div>
          <div className="stat-desc">
            <TrendingUp className="h-4 w-4 text-green-500 inline mr-1" />
            +8% from last month
          </div>
        </div>

        <div className="stat bg-white shadow-lg rounded-lg p-6">
          <div className="stat-figure text-success">
            <CheckCircle className="h-8 w-8" />
          </div>
          <div className="stat-title">Approval Rate</div>
          <div className="stat-value text-success">
            {Math.round((analytics.approvedRequests / analytics.totalRequests) * 100)}%
          </div>
          <div className="stat-desc">
            <TrendingUp className="h-4 w-4 text-green-500 inline mr-1" />
            +2% from last month
          </div>
        </div>
      </div>

      {/* Request Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Request Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${getStatusBgColor('approved')} mr-3`}></div>
                <span>Approved</span>
              </div>
              <span className="font-semibold">{analytics.approvedRequests}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${getStatusBgColor('pending')} mr-3`}></div>
                <span>Pending</span>
              </div>
              <span className="font-semibold">{analytics.pendingRequests}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${getStatusBgColor('rejected')} mr-3`}></div>
                <span>Rejected</span>
              </div>
              <span className="font-semibold">{analytics.rejectedRequests}</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Average Response Time</span>
                <span className="font-semibold">{analytics.averageResponseTime}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Resource Utilization</span>
                <span className="font-semibold">{analytics.resourceUtilization}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${analytics.resourceUtilization}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
          <div className="space-y-3">
            {analytics.categoryDistribution.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.category}</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Resources */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Most Requested Resources</h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Resource</th>
                <th>Total Requests</th>
                <th>Utilization Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topResources.map((resource, index) => (
                <tr key={index}>
                  <td className="font-medium">{resource.name}</td>
                  <td>{resource.requests}</td>
                  <td>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${resource.utilization}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{resource.utilization}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${resource.utilization > 80 ? 'badge-success' : resource.utilization > 60 ? 'badge-warning' : 'badge-error'}`}>
                      {resource.utilization > 80 ? 'High' : resource.utilization > 60 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Request Trends</h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {analytics.monthlyRequests.map((value, index) => {
            const maxValue = Math.max(...analytics.monthlyRequests);
            const height = (value / maxValue) * 100;
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="bg-blue-500 rounded-t w-full transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${height}%` }}
                  title={`${months[index]}: ${value} requests`}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{months[index]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics; 
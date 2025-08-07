import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, userRole } = useAuth();
  const [resources, setResources] = useState([]);
  const [requests, setRequests] = useState([]);
  const [usageHistory, setUsageHistory] = useState([]);
  const [overdueItems, setOverdueItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  
  // Form state for adding/editing resources
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    status: 'available',
    reservedFor: 'both', // 'student', 'faculty', 'both'
    imageUrl: '',
    quantity: 1
  });

  useEffect(() => {
    fetchResources();
    fetchRequests();
    fetchUsageHistory();
    fetchOverdueItems();
  }, [user, userRole]);

  const fetchResources = async () => {
    try {
      const response = await fetch('http://localhost:3000/resources');
      if (response.ok) {
        const data = await response.json();
        setResources(data);
      }
    } catch (error) {
      toast.error('Failed to fetch resources');
    }
  };

  const fetchRequests = async () => {
    try {
      let url = 'http://localhost:3000/api/requests';
      
      // Filter requests based on user role
      if (userRole === 'faculty' || userRole === 'student') {
        // Faculty and students only see their own requests
        url = `http://localhost:3000/api/requests/user/${user?.email}`;
      }
      // Admins see all requests (no filtering needed)
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageHistory = async () => {
    try {
      let url = 'http://localhost:3000/api/usage-history';
      
      // Filter usage history based on user role
      if (userRole === 'faculty' || userRole === 'student') {
        // Faculty and students only see their own usage history
        url = `http://localhost:3000/api/usage-history/user/${user?.email}`;
      }
      // Admins see all usage history (no filtering needed)
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setUsageHistory(data);
      }
    } catch (error) {
      console.error('Failed to fetch usage history:', error);
    }
  };

  const fetchOverdueItems = async () => {
    try {
      let url = 'http://localhost:3000/api/overdue-items';
      
      // Filter overdue items based on user role
      if (userRole === 'faculty' || userRole === 'student') {
        // Faculty and students only see their own overdue items
        url = `http://localhost:3000/api/overdue-items/user/${user?.email}`;
      }
      // Admins see all overdue items (no filtering needed)
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setOverdueItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch overdue items:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingResource 
        ? `http://localhost:3000/resources/${editingResource._id}`
        : 'http://localhost:3000/resources';
      
      const method = editingResource ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingResource ? 'Resource updated successfully!' : 'Resource added successfully!');
        setShowAddForm(false);
        setEditingResource(null);
        resetForm();
        fetchResources();
      } else {
        toast.error('Failed to save resource');
      }
    } catch (error) {
      toast.error('Error saving resource');
    }
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData({
      name: resource.name,
      description: resource.description,
      category: resource.category,
      status: resource.status,
      reservedFor: resource.reservedFor || 'both',
      imageUrl: resource.imageUrl,
      quantity: resource.quantity || 1
    });
    setShowAddForm(true);
  };

  const handleDelete = async (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        const response = await fetch(`http://localhost:3000/resources/${resourceId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('Resource deleted successfully!');
          fetchResources();
        } else {
          toast.error('Failed to delete resource');
        }
      } catch (error) {
        toast.error('Error deleting resource');
      }
    }
  };

  const handleRequestAction = async (requestId, action, adminNotes = '') => {
    try {
      const response = await fetch(`http://localhost:3000/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: action,
          adminNotes,
          processedBy: user.email,
          processedAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        toast.success(`Request ${action} successfully!`);
        fetchRequests();
        fetchUsageHistory();
        fetchOverdueItems();
      } else {
        toast.error(`Failed to ${action} request`);
      }
    } catch (error) {
      toast.error(`Error ${action}ing request`);
    }
  };

  const handleSendNotification = async (userId, message) => {
    try {
      const response = await fetch('http://localhost:3000/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          message,
          type: 'due_return',
          sentBy: user.email,
          sentAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        toast.success('Notification sent successfully!');
      } else {
        toast.error('Failed to send notification');
      }
    } catch (error) {
      toast.error('Error sending notification');
    }
  };

  const handleMarkAsReturned = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/requests/${requestId}/return`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnedAt: new Date().toISOString(),
          returnedBy: user.email
        }),
      });

      if (response.ok) {
        toast.success('Item marked as returned successfully!');
        fetchRequests();
        fetchUsageHistory();
        fetchOverdueItems();
      } else {
        toast.error('Failed to mark item as returned');
      }
    } catch (error) {
      toast.error('Error marking item as returned');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      status: 'available',
      reservedFor: 'both',
      imageUrl: '',
      quantity: 1
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      available: 'badge badge-success',
      borrowed: 'badge badge-warning',
      'in-use': 'badge badge-info',
      repair: 'badge badge-error'
    };
    return <span className={statusClasses[status] || 'badge badge-neutral'}>{status}</span>;
  };

  const getReservedForBadge = (reservedFor) => {
    const reservedClasses = {
      student: 'badge badge-primary',
      faculty: 'badge badge-secondary',
      both: 'badge badge-accent'
    };
    return <span className={reservedClasses[reservedFor] || 'badge badge-neutral'}>{reservedFor}</span>;
  };

  const getRequestStatusBadge = (status) => {
    const statusClasses = {
      pending: 'badge badge-warning',
      approved: 'badge badge-success',
      rejected: 'badge badge-error',
      returned: 'badge badge-info',
      overdue: 'badge badge-error'
    };
    return <span className={statusClasses[status] || 'badge badge-neutral'}>{status}</span>;
  };

  const calculateDaysOverdue = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getOverdueBadge = (daysOverdue) => {
    if (daysOverdue === 0) return null;
    return (
      <span className="badge badge-error">
        {daysOverdue} day{daysOverdue > 1 ? 's' : ''} overdue
      </span>
    );
  };

  const getDashboardTitle = () => {
    switch (userRole) {
      case 'admin':
        return 'Admin Dashboard';
      case 'faculty':
        return 'Faculty Dashboard';
      case 'student':
        return 'Student Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const getDashboardSubtitle = () => {
    switch (userRole) {
      case 'admin':
        return 'Welcome back, Admin!';
      case 'faculty':
        return 'Welcome back, Faculty!';
      case 'student':
        return 'Welcome back, Student!';
      default:
        return 'Welcome back!';
    }
  };

  const canManageResources = () => {
    return userRole === 'admin';
  };

  const canManageRequests = () => {
    return userRole === 'admin';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const overdueRequests = requests.filter(r => {
    if (r.status === 'approved' && r.dueDate) {
      return calculateDaysOverdue(r.dueDate) > 0;
    }
    return false;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{getDashboardTitle()}</h1>
              <p className="text-gray-600 mt-2">{getDashboardSubtitle()}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="avatar">
                <div className="w-12 h-12 rounded-full">
                  <img src={user?.photoURL || 'https://api.dicebear.com/7.x/initials/svg?seed=User'} alt="User" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Resources</p>
                <p className="text-2xl font-semibold text-gray-900">{resources.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-semibold text-gray-900">{pendingRequests.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue Items</p>
                <p className="text-2xl font-semibold text-gray-900">{overdueRequests.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Loans</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {requests.filter(r => r.status === 'approved' && !r.returnedAt).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="tabs tabs-boxed p-4">
            <button 
              className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            {canManageResources() && (
              <button 
                className={`tab ${activeTab === 'resources' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('resources')}
              >
                Resources Management
              </button>
            )}
            <button 
              className={`tab ${activeTab === 'requests' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              {userRole === 'admin' ? 'All Requests' : 'My Requests'} ({pendingRequests.length})
            </button>
            <button 
              className={`tab ${activeTab === 'overdue' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('overdue')}
            >
              Overdue Items ({overdueRequests.length})
            </button>
            <button 
              className={`tab ${activeTab === 'history' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              Usage History
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Requests */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                {userRole === 'admin' ? 'Recent Requests' : 'My Recent Requests'}
              </h3>
              <div className="space-y-3">
                {requests.slice(0, 5).map((request) => (
                  <div key={request._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {userRole === 'admin' && (
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-full">
                          <img 
                            src={request.userPhotoURL || 'https://api.dicebear.com/7.x/initials/svg?seed=User'} 
                            alt="User"
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">{request.resourceName}</h4>
                      <p className="text-sm text-gray-600">
                        {userRole === 'admin' ? `${request.userName} • ` : ''}{new Date(request.requestDate).toLocaleDateString()}
                      </p>
                    </div>
                    {getRequestStatusBadge(request.status)}
                  </div>
                ))}
                {requests.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No requests found</p>
                )}
              </div>
            </div>

            {/* Overdue Items */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                {userRole === 'admin' ? 'Overdue Items' : 'My Overdue Items'}
              </h3>
              <div className="space-y-3">
                {overdueRequests.slice(0, 5).map((request) => (
                  <div key={request._id} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    {userRole === 'admin' && (
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-full">
                          <img 
                            src={request.userPhotoURL || 'https://api.dicebear.com/7.x/initials/svg?seed=User'} 
                            alt="User"
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">{request.resourceName}</h4>
                      <p className="text-sm text-gray-600">
                        {userRole === 'admin' ? `${request.userName} • ` : ''}Due: {new Date(request.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    {getOverdueBadge(calculateDaysOverdue(request.dueDate))}
                  </div>
                ))}
                {overdueRequests.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No overdue items</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Resources Management</h2>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setShowAddForm(true);
                  setEditingResource(null);
                  resetForm();
                }}
              >
                Add New Resource
              </button>
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">
                  {editingResource ? 'Edit Resource' : 'Add New Resource'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text">Resource Name</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Category</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="electronics">Electronics</option>
                        <option value="books">Books</option>
                        <option value="equipment">Equipment</option>
                        <option value="software">Software</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Status</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        required
                      >
                        <option value="available">Available</option>
                        <option value="borrowed">Borrowed</option>
                        <option value="in-use">In Use</option>
                        <option value="repair">Under Repair</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Reserved For</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={formData.reservedFor}
                        onChange={(e) => setFormData({...formData, reservedFor: e.target.value})}
                        required
                      >
                        <option value="both">Both Students & Faculty</option>
                        <option value="student">Students Only</option>
                        <option value="faculty">Faculty Only</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Quantity</span>
                      </label>
                      <input
                        type="number"
                        className="input input-bordered w-full"
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                        min="1"
                        required
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Image URL</span>
                      </label>
                      <input
                        type="url"
                        className="input input-bordered w-full"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Description</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered w-full"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                    ></textarea>
                  </div>
                  <div className="flex space-x-2">
                    <button type="submit" className="btn btn-primary">
                      {editingResource ? 'Update Resource' : 'Add Resource'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-ghost"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingResource(null);
                        resetForm();
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Resources List */}
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Reserved For</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map((resource) => (
                    <tr key={resource._id}>
                      <td>
                        <div className="avatar">
                          <div className="w-12 h-12 rounded">
                            <img 
                              src={resource.imageUrl || 'https://via.placeholder.com/48'} 
                              alt={resource.name}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/48';
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-bold">{resource.name}</div>
                          <div className="text-sm opacity-50">{resource.description}</div>
                        </div>
                      </td>
                      <td>{resource.category}</td>
                      <td>{getStatusBadge(resource.status)}</td>
                      <td>{getReservedForBadge(resource.reservedFor)}</td>
                      <td>{resource.quantity}</td>
                      <td>
                        <div className="flex space-x-2">
                          <button 
                            className="btn btn-sm btn-outline"
                            onClick={() => handleEdit(resource)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-error"
                            onClick={() => handleDelete(resource._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {userRole === 'admin' ? 'All Resource Requests' : 'My Requests'}
            </h2>
            
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    {userRole === 'admin' && <th>User</th>}
                    <th>Resource</th>
                    <th>Request Date</th>
                    <th>Status</th>
                    {userRole === 'admin' && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request._id}>
                      {userRole === 'admin' && (
                        <td>
                          <div className="flex items-center space-x-3">
                            <div className="avatar">
                              <div className="w-10 h-10 rounded-full">
                                <img 
                                  src={request.userPhotoURL || 'https://api.dicebear.com/7.x/initials/svg?seed=User'} 
                                  alt="User"
                                />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{request.userName}</div>
                              <div className="text-sm opacity-50">{request.userEmail}</div>
                            </div>
                          </div>
                        </td>
                      )}
                      <td>
                        <div>
                          <div className="font-bold">{request.resourceName}</div>
                          <div className="text-sm opacity-50">{request.resourceCategory}</div>
                        </div>
                      </td>
                      <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                      <td>
                        {getRequestStatusBadge(request.status)}
                        {request.status === 'approved' && request.dueDate && (
                          <div className="text-sm text-gray-500">
                            Due: {new Date(request.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      {userRole === 'admin' && (
                        <td>
                          {request.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button 
                                className="btn btn-sm btn-success"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setShowRequestModal(true);
                                }}
                              >
                                Approve
                              </button>
                              <button 
                                className="btn btn-sm btn-error"
                                onClick={() => handleRequestAction(request._id, 'rejected')}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          {request.status === 'approved' && !request.returnedAt && (
                            <div className="flex space-x-2">
                              <button 
                                className="btn btn-sm btn-info"
                                onClick={() => handleMarkAsReturned(request._id)}
                              >
                                Mark Returned
                              </button>
                              <button 
                                className="btn btn-sm btn-warning"
                                onClick={() => {
                                  const message = `Reminder: Your ${request.resourceName} is due for return. Please return it as soon as possible.`;
                                  handleSendNotification(request.userId, message);
                                }}
                              >
                                Send Reminder
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {requests.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No requests found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Overdue Items Tab */}
        {activeTab === 'overdue' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {userRole === 'admin' ? 'All Overdue Items' : 'My Overdue Items'}
            </h2>
            
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    {userRole === 'admin' && <th>User</th>}
                    <th>Resource</th>
                    <th>Due Date</th>
                    <th>Days Overdue</th>
                    {userRole === 'admin' && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {overdueRequests.map((request) => (
                    <tr key={request._id}>
                      {userRole === 'admin' && (
                        <td>
                          <div className="flex items-center space-x-3">
                            <div className="avatar">
                              <div className="w-10 h-10 rounded-full">
                                <img 
                                  src={request.userPhotoURL || 'https://api.dicebear.com/7.x/initials/svg?seed=User'} 
                                  alt="User"
                                />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{request.userName}</div>
                              <div className="text-sm opacity-50">{request.userEmail}</div>
                            </div>
                          </div>
                        </td>
                      )}
                      <td>
                        <div>
                          <div className="font-bold">{request.resourceName}</div>
                          <div className="text-sm opacity-50">{request.resourceCategory}</div>
                        </div>
                      </td>
                      <td>{new Date(request.dueDate).toLocaleDateString()}</td>
                      <td>
                        {getOverdueBadge(calculateDaysOverdue(request.dueDate))}
                      </td>
                      {userRole === 'admin' && (
                        <td>
                          <div className="flex space-x-2">
                            <button 
                              className="btn btn-sm btn-info"
                              onClick={() => handleMarkAsReturned(request._id)}
                            >
                              Mark Returned
                            </button>
                            <button 
                              className="btn btn-sm btn-warning"
                              onClick={() => {
                                const daysOverdue = calculateDaysOverdue(request.dueDate);
                                const message = `URGENT: Your ${request.resourceName} is ${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue. Please return it immediately to avoid penalties.`;
                                handleSendNotification(request.userId, message);
                              }}
                            >
                              Send Urgent Notice
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {overdueRequests.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No overdue items found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Usage History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {userRole === 'admin' ? 'All Usage History' : 'My Usage History'}
            </h2>
            
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    {userRole === 'admin' && <th>User</th>}
                    <th>Resource</th>
                    <th>Request Date</th>
                    <th>Approved Date</th>
                    <th>Due Date</th>
                    <th>Return Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {usageHistory.map((record) => (
                    <tr key={record._id}>
                      {userRole === 'admin' && (
                        <td>
                          <div className="flex items-center space-x-3">
                            <div className="avatar">
                              <div className="w-10 h-10 rounded-full">
                                <img 
                                  src={record.userPhotoURL || 'https://api.dicebear.com/7.x/initials/svg?seed=User'} 
                                  alt="User"
                                />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{record.userName}</div>
                              <div className="text-sm opacity-50">{record.userEmail}</div>
                            </div>
                          </div>
                        </td>
                      )}
                      <td>
                        <div>
                          <div className="font-bold">{record.resourceName}</div>
                          <div className="text-sm opacity-50">{record.resourceCategory}</div>
                        </div>
                      </td>
                      <td>{new Date(record.requestDate).toLocaleDateString()}</td>
                      <td>{record.processedAt ? new Date(record.processedAt).toLocaleDateString() : '-'}</td>
                      <td>{record.dueDate ? new Date(record.dueDate).toLocaleDateString() : '-'}</td>
                      <td>{record.returnedAt ? new Date(record.returnedAt).toLocaleDateString() : '-'}</td>
                      <td>{getRequestStatusBadge(record.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {usageHistory.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No usage history found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Request Approval Modal */}
        {showRequestModal && selectedRequest && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Approve Request</h3>
              <div className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">Due Date</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedRequest({...selectedRequest, dueDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Admin Notes (Optional)</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    rows="3"
                    placeholder="Any additional notes..."
                    onChange={(e) => setNotificationMessage(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-action">
                <button 
                  className="btn btn-success"
                  onClick={() => {
                    handleRequestAction(selectedRequest._id, 'approved', notificationMessage);
                    setShowRequestModal(false);
                    setSelectedRequest(null);
                    setNotificationMessage('');
                  }}
                >
                  Approve Request
                </button>
                <button 
                  className="btn btn-ghost"
                  onClick={() => {
                    setShowRequestModal(false);
                    setSelectedRequest(null);
                    setNotificationMessage('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resources');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  
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
  }, []);

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
      const response = await fetch('http://localhost:3000/api/requests');
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

  const handleRequestAction = async (requestId, action) => {
    try {
      const response = await fetch(`http://localhost:3000/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action }),
      });

      if (response.ok) {
        toast.success(`Request ${action} successfully!`);
        fetchRequests();
      } else {
        toast.error(`Failed to ${action} request`);
      }
    } catch (error) {
      toast.error(`Error ${action}ing request`);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, {user?.displayName || 'Admin'}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="avatar">
                <div className="w-12 h-12 rounded-full">
                  <img src={user?.photoURL || 'https://api.dicebear.com/7.x/initials/svg?seed=Admin'} alt="Admin" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="tabs tabs-boxed p-4">
            <button 
              className={`tab ${activeTab === 'resources' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('resources')}
            >
              Resources Management
            </button>
            <button 
              className={`tab ${activeTab === 'requests' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              Requests ({requests.filter(r => r.status === 'pending').length})
            </button>
          </div>
        </div>

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
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Resource Requests</h2>
            
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Resource</th>
                    <th>Request Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request._id}>
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
                      <td>
                        <div>
                          <div className="font-bold">{request.resourceName}</div>
                          <div className="text-sm opacity-50">{request.resourceCategory}</div>
                        </div>
                      </td>
                      <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${
                          request.status === 'pending' ? 'badge-warning' :
                          request.status === 'approved' ? 'badge-success' :
                          'badge-error'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td>
                        {request.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button 
                              className="btn btn-sm btn-success"
                              onClick={() => handleRequestAction(request._id, 'approved')}
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
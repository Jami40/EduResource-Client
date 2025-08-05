import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    photoURL: user?.photoURL || '',
    studentId: '',
    major: '',
    year: '',
    phone: ''
  });

  useEffect(() => {
    fetchResources();
    fetchMyRequests();
    fetchProfileData();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('http://localhost:3000/resources');
      if (response.ok) {
        const data = await response.json();
        // Filter resources that students can access (student-only or both)
        const studentResources = data.filter(resource => 
          resource.reservedFor === 'student' || resource.reservedFor === 'both'
        );
        setResources(studentResources);
      }
    } catch (error) {
      toast.error('Failed to fetch resources');
    }
  };

  const fetchMyRequests = async () => {
    try {
      console.log('Fetching requests for email:', user?.email);
      const response = await fetch(`http://localhost:3000/api/requests/user/${user?.email}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched requests:', data);
        setMyRequests(data);
      } else {
        console.error('Failed to fetch requests:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to fetch your requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/${user?.email}`);
      if (response.ok) {
        const userData = await response.json();
        setProfileData({
          displayName: userData.displayName || user?.displayName || '',
          photoURL: userData.photoURL || user?.photoURL || '',
          studentId: userData.studentId || '',
          major: userData.major || '',
          year: userData.year || '',
          phone: userData.phone || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile data');
    }
  };

  const handleRequestResource = async (resourceId, resourceName) => {
    try {
      const requestData = {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        userPhotoURL: user.photoURL,
        userRole: 'student',
        resourceId: resourceId,
        resourceName: resourceName,
        requestDate: new Date().toISOString(),
        status: 'pending'
      };
      
      console.log('Submitting request:', requestData);
      
      const response = await fetch('http://localhost:3000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Request submitted successfully:', result);
        toast.success('Resource request submitted successfully!');
        fetchMyRequests();
      } else {
        const errorText = await response.text();
        console.error('Failed to submit request:', errorText);
        toast.error('Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Error submitting request');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/users/${user?.email}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        toast.success('Profile updated successfully!');
        setShowProfileEdit(false);
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Error updating profile');
    }
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

  const getRequestStatusBadge = (status) => {
    const statusClasses = {
      pending: 'badge badge-warning',
      approved: 'badge badge-success',
      rejected: 'badge badge-error'
    };
    return <span className={statusClasses[status] || 'badge badge-neutral'}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-gray-600">Loading student dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, {user?.displayName || 'Student'}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="avatar">
                <div className="w-12 h-12 rounded-full">
                  <img src={user?.photoURL || 'https://api.dicebear.com/7.x/initials/svg?seed=Student'} alt="Student" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Resources</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {resources.filter(r => r.status === 'available').length}
                </p>
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
                <p className="text-2xl font-semibold text-gray-900">
                  {myRequests.filter(r => r.status === 'pending').length}
                </p>
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
                <p className="text-sm font-medium text-gray-600">Approved Requests</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {myRequests.filter(r => r.status === 'approved').length}
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
            <button 
              className={`tab ${activeTab === 'resources' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('resources')}
            >
              Available Resources
            </button>
            <button 
              className={`tab ${activeTab === 'requests' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              My Requests
            </button>
            <button 
              className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Resources */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Available Resources</h3>
              <div className="space-y-3">
                {resources.slice(0, 5).map((resource) => (
                  <div key={resource._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="avatar">
                      <div className="w-10 h-10 rounded">
                        <img 
                          src={resource.imageUrl || 'https://via.placeholder.com/40'} 
                          alt={resource.name}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/40';
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{resource.name}</h4>
                      <p className="text-sm text-gray-600">{resource.category}</p>
                    </div>
                    {getStatusBadge(resource.status)}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Requests */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Requests</h3>
              <div className="space-y-3">
                {myRequests.slice(0, 5).map((request) => (
                  <div key={request._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{request.resourceName}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(request.requestDate).toLocaleDateString()}
                      </p>
                    </div>
                    {getRequestStatusBadge(request.status)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Resources</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <div key={resource._id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
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
                    <div className="flex-1">
                      <h3 className="font-semibold">{resource.name}</h3>
                      <p className="text-sm text-gray-600">{resource.category}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{resource.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Quantity: {resource.quantity}</span>
                    {getStatusBadge(resource.status)}
                  </div>
                  
                  {resource.status === 'available' && (
                    <button 
                      className="btn btn-primary btn-sm w-full"
                      onClick={() => handleRequestResource(resource._id, resource.name)}
                    >
                      Request Resource
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Requests</h2>
            
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Resource</th>
                    <th>Request Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myRequests.map((request) => (
                    <tr key={request._id}>
                      <td>
                        <div>
                          <div className="font-bold">{request.resourceName}</div>
                          <div className="text-sm opacity-50">{request.resourceCategory}</div>
                        </div>
                      </td>
                      <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                      <td>{getRequestStatusBadge(request.status)}</td>
                      <td>
                        {request.status === 'pending' && (
                          <button 
                            className="btn btn-sm btn-error"
                            onClick={() => {
                              // Cancel request functionality
                              toast.info('Cancel request functionality to be implemented');
                            }}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
              <button 
                className="btn btn-outline"
                onClick={() => setShowProfileEdit(!showProfileEdit)}
              >
                {showProfileEdit ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>

            {showProfileEdit ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={profileData.displayName}
                      onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Profile Photo URL</span>
                    </label>
                    <input
                      type="url"
                      className="input input-bordered w-full"
                      value={profileData.photoURL}
                      onChange={(e) => setProfileData({...profileData, photoURL: e.target.value})}
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Student ID</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={profileData.studentId}
                      onChange={(e) => setProfileData({...profileData, studentId: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Major</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={profileData.major}
                      onChange={(e) => setProfileData({...profileData, major: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Year</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={profileData.year}
                      onChange={(e) => setProfileData({...profileData, year: e.target.value})}
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      className="input input-bordered w-full"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button type="submit" className="btn btn-primary">
                    Update Profile
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-ghost"
                    onClick={() => setShowProfileEdit(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="avatar">
                    <div className="w-20 h-20 rounded-full">
                      <img 
                        src={profileData.photoURL || 'https://api.dicebear.com/7.x/initials/svg?seed=Student'} 
                        alt="Profile"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{profileData.displayName}</h3>
                    <p className="text-gray-600">{user?.email}</p>
                    <p className="text-sm text-gray-500">Student</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Student ID:</span>
                    <p className="text-gray-600">{profileData.studentId || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Major:</span>
                    <p className="text-gray-600">{profileData.major || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Year:</span>
                    <p className="text-gray-600">{profileData.year || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>
                    <p className="text-gray-600">{profileData.phone || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
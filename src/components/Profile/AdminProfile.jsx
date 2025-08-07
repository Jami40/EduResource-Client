import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const AdminProfile = () => {
  const { user } = useAuth();
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    photoURL: user?.photoURL || '',
    department: '',
    phone: '',
    office: '',
    specialization: '',
    joiningDate: '',
    adminLevel: 'Super Admin',
    permissions: ['manage_resources', 'manage_requests', 'view_analytics', 'manage_users']
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/${user?.email}`);
      if (response.ok) {
        const userData = await response.json();
        setProfileData({
          displayName: userData.displayName || user?.displayName || '',
          photoURL: userData.photoURL || user?.photoURL || '',
          department: userData.department || '',
          phone: userData.phone || '',
          office: userData.office || '',
          specialization: userData.specialization || '',
          joiningDate: userData.joiningDate || '',
          adminLevel: userData.adminLevel || 'Super Admin',
          permissions: userData.permissions || ['manage_resources', 'manage_requests', 'view_analytics', 'manage_users']
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile data');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Profile</h1>
              <p className="text-gray-600 mt-1">System Administrator Dashboard</p>
            </div>
            <button 
              className="btn btn-outline"
              onClick={() => setShowProfileEdit(!showProfileEdit)}
            >
              {showProfileEdit ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>

          {showProfileEdit ? (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Department</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={profileData.department}
                    onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                  />
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
                <div>
                  <label className="label">
                    <span className="label-text">Office Location</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={profileData.office}
                    onChange={(e) => setProfileData({...profileData, office: e.target.value})}
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Specialization</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={profileData.specialization}
                    onChange={(e) => setProfileData({...profileData, specialization: e.target.value})}
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Joining Date</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={profileData.joiningDate}
                    onChange={(e) => setProfileData({...profileData, joiningDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Admin Level</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={profileData.adminLevel}
                    onChange={(e) => setProfileData({...profileData, adminLevel: e.target.value})}
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Moderator">Moderator</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowProfileEdit(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Profile Picture and Basic Info */}
              <div className="space-y-6">
                <div className="text-center">
                  <img
                    src={profileData.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${profileData.displayName}`}
                    alt="Profile"
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-gray-200"
                  />
                  <h2 className="text-2xl font-bold text-gray-800">{profileData.displayName}</h2>
                  <p className="text-gray-600">System Administrator</p>
                  <div className="badge badge-primary mt-2">{profileData.adminLevel}</div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Email:</span> {user?.email}</p>
                      <p><span className="font-medium">Phone:</span> {profileData.phone || 'Not provided'}</p>
                      <p><span className="font-medium">Office:</span> {profileData.office || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Professional Details</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Department:</span> {profileData.department || 'Not specified'}</p>
                    <p><span className="font-medium">Specialization:</span> {profileData.specialization || 'Not specified'}</p>
                    <p><span className="font-medium">Joining Date:</span> {profileData.joiningDate || 'Not specified'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Admin Permissions</h3>
                  <div className="space-y-2">
                    {profileData.permissions.map((permission, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700 capitalize">
                          {permission.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">System Access</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Resource Management</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Request Approval</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Analytics Dashboard</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">User Management</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile; 
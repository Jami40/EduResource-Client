import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const FacultyProfile = () => {
  const { user } = useAuth();
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    photoURL: user?.photoURL || '',
    department: '',
    phone: '',
    office: '',
    specialization: '',
    joiningDate: ''
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
          joiningDate: userData.joiningDate || ''
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Faculty Profile</h1>
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
                    placeholder="https://example.com/photo.jpg"
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
                    <span className="label-text">Joining Date</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={profileData.joiningDate}
                    onChange={(e) => setProfileData({...profileData, joiningDate: e.target.value})}
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Picture and Basic Info */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <div className="avatar mb-4">
                    <div className="w-32 h-32 rounded-full mx-auto">
                      <img 
                        src={profileData.photoURL || 'https://api.dicebear.com/7.x/initials/svg?seed=Faculty'} 
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{profileData.displayName}</h2>
                  <p className="text-gray-600 mb-1">{user?.email}</p>
                  <span className="badge badge-success">Faculty</span>
                </div>
              </div>

              {/* Profile Details */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-700">Department:</span>
                      <p className="text-gray-900">{profileData.department || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Specialization:</span>
                      <p className="text-gray-900">{profileData.specialization || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Phone:</span>
                      <p className="text-gray-900">{profileData.phone || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Office:</span>
                      <p className="text-gray-900">{profileData.office || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Joining Date:</span>
                      <p className="text-gray-900">
                        {profileData.joiningDate ? new Date(profileData.joiningDate).toLocaleDateString() : 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Member Since:</span>
                      <p className="text-gray-900">
                        {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Not available'}
                      </p>
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

export default FacultyProfile; 
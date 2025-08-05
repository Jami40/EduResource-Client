import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const StudentProfile = () => {
  const { user } = useAuth();
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    photoURL: user?.photoURL || '',
    studentId: '',
    major: '',
    year: '',
    phone: '',
    address: '',
    emergencyContact: ''
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
          studentId: userData.studentId || '',
          major: userData.major || '',
          year: userData.year || '',
          phone: userData.phone || '',
          address: userData.address || '',
          emergencyContact: userData.emergencyContact || ''
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Student Profile</h1>
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
                <div>
                  <label className="label">
                    <span className="label-text">Emergency Contact</span>
                  </label>
                  <input
                    type="tel"
                    className="input input-bordered w-full"
                    value={profileData.emergencyContact}
                    onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                    placeholder="Parent/Guardian phone number"
                  />
                </div>
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Address</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  rows="3"
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  placeholder="Enter your current address"
                ></textarea>
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
                        src={profileData.photoURL || 'https://api.dicebear.com/7.x/initials/svg?seed=Student'} 
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{profileData.displayName}</h2>
                  <p className="text-gray-600 mb-1">{user?.email}</p>
                  <span className="badge badge-primary">Student</span>
                  {profileData.studentId && (
                    <p className="text-sm text-gray-500 mt-1">ID: {profileData.studentId}</p>
                  )}
                </div>
              </div>

              {/* Profile Details */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Academic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <span className="font-medium text-gray-700">Major:</span>
                      <p className="text-gray-900">{profileData.major || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Year:</span>
                      <p className="text-gray-900">{profileData.year || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Student ID:</span>
                      <p className="text-gray-900">{profileData.studentId || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Member Since:</span>
                      <p className="text-gray-900">
                        {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Not available'}
                      </p>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <span className="font-medium text-gray-700">Phone:</span>
                      <p className="text-gray-900">{profileData.phone || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Emergency Contact:</span>
                      <p className="text-gray-900">{profileData.emergencyContact || 'Not specified'}</p>
                    </div>
                  </div>

                  {profileData.address && (
                    <>
                      <h3 className="text-xl font-semibold mb-4">Address</h3>
                      <div className="mb-6">
                        <span className="font-medium text-gray-700">Current Address:</span>
                        <p className="text-gray-900 mt-1">{profileData.address}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile; 
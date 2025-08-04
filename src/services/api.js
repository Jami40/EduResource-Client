// API service for server communication
const API_BASE_URL = 'http://localhost:5000/api'; // Update this with your server URL

// Generic fetch wrapper with error handling
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Resource API functions
export const resourceAPI = {
  // Get all resources
  getAll: () => apiRequest('/resources'),
  
  // Get resource by ID
  getById: (id) => apiRequest(`/resources/${id}`),
  
  // Create new resource (admin only)
  create: (resourceData) => apiRequest('/resources', {
    method: 'POST',
    body: JSON.stringify(resourceData),
  }),
  
  // Update resource (admin only)
  update: (id, resourceData) => apiRequest(`/resources/${id}`, {
    method: 'PUT',
    body: JSON.stringify(resourceData),
  }),
  
  // Delete resource (admin only)
  delete: (id) => apiRequest(`/resources/${id}`, {
    method: 'DELETE',
  }),
};

// Request API functions
export const requestAPI = {
  // Get all requests (filtered by user role)
  getAll: () => apiRequest('/requests'),
  
  // Get requests by user ID
  getByUser: (userId) => apiRequest(`/requests/user/${userId}`),
  
  // Get request by ID
  getById: (id) => apiRequest(`/requests/${id}`),
  
  // Create new request
  create: (requestData) => apiRequest('/requests', {
    method: 'POST',
    body: JSON.stringify(requestData),
  }),
  
  // Update request status (admin only)
  updateStatus: (id, status, adminNotes = '') => apiRequest(`/requests/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, adminNotes }),
  }),
  
  // Cancel request
  cancel: (id) => apiRequest(`/requests/${id}/cancel`, {
    method: 'PUT',
  }),
  
  // Return resource
  return: (id) => apiRequest(`/requests/${id}/return`, {
    method: 'PUT',
  }),
};

// User API functions
export const userAPI = {
  // Get user profile
  getProfile: (userId) => apiRequest(`/users/${userId}`),
  
  // Update user profile
  updateProfile: (userId, profileData) => apiRequest(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),
  
  // Get user statistics
  getStats: (userId) => apiRequest(`/users/${userId}/stats`),
};

// Analytics API functions (admin only)
export const analyticsAPI = {
  // Get dashboard statistics
  getDashboardStats: () => apiRequest('/analytics/dashboard'),
  
  // Get resource usage statistics
  getResourceStats: () => apiRequest('/analytics/resources'),
  
  // Get user activity statistics
  getUserStats: () => apiRequest('/analytics/users'),
  
  // Get request statistics
  getRequestStats: () => apiRequest('/analytics/requests'),
};

// Helper function to transform server data to component format
export const transformResourceData = (serverData) => {
  if (Array.isArray(serverData)) {
    return serverData.map(transformResourceData);
  }
  
  return {
    id: serverData.id || serverData._id,
    name: serverData.name || serverData.title,
    category: serverData.category || serverData.type,
    status: serverData.status || 'available',
    location: serverData.location || serverData.room || 'Not specified',
    description: serverData.description || serverData.details || 'No description available',
    image: serverData.image || serverData.imageUrl || serverData.photo || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
    // Preserve all original data
    ...serverData,
  };
};

// Helper function to transform request data
export const transformRequestData = (serverData) => {
  if (Array.isArray(serverData)) {
    return serverData.map(transformRequestData);
  }
  
  return {
    id: serverData.id || serverData._id,
    resourceId: serverData.resourceId || serverData.resource_id,
    userId: serverData.userId || serverData.user_id,
    status: serverData.status || 'pending',
    requestDate: serverData.requestDate || serverData.created_at,
    startDate: serverData.startDate || serverData.start_date,
    endDate: serverData.endDate || serverData.end_date,
    purpose: serverData.purpose || 'General use',
    adminNotes: serverData.adminNotes || serverData.admin_notes || '',
    // Preserve all original data
    ...serverData,
  };
};

export default {
  resourceAPI,
  requestAPI,
  userAPI,
  analyticsAPI,
  transformResourceData,
  transformRequestData,
}; 
import { useState, useEffect } from 'react';
import { Search, Filter, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const ResourceList = () => {
  const { user, userRole } = useAuth();
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch resources from server
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:3000/resources');
        if (!response.ok) {
          throw new Error('Failed to fetch resources');
        }
        
        const data = await response.json();
        
        // Filter resources based on user role
        let filteredData = data;
        if (userRole === 'student') {
          filteredData = data.filter(resource => 
            resource.reservedFor === 'student' || resource.reservedFor === 'both'
          );
        } else if (userRole === 'faculty') {
          filteredData = data.filter(resource => 
            resource.reservedFor === 'faculty' || resource.reservedFor === 'both'
          );
        }
        // Admin can see all resources
        
        setResources(filteredData);
        setFilteredResources(filteredData);
      } catch (err) {
        console.error('Failed to load resources:', err);
        setError('Failed to load resources. Please try again later.');
        toast.error('Failed to load resources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    let filtered = resources;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(resource => resource.status === selectedStatus);
    }

    setFilteredResources(filtered);
  }, [resources, searchTerm, selectedCategory, selectedStatus]);

  const handleRequestCheckout = async (resourceId) => {
    try {
      const resource = resources.find(r => r._id === resourceId);
      if (!resource) {
        toast.error('Resource not found');
        return;
      }

      const requestData = {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        userPhotoURL: user.photoURL,
        userRole: userRole,
        resourceId: resourceId,
        resourceName: resource.name,
        resourceCategory: resource.category,
        requestDate: new Date().toISOString(),
        status: 'pending'
      };

             const response = await fetch('http://localhost:3000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      toast.success(`Request submitted for ${resource.name}`);
    } catch (error) {
      console.error('Failed to request checkout:', error);
      toast.error('Failed to submit request. Please try again.');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'checked-out':
      case 'borrowed':
      case 'in-use':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'maintenance':
      case 'repair':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return 'badge-success';
      case 'checked-out':
      case 'borrowed':
      case 'in-use':
        return 'badge-warning';
      case 'maintenance':
      case 'repair':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'checked-out':
      case 'borrowed':
      case 'in-use':
        return 'Checked Out';
      case 'maintenance':
      case 'repair':
        return 'Maintenance';
      default:
        return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown';
    }
  };

  const categories = ['all', ...new Set(resources.map(r => r.category).filter(Boolean))];
  const statuses = ['all', ...new Set(resources.map(r => r.status).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Resources</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resource Catalog</h1>
        <p className="text-gray-600">Browse and request departmental resources</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="select select-bordered w-full"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="select select-bordered w-full"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : getStatusText(status)}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedStatus('all');
            }}
            className="btn btn-outline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredResources.length} of {resources.length} resources
        </p>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredResources.map((resource) => (
           <div key={resource._id} className="card bg-white shadow-lg hover:shadow-xl transition-shadow">
            <figure className="h-48">
                             <img
                 src={resource.imageUrl || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop'}
                 alt={resource.name}
                 className="w-full h-full object-cover"
                 onError={(e) => {
                   e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop';
                 }}
               />
            </figure>
            <div className="card-body">
              <div className="flex items-start justify-between mb-2">
                <h2 className="card-title text-lg">{resource.name}</h2>
                <div className="flex items-center">
                  {getStatusIcon(resource.status)}
                  <span className={`badge ${getStatusBadge(resource.status)} ml-2`}>
                    {getStatusText(resource.status)}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
              
              <div className="text-sm text-gray-500 mb-4">
                <p><strong>Category:</strong> {resource.category}</p>
                <p><strong>Location:</strong> {resource.location}</p>
              </div>

              <div className="card-actions justify-end">
                                 {resource.status === 'available' ? (
                   <button
                     onClick={() => handleRequestCheckout(resource._id)}
                     className="btn btn-primary btn-sm"
                   >
                    Request Checkout
                  </button>
                ) : (
                  <button
                    disabled
                    className="btn btn-disabled btn-sm"
                  >
                    {getStatusText(resource.status)}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default ResourceList; 
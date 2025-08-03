import { useState, useEffect } from 'react';
import { Search, Filter, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ResourceList = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const mockResources = [
      {
        id: 1,
        name: 'Projector Epson EX3260',
        category: 'Electronics',
        status: 'available',
        location: 'Room 101',
        description: 'High-quality projector for presentations and lectures',
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop'
      },
      {
        id: 2,
        name: 'Laptop Dell XPS 13',
        category: 'Computers',
        status: 'available',
        location: 'IT Department',
        description: 'Premium laptop for research and development work',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop'
      },
      {
        id: 3,
        name: 'Microscope Olympus',
        category: 'Lab Equipment',
        status: 'checked-out',
        location: 'Biology Lab',
        description: 'Advanced microscope for biological research',
        image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=300&h=200&fit=crop'
      },
      {
        id: 4,
        name: 'Whiteboard Marker Set',
        category: 'Stationery',
        status: 'available',
        location: 'Storage Room',
        description: 'Complete set of whiteboard markers in various colors',
        image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop'
      },
      {
        id: 5,
        name: '3D Printer Ultimaker',
        category: 'Lab Equipment',
        status: 'maintenance',
        location: 'Engineering Lab',
        description: 'Professional 3D printer for prototyping',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop'
      },
      {
        id: 6,
        name: 'Camera Canon EOS R5',
        category: 'Electronics',
        status: 'available',
        location: 'Media Center',
        description: 'Professional camera for photography and videography',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=200&fit=crop'
      }
    ];

    setResources(mockResources);
    setFilteredResources(mockResources);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = resources;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleRequestCheckout = (resourceId) => {
    toast.success(`Request submitted for ${resources.find(r => r.id === resourceId)?.name}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'checked-out':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'maintenance':
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
        return 'badge-warning';
      case 'maintenance':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const categories = ['all', ...new Set(resources.map(r => r.category))];
  const statuses = ['all', 'available', 'checked-out', 'maintenance'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
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
                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
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
          <div key={resource.id} className="card bg-white shadow-lg hover:shadow-xl transition-shadow">
            <figure className="h-48">
              <img
                src={resource.image}
                alt={resource.name}
                className="w-full h-full object-cover"
              />
            </figure>
            <div className="card-body">
              <div className="flex items-start justify-between mb-2">
                <h2 className="card-title text-lg">{resource.name}</h2>
                <div className="flex items-center">
                  {getStatusIcon(resource.status)}
                  <span className={`badge ${getStatusBadge(resource.status)} ml-2`}>
                    {resource.status}
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
                    onClick={() => handleRequestCheckout(resource.id)}
                    className="btn btn-primary btn-sm"
                  >
                    Request Checkout
                  </button>
                ) : (
                  <button
                    disabled
                    className="btn btn-disabled btn-sm"
                  >
                    {resource.status === 'checked-out' ? 'Currently Checked Out' : 'Unavailable'}
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
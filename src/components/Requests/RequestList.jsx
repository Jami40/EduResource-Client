import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Calendar,
  Package,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';

const RequestList = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const mockRequests = [
      {
        id: 1,
        resourceName: 'Projector Epson EX3260',
        resourceId: 1,
        status: 'pending',
        requestDate: '2024-01-15',
        startDate: '2024-01-20',
        endDate: '2024-01-22',
        duration: '2 days',
        purpose: 'Class presentation for Computer Science 101',
        adminNotes: '',
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop'
      },
      {
        id: 2,
        resourceName: 'Laptop Dell XPS 13',
        resourceId: 2,
        status: 'approved',
        requestDate: '2024-01-10',
        startDate: '2024-01-15',
        endDate: '2024-01-22',
        duration: '1 week',
        purpose: 'Research project development',
        adminNotes: 'Approved for academic research',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop'
      },
      {
        id: 3,
        resourceName: 'Microscope Olympus',
        resourceId: 3,
        status: 'rejected',
        requestDate: '2024-01-08',
        startDate: '2024-01-12',
        endDate: '2024-01-15',
        duration: '3 days',
        purpose: 'Biology lab experiment',
        adminNotes: 'Equipment currently under maintenance',
        image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=300&h=200&fit=crop'
      },
      {
        id: 4,
        resourceName: 'Camera Canon EOS R5',
        resourceId: 6,
        status: 'active',
        requestDate: '2024-01-05',
        startDate: '2024-01-10',
        endDate: '2024-01-17',
        duration: '1 week',
        purpose: 'Photography workshop',
        adminNotes: 'Currently checked out',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=200&fit=crop'
      }
    ];

    setRequests(mockRequests);
    setFilteredRequests(mockRequests);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(request => request.status === selectedStatus));
    }
  }, [requests, selectedStatus]);

  const handleCancelRequest = (requestId) => {
    setRequests(requests.map(request => 
      request.id === requestId 
        ? { ...request, status: 'cancelled' }
        : request
    ));
    toast.success('Request cancelled successfully');
  };

  const handleReturnResource = (requestId) => {
    setRequests(requests.map(request => 
      request.id === requestId 
        ? { ...request, status: 'returned' }
        : request
    ));
    toast.success('Resource returned successfully');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'active':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'returned':
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'approved':
        return 'badge-success';
      case 'rejected':
        return 'badge-error';
      case 'active':
        return 'badge-info';
      case 'returned':
        return 'badge-neutral';
      case 'cancelled':
        return 'badge-neutral';
      default:
        return 'badge-neutral';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending Approval';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'active':
        return 'Currently Checked Out';
      case 'returned':
        return 'Returned';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const statuses = ['all', 'pending', 'approved', 'rejected', 'active', 'returned', 'cancelled'];

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Requests</h1>
        <p className="text-gray-600">Track your resource checkout requests</p>
      </div>

      {/* Filter */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter by status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="select select-bordered select-sm"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : getStatusText(status)}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {filteredRequests.length} of {requests.length} requests
          </div>
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRequests.map((request) => (
          <div key={request.id} className="card bg-white shadow-lg">
            <div className="card-body">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={request.image}
                    alt={request.resourceName}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{request.resourceName}</h3>
                    <div className="flex items-center mt-1">
                      {getStatusIcon(request.status)}
                      <span className={`badge ${getStatusBadge(request.status)} ml-2`}>
                        {getStatusText(request.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Request Date:</span>
                    <p className="font-medium">{request.requestDate}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <p className="font-medium">{request.duration}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Start Date:</span>
                    <p className="font-medium">{request.startDate}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">End Date:</span>
                    <p className="font-medium">{request.endDate}</p>
                  </div>
                </div>

                <div>
                  <span className="text-gray-500 text-sm">Purpose:</span>
                  <p className="text-sm mt-1">{request.purpose}</p>
                </div>

                {request.adminNotes && (
                  <div>
                    <span className="text-gray-500 text-sm">Admin Notes:</span>
                    <p className="text-sm mt-1 text-gray-600">{request.adminNotes}</p>
                  </div>
                )}

                <div className="card-actions justify-end pt-4">
                  {request.status === 'pending' && (
                    <button
                      onClick={() => handleCancelRequest(request.id)}
                      className="btn btn-outline btn-sm btn-error"
                    >
                      Cancel Request
                    </button>
                  )}
                  
                  {request.status === 'active' && (
                    <button
                      onClick={() => handleReturnResource(request.id)}
                      className="btn btn-primary btn-sm"
                    >
                      Return Resource
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-600">
            {selectedStatus === 'all' 
              ? "You haven't made any requests yet. Browse resources to get started!"
              : `No ${selectedStatus} requests found.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default RequestList; 
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
  const { user, userRole } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  // Fetch requests based on user role
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        let url = 'http://localhost:3000/api/requests';
        
        // If user is faculty or student, fetch only their requests
        if (userRole === 'faculty' || userRole === 'student') {
          url = `http://localhost:3000/api/requests/user/${user?.email}`;
        }
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setRequests(data);
          setFilteredRequests(data);
        } else {
          console.error('Failed to fetch requests');
          toast.error('Failed to fetch requests');
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
        toast.error('Error fetching requests');
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchRequests();
    }
  }, [user, userRole]);

  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(request => request.status === selectedStatus));
    }
  }, [requests, selectedStatus]);

  const handleCancelRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (response.ok) {
        setRequests(requests.map(request => 
          request._id === requestId 
            ? { ...request, status: 'cancelled' }
            : request
        ));
        toast.success('Request cancelled successfully');
      } else {
        toast.error('Failed to cancel request');
      }
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast.error('Error cancelling request');
    }
  };

  const handleReturnResource = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/requests/${requestId}/return`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          returnedAt: new Date().toISOString(),
          returnedBy: user?.email 
        }),
      });

      if (response.ok) {
        setRequests(requests.map(request => 
          request._id === requestId 
            ? { ...request, status: 'returned', returnedAt: new Date().toISOString() }
            : request
        ));
        toast.success('Resource returned successfully');
      } else {
        toast.error('Failed to return resource');
      }
    } catch (error) {
      console.error('Error returning resource:', error);
      toast.error('Error returning resource');
    }
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getPageTitle = () => {
    switch (userRole) {
      case 'admin':
        return 'All Requests';
      case 'faculty':
        return 'My Requests';
      case 'student':
        return 'My Requests';
      default:
        return 'Requests';
    }
  };

  const getPageSubtitle = () => {
    switch (userRole) {
      case 'admin':
        return 'Manage all resource checkout requests';
      case 'faculty':
        return 'Track your resource checkout requests';
      case 'student':
        return 'Track your resource checkout requests';
      default:
        return 'Track resource checkout requests';
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{getPageTitle()}</h1>
        <p className="text-gray-600">{getPageSubtitle()}</p>
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
          <div key={request._id} className="card bg-white shadow-lg">
            <div className="card-body">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={request.resourceImageUrl || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop'}
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
                {/* Show user info only for admin */}
                {userRole === 'admin' && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Requested by:</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      <p>{request.userName} ({request.userEmail})</p>
                      <p className="text-xs text-gray-500">Role: {request.userRole}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Request Date:</span>
                    <p className="font-medium">{formatDate(request.requestDate)}</p>
                  </div>
                  {request.dueDate && (
                    <div>
                      <span className="text-gray-500">Due Date:</span>
                      <p className="font-medium">{formatDate(request.dueDate)}</p>
                    </div>
                  )}
                  {request.returnedAt && (
                    <div>
                      <span className="text-gray-500">Returned Date:</span>
                      <p className="font-medium">{formatDate(request.returnedAt)}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">Resource Category:</span>
                    <p className="font-medium">{request.resourceCategory || 'N/A'}</p>
                  </div>
                </div>

                {request.purpose && (
                  <div>
                    <span className="text-gray-500 text-sm">Purpose:</span>
                    <p className="text-sm mt-1">{request.purpose}</p>
                  </div>
                )}

                {request.adminNotes && (
                  <div>
                    <span className="text-gray-500 text-sm">Admin Notes:</span>
                    <p className="text-sm mt-1 text-gray-600">{request.adminNotes}</p>
                  </div>
                )}

                <div className="card-actions justify-end pt-4">
                  {request.status === 'pending' && (
                    <button
                      onClick={() => handleCancelRequest(request._id)}
                      className="btn btn-outline btn-sm btn-error"
                    >
                      Cancel Request
                    </button>
                  )}
                  
                  {request.status === 'approved' && !request.returnedAt && (
                    <button
                      onClick={() => handleReturnResource(request._id)}
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
              ? userRole === 'admin' 
                ? "No requests have been made yet."
                : "You haven't made any requests yet. Browse resources to get started!"
              : `No ${selectedStatus} requests found.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default RequestList; 
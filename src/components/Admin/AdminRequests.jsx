import { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  User,
  Package,
  Calendar,
  MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  // Mock data - replace with API call
  useEffect(() => {
    const mockRequests = [
      {
        id: 1,
        resourceName: 'Projector Epson EX3260',
        resourceId: 1,
        userId: 'user1',
        userName: 'John Doe',
        userEmail: 'john.doe@university.edu',
        userRole: 'Student',
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
        userId: 'user2',
        userName: 'Dr. Jane Smith',
        userEmail: 'jane.smith@university.edu',
        userRole: 'Faculty',
        status: 'pending',
        requestDate: '2024-01-14',
        startDate: '2024-01-18',
        endDate: '2024-01-25',
        duration: '1 week',
        purpose: 'Research project development and data analysis',
        adminNotes: '',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop'
      },
      {
        id: 3,
        resourceName: 'Microscope Olympus',
        resourceId: 3,
        userId: 'user3',
        userName: 'Mike Johnson',
        userEmail: 'mike.johnson@university.edu',
        userRole: 'Student',
        status: 'approved',
        requestDate: '2024-01-12',
        startDate: '2024-01-16',
        endDate: '2024-01-19',
        duration: '3 days',
        purpose: 'Biology lab experiment for final project',
        adminNotes: 'Approved for academic research',
        image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=300&h=200&fit=crop'
      },
      {
        id: 4,
        resourceName: 'Camera Canon EOS R5',
        resourceId: 6,
        userId: 'user4',
        userName: 'Sarah Wilson',
        userEmail: 'sarah.wilson@university.edu',
        userRole: 'Student',
        status: 'rejected',
        requestDate: '2024-01-10',
        startDate: '2024-01-15',
        endDate: '2024-01-22',
        duration: '1 week',
        purpose: 'Personal photography project',
        adminNotes: 'Equipment reserved for academic use only',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=200&fit=crop'
      }
    ];

    setRequests(mockRequests);
    setFilteredRequests(mockRequests.filter(r => r.status === 'pending'));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(request => request.status === selectedStatus));
    }
  }, [requests, selectedStatus]);

  const handleApprove = (requestId) => {
    setRequests(requests.map(request => 
      request.id === requestId 
        ? { ...request, status: 'approved', adminNotes: adminNotes || 'Request approved' }
        : request
    ));
    setSelectedRequest(null);
    setAdminNotes('');
    toast.success('Request approved successfully');
  };

  const handleReject = (requestId) => {
    if (!adminNotes.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    
    setRequests(requests.map(request => 
      request.id === requestId 
        ? { ...request, status: 'rejected', adminNotes }
        : request
    ));
    setSelectedRequest(null);
    setAdminNotes('');
    toast.success('Request rejected');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
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
      default:
        return status;
    }
  };

  const statuses = ['all', 'pending', 'approved', 'rejected'];

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Requests</h1>
        <p className="text-gray-600">Review and approve resource checkout requests</p>
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

      {/* Requests Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Resource</th>
                <th>User</th>
                <th>Request Date</th>
                <th>Duration</th>
                <th>Purpose</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td>
                    <div className="flex items-center space-x-3">
                      <img
                        src={request.image}
                        alt={request.resourceName}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <div className="font-medium">{request.resourceName}</div>
                        <div className="text-sm text-gray-500">{request.startDate} - {request.endDate}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="font-medium">{request.userName}</div>
                      <div className="text-sm text-gray-500">{request.userEmail}</div>
                      <div className="text-xs text-gray-400">{request.userRole}</div>
                    </div>
                  </td>
                  <td>{request.requestDate}</td>
                  <td>{request.duration}</td>
                  <td>
                    <div className="max-w-xs truncate" title={request.purpose}>
                      {request.purpose}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center">
                      {getStatusIcon(request.status)}
                      <span className={`badge ${getStatusBadge(request.status)} ml-2`}>
                        {getStatusText(request.status)}
                      </span>
                    </div>
                  </td>
                  <td>
                    {request.status === 'pending' ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="btn btn-sm btn-primary"
                        >
                          Review
                        </button>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        {request.adminNotes && (
                          <div className="max-w-xs truncate" title={request.adminNotes}>
                            {request.adminNotes}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-600">
            {selectedStatus === 'all' 
              ? "No requests have been submitted yet."
              : `No ${selectedStatus} requests found.`
            }
          </p>
        </div>
      )}

      {/* Review Modal */}
      {selectedRequest && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Review Request</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedRequest.image}
                  alt={selectedRequest.resourceName}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-semibold text-lg">{selectedRequest.resourceName}</h4>
                  <p className="text-gray-600">{selectedRequest.startDate} - {selectedRequest.endDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Requestor</span>
                  </label>
                  <p>{selectedRequest.userName} ({selectedRequest.userRole})</p>
                  <p className="text-sm text-gray-500">{selectedRequest.userEmail}</p>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Duration</span>
                  </label>
                  <p>{selectedRequest.duration}</p>
                </div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">Purpose</span>
                </label>
                <p className="bg-gray-50 p-3 rounded">{selectedRequest.purpose}</p>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">Admin Notes</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="Add notes or reason for approval/rejection..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="modal-action">
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setAdminNotes('');
                }}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedRequest.id)}
                className="btn btn-error"
              >
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedRequest.id)}
                className="btn btn-success"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequests; 
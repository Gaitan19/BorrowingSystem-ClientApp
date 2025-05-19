'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { IRequest, IItem } from '../../../interfaces';
import { 
  getRequests, 
  deleteRequest, 
  createRequest, 
  updateRequest,
  approveRejectRequest,
  returnRequest
} from '../../../services/requests.service';
import AuthGuard from '../../../components/AuthGuard';
import Modal from '../../../components/ui/Modal';
import RequestForm from '../../../components/Requests/Form';
import { toast } from 'react-hot-toast';
import Table from '@/components/ui/Table';
import { getItems } from '@/services/items.service';
import { Button } from '@/components/ui/Button';
import  Select  from '@/components/ui/Select';

// Mapeo de estados numéricos
const REQUEST_STATUS = {
  0: 'Pending',
  1: 'Approved',
  2: 'Rejected'
} as const;

const RETURN_STATUS = {
  0: 'Pending',
  1: 'Returned'
} as const;

type RequestStatus = keyof typeof REQUEST_STATUS;
type ReturnStatus = keyof typeof RETURN_STATUS;

const RequestsPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [items, setItems] = useState<IItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<IRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [requestsData, itemsData] = await Promise.all([
          getRequests(),
          getItems()
        ]);
        
        setItems(itemsData);
        const filteredRequests = user?.role === 'admin' 
          ? requestsData 
          : requestsData.filter(r => r.requestedByUserId === user?.id);
        
        setRequests(filteredRequests);
      } catch (error) {
        toast.error('Error loading data');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) loadData();
  }, [user]);

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    try {
      const numericStatus = parseInt(newStatus) as RequestStatus;
      const isApproved = numericStatus === 1;
      
      await approveRejectRequest(requestId, isApproved);
      
      setRequests(prev => prev.map(request => 
        request.id === requestId ? {
          ...request, 
          requestStatus: numericStatus
        } : request
      ));
      
      toast.success(`Request ${REQUEST_STATUS[numericStatus]} successfully`);
    } catch (error) {
      toast.error('Error updating request status');
    }
  };

  const handleReturn = async (requestId: string) => {
    try {
      await returnRequest(requestId);
      setRequests(prev => prev.map(request => 
        request.id === requestId ? {
          ...request, 
          returnStatus: 1 // Marcar como Returned
        } : request
      ));
      toast.success('Items returned successfully');
    } catch (error) {
      toast.error('Error returning items');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this request?')) {
      try {
        await deleteRequest(id);
        setRequests(prev => prev.filter(r => r.id !== id));
        toast.success('Request deleted successfully');
      } catch (error) {
        toast.error('Error deleting request');
      }
    }
  };

  const handleSubmit = async (data: Omit<IRequest, 'id'>) => {
    try {
      if (selectedRequest) {
        const updatedRequest = await updateRequest(selectedRequest.id, data);
        setRequests(prev => 
          prev.map(r => r.id === selectedRequest.id ? updatedRequest : r
        ));
        toast.success('Request updated successfully');
      } else {
        const newRequest = await createRequest({
          ...data,
          requestedByUserId: user?.id || ''
        });
        setRequests(prev => [...prev, newRequest]);
        toast.success('Request created successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Error saving request');
    }
  };

  return (
    <AuthGuard allowedRoles={['admin', 'user']}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Requests</h1>
          {user?.role === 'admin' && (
            <Button 
              onClick={() => {
                setSelectedRequest(null);
                setIsModalOpen(true);
              }}
              variant="primary"
            >
              + New Request
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No requests found</div>
        ) : (
          <Table<IRequest>
            columns={[
              { 
                header: 'Description', 
                accessor: (item: IRequest) => item.description
              },
              { 
                header: 'Status', 
                accessor: (item: IRequest) => (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.requestStatus === 1 ? 'bg-green-100 text-green-800' :
                    item.requestStatus === 2 ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {REQUEST_STATUS[item.requestStatus]}
                  </span>
                )
              },
              { 
                header: 'Return Status', 
                accessor: (item: IRequest) => (
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.returnStatus === 1 ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {RETURN_STATUS[item.returnStatus]}
                    </span>
                    {item.requestStatus === 1 && 
                    item.returnStatus === 0 &&
                    user?.role === 'user' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReturn(item.id)}
                      >
                        Return
                      </Button>
                    )}
                  </div>
                )
              },
              { 
                header: 'Date', 
                accessor: (item: IRequest) => 
                  new Date(item.requestDate).toLocaleDateString()
              },
              { 
                header: 'Items', 
                accessor: (item: IRequest) => item.requestItems
                  .map(ri => {
                    const itemName = items.find(i => i.id === ri.itemId)?.name || 'Unknown Item';
                    return `${ri.quantity}x ${itemName}`;
                  })
                  .join(', ')
              },
              ...(user?.role === 'admin' ? [{
                header: 'Actions',
                accessor: (item: IRequest) => (
                  <div className="flex gap-2 items-center">
                    <Select
                      value={item.requestStatus.toString()}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      options={[
                        { value: '0', label: 'Pending' },
                        { value: '1', label: 'Approve' },
                        { value: '2', label: 'Reject' }
                      ]}
                      disabled={item.requestStatus !== 0}
                      className="w-40"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </div>
                )
              }] : [])
            ]}
            data={requests}
          />
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`${selectedRequest ? 'Edit' : 'Create'} Request`}
        >
          <RequestForm
            initialData={selectedRequest}
            items={items}
            onSubmit={handleSubmit}
          />
        </Modal>
      </div>
    </AuthGuard>
  );
};

export default RequestsPage;
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { IRequest, IItem } from '../../../interfaces';
import { 
  getRequests, 
  deleteRequest, 
  createRequest, 
  updateRequest 
} from '../../../services/requests.service';
import AuthGuard from '../../../components/AuthGuard';
import Modal from '../../../components/ui/Modal';
import RequestForm from '../../../components/Requests/Form';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import { getItems } from '@/services/items.service';

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
          prev.map(r => r.id === selectedRequest.id ? updatedRequest : r)
        );
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
            <Button onClick={() => {
              setSelectedRequest(null);
              setIsModalOpen(true);
            }}>
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
                accessor: 'description' 
              },
              { 
                header: 'Status', 
                accessor: (item) => (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.requestStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                    item.requestStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.requestStatus}
                  </span>
                )
              },
              { 
                header: 'Return Status', 
                accessor: (item) => (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.returnStatus === 'Returned' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.returnStatus}
                  </span>
                )
              },
              { 
                header: 'Date', 
                accessor: (item) => new Date(item.requestDate).toLocaleDateString() 
              },
              { 
                header: 'Items', 
                accessor: (item) => item.requestItems
                  .map(ri => {
                    const itemName = items.find(i => i.id === ri.itemId)?.name || 'Unknown Item';
                    return `${ri.quantity}x ${itemName}`;
                  })
                  .join(', ')
              }
            ]}
            data={requests}
            onEdit={user?.role === 'admin' ? (item) => {
              setSelectedRequest(item);
              setIsModalOpen(true);
            } : undefined}
            onDelete={user?.role === 'admin' ? handleDelete : undefined}
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
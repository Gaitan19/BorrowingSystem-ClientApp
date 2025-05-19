'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import AuthGuard from '../../../components/AuthGuard';
import Table from '../../../components/ui/Table';
import {Button} from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import ItemForm from '../../../components/Items/Form';
import { toast } from 'react-hot-toast';
import { IItem } from '../../../interfaces';
import { getItems, createItem, updateItem, deleteItem } from '../../../services/items.service';

const ItemsPage = () => {
  const [items, setItems] = useState<IItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadItems = async () => {
    try {
      const data = await getItems();
      setItems(data);
    } catch (error) {
      toast.error('Error loading items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleSubmit = async (data: Omit<IItem, 'id'>) => {
    try {
      if (selectedItem) {
        const updatedItem = await updateItem(selectedItem.id, data);
        setItems(prev => prev.map(item => 
          item.id === selectedItem.id ? updatedItem : item
        ));
        toast.success('Item updated successfully');
      } else {
        const newItem = await createItem(data);
        setItems(prev => [...prev, newItem]);
        toast.success('Item created successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Error saving item');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(id);
        setItems(prev => prev.filter(item => item.id !== id));
        toast.success('Item deleted successfully');
      } catch (error) {
        toast.error('Error deleting item');
      }
    }
  };

  return (
    <AuthGuard allowedRoles={['admin']}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Items Management</h1>
          <Button onClick={() => {
            setSelectedItem(null);
            setIsModalOpen(true);
          }}>
            + New Item
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading items...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No items found</div>
        ) : (
          <Table<IItem>
            columns={[
              { header: 'Name', accessor: 'name' },
              { header: 'Description', accessor: 'description' },
              { 
                header: 'Quantity', 
                accessor: (item) => (
                  <span className="font-mono">{item.quantity}</span>
                )
              }
            ]}
            data={items}
            onEdit={(item) => {
              setSelectedItem(item);
              setIsModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedItem ? 'Edit Item' : 'Create New Item'}
        >
          <ItemForm
            initialData={selectedItem}
            onSubmit={handleSubmit}
          />
        </Modal>
      </div>
    </AuthGuard>
  );
};

export default ItemsPage;
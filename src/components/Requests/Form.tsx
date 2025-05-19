'use client';

import { useState, useEffect } from 'react';
import { IRequest, IRequestItem, IItem } from '../../interfaces';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/Button';

interface RequestFormProps {
  initialData?: IRequest | null;
  items: IItem[];
  onSubmit: (data: Omit<IRequest, 'id'>) => void;
}

const RequestForm = ({ initialData, items, onSubmit }: RequestFormProps) => {
  const [description, setDescription] = useState('');
  const [requestItems, setRequestItems] = useState<IRequestItem[]>([]);

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description);
      setRequestItems(initialData.requestItems);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      toast.error('Description is required');
      return;
    }
    
    if (requestItems.length === 0) {
      toast.error('At least one item is required');
      return;
    }

    if (requestItems.some(item => item.quantity <= 0)) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    onSubmit({
      description,
      requestedByUserId: initialData?.requestedByUserId || '',
      requestStatus: initialData?.requestStatus ?? 0,
      returnStatus: initialData?.returnStatus ?? 0,
      requestDate: initialData?.requestDate || new Date().toISOString(),
      requestItems
    });
  };

  const addItem = () => {
    setRequestItems([...requestItems, { itemId: '', quantity: 1 }]);
  };

  const updateItem = (index: number, field: keyof IRequestItem, value: string | number) => {
    const newItems = [...requestItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setRequestItems(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = requestItems.filter((_, i) => i !== index);
    setRequestItems(newItems);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Description"
        value={description}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
        required
      />

      <div className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="font-medium">Items</h3>
        </div>
        
        {requestItems.map((item, index) => (
          <div key={index} className="flex gap-4 items-end">
            <Select
              label="Item"
              options={items.map(i => ({ value: i.id, label: i.name }))}
              value={item.itemId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                updateItem(index, 'itemId', e.target.value)
              }
              required
              className="flex-1"
            />
            <Input
              label="Quantity"
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                updateItem(index, 'quantity', parseInt(e.target.value) || 1)
              }
              required
              className="w-24"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="mb-1 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        ))}

        <Button
          type="button"
          onClick={addItem}
          variant="outline"
          className="w-full"
        >
          Add Item
        </Button>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full">
          {initialData ? 'Update Request' : 'Create Request'}
        </Button>
      </div>
    </form>
  );
};

export default RequestForm;
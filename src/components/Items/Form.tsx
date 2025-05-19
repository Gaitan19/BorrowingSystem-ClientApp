'use client';

import { useState, useEffect } from 'react';
import { IItem } from '../../interfaces';
import Input from '../ui/Input';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/Button';

interface ItemFormProps {
  initialData?: IItem | null;
  onSubmit: (data: Omit<IItem, 'id'>) => Promise<void>;
}

const ItemForm = ({ initialData, onSubmit }: ItemFormProps) => {
  const [formData, setFormData] = useState<Omit<IItem, 'id'>>({
    name: '',
    description: '',
    quantity: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        quantity: initialData.quantity
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      toast.success(`Item ${initialData ? 'updated' : 'created'} successfully`);
    } catch (error) {
      toast.error(`Error ${initialData ? 'updating' : 'creating'} item`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />
      <Input
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        required
      />
      <Input
        label="Quantity"
        type="number"
        min="0"
        value={formData.quantity}
        onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
        required
      />
      <Button type="submit" className="w-full">
        {initialData ? 'Update Item' : 'Create Item'}
      </Button>
    </form>
  );
};

export default ItemForm;
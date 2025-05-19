'use client';

import { useState, useEffect } from 'react';
import { IUser } from '../../interfaces';
import Input from '../ui/Input';
import Select from '../ui/Select';
import {Button} from '../ui/Button';
import { toast } from 'react-hot-toast';

interface UserFormProps {
  initialData?: IUser | null;
  onSubmit: (data: {
    name: string;
    email: string;
    password?: string;
    role: string;
  }) => Promise<void>;
}

const UserForm = ({ initialData, onSubmit }: UserFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        password: '',
        role: initialData.role
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({
        ...formData,
        password: formData.password || undefined
      });
      toast.success(`User ${initialData ? 'updated' : 'created'} successfully`);
    } catch (error) {
      toast.error(`Error ${initialData ? 'updating' : 'creating'} user`);
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
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        placeholder={initialData ? 'Leave blank to keep current' : ''}
        required={!initialData}
      />
      <Select
        label="Role"
        options={[
          { value: 'admin', label: 'Admin' },
          { value: 'user', label: 'User' }
        ]}
        value={formData.role}
        onChange={(e) => setFormData({...formData, role: e.target.value})}
        required
      />
      <Button type="submit" className="w-full">
        {initialData ? 'Update User' : 'Create User'}
      </Button>
    </form>
  );
};

export default UserForm;
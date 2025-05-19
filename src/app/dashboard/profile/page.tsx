'use client';

import { useAuth } from '../../../context/AuthContext';
import AuthGuard from '../../../components/AuthGuard';
import { FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import Input from '../../../components/ui/Input';
import { Button } from '@/components/ui/Button';
import { updateUser } from '@/services/users.service';


export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateUser(user.id, {
        name: formData.name,
        email: formData.email,
        password: formData.password || undefined
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  return (
    <AuthGuard allowedRoles={['admin', 'user']}>
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
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
            label="New Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            placeholder="Leave blank to keep current"
          />
          <div className="flex justify-end gap-4">
            <Button type="submit">Update Profile</Button>
            <Button variant="outline" onClick={logout}>Logout</Button>
          </div>
        </form>
      </div>
    </AuthGuard>
  );
}
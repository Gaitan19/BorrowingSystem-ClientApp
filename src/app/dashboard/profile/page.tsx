'use client';

import { useAuth } from '../../../context/AuthContext';
import AuthGuard from '../../../components/AuthGuard';
import { FormEvent, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Input from '../../../components/ui/Input';
import { Button } from '@/components/ui/Button';
import { getUserById, updateUser } from '@/services/users.service';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (user?.id) {
        try {
          const userData = await getUserById(user.id);
          setFormData({
            name: userData.name,
            email: userData.email,
            password: userData.password || ''
          });
        } catch (error) {
          toast.error('Error loading user data');
        } finally {
          setLoading(false);
        }
      }
    };

    loadUserData();
  }, [user?.id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateUser(user.id, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: user.role
      });
      toast.success('Profile updated successfully');
      setFormData(prev => ({...prev, password: formData.password}));
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (loading) {
    return (
      <AuthGuard allowedRoles={['admin', 'user']}>
        <div className="p-4 max-w-2xl mx-auto text-center">
          <div className="animate-pulse">Loading user data...</div>
        </div>
      </AuthGuard>
    );
  }

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
          <div className="relative">
            <Input
              label="New Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="flex justify-end gap-4">
            <Button type="submit">Update Profile</Button>
            <Button variant="outline" onClick={logout}>Logout</Button>
          </div>
        </form>
      </div>
    </AuthGuard>
  );
}
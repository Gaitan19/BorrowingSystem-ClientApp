'use client';

import { useAuth } from '../../../context/AuthContext';
import AuthGuard from '../../../components/AuthGuard';
import { FormEvent, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Input from '../../../components/ui/Input';
import { Button } from '@/components/ui/Button';
import { getUserById, updateUser } from '@/services/users.service';
import { EyeIcon, EyeSlashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

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
        <div className="flex justify-center items-center min-h-[300px]">
          <ArrowPathIcon className="h-12 w-12 text-blue-600 animate-spin" />
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard allowedRoles={['admin', 'user']}>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-xl shadow-lg mb-8">
          <h1 className="text-3xl font-bold text-white">User Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="space-y-5">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              className="focus:ring-2 focus:ring-blue-500"
            />
            
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              className="focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="relative">
              <Input
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="pr-10 focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 stroke-2" />
                ) : (
                  <EyeIcon className="h-5 w-5 stroke-2" />
                )}
              </button>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg 
                  shadow-md hover:shadow-lg transition-all font-medium"
              >
                Update Profile
              </Button>
              <Button
                variant="outline"
                onClick={logout}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-lg 
                  shadow-sm hover:shadow-md transition-all font-medium"
              >
                Logout
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AuthGuard>
  );
}
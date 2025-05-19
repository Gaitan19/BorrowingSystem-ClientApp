'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import AuthGuard from '../../../components/AuthGuard';
import Table from '../../../components/ui/Table';
import {Button} from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import UserForm from '../../../components/Users/Form';
import { toast } from 'react-hot-toast';
import { IUser } from '../../../interfaces';
import { getUsers, createUser, updateUser, deleteUser } from '../../../services/users.service';

const UsersPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (data: {
    name: string;
    email: string;
    password?: string;
    role: string;
  }) => {
    try {
      if (selectedUser) {
        const updatedUser = await updateUser(selectedUser.id, data);
        setUsers(prev => prev.map(user => 
          user.id === selectedUser.id ? updatedUser : user
        ));
        toast.success('User updated successfully');
      } else {
        const newUser = await createUser({
          ...data,
          password: data.password ?? ''
        });
        setUsers(prev => [...prev, newUser]);
        toast.success('User created successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Error saving user');
    }
  };

  const handleDelete = async (id: string) => {
    if (id === currentUser?.id) {
      toast.error('You cannot delete your own account');
      return;
    }
    
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        setUsers(prev => prev.filter(user => user.id !== id));
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Error deleting user');
      }
    }
  };

  return (
    <AuthGuard allowedRoles={['admin']}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Users Management</h1>
          <Button onClick={() => {
            setSelectedUser(null);
            setIsModalOpen(true);
          }}>
            + New User
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No users found</div>
        ) : (
          <Table<IUser>
            columns={[
              { header: 'Name', accessor: 'name' },
              { header: 'Email', accessor: 'email' },
              { 
                header: 'Role', 
                accessor: (user) => (
                  <span className="capitalize px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                    {user.role}
                  </span>
                )
              }
            ]}
            data={users}
            onEdit={(user) => {
              setSelectedUser(user);
              setIsModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedUser ? 'Edit User' : 'Create New User'}
        >
          <UserForm
            initialData={selectedUser}
            onSubmit={handleSubmit}
          />
        </Modal>
      </div>
    </AuthGuard>
  );
};

export default UsersPage;
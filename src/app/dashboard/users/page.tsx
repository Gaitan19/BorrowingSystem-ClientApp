"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import AuthGuard from "../../../components/AuthGuard";
import Table from "../../../components/ui/Table";
import Modal from "../../../components/ui/Modal";
import UserForm from "../../../components/Users/Form";
import { toast } from "react-hot-toast";
import { IUser } from "../../../interfaces";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../../services/users.service";
import Loading from "@/components/ui/Loading";
import { PlusIcon, PencilIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

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
      toast.error("Error loading users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (formData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    try {
      if (selectedUser) {
        const payload: {
          name: string;
          email: string;
          role: string;
          password: string;
        } = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          password: formData.password
        };

        const updatedUser = await updateUser(selectedUser.id, payload);
        setUsers(prev => prev.map(user => 
          user.id === selectedUser.id ? updatedUser : user
        ));
        toast.success("User updated successfully");
      } else {
        if (!formData.password || formData.password.trim() === "") {
          toast.error("Password is required for new users");
          return;
        }
        
        const newUser = await createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
        setUsers(prev => [...prev, newUser]);
        toast.success("User created successfully");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Error saving user");
    }
  };

  const handleDelete = async (id: string) => {
    if (id === currentUser?.id) {
      toast.error("You cannot delete your own account");
      return;
    }

    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        setUsers(prev => prev.filter(user => user.id !== id));
        toast.success("User deleted successfully");
      } catch (error) {
        toast.error("Error deleting user");
      }
    }
  };

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-xl shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center md:text-left">User Management</h1>
          <button
            onClick={() => {
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
            className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 md:px-6 md:py-3 rounded-lg 
      shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 
      font-medium text-xs md:text-sm"
          >
            <PlusIcon className="h-5 w-5 stroke-2" />
            New User
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <ArrowPathIcon className="h-12 w-12 text-blue-600 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-600 font-medium text-lg">No users found</p>
          </div>
        ) : (
          <Table<IUser>
            columns={[
              { 
                header: "Name", 
                accessor: "name",
              },
              { 
                header: "Email", 
                accessor: "email",
              },
              {
                header: "Role",
                accessor: (user) => (
                  <span className="capitalize px-3 py-1 rounded-full text-sm 
                    bg-purple-100 text-purple-800">
                    {user.role}
                  </span>
                ),
              },
              {
                header: "Actions",
                accessor: (user) => (
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-700 px-2.5 py-1.5 rounded-md 
                        transition-colors flex items-center gap-1.5 border border-indigo-200
                        bg-indigo-50 hover:bg-indigo-100 text-sm font-medium"
                    >
                      <PencilIcon className="h-4 w-4 stroke-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-700 px-2.5 py-1.5 rounded-md 
                        transition-colors flex items-center gap-1.5 border border-red-200
                        bg-red-50 hover:bg-red-100 text-sm font-medium"
                      disabled={user.id === currentUser?.id}
                    >
                      <TrashIcon className="h-4 w-4 stroke-2" />
                      Delete
                    </button>
                  </div>
                ),
              },
            ]}
            data={users}
          />
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedUser ? "Edit User" : "Create New User"}
        >
          <UserForm 
            initialData={selectedUser} 
            onSubmit={handleSubmit}
            currentUserId={currentUser?.id}
          />
        </Modal>
      </div>
    </AuthGuard>
  );
};

export default UsersPage;
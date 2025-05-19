'use client';

import { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { Button } from '../ui/Button';
import { IUser } from '@/interfaces';

interface UserFormProps {
  initialData?: IUser | null;
  onSubmit: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => void;
  currentUserId?: string;
}

const UserForm = ({ initialData, onSubmit, currentUserId }: UserFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(initialData?.role || "user");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
      setRole(initialData.role);
      setPassword(initialData.password || "");
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!initialData && !password.trim()) {
      alert("Password is required for new users");
      return;
    }

    onSubmit({
      name,
      email,
      password,
      role: initialData?.id === currentUserId ? "user" : role
    });
  };

  const handlePasswordFocus = () => {
    if (password === "********") {
      setPassword("");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={!initialData}
          onFocus={handlePasswordFocus}
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
      {initialData?.id !== currentUserId && (
        <Select
          label="Role"
          options={[
            { value: "admin", label: "Admin" },
            { value: "user", label: "User" }
          ]}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
      )}
      <Button type="submit" className="w-full">
        {initialData ? "Update User" : "Create User"}
      </Button>
    </form>
  );
};

export default UserForm;
'use client';

import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center px-4 py-4">
        <div className="text-xl font-bold">Dashboard</div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{user?.email}</span>
          <Button onClick={logout} variant="secondary">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
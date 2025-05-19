'use client';

import { useSidebar } from '@/context/SidebarContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

const Header = () => {
  const { user, logout } = useAuth();
  const { toggle, isOpen } = useSidebar();

  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            className="md:hidden block text-gray-600 hover:text-gray-800"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          <div className="text-xl font-bold">Dashboard</div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 hidden md:inline truncate max-w-[160px]">
            {user?.email}
          </span>
          <Button onClick={logout} variant="secondary" className="text-sm md:text-base">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
'use client';

import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-800 text-white p-4">
      <div className="text-xl font-bold mb-8">Borrowing System</div>
      <nav className="space-y-2">
        {user?.role === 'admin' && (
          <>
            <Link href="/dashboard/users" className="block p-2 hover:bg-gray-700 rounded">
              Users
            </Link>
            <Link href="/dashboard/items" className="block p-2 hover:bg-gray-700 rounded">
              Items
            </Link>
          </>
        )}
        <Link href="/dashboard/requests" className="block p-2 hover:bg-gray-700 rounded">
          Requests
        </Link>
        <Link href="/dashboard/profile" className="block p-2 hover:bg-gray-700 rounded">
          Profile
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
"use client";

import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from '@/context/SidebarContext';

const Sidebar = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebar();

  return (
    <>
      <div className={`fixed left-0 top-0 h-full w-full md:w-64 bg-gray-800 text-white p-4 border-r border-gray-700 transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <div className="text-xl font-bold mb-8">
          <Link href="/dashboard" className="text-white" onClick={() => { if(window.innerWidth < 768) toggle() }}>
            Borrowing System
          </Link>
        </div>
        
        <nav className="space-y-2">
          {user?.role === "admin" && (
            <>
              <Link
                href="/dashboard/users"
                onClick={() => { if(window.innerWidth < 768) toggle() }}
                className={`block p-2 hover:bg-gray-700 rounded ${
                  pathname === "/dashboard/users" ? "bg-gray-700" : ""
                }`}
              >
                Users
              </Link>
              <Link
                href="/dashboard/items"
                onClick={() => { if(window.innerWidth < 768) toggle() }}
                className={`block p-2 hover:bg-gray-700 rounded ${
                  pathname === "/dashboard/items" ? "bg-gray-700" : ""
                }`}
              >
                Items
              </Link>
            </>
          )}
          <Link
            href="/dashboard/requests"
            onClick={() => { if(window.innerWidth < 768) toggle() }}
            className={`block p-2 hover:bg-gray-700 rounded ${
              pathname.startsWith("/dashboard/requests") ? "bg-gray-700" : ""
            }`}
          >
            Requests
          </Link>
          <Link
            href="/dashboard/profile"
            onClick={() => { if(window.innerWidth < 768) toggle() }}
            className={`block p-2 hover:bg-gray-700 rounded ${
              pathname === "/dashboard/profile" ? "bg-gray-700" : ""
            }`}
          >
            Profile
          </Link>
        </nav>
      </div>

      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 md:hidden z-40" 
          onClick={toggle}
        />
      )}
    </>
  );
};

export default Sidebar;
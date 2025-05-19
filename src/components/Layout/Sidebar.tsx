"use client";

import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-800 text-white p-4 border-r border-gray-700">
      <div className="text-xl font-bold mb-8">
        <Link href="/dashboard" className="text-white">
          Borrowing System
        </Link>
      </div>
      <nav className="space-y-2">
        {user?.role === "admin" && (
          <>
            <Link
              href="/dashboard/users"
              className={`block p-2 hover:bg-gray-700 rounded ${
                pathname === "/dashboard/users" ? "bg-gray-700" : ""
              }`}
            >
              Users
            </Link>
            <Link
              href="/dashboard/items"
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
          className={`block p-2 hover:bg-gray-700 rounded ${
            pathname.startsWith("/dashboard/requests") ? "bg-gray-700" : ""
          }`}
        >
          Requests
        </Link>
        <Link
          href="/dashboard/profile"
          className={`block p-2 hover:bg-gray-700 rounded ${
            pathname === "/dashboard/profile" ? "bg-gray-700" : ""
          }`}
        >
          Profile
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;

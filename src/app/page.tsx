import Link from "next/link";
import { BookOpenIcon, ArrowRightIcon, UserGroupIcon, ShieldCheckIcon, ChartBarIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to 
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}BorrowSystem
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Manage your resources efficiently with our comprehensive borrowing management system
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg 
                shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-lg
                font-medium justify-center"
            >
              Get Started
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            
            <Link
              href="/about"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg 
                shadow-sm hover:shadow-md transition-all text-lg font-medium
                flex items-center justify-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Key Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <BookOpenIcon className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Item Borrowing</h3>
            <p className="text-gray-600">
              Track items, manage loans, and monitor returns with real-time updates
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <UserGroupIcon className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">User Management</h3>
            <p className="text-gray-600">
              Manage user roles and permissions with multi-level access control
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <ShieldCheckIcon className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Security</h3>
            <p className="text-gray-600">
              Enterprise-grade security with role-based authentication
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold mb-2">500+</p>
            <p className="text-gray-200">Items Managed</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-2">1K+</p>
            <p className="text-gray-200">Monthly Transactions</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-2">99.9%</p>
            <p className="text-gray-200">Uptime Guarantee</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 mb-4">
            © 2024 BorrowSystem. All rights reserved.
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/docs" className="text-gray-300 hover:text-white transition-colors">
              Documentation
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
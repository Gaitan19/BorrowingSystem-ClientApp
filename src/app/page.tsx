import Link from "next/link";
import { 
  BookOpenIcon, 
  ArrowRightIcon, 
  UserGroupIcon, 
  ShieldCheckIcon, 
  ChartBarIcon,
  CubeIcon,
  ClockIcon,
  CheckCircleIcon,
  DocumentChartBarIcon
} from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <header className="container mx-auto px-4 lg:px-8 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Streamline Your Inventory Management with
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block mt-3">
              BorrowSystem Pro
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Efficiently manage equipment loans, track inventory movements, and automate borrowing workflows with our comprehensive management solution.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl 
                shadow-lg hover:shadow-xl transition-all flex items-center gap-3 text-lg
                font-medium justify-center transform hover:scale-105"
            >
              <ArrowRightIcon className="h-5 w-5" />
              Get Started
            </Link>
            
            <Link
              href="/features"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50/50 px-8 py-4 rounded-xl 
                shadow-sm hover:shadow-md transition-all text-lg font-medium
                flex items-center justify-center transform hover:scale-105"
            >
              <DocumentChartBarIcon className="h-5 w-5 mr-2" />
              Explore Features
            </Link>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Core Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="bg-blue-100 w-fit p-3 rounded-xl mb-4">
              <BookOpenIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Item Tracking</h3>
            <p className="text-gray-600">
              Real-time inventory tracking with automated quantity updates
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="bg-green-100 w-fit p-3 rounded-xl mb-4">
              <UserGroupIcon className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Role Management</h3>
            <p className="text-gray-600">
              Granular user permissions and access controls
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="bg-purple-100 w-fit p-3 rounded-xl mb-4">
              <ShieldCheckIcon className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Security</h3>
            <p className="text-gray-600">
              Enterprise-grade authentication with audit logging
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="bg-orange-100 w-fit p-3 rounded-xl mb-4">
              <ChartBarIcon className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Analytics</h3>
            <p className="text-gray-600">
              Detailed usage reports and trend analysis
            </p>
          </div>
        </div>
      </section>

      <section className="bg-indigo-50 py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Simple Workflow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <CubeIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Item Selection</h3>
              <p className="text-gray-600">Choose from available inventory</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Approval Process</h3>
              <p className="text-gray-600">Automated request validation</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Completion</h3>
              <p className="text-gray-600">End-to-end transaction tracking</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-4">
            <p className="text-3xl md:text-4xl font-bold mb-2">500+</p>
            <p className="text-sm md:text-base text-blue-100">Active Users</p>
          </div>
          <div className="p-4">
            <p className="text-3xl md:text-4xl font-bold mb-2">1M+</p>
            <p className="text-sm md:text-base text-blue-100">Monthly Transactions</p>
          </div>
          <div className="p-4">
            <p className="text-3xl md:text-4xl font-bold mb-2">99.99%</p>
            <p className="text-sm md:text-base text-blue-100">System Uptime</p>
          </div>
          <div className="p-4">
            <p className="text-3xl md:text-4xl font-bold mb-2">24/7</p>
            <p className="text-sm md:text-base text-blue-100">Support Coverage</p>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">BorrowSystem</h4>
              <p className="text-gray-400 text-sm">
                Enterprise-grade inventory management solution for modern organizations.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-gray-300 hover:text-white transition-colors text-sm">Features</Link></li>
                <li><Link href="/pricing" className="text-gray-300 hover:text-white transition-colors text-sm">Pricing</Link></li>
                <li><Link href="/security" className="text-gray-300 hover:text-white transition-colors text-sm">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/docs" className="text-gray-300 hover:text-white transition-colors text-sm">Documentation</Link></li>
                <li><Link href="/blog" className="text-gray-300 hover:text-white transition-colors text-sm">Blog</Link></li>
                <li><Link href="/status" className="text-gray-300 hover:text-white transition-colors text-sm">System Status</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">About</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">Contact</Link></li>
                <li><Link href="/careers" className="text-gray-300 hover:text-white transition-colors text-sm">Careers</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 BorrowSystem. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
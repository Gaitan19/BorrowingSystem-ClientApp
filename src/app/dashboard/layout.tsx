import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import { AuthProvider } from '@/context/AuthContext';
import { SidebarProvider } from '@/context/SidebarContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dashboard - Borrowing System',
  description: 'Management system for borrowing items',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <AuthProvider>
          <SidebarProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 min-w-0 md:ml-64 overflow-x-hidden">
                <Header />
                <div className="p-2 md:p-4 w-full max-w-full overflow-x-auto">
                  {children}
                </div>
              </main>
            </div>
          </SidebarProvider>
        </AuthProvider>
  );
}
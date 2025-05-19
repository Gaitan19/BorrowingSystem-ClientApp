import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import { AuthProvider } from '@/context/AuthContext';

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
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64">
              <Header />
              <div className="p-4">
                {children}
              </div>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
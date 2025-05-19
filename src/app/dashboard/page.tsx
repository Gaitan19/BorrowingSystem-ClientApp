'use client';

import { useAuth } from '../../context/AuthContext';
import AuthGuard from '../../components/AuthGuard';
import Sidebar from '../../components/Layout/Sidebar';
import Header from '../../components/Layout/Header';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getRequests } from '../../services/requests.service';
import { getItems } from '../../services/items.service';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({ 
    totalRequests: 0,
    pendingRequests: 0,
    totalItems: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;
      
      try {
        const [requests, items] = await Promise.all([
          getRequests(),
          getItems()
        ]);

        const pendingRequests = requests.filter(
          r => r.requestStatus === 0
        ).length;

        setStats({
          totalRequests: requests.length,
          pendingRequests,
          totalItems: items.length
        });
      } catch (error) {
        toast.error('Error loading statistics');
      }
    };

    if (!loading) loadStats();
  }, [loading, user]);

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <AuthGuard allowedRoles={['admin', 'user']}>
      <div className="min-h-screen bg-gray-100">
        <div className="ml-64 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <StatCard 
              title="Total Requests" 
              value={stats.totalRequests}
              color="bg-blue-100"
            />
            <StatCard
              title="Pending Requests"
              value={stats.pendingRequests}
              color="bg-yellow-100"
            />
            <StatCard
              title="Available Items"
              value={stats.totalItems}
              color="bg-green-100"
            />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

const StatCard = ({ title, value, color }: { 
  title: string; 
  value: number;
  color: string;
}) => (
  <div className={`${color} p-6 rounded-lg shadow`}>
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-3xl mt-2 font-bold">{value}</p>
  </div>
);
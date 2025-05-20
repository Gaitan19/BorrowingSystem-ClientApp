'use client';

import { useAuth } from '../../context/AuthContext';
import AuthGuard from '../../components/AuthGuard';
import Sidebar from '../../components/Layout/Sidebar';
import Header from '../../components/Layout/Header';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getRequests } from '../../services/requests.service';
import { getItems } from '../../services/items.service';
import { ArrowPathIcon, ClockIcon, CubeIcon, InboxIcon } from '@heroicons/react/24/outline';

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

  return (
    <AuthGuard allowedRoles={['admin', 'user']}>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="md:ml-64 p-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <StatCard 
              title="Total Requests" 
              value={stats.totalRequests}
              icon={<InboxIcon className="h-8 w-8 text-white" />}
              color="from-blue-600 to-indigo-600"
            />
            <StatCard
              title="Pending Requests"
              value={stats.pendingRequests}
              icon={<ClockIcon className="h-8 w-8 text-white" />}
              color="from-amber-600 to-orange-600"
            />
            <StatCard
              title="Available Items"
              value={stats.totalItems}
              icon={<CubeIcon className="h-8 w-8 text-white" />}
              color="from-emerald-600 to-green-600"
            />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

const StatCard = ({ title, value, icon, color }: { 
  title: string; 
  value: number;
  icon: React.ReactNode;
  color: string;
}) => (
  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className={`bg-gradient-to-r ${color} p-4 rounded-t-xl`}>
      <div className="flex items-center justify-between">
        <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
          {icon}
        </div>
        <ArrowPathIcon className="h-6 w-6 text-white/50" />
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-500">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
  </div>
);
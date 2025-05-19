'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthGuard({ children, allowedRoles }: { 
  children: React.ReactNode;
  allowedRoles: string[] 
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (user && !allowedRoles.includes(user.role)) {
      router.push('/dashboard');
    }
  }, [user, loading, router, allowedRoles]);

  if (loading || !user) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return <>{children}</>;
}
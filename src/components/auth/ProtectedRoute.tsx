'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('Customer' | 'Owner' | 'Admin')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Crucial: Wait until auth has completed loading so reload never redirects active sessions!
    if (!isLoading) {
      if (!user) {
        // Preserve intended path to redirect back after login
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (allowedRoles && allowedRoles.length > 0) {
        const hasRole = allowedRoles.some(
          (role) => role.toLowerCase() === user.role?.toLowerCase()
        );
        if (!hasRole) {
          // Redirect to their own dashboard
          if (user.role === 'Admin') router.push('/dashboard/admin');
          else if (user.role === 'Owner') router.push('/dashboard/owner');
          else router.push('/dashboard/customer');
        }
      }
    }
  }, [user, isLoading, router, pathname, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <Loader2 className="w-6 h-6 text-primary absolute animate-pulse" />
        </div>
        <p className="text-sm font-medium text-base-content/70 animate-pulse">
          Verifying secure session...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.some((role) => role.toLowerCase() === user.role?.toLowerCase())
  ) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

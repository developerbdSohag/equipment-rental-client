'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfileTab from '@/components/dashboard/ProfileTab';
import { User, ArrowLeft } from 'lucide-react';
import NextLink from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  const getDashboardBackLink = () => {
    if (user?.role === 'Admin') return '/dashboard/admin';
    if (user?.role === 'Owner') return '/dashboard/owner';
    return '/dashboard/customer';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-base-100 py-10 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Breadcrumb / Back button */}
          <div className="flex items-center justify-between">
            <NextLink
              href={getDashboardBackLink()}
              className="inline-flex items-center gap-2 text-xs font-bold text-base-content/60 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </NextLink>

            <span className="text-xs font-bold text-base-content/40">
              Account Management
            </span>
          </div>

          {/* Profile Management Suite */}
          <ProfileTab />

        </div>
      </div>
    </ProtectedRoute>
  );
}

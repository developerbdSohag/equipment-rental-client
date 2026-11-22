'use client';

import React from 'react';
import OwnerLoginPortal from '@/components/auth/OwnerLoginPortal';

export default function OwnerLoginPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] dark:bg-[#070d19] py-8 sm:py-14 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-colors">
      <OwnerLoginPortal />
    </div>
  );
}

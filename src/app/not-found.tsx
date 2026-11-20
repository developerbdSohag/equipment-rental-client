'use client';

import React from 'react';
import NextLink from 'next/link';
import { Truck, Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 transition-colors">
      <div className="max-w-md w-full text-center space-y-6">
        
        <div className="relative inline-block">
          <span className="text-8xl sm:text-9xl font-black text-primary/20 select-none">404</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-base-200 border border-base-300 flex items-center justify-center text-primary shadow-lg">
              <Truck className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
            Equipment Route Not Found
          </h1>
          <p className="text-xs text-base-content/70 max-w-sm mx-auto">
            The equipment listing or page you are looking for does not exist or may have been relocated.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <NextLink
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </NextLink>

          <NextLink
            href="/equipment"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-base-300 text-xs font-bold text-base-content hover:bg-base-200 transition-all flex items-center justify-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Browse Catalog</span>
          </NextLink>
        </div>

      </div>
    </div>
  );
}

'use client';

import React, { useEffect } from 'react';
import NextLink from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Runtime Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 transition-colors">
      <div className="max-w-md w-full bg-base-100 rounded-3xl border border-base-300 p-8 text-center shadow-xl space-y-6">
        
        <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center ring-8 ring-rose-500/10">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-500">System Notice</span>
          <h2 className="text-2xl font-black text-base-content tracking-tight">Something Went Wrong</h2>
          <p className="text-xs text-base-content/70">
            An unexpected error occurred while loading this page. Our team has been notified.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 rounded-xl bg-primary text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>

          <NextLink
            href="/"
            className="flex-1 py-3 rounded-xl border border-base-300 text-xs font-bold text-base-content hover:bg-base-200 transition-all flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Go to Home</span>
          </NextLink>
        </div>

      </div>
    </div>
  );
}

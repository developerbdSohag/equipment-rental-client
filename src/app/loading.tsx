'use client';

import React from 'react';
import { Truck, Loader2 } from 'lucide-react';

export default function RootLoading() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center space-y-4 transition-colors">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary animate-bounce">
          <Truck className="w-8 h-8" />
        </div>
      </div>

      <div className="flex items-center space-x-2 text-sm font-bold text-base-content/80">
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
        <span>Loading Equipment Platform...</span>
      </div>
    </div>
  );
}

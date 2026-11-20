'use client';

import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="flex flex-col h-full rounded-3xl border border-base-300/80 bg-base-100/80 overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-[16/10] w-full bg-base-300/60" />
      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-base-300/60 rounded-full w-1/3" />
          <div className="h-5 bg-base-300/60 rounded-full w-3/4" />
          <div className="h-3 bg-base-300/60 rounded-full w-1/2" />
        </div>
        <div className="pt-4 border-t border-base-200 flex justify-between items-center">
          <div className="h-6 bg-base-300/60 rounded-full w-1/4" />
          <div className="h-9 bg-base-300/60 rounded-2xl w-1/3" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;

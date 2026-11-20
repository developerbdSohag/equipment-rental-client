'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import NextLink from 'next/link';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  return (
    <div className="min-h-screen bg-base-100 py-16 flex items-center justify-center transition-colors">
      <div className="max-w-md mx-auto px-4 text-center">
        
        <div className="bg-base-100 rounded-3xl border border-base-300 p-8 sm:p-10 shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center ring-8 ring-rose-500/10">
            <XCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500">Checkout Cancelled</span>
            <h1 className="text-2xl font-black text-base-content tracking-tight">Payment Was Not Completed</h1>
            <p className="text-xs text-base-content/70">
              Your Stripe checkout session was cancelled. No charges were made to your account.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <NextLink
              href="/equipment"
              className="py-3.5 rounded-2xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Equipment Catalog</span>
            </NextLink>

            <NextLink
              href="/dashboard/customer"
              className="py-3.5 rounded-2xl border border-base-300 text-xs font-bold text-base-content hover:bg-base-200"
            >
              Go to Customer Dashboard
            </NextLink>
          </div>
        </div>

      </div>
    </div>
  );
}

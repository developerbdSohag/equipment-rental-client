'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/lib/api';
import { CheckCircle2, Loader2, ArrowRight, FileText, Truck, Shield } from 'lucide-react';
import NextLink from 'next/link';

export default function PaymentSuccessPageWrapper() {
  return (
    <ProtectedRoute>
      <PaymentSuccessContent />
    </ProtectedRoute>
  );
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const bookingId = searchParams.get('bookingId');
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bookingId) {
      setError('Missing booking reference.');
      setLoading(false);
      return;
    }

    const verifyAndConfirm = async () => {
      try {
        const res = await api.post('/payments/verify', {
          bookingId,
          sessionId
        });

        if (res.data.success) {
          setBooking(res.data.booking);
          setTransactionId(res.data.transactionId || sessionId || 'TXN_SUCCESS');
        } else {
          setError(res.data.message || 'Payment verification failed.');
        }
      } catch (err: any) {
        console.error('Error verifying payment:', err);
        setError(err.response?.data?.message || 'Payment verification failed.');
      } finally {
        setLoading(false);
      }
    };

    verifyAndConfirm();
  }, [bookingId, sessionId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <h2 className="text-xl font-bold text-base-content">Verifying Stripe Payment...</h2>
        <p className="text-sm text-base-content/60">Securing your rental dates and updating equipment records.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-base-content">Payment Verification Notice</h2>
        <p className="text-sm text-base-content/70">{error}</p>
        <NextLink
          href="/dashboard/customer"
          className="inline-block px-6 py-3 rounded-2xl bg-primary text-white text-sm font-bold"
        >
          Check My Rentals
        </NextLink>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-16 transition-colors">
      <div className="max-w-xl mx-auto px-4">
        
        <div className="bg-base-100 rounded-3xl border border-base-300 p-8 sm:p-10 shadow-xl text-center space-y-6">
          
          {/* Animated Success Badge */}
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 text-emerald-500 mx-auto flex items-center justify-center ring-8 ring-emerald-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Payment Complete</span>
            <h1 className="text-3xl font-black text-base-content tracking-tight">Rental Confirmed!</h1>
            <p className="text-sm text-base-content/70">
              Your equipment booking is confirmed and secured in the system. The owner has been notified.
            </p>
          </div>

          {/* Receipt Card */}
          <div className="bg-base-200/50 p-6 rounded-2xl border border-base-200 text-left space-y-3 text-xs">
            <div className="flex justify-between border-b border-base-200 pb-2">
              <span className="text-base-content/60">Transaction ID:</span>
              <span className="font-mono font-bold text-base-content">{transactionId}</span>
            </div>
            <div className="flex justify-between border-b border-base-200 pb-2">
              <span className="text-base-content/60">Equipment:</span>
              <span className="font-bold text-base-content">{booking?.equipmentName}</span>
            </div>
            <div className="flex justify-between border-b border-base-200 pb-2">
              <span className="text-base-content/60">Rental Period:</span>
              <span className="font-bold text-base-content">{booking?.startDate} to {booking?.endDate}</span>
            </div>
            <div className="flex justify-between border-b border-base-200 pb-2">
              <span className="text-base-content/60">Total Paid:</span>
              <span className="font-black text-primary text-sm">৳{Number(booking?.totalAmount || 0).toLocaleString('en-BD')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/60">Payment Status:</span>
              <span className="font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">Paid via Stripe</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <NextLink
              href="/dashboard/customer"
              className="flex-1 py-3.5 rounded-2xl bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              <span>View in My Rentals</span>
              <ArrowRight className="w-4 h-4" />
            </NextLink>

            <NextLink
              href="/equipment"
              className="flex-1 py-3.5 rounded-2xl border border-base-300 text-base-content text-sm font-bold hover:bg-base-200 transition-all"
            >
              Rent More Equipment
            </NextLink>
          </div>

        </div>

      </div>
    </div>
  );
}

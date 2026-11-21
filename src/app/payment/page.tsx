'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import NextLink from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import {
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Loader2,
  ExternalLink,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentPageWrapper() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm font-bold text-base-content">Loading Payment Gateway...</p>
          </div>
        }
      >
        <PaymentPageContent />
      </Suspense>
    </ProtectedRoute>
  );
}

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get('bookingId');
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [stripeRedirecting, setStripeRedirecting] = useState(false);

  // Stripe Card Form State
  const [cardName, setCardName] = useState(user?.name || 'Authorized Renter');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [rawCardNumber, setRawCardNumber] = useState('4242424242424242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [billingZip, setBillingZip] = useState('1208');

  // Load Booking Data
  useEffect(() => {
    let localBooking: any = null;
    try {
      const raw = localStorage.getItem('gearup_latest_booking');
      if (raw) localBooking = JSON.parse(raw);
    } catch {}

    const fetchBooking = async () => {
      if (bookingId) {
        try {
          const res = await api.get(`/bookings/${bookingId}`);
          if (res.data?.success && res.data.booking) {
            setBooking(res.data.booking);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Could not fetch booking via API, attempting local fallback:', err);
        }
      }

      if (localBooking) {
        setBooking(localBooking);
      }
      setLoading(false);
    };

    fetchBooking();
  }, [bookingId]);

  // Format Card Number (adds space every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    setRawCardNumber(val);
    const parts = val.match(/[\s\S]{1,4}/g) || [];
    setCardNumber(parts.join(' '));
  };

  // Quick-fill Stripe standard test credentials
  const fillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setRawCardNumber('4242424242424242');
    setExpiry('12/28');
    setCvc('123');
    setCardName(user?.name || 'Stripe Test Customer');
    toast.success('Stripe test card loaded (4242 4242 4242 4242)');
  };

  // Submit Direct Stripe Payment
  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!booking) {
      toast.error('Booking information missing. Please re-select equipment.');
      return;
    }

    if (rawCardNumber.length < 16) {
      toast.error('Please enter a valid 16-digit card number.');
      return;
    }

    if (!expiry || !expiry.includes('/')) {
      toast.error('Please provide card expiry in MM/YY format.');
      return;
    }

    if (cvc.length < 3) {
      toast.error('Please provide a 3 or 4-digit CVC code.');
      return;
    }

    setProcessing(true);

    try {
      const res = await api.post('/payments/pay', {
        bookingId: booking._id,
        bookingData: booking,
        cardDetails: {
          last4: rawCardNumber.slice(-4),
          brand: rawCardNumber.startsWith('4') ? 'Visa' : 'Mastercard'
        },
        billingAddress: booking.deliveryAddress
      });

      if (res.data?.success) {
        const txnId = res.data.transactionId;
        const confirmedBooking = res.data.booking || {
          ...booking,
          paymentStatus: 'Paid',
          bookingStatus: 'Confirmed',
          transactionId: txnId
        };

        // Cache confirmed booking in localStorage for customer dashboard
        try {
          const rawRentals = localStorage.getItem('gearup_customer_rentals');
          const localRentals = rawRentals ? JSON.parse(rawRentals) : [];
          const filtered = localRentals.filter((r: any) => r._id !== confirmedBooking._id);
          filtered.unshift(confirmedBooking);
          localStorage.setItem('gearup_customer_rentals', JSON.stringify(filtered));
          localStorage.setItem('gearup_latest_booking', JSON.stringify(confirmedBooking));
        } catch {}

        toast.success('Payment verified successfully with Stripe!');
        router.push(`/payment/success?session_id=${txnId}&bookingId=${confirmedBooking._id}`);
      } else {
        throw new Error(res.data?.message || 'Payment processing failed.');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      toast.error(err.response?.data?.message || err.message || 'Payment processing failed.');
    } finally {
      setProcessing(false);
    }
  };

  // Redirect to Stripe Hosted Checkout
  const handleStripeCheckoutRedirect = async () => {
    if (!booking) return;
    setStripeRedirecting(true);

    try {
      const res = await api.post('/payments/create-checkout-session', {
        bookingId: booking._id,
        bookingData: booking
      });

      if (res.data?.success && res.data.url) {
        toast.loading('Redirecting to Stripe Hosted Checkout...', { duration: 2500 });
        window.location.href = res.data.url;
      } else {
        throw new Error('Could not initiate Stripe checkout.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to redirect to Stripe.');
    } finally {
      setStripeRedirecting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-bold text-base-content">Initializing Stripe Secure Checkout...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-base-content">No Active Reservation Found</h2>
        <p className="text-xs text-base-content/60">
          Please select an equipment item from our catalog to initiate a secure booking.
        </p>
        <NextLink
          href="/equipment"
          className="inline-block px-6 py-3 rounded-2xl bg-primary text-white text-xs font-bold"
        >
          Browse Equipment Catalog
        </NextLink>
      </div>
    );
  }

  const totalAmount = Number(booking.totalAmount || 0);

  return (
    <div className="min-h-screen bg-base-100 py-10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-xs font-bold text-base-content/70 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Back to Equipment Details</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted Payment</span>
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
            Checkout Step 2 of 2
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight mt-1">
            Complete Rental Payment
          </h1>
          <p className="text-xs text-base-content/60">
            Authorize your equipment reservation via Stripe Payment Gateway with 100% escrow protection.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (7 cols): Stripe Payment Form */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-base-100 rounded-3xl border border-base-300 p-6 sm:p-8 shadow-sm space-y-6">
              
              {/* Stripe Gateway Header */}
              <div className="flex items-center justify-between pb-4 border-b border-base-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                    S
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-base-content flex items-center gap-1.5">
                      Stripe Payment Gateway
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </h2>
                    <p className="text-[11px] text-base-content/50">Official PCI-DSS Certified Processor</p>
                  </div>
                </div>

                {/* Quick Test Card Pill */}
                <button
                  type="button"
                  onClick={fillTestCard}
                  className="px-3 py-1.5 rounded-xl bg-base-200 hover:bg-base-300 text-[11px] font-bold text-primary border border-base-300 flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Use Test Card</span>
                </button>
              </div>

              {/* Payment Form */}
              <form onSubmit={handleProcessPayment} className="space-y-4 text-xs">
                
                <div>
                  <label className="font-bold text-base-content/80 block mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="e.g. Tariq Rahman"
                    className="w-full p-3.5 rounded-xl bg-base-200/60 border border-base-300 text-xs font-bold text-base-content focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-base-content/80 block mb-1 flex items-center justify-between">
                    <span>Card Number</span>
                    <span className="text-[10px] text-base-content/50 font-normal">Visa • Mastercard • Amex</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4242 4242 4242 4242"
                      className="w-full p-3.5 pl-11 rounded-xl bg-base-200/60 border border-base-300 text-xs font-mono font-bold text-base-content tracking-wider focus:border-primary focus:outline-none"
                    />
                    <CreditCard className="w-4 h-4 text-base-content/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-base-content/80 block mb-1">
                      Expiration Date
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full p-3.5 rounded-xl bg-base-200/60 border border-base-300 text-xs font-bold text-base-content focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-base-content/80 block mb-1">
                      Security Code (CVC)
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      className="w-full p-3.5 rounded-xl bg-base-200/60 border border-base-300 text-xs font-mono font-bold text-base-content focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-base-content/80 block mb-1">
                    Billing ZIP / Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={billingZip}
                    onChange={(e) => setBillingZip(e.target.value)}
                    placeholder="e.g. 1208 or 4000"
                    className="w-full p-3.5 rounded-xl bg-base-200/60 border border-base-300 text-xs font-bold text-base-content focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Escrow Guarantee Box */}
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-black text-primary">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span>Stripe Escrow Protection Enabled</span>
                  </div>
                  <p className="text-[11px] text-base-content/70">
                    Payment is held securely in escrow and only released to the owner after equipment is verified and delivered to your job site.
                  </p>
                </div>

                {/* Primary Action Button */}
                <button
                  type="submit"
                  disabled={processing || stripeRedirecting}
                  className="w-full py-4 rounded-2xl bg-primary hover:bg-primary/95 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Stripe Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ৳{totalAmount.toLocaleString('en-BD')} Securely via Stripe</span>
                    </>
                  )}
                </button>

                {/* Secondary Option: Stripe Hosted Checkout Redirect */}
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={handleStripeCheckoutRedirect}
                    disabled={processing || stripeRedirecting}
                    className="text-[11px] font-bold text-base-content/60 hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    <span>Or switch to Stripe Hosted Checkout URL</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

              </form>

            </div>

          </div>

          {/* Right Column (5 cols): Itemized Rental Invoice Summary */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-base-100 rounded-3xl border border-base-300 p-6 sm:p-8 shadow-sm space-y-6">
              
              <h3 className="text-base font-black text-base-content pb-3 border-b border-base-200">
                Reservation Invoice Summary
              </h3>

              {/* Machinery preview */}
              <div className="flex items-center space-x-4">
                <img
                  src={booking.equipmentImage || 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80'}
                  alt={booking.equipmentName}
                  className="w-16 h-16 rounded-2xl object-cover bg-base-200 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-primary tracking-wider">
                    {booking.category || 'Heavy Equipment'}
                  </span>
                  <h4 className="text-sm font-black text-base-content line-clamp-1">
                    {booking.equipmentName}
                  </h4>
                  <p className="text-[11px] text-base-content/60">
                    ৳{Number(booking.rentalPrice || 0).toLocaleString('en-BD')} / {booking.rentalType?.toLowerCase() || 'day'}
                  </p>
                </div>
              </div>

              {/* Rental Specs */}
              <div className="bg-base-200/50 p-4 rounded-2xl border border-base-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-base-content/60 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Duration:</span>
                  </span>
                  <span className="font-bold text-base-content">
                    {booking.durationDays || 1} day(s) ({booking.startDate} → {booking.endDate})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Units Booked:</span>
                  </span>
                  <span className="font-bold text-base-content">
                    {booking.quantity || 1} unit(s)
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-base-content/60 flex items-center gap-1.5 shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Delivery Site:</span>
                  </span>
                  <span className="font-bold text-base-content text-right line-clamp-2 ml-2">
                    {booking.deliveryAddress || 'Tejgaon I/A, Dhaka'}
                  </span>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 text-xs pt-2 border-t border-base-200">
                <div className="flex justify-between text-base-content/70">
                  <span>Gross Rental Amount:</span>
                  <span className="font-bold text-base-content">৳{totalAmount.toLocaleString('en-BD')}</span>
                </div>
                <div className="flex justify-between text-base-content/70">
                  <span>Stripe Security Escrow Fee:</span>
                  <span className="font-bold text-emerald-600">৳0 (Covered)</span>
                </div>
                <div className="flex justify-between text-base-content/70">
                  <span>Equipment Inspection Protection:</span>
                  <span className="font-bold text-emerald-600">Included</span>
                </div>
                <div className="flex justify-between text-base font-black text-base-content pt-3 border-t border-base-200">
                  <span>Total Amount Due:</span>
                  <span className="text-primary text-xl">৳{totalAmount.toLocaleString('en-BD')}</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

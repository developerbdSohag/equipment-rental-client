'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import {
  MapPin,
  Calendar,
  ShieldCheck,
  Heart,
  Share2,
  CheckCircle2,
  XCircle,
  Truck,
  FileText,
  User,
  Phone,
  Tag,
  Loader2,
  ArrowLeft,
  X,
  CreditCard
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function EquipmentDetailsPageWrapper() {
  return (
    <ProtectedRoute>
      <EquipmentDetailsContent />
    </ProtectedRoute>
  );
}

function EquipmentDetailsContent() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [equipment, setEquipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [contactNumber, setContactNumber] = useState(user?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Fetch Equipment & Favorite Status
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await api.get(`/equipment/${id}`);
        if (res.data.success) {
          setEquipment(res.data.equipment);
        }

        // Check if item is already in favorites
        const favRes = await api.get(`/favorites/check/${id}`);
        if (favRes.data.success) {
          setIsFavorite(favRes.data.isFavorite);
        }
      } catch (err) {
        console.error('Failed to fetch equipment details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Calculate rental duration in days
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.ceil(Math.abs(e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  };

  // Calculate estimated total price
  const calculateTotal = () => {
    if (!equipment) return 0;
    const days = calculateDays();
    let unitRate = equipment.rentalPrice;
    if (equipment.rentalType === 'Weekly') unitRate = unitRate / 7;
    if (equipment.rentalType === 'Monthly') unitRate = unitRate / 30;
    return Math.round(unitRate * days * quantity * 100) / 100;
  };

  // Toggle Favorite
  const handleToggleFavorite = async () => {
    if (!equipment) return;
    setFavLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${equipment._id}`);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await api.post(`/favorites/${equipment._id}`);
        setIsFavorite(true);
        toast.success('Saved to your favorites!');
      }
    } catch (err) {
      toast.error('Could not update favorites.');
    } finally {
      setFavLoading(false);
    }
  };

  // Initiate Booking & Redirect to Stripe
  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast.error('Please select both rental start and end dates.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error('End date cannot be earlier than start date.');
      return;
    }

    if (!contactNumber || !deliveryAddress) {
      toast.error('Contact phone number and delivery address are required.');
      return;
    }

    if (quantity > (equipment.availableQuantity || 0)) {
      toast.error(`Only ${equipment.availableQuantity} units available.`);
      return;
    }

    setBookingLoading(true);

    try {
      // 1. Create booking in backend
      const bookingRes = await api.post('/bookings', {
        equipmentId: equipment._id,
        startDate,
        endDate,
        quantity,
        contactNumber,
        deliveryAddress,
        additionalNotes
      });

      if (!bookingRes.data.success) {
        throw new Error(bookingRes.data.message || 'Failed to initiate booking.');
      }

      const createdBooking = bookingRes.data.booking;

      // 2. Create Stripe Checkout Session
      const checkoutRes = await api.post('/payments/create-checkout-session', {
        bookingId: createdBooking._id
      });

      if (checkoutRes.data.success && checkoutRes.data.url) {
        toast.loading('Redirecting to secure Stripe Checkout...', { duration: 2500 });
        window.location.href = checkoutRes.data.url;
      } else {
        throw new Error('Failed to generate checkout session.');
      }
    } catch (error: any) {
      console.error('Booking checkout error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Booking Notice',
        text: error.response?.data?.message || error.message || 'Unable to proceed to payment.',
        confirmButtonColor: '#16a34a'
      });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-medium text-base-content/70">Loading equipment specifications...</p>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-base-content">Equipment Not Found</h2>
        <p className="text-sm text-base-content/60">The equipment you requested may have been removed or is pending approval.</p>
        <button
          onClick={() => router.push('/equipment')}
          className="px-6 py-3 rounded-2xl bg-primary text-white text-sm font-bold"
        >
          Return to All Equipment
        </button>
      </div>
    );
  }

  const isAvailable = (equipment.availableQuantity || 0) > 0;

  return (
    <div className="min-h-screen bg-base-100 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-xs font-bold text-base-content/70 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back to Equipment Catalog</span>
        </button>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column (7 cols): Image gallery & specs */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Hero Image */}
            <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-base-200 border border-base-300 shadow-md">
              <img
                src={equipment.image}
                alt={equipment.name}
                className="w-full h-full object-cover"
              />
              
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-base-100/90 backdrop-blur-md text-base-content shadow-sm">
                  {equipment.category}
                </span>
              </div>

              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <button
                  onClick={handleToggleFavorite}
                  disabled={favLoading}
                  aria-label="Add to favorites"
                  className={`p-2.5 rounded-full backdrop-blur-md shadow-md transition-all ${
                    isFavorite
                      ? 'bg-rose-500 text-white'
                      : 'bg-base-100/90 text-base-content hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-base-100 p-8 rounded-3xl border border-base-300 space-y-4">
              <h3 className="text-xl font-bold text-base-content flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Equipment Overview
              </h3>
              <p className="text-sm text-base-content/80 leading-relaxed whitespace-pre-line">
                {equipment.description}
              </p>
            </div>

            {/* Technical Specifications */}
            <div className="bg-base-100 p-8 rounded-3xl border border-base-300 space-y-4">
              <h3 className="text-xl font-bold text-base-content flex items-center gap-2">
                <Tag className="w-5 h-5 text-secondary" />
                Equipment Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-base-200/50">
                  <span className="text-[11px] font-bold uppercase text-base-content/50 block">Brand</span>
                  <span className="text-sm font-black text-base-content">{equipment.brand || 'Enterprise'}</span>
                </div>
                <div className="p-4 rounded-2xl bg-base-200/50">
                  <span className="text-[11px] font-bold uppercase text-base-content/50 block">Model</span>
                  <span className="text-sm font-black text-base-content">{equipment.model || 'Standard'}</span>
                </div>
                <div className="p-4 rounded-2xl bg-base-200/50">
                  <span className="text-[11px] font-bold uppercase text-base-content/50 block">Condition</span>
                  <span className="text-sm font-black text-base-content">{equipment.condition || 'Inspected'}</span>
                </div>
                <div className="p-4 rounded-2xl bg-base-200/50">
                  <span className="text-[11px] font-bold uppercase text-base-content/50 block">Location</span>
                  <span className="text-sm font-black text-base-content">{equipment.location}</span>
                </div>
                <div className="p-4 rounded-2xl bg-base-200/50">
                  <span className="text-[11px] font-bold uppercase text-base-content/50 block">Available Units</span>
                  <span className="text-sm font-black text-primary">{equipment.availableQuantity} in stock</span>
                </div>
                <div className="p-4 rounded-2xl bg-base-200/50">
                  <span className="text-[11px] font-bold uppercase text-base-content/50 block">Rental Frequency</span>
                  <span className="text-sm font-black text-base-content">{equipment.rentalType}</span>
                </div>
              </div>
            </div>

            {/* Rental Terms and Conditions */}
            <div className="bg-base-100 p-8 rounded-3xl border border-base-300 space-y-4">
              <h3 className="text-xl font-bold text-base-content flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                Rental Terms & Conditions
              </h3>
              <p className="text-xs text-base-content/75 leading-relaxed bg-base-200/40 p-4 rounded-2xl border border-base-200">
                {equipment.terms || 'Standard peer-to-peer equipment contract applies. Inspection checklist completed on handover. Clean and operational return expected.'}
              </p>
            </div>

          </div>

          {/* Right Column (5 cols): Booking & Owner Summary */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Sticky Pricing & Booking Card */}
            <div className="sticky top-28 bg-base-100 p-8 rounded-3xl border border-base-300 shadow-xl space-y-6">
              
              {/* Header: Title & Price */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">{equipment.category}</span>
                  {isAvailable ? (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      In Stock
                    </span>
                  ) : (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      Rented Out
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
                  {equipment.name}
                </h1>

                <div className="mt-4 flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-primary">${equipment.rentalPrice}</span>
                  <span className="text-sm text-base-content/60 font-medium">/{equipment.rentalType?.toLowerCase() || 'day'}</span>
                </div>
              </div>

              {/* Owner Info Box */}
              <div className="p-4 rounded-2xl bg-base-200/60 border border-base-200 flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-base-content/50 uppercase font-bold">Listed By Owner</p>
                  <p className="text-sm font-bold text-base-content">{equipment.ownerName || 'Verified Equipment Owner'}</p>
                  <p className="text-xs text-base-content/60">{equipment.location}</p>
                </div>
              </div>

              {/* Book Now Button */}
              <button
                disabled={!isAvailable}
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full py-4 rounded-2xl text-base font-bold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>{isAvailable ? 'Book Equipment Now' : 'Currently Unavailable'}</span>
              </button>

              <p className="text-[11px] text-center text-base-content/60">
                🔒 Protected by Stripe 100% Escrow Guarantee. No payment charged until dates are confirmed.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Book Equipment Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-base-100 rounded-3xl border border-base-300 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-base-200">
              <div>
                <h3 className="text-lg font-black text-base-content">Book {equipment.name}</h3>
                <p className="text-xs text-base-content/60">Complete reservation details to proceed to Stripe payment</p>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="p-2 rounded-xl text-base-content/60 hover:bg-base-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
              
              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-base-content/70 block mb-1">Rental Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-bold text-base-content/70 block mb-1">Rental End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="font-bold text-base-content/70 block mb-1">
                  Required Quantity (Max: {equipment.availableQuantity})
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={equipment.availableQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full p-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="font-bold text-base-content/70 block mb-1">Contact Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full p-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                />
              </div>

              {/* Delivery Address */}
              <div>
                <label className="font-bold text-base-content/70 block mb-1">Job Site / Delivery Address</label>
                <input
                  type="text"
                  required
                  placeholder="Street address, city, state, zip"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full p-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="font-bold text-base-content/70 block mb-1">Additional Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Special job site instructions, gate codes, or delivery timing..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full p-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                />
              </div>

              {/* Price Calculation Summary Box */}
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-1.5">
                <div className="flex justify-between text-xs text-base-content/70">
                  <span>Duration:</span>
                  <span className="font-bold text-base-content">{calculateDays()} day(s)</span>
                </div>
                <div className="flex justify-between text-xs text-base-content/70">
                  <span>Quantity:</span>
                  <span className="font-bold text-base-content">{quantity} unit(s)</span>
                </div>
                <div className="flex justify-between text-sm font-black text-base-content pt-2 border-t border-primary/20">
                  <span>Total Rental Amount:</span>
                  <span className="text-primary text-base">${calculateTotal()}</span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="w-1/3 py-3 rounded-xl border border-base-300 font-bold text-base-content/80 hover:bg-base-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-2/3 py-3 rounded-xl bg-primary text-white font-bold shadow-md shadow-primary/25 hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  {bookingLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Proceed to Stripe (${calculateTotal()})</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import {
  MapPin,
  Calendar,
  ShieldCheck,
  Heart,
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
  CreditCard,
  Star,
  Clock,
  Sparkles,
  Info,
  Edit3,
  Trash2,
  Eye,
  Sliders,
  DollarSign,
  AlertTriangle,
  ArrowRight
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
  const searchParams = useSearchParams();

  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const isOwnerRole = user?.role === 'Owner';

  const [equipment, setEquipment] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Live equipment rentals ledger (for Admin and Owner)
  const [itemBookings, setItemBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [viewingDossier, setViewingDossier] = useState<any>(null);

  // Quick edit modal state (Admin & Owner)
  const [editingEquipment, setEditingEquipment] = useState<any>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Fast inline stock / rate updater for Owner & Admin
  const [quickQty, setQuickQty] = useState<number>(1);
  const [quickPrice, setQuickPrice] = useState<number>(0);
  const [savingQuickParams, setSavingQuickParams] = useState(false);

  // Booking Form State (Image 4 & 5 embedded right-sidebar style)
  const [bookingLoading, setBookingLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [contactNumber, setContactNumber] = useState(user?.phone || '+880 1711-234567');
  const [deliveryAddress, setDeliveryAddress] = useState(
    user?.address || 'Plot 14-15, Tejgaon Industrial Area, Dhaka-1208'
  );
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Owner perspective: active for any logged-in Owner
  const isOwner = user?.role === 'Owner' && !isAdmin;

  // Fetch Equipment & Favorite Status
  const fetchEquipmentData = async () => {
    if (!id) return;

    try {
      const storedFavs = JSON.parse(localStorage.getItem('gearup_favorites') || '[]');
      if (storedFavs.some((f: any) => f.equipmentId === id || f._id === id || f.equipment?._id === id)) {
        setIsFavorite(true);
      }
    } catch {}

    try {
      const res = await api.get(`/equipment/${id}`);
      if (res.data?.success && res.data.equipment) {
        setEquipment(res.data.equipment);
        setSelectedImage(res.data.equipment.image);
        setQuickQty(res.data.equipment.availableQuantity || 1);
        setQuickPrice(res.data.equipment.rentalPrice || 0);
      }

      const favRes = await api.get(`/favorites/check/${id}`).catch(() => ({ data: { success: false } }));
      if (favRes.data?.success) {
        setIsFavorite(favRes.data.isFavorite);
      }
    } catch (err) {
      console.error('Failed to fetch equipment details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch equipment bookings for Admin or Owner
  const fetchEquipmentBookings = async () => {
    if (!isAdmin && !isOwnerRole) return;
    setLoadingBookings(true);
    try {
      const res = await api.get(`/bookings/equipment/${id}`).catch(() => ({ data: { success: false, rentals: [] } }));
      let bookings = res.data?.success ? res.data.rentals || [] : [];

      // Fallback: merge with local bookings cache if available
      try {
        const raw = localStorage.getItem('gearup_global_rentals') || localStorage.getItem('gearup_customer_rentals');
        if (raw) {
          const list = JSON.parse(raw);
          for (const item of list) {
            if (
              (item.equipmentId === id || (equipment && item.equipmentName === equipment.name)) &&
              !bookings.some((b: any) => b._id === item._id)
            ) {
              bookings.unshift(item);
            }
          }
        }
      } catch {}

      setItemBookings(bookings);
    } catch (err) {
      console.error('Failed to load item bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchEquipmentData();
  }, [id]);

  useEffect(() => {
    if (equipment && (isAdmin || isOwnerRole)) {
      fetchEquipmentBookings();
    }
  }, [equipment?._id, isAdmin, isOwnerRole]);

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.ceil(Math.abs(e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  };

  const calculateTotal = () => {
    if (!equipment) return 0;
    const days = calculateDays();
    let unitRate = Number(equipment.rentalPrice) || 0;
    if (equipment.rentalType === 'Weekly') unitRate = unitRate / 7;
    if (equipment.rentalType === 'Monthly') unitRate = unitRate / 30;
    return Math.round(unitRate * days * quantity * 100) / 100;
  };

  // Toggle Favorites
  const handleToggleFavorite = async () => {
    if (!equipment) return;
    setFavLoading(true);
    try {
      const storedFavs = JSON.parse(localStorage.getItem('gearup_favorites') || '[]');
      if (isFavorite) {
        const updated = storedFavs.filter(
          (f: any) => f.equipmentId !== equipment._id && f._id !== equipment._id && f.equipment?._id !== equipment._id
        );
        localStorage.setItem('gearup_favorites', JSON.stringify(updated));
        setIsFavorite(false);
        await api.delete(`/favorites/${equipment._id}`).catch(() => {});
        toast.success('Removed from favorites');
      } else {
        const updated = storedFavs.filter(
          (f: any) => f.equipmentId !== equipment._id && f._id !== equipment._id && f.equipment?._id !== equipment._id
        );
        updated.push({
          _id: equipment._id,
          equipmentId: equipment._id,
          equipment,
          addedAt: new Date().toISOString()
        });
        localStorage.setItem('gearup_favorites', JSON.stringify(updated));
        setIsFavorite(true);
        await api.post(`/favorites/${equipment._id}`, { equipment }).catch(() => {});
        toast.success('Saved to your favorites!');
      }
    } catch {
      toast.error('Could not update favorites.');
    } finally {
      setFavLoading(false);
    }
  };

  // Admin / Owner Update Listing Moderation Status
  const handleUpdateListingStatus = async (newStatus: string) => {
    try {
      const res = await api.put(`/equipment/${id}/status`, { status: newStatus });
      if (res.data?.success) {
        setEquipment((prev: any) => ({ ...prev, status: newStatus }));
        toast.success(`Listing status updated to ${newStatus}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update listing status.');
    }
  };

  // Save Full Equipment Edit (Admin & Owner)
  const handleSaveEquipmentEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEquipment) return;
    setSavingEdit(true);
    try {
      const res = await api.put(`/equipment/${id}`, editingEquipment);
      if (res.data?.success) {
        setEquipment(res.data.equipment || { ...equipment, ...editingEquipment });
        setEditingEquipment(null);
        toast.success('Equipment specifications updated successfully!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save equipment updates.');
    } finally {
      setSavingEdit(false);
    }
  };

  // Quick Stock & Rate update (Admin & Owner)
  const handleSaveQuickParams = async () => {
    if (!equipment) return;
    setSavingQuickParams(true);
    try {
      const res = await api.put(`/equipment/${id}`, {
        availableQuantity: quickQty,
        rentalPrice: quickPrice
      });
      if (res.data?.success) {
        setEquipment((prev: any) => ({
          ...prev,
          availableQuantity: quickQty,
          rentalPrice: quickPrice
        }));
        toast.success('Fleet parameters updated!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update parameters.');
    } finally {
      setSavingQuickParams(false);
    }
  };

  // Delete Equipment Listing (Admin & Owner)
  const handleDeleteEquipment = async () => {
    const result = await Swal.fire({
      title: 'Delete Equipment Listing?',
      text: `Are you sure you want to permanently delete ${equipment.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Delete Listing'
    });

    if (result.isConfirmed) {
      try {
        const res = await api.delete(`/equipment/${id}`);
        if (res.data?.success) {
          await Swal.fire({
            title: 'Deleted!',
            text: 'Equipment listing removed successfully.',
            icon: 'success',
            confirmButtonColor: '#3878FF'
          });
          router.push('/equipment');
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to delete equipment.');
      }
    }
  };

  // Admin & Owner Update Booking Status
  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      if (res.data?.success) {
        toast.success(`Booking status changed to ${newStatus}`);
        setItemBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, bookingStatus: newStatus } : b))
        );
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update booking status.');
    }
  };

  // Admin & Owner Confirm Payment Received
  const handleUpdatePaymentStatus = async (bookingId: string, newPaymentStatus: string) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/payment-status`, { paymentStatus: newPaymentStatus });
      if (res.data?.success) {
        toast.success(`Payment marked as ${newPaymentStatus}!`);
        setItemBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId
              ? {
                  ...b,
                  paymentStatus: newPaymentStatus,
                  bookingStatus: newPaymentStatus === 'Paid' && b.bookingStatus === 'Pending' ? 'Confirmed' : b.bookingStatus
                }
              : b
          )
        );
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update payment status.');
    }
  };

  // Customer / Admin / Owner Submit Booking
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

    if (quantity > (equipment.availableQuantity || 0) && !isAdmin) {
      toast.error(`Only ${equipment.availableQuantity} units available.`);
      return;
    }

    setBookingLoading(true);

    try {
      const bookingRes = await api.post('/bookings', {
        equipmentId: equipment._id,
        startDate,
        endDate,
        quantity,
        contactNumber,
        deliveryAddress,
        additionalNotes
      });

      if (!bookingRes.data?.success) {
        throw new Error(bookingRes.data?.message || 'Failed to initiate booking.');
      }

      const createdBooking = bookingRes.data.booking;

      try {
        localStorage.setItem('gearup_latest_booking', JSON.stringify(createdBooking));
        const rawCustomerRentals = localStorage.getItem('gearup_customer_rentals') || '[]';
        const parsedRentals = JSON.parse(rawCustomerRentals);
        parsedRentals.unshift(createdBooking);
        localStorage.setItem('gearup_customer_rentals', JSON.stringify(parsedRentals));
      } catch {}

      // If Owner is recording an internal/jobsite dispatch:
      if (isOwner) {
        toast.success('Jobsite dispatch recorded! Added to your fleet bookings.');
        fetchEquipmentBookings();
        return;
      }

      // If Admin is doing a direct administrative booking override:
      if (isAdmin) {
        toast.success('Admin authorized reservation created! Redirecting to payment options...');
        router.push(`/payment?bookingId=${createdBooking._id}`);
        return;
      }

      // Customer checkout flow:
      toast.success('Reservation confirmed! Redirecting to secure Stripe Checkout...');
      router.push(`/payment?bookingId=${createdBooking._id}`);
    } catch (error: any) {
      console.error('Booking checkout error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Booking Notice',
        text: error.response?.data?.message || error.message || 'Unable to proceed to payment.',
        confirmButtonColor: '#3878FF'
      });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 text-electric-500 animate-spin" />
        <p className="text-sm font-bold text-navy-900 dark:text-white">Loading equipment specifications...</p>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-black text-navy-900 dark:text-white">Equipment Listing Not Found</h2>
        <p className="text-sm text-base-content/60">This equipment may have been removed or is pending approval.</p>
        <button
          onClick={() => router.push('/equipment')}
          className="btn-premium-primary px-6 py-3 text-xs"
        >
          Return to All Equipment
        </button>
      </div>
    );
  }

  const isAvailable = (equipment.availableQuantity || 0) > 0;
  const ratingValue = equipment.rating || 4.9;
  const reviewCountValue = equipment.reviewCount || 28;

  // Gallery images mockup
  const galleryImages = [
    equipment.image,
    'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <div className="min-h-screen py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Header & Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-xs font-bold text-base-content/70 hover:text-electric-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Back to Equipment Catalog</span>
          </button>

          {/* Quick Favorite Heart Button */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleToggleFavorite}
              disabled={favLoading}
              className={`p-2.5 rounded-2xl border transition-all shadow-sm flex items-center justify-center ${
                isFavorite
                  ? 'bg-rose-500 text-white border-rose-500 hover:bg-rose-600 shadow-md shadow-rose-500/30 ring-2 ring-rose-400/40'
                  : 'bg-base-100 hover:bg-rose-50 border-base-300 text-base-content/70 hover:text-rose-500 hover:border-rose-300 dark:hover:bg-rose-950/30'
              }`}
              title={isFavorite ? 'Saved in favorites (click to remove)' : 'Add to favorites'}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`w-5 h-5 transition-transform active:scale-90 ${
                  isFavorite ? 'fill-white text-white' : 'text-base-content/70'
                }`}
              />
            </button>
          </div>
        </div>

        {/* =========================================================================
            ROLE-SPECIFIC TOP BANNERS
        ========================================================================= */}

        {/* 1. ADMIN TOP CONTROL BANNER */}
        {isAdmin && (
          <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-base-200 border-2 border-blue-500/40 p-5 rounded-3xl mb-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 ring-2 ring-blue-500/30">
                <ShieldCheck className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Master Administration
                  </span>
                  <span className="text-xs font-bold text-base-content/60">Full Governance Mode</span>
                </div>
                <h3 className="text-base font-black text-navy-900 dark:text-white mt-0.5">
                  Admin Machinery & Payment Control Console
                </h3>
                <p className="text-xs text-base-content/70">
                  Full authority to approve/reject equipment, override rates, inspect rental dossiers, and confirm payment settlements.
                </p>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2.5">
              <button
                onClick={() => setEditingEquipment({ ...equipment })}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Equipment</span>
              </button>
              <button
                onClick={handleDeleteEquipment}
                className="px-4 py-2.5 rounded-xl bg-error/10 hover:bg-error/20 text-error font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Listing</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. OWNER TOP CONTROL BANNER */}
        {isOwner && (
          <div className="bg-gradient-to-r from-emerald-900/30 via-teal-900/20 to-base-200 border-2 border-emerald-500/40 p-5 rounded-3xl mb-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 ring-2 ring-emerald-500/30">
                <Truck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Fleet Owner Portal
                  </span>
                  <span className="text-xs font-bold text-base-content/60">Verified Machinery Owner</span>
                </div>
                <h3 className="text-base font-black text-navy-900 dark:text-white mt-0.5">
                  Your Fleet Unit & Dispatch Operations Hub
                </h3>
                <p className="text-xs text-base-content/70">
                  Manage stock availability, adjust daily rental rates, and track client jobsite deployments directly.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setEditingEquipment({ ...equipment })}
                className="btn-premium-primary px-4 py-2.5 text-xs font-bold flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Specifications</span>
              </button>
            </div>
          </div>
        )}

        {/* Main 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* Left Column (7 cols): Machinery Photo, Taxonomy Badges & Specifications */}
          <div className="lg:col-span-7 space-y-8">

            {/* Main Image Stage */}
            <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-navy-950 border border-base-300 shadow-md">
              <img
                src={selectedImage || equipment.image}
                alt={equipment.name}
                className="w-full h-full object-cover transition-all duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=1200&q=80';
                }}
              />
            </div>

            {/* Thumbnail Gallery Preview */}
            <div className="grid grid-cols-4 gap-3">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === img
                      ? 'border-electric-500 shadow-sm scale-[1.03]'
                      : 'border-base-300/80 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Category, Stock Status & Rental Duration Badges (Image 4 & 5 Style) */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                {equipment.category}
              </span>

              {isAvailable ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  In Stock ({equipment.availableQuantity} units)
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  Currently Out of Stock
                </span>
              )}

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                {equipment.rentalType} Rental
              </span>

              {/* Admin Moderation Pill */}
              {isAdmin && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                    equipment.status === 'Approved'
                      ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
                      : equipment.status === 'Pending'
                      ? 'bg-amber-500/15 text-amber-600 border-amber-500/30'
                      : 'bg-rose-500/15 text-rose-600 border-rose-500/30'
                  }`}
                >
                  Admin Status: {equipment.status || 'Approved'}
                </span>
              )}
            </div>

            {/* Title & Location */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-black text-navy-900 dark:text-white tracking-tight">
                {equipment.name}
              </h1>
              <div className="flex items-center text-xs font-bold text-base-content/60">
                <MapPin className="w-4 h-4 text-electric-500 mr-1.5 shrink-0" />
                <span>{equipment.location || 'Dhaka, Bangladesh'}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-black uppercase text-base-content/50 tracking-wider">
                Description
              </h3>
              <p className="text-sm text-base-content/80 leading-relaxed whitespace-pre-line">
                {equipment.description}
              </p>
            </div>

            {/* Specifications Matrix (Image 4 & 5 Style: 6 distinct specification boxes) */}
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase text-base-content/50 tracking-wider">
                Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-base-100 border border-base-300">
                  <span className="text-[10px] font-bold uppercase text-base-content/50 block">Brand</span>
                  <span className="text-xs font-bold text-base-content mt-1 block">
                    {equipment.brand || 'Enterprise Grade'}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-base-100 border border-base-300">
                  <span className="text-[10px] font-bold uppercase text-base-content/50 block">Model</span>
                  <span className="text-xs font-bold text-base-content mt-1 block">
                    {equipment.model || 'Standard Edition'}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-base-100 border border-base-300">
                  <span className="text-[10px] font-bold uppercase text-base-content/50 block">Condition</span>
                  <span className="text-xs font-bold text-base-content mt-1 block">
                    {equipment.condition || 'Inspected & Certified'}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-base-100 border border-base-300">
                  <span className="text-[10px] font-bold uppercase text-base-content/50 block">Available Stock</span>
                  <span className="text-xs font-bold text-emerald-600 mt-1 block">
                    {equipment.availableQuantity} units
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-base-100 border border-base-300">
                  <span className="text-[10px] font-bold uppercase text-base-content/50 block">Rental Rate</span>
                  <span className="text-xs font-bold text-primary mt-1 block">
                    ৳{Number(equipment.rentalPrice).toLocaleString('en-BD')} / {equipment.rentalType?.toLowerCase()}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-base-100 border border-base-300">
                  <span className="text-[10px] font-bold uppercase text-base-content/50 block">Rental Type</span>
                  <span className="text-xs font-bold text-base-content mt-1 block">
                    {equipment.rentalType}
                  </span>
                </div>
              </div>
            </div>

            {/* Owner & Supplier Card (Image 4 & 5 Style) */}
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase text-base-content/50 tracking-wider">
                Owner & Supplier
              </h3>
              <div className="p-5 rounded-2xl bg-base-100 border border-base-300 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-base-content">
                        {equipment.ownerName || 'Apex Equipment Pro'}
                      </p>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        Verified Owner
                      </span>
                    </div>
                    <p className="text-xs text-base-content/60 mt-0.5">
                      {equipment.ownerEmail || 'owner@rentalequip.com'}
                    </p>
                    <p className="text-[11px] text-base-content/50 mt-0.5">
                      {equipment.location} • 100% Verified Provider
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rental Terms & Conditions Box (Image 4 & 5 Style) */}
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase text-base-content/50 tracking-wider">
                Rental Terms & Conditions
              </h3>
              <div className="p-4 rounded-2xl bg-base-100 border border-base-300 text-xs text-base-content/70 leading-relaxed">
                {equipment.terms ||
                  'Clean handover and return expected. Standard machinery inspection signed upon dispatch. Pre-authorized Stripe escrow held until jobsite acceptance.'}
              </div>
            </div>

            {/* Customer Ratings & Reviews */}
            <div className="p-6 rounded-3xl bg-base-100 border border-base-300 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-base-content flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  Renter Feedback & Ratings
                </h3>
                <span className="text-xs font-bold text-primary">
                  {ratingValue} / 5.0 ({reviewCountValue} Verified Reviews)
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-base-200/50 border border-base-200 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span>Engr. Mahmudul Haque</span>
                  <span className="text-amber-500 font-mono">★★★★★</span>
                </div>
                <p className="text-base-content/70">
                  "Unit was delivered directly on site at 7:00 AM sharp. Completely clean, inspected, and ready to work. Smooth Stripe escrow checkout."
                </p>
              </div>
            </div>

            {/* =========================================================================
                ADMIN & OWNER POWER SECTION: LIVE RENTALS & PAYMENT LEDGER
            ========================================================================= */}
            {(isAdmin || isOwnerRole) && (
              <div className="p-6 rounded-3xl bg-base-100 border-2 border-primary/20 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-navy-900 dark:text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{isAdmin ? 'Admin Master Rental Audit Ledger' : 'Fleet Active Renter & Dispatch Ledger'}</span>
                    </h3>
                    <p className="text-xs text-base-content/60">
                      {isAdmin
                        ? 'Full administrative control over all customer bookings for this machine.'
                        : 'Manage client jobsite reservations, confirm payments, and dispatch units.'}
                    </p>
                  </div>
                  <button
                    onClick={fetchEquipmentBookings}
                    className="p-2 rounded-xl border border-base-300 hover:bg-base-200 text-xs font-bold flex items-center gap-1"
                    title="Refresh bookings"
                  >
                    <Loader2 className={`w-3.5 h-3.5 ${loadingBookings ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                {loadingBookings ? (
                  <div className="py-8 text-center text-xs text-base-content/60">Loading rental history...</div>
                ) : itemBookings.length === 0 ? (
                  <div className="py-8 text-center bg-base-200/50 rounded-2xl text-xs text-base-content/60">
                    No active bookings recorded for this machine yet. Use the sidebar form to create a reservation.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table w-full text-xs">
                      <thead className="bg-base-200/60 uppercase text-[10px] text-base-content/70">
                        <tr>
                          <th>Renter Details</th>
                          <th>Dates & Qty</th>
                          <th>Total Amount</th>
                          <th>Payment Status</th>
                          <th>Booking Status</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-base-200">
                        {itemBookings.map((b) => (
                          <tr key={b._id} className="hover:bg-base-200/40">
                            <td>
                              <p className="font-bold text-base-content">{b.customerName || 'Customer'}</p>
                              <p className="text-[10px] text-base-content/50">{b.contactNumber || b.customerEmail}</p>
                            </td>
                            <td>
                              <p className="font-medium text-base-content/80">
                                {b.startDate} → {b.endDate}
                              </p>
                              <p className="text-[10px] text-base-content/50">
                                {b.durationDays || 1} day(s) · Qty: {b.quantity || 1}
                              </p>
                            </td>
                            <td className="font-black text-primary text-sm">
                              ৳{Number(b.totalAmount || 0).toLocaleString('en-BD')}
                            </td>
                            <td>
                              {/* Payment Status with direct Admin & Owner power */}
                              <div className="space-y-1">
                                <select
                                  value={b.paymentStatus || 'Unpaid'}
                                  onChange={(e) => handleUpdatePaymentStatus(b._id, e.target.value)}
                                  className={`p-1 rounded-lg text-[10px] font-black border ${
                                    b.paymentStatus === 'Paid'
                                      ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
                                      : 'bg-amber-500/15 text-amber-600 border-amber-500/30'
                                  }`}
                                >
                                  <option value="Paid">✓ Paid</option>
                                  <option value="Unpaid">⏳ Unpaid</option>
                                  <option value="Refunded">↺ Refunded</option>
                                </select>
                                {b.paymentStatus !== 'Paid' && (
                                  <button
                                    onClick={() => handleUpdatePaymentStatus(b._id, 'Paid')}
                                    className="block text-[9px] font-extrabold text-emerald-600 hover:underline"
                                  >
                                    Confirm Paid
                                  </button>
                                )}
                              </div>
                            </td>
                            <td>
                              {/* Booking Status Dropdown */}
                              <select
                                value={b.bookingStatus || 'Pending'}
                                onChange={(e) => handleUpdateBookingStatus(b._id, e.target.value)}
                                className="p-1 rounded-lg text-[10px] font-black bg-base-200 border border-base-300"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Active">Active</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="text-right">
                              <button
                                onClick={() => setViewingDossier(b)}
                                className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold text-[10px] transition-colors"
                              >
                                Dossier
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* =========================================================================
              RIGHT COLUMN (5 cols): ROLE-SPECIFIC INTERACTIVE SIDEBAR PANEL
              (Image 4 & Image 5 embedded sticky card format)
          ========================================================================= */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">

              {/* CARD CONTAINER */}
              <div className="p-6 sm:p-7 rounded-3xl bg-base-100 border border-base-300 shadow-xl space-y-5">

                {/* 1. Header: Rate & Role-Specific Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-base-200">
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-3xl font-black text-navy-900 dark:text-white">
                      ৳{Number(equipment.rentalPrice).toLocaleString('en-BD')}
                    </span>
                    <span className="text-xs font-bold text-base-content/60">
                      /{equipment.rentalType?.toLowerCase() || 'daily'}
                    </span>
                  </div>

                  {isAdmin ? (
                    <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                      Admin Master Control
                    </span>
                  ) : isOwner ? (
                    <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      Owner Fleet Controls
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      Instant Checkout
                    </span>
                  )}
                </div>

                {/* 2. Notice Box (Image 4 & 5 Yellow Style) */}
                {isAdmin ? (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-700 dark:text-amber-300 flex items-start gap-2.5">
                    <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <div>
                      <p className="font-black">Master Administration Mode</p>
                      <p className="opacity-90">
                        You can approve listings, override pricing, create direct client reservations, and confirm payments.
                      </p>
                    </div>
                  </div>
                ) : isOwner ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-700 dark:text-emerald-300 flex items-start gap-2.5">
                    <Info className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                    <div>
                      <p className="font-black">Owner Fleet Management</p>
                      <p className="opacity-90">
                        You own this machinery. Use this panel to record off-platform jobsites, adjust rates, and confirm payments.
                      </p>
                    </div>
                  </div>
                ) : null}

                {/* 3. Quick Stock & Rate Controls for Admin & Owner */}
                {(isAdmin || isOwner) && (
                  <div className="p-4 rounded-2xl bg-base-200/60 border border-base-300 space-y-3">
                    <span className="text-[10px] font-black uppercase text-base-content/60 tracking-wider block">
                      Quick Fleet Parameters
                    </span>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="font-bold text-base-content/70 block mb-1">Available Units</label>
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => setQuickQty((q) => Math.max(0, q - 1))}
                            className="w-8 h-8 rounded-lg bg-base-300 font-bold hover:bg-base-content hover:text-base-100"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={quickQty}
                            onChange={(e) => setQuickQty(Math.max(0, parseInt(e.target.value, 10) || 0))}
                            className="w-14 p-1.5 rounded-lg bg-base-100 text-center font-bold border border-base-300"
                          />
                          <button
                            type="button"
                            onClick={() => setQuickQty((q) => q + 1)}
                            className="w-8 h-8 rounded-lg bg-base-300 font-bold hover:bg-base-content hover:text-base-100"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-base-content/70 block mb-1">Rental Price (৳)</label>
                        <input
                          type="number"
                          value={quickPrice}
                          onChange={(e) => setQuickPrice(Number(e.target.value) || 0)}
                          className="w-full p-1.5 rounded-lg bg-base-100 font-bold border border-base-300"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={savingQuickParams}
                      onClick={handleSaveQuickParams}
                      className="w-full py-2 rounded-xl bg-primary text-white text-[11px] font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5"
                    >
                      {savingQuickParams ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sliders className="w-3.5 h-3.5" />}
                      <span>Save Fleet Parameters</span>
                    </button>
                  </div>
                )}

                {/* 4. Embedded Reservation / Booking Form (Matching Image 4 & 5) */}
                <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">

                  {/* Start Date & End Date */}
                  <div className="space-y-1.5">
                    <label className="font-black text-base-content/70 block">Rental Start Date</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-3 rounded-xl bg-base-200/80 border border-base-300 text-xs font-bold text-base-content focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-black text-base-content/70 block">Rental End Date</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-3 rounded-xl bg-base-200/80 border border-base-300 text-xs font-bold text-base-content focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="space-y-1.5">
                    <label className="font-black text-base-content/70 block">
                      Quantity (Max: {equipment.availableQuantity})
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={isAdmin ? 99 : equipment.availableQuantity}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-full p-3 rounded-xl bg-base-200/80 border border-base-300 text-xs font-bold text-base-content"
                    />
                  </div>

                  {/* Contact Phone */}
                  <div className="space-y-1.5">
                    <label className="font-black text-base-content/70 block">
                      {isOwner ? 'Client Contact Phone' : 'Contact Phone'}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+880 1711-234567"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="w-full p-3 rounded-xl bg-base-200/80 border border-base-300 text-xs font-bold text-base-content"
                    />
                  </div>

                  {/* Delivery Address */}
                  <div className="space-y-1.5">
                    <label className="font-black text-base-content/70 block">
                      {isOwner ? 'Job Site / Destination Address' : 'Delivery Address'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Plot 14-15, Tejgaon Industrial Area, Dhaka-1208"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full p-3 rounded-xl bg-base-200/80 border border-base-300 text-xs font-bold text-base-content"
                    />
                  </div>

                  {/* Special Instructions (Optional) */}
                  <div className="space-y-1.5">
                    <label className="font-black text-base-content/70 block">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Delivery instructions, operator needed, etc."
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      className="w-full p-3 rounded-xl bg-base-200/80 border border-base-300 text-xs font-bold text-base-content"
                    />
                  </div>

                  {/* Dynamic Pricing Summary (Image 4 & 5 Style) */}
                  <div className="p-4 rounded-2xl bg-base-200/60 border border-base-300 space-y-2">
                    <div className="flex justify-between text-xs text-base-content/70">
                      <span>Duration:</span>
                      <span className="font-bold text-base-content">
                        {calculateDays()} day(s) × ৳{Number(equipment.rentalPrice).toLocaleString('en-BD')}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-base-content/70">
                      <span>Units:</span>
                      <span className="font-bold text-base-content">{quantity} unit(s)</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-base-content pt-2 border-t border-base-300">
                      <span>Total Due:</span>
                      <span className="text-primary text-base font-black">
                        ৳{calculateTotal().toLocaleString('en-BD')}
                      </span>
                    </div>
                  </div>

                  {/* Role-Specific Action Button */}
                  {isAdmin ? (
                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      {bookingLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ShieldCheck className="w-4 h-4" />
                      )}
                      <span>Admin Authorize & Book (৳{calculateTotal().toLocaleString('en-BD')})</span>
                    </button>
                  ) : isOwner ? (
                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      {bookingLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Truck className="w-4 h-4" />
                      )}
                      <span>Record & Dispatch Fleet Unit</span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={bookingLoading || !isAvailable}
                      className="w-full btn-premium-orange py-4 text-xs font-black uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {bookingLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CreditCard className="w-4 h-4" />
                      )}
                      <span>
                        {isAvailable
                          ? `Reserve & Book via Stripe (৳${calculateTotal().toLocaleString('en-BD')})`
                          : 'Currently Out of Stock'}
                      </span>
                    </button>
                  )}

                  {/* Add to Favorites Toggle Button */}
                  <button
                    type="button"
                    onClick={handleToggleFavorite}
                    disabled={favLoading}
                    className={`w-full py-3.5 rounded-2xl border text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      isFavorite
                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 shadow-sm'
                        : 'bg-base-200/80 border-base-300 text-base-content hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>
                      {favLoading
                        ? 'Updating...'
                        : isFavorite
                        ? 'Saved in Favorites (Click to Remove)'
                        : 'Add to Favorites'}
                    </span>
                  </button>

                  {/* Escrow Guarantee */}
                  <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 text-[11px] text-base-content/70 space-y-1">
                    <p className="font-bold text-base-content flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      Stripe 100% Escrow Guarantee
                    </p>
                    <p>Funds are secured until equipment is inspected and verified on your site.</p>
                  </div>

                </form>

              </div>

            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
          VIEW DOSSIER MODAL (Admin & Owner)
      ========================================================================= */}
      {viewingDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-base-100 rounded-3xl border border-base-300 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-base-200">
              <div>
                <h3 className="text-base font-black text-navy-900 dark:text-white">Rental Booking Dossier</h3>
                <p className="text-[11px] font-mono text-base-content/50">ID: {viewingDossier._id}</p>
              </div>
              <button onClick={() => setViewingDossier(null)} className="p-2 rounded-xl hover:bg-base-200">
                <X className="w-5 h-5 text-base-content/60" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-base-200/60 space-y-2">
                <div className="flex justify-between">
                  <span className="text-base-content/60 font-medium">Customer:</span>
                  <span className="font-bold text-base-content">{viewingDossier.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60 font-medium">Contact:</span>
                  <span className="font-bold text-base-content">{viewingDossier.contactNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60 font-medium">Delivery Address:</span>
                  <span className="font-bold text-base-content max-w-[200px] text-right truncate">
                    {viewingDossier.deliveryAddress}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60 font-medium">Duration:</span>
                  <span className="font-bold text-base-content">
                    {viewingDossier.startDate} → {viewingDossier.endDate} ({viewingDossier.durationDays} days)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60 font-medium">Total BDT:</span>
                  <span className="font-black text-primary text-sm">
                    ৳{Number(viewingDossier.totalAmount).toLocaleString('en-BD')}
                  </span>
                </div>
              </div>

              {/* Direct payment toggle inside dossier */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-base-200/40">
                <span className="font-bold text-base-content/70">Payment Status:</span>
                <button
                  onClick={() =>
                    handleUpdatePaymentStatus(
                      viewingDossier._id,
                      viewingDossier.paymentStatus === 'Paid' ? 'Unpaid' : 'Paid'
                    )
                  }
                  className={`px-3 py-1 rounded-xl text-xs font-black ${
                    viewingDossier.paymentStatus === 'Paid'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  {viewingDossier.paymentStatus === 'Paid' ? '✓ Paid (Click to Toggle)' : 'Confirm Payment'}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-base-200">
              <button
                onClick={() => setViewingDossier(null)}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          EDIT EQUIPMENT MODAL (Admin & Owner)
      ========================================================================= */}
      {editingEquipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-base-100 rounded-3xl border border-base-300 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-base-200">
              <div>
                <h3 className="text-lg font-black text-navy-900 dark:text-white">Edit Machinery Specifications</h3>
                <p className="text-xs text-base-content/60">Update live listing parameters</p>
              </div>
              <button onClick={() => setEditingEquipment(null)} className="p-2 rounded-xl hover:bg-base-200">
                <X className="w-5 h-5 text-base-content/60" />
              </button>
            </div>

            <form onSubmit={handleSaveEquipmentEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-base-content/70 block mb-1">Equipment Name</label>
                <input
                  type="text"
                  required
                  value={editingEquipment.name}
                  onChange={(e) => setEditingEquipment({ ...editingEquipment, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-base-content/70 block mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={editingEquipment.category}
                    onChange={(e) => setEditingEquipment({ ...editingEquipment, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-base-content/70 block mb-1">Daily Rental Price (৳)</label>
                  <input
                    type="number"
                    required
                    value={editingEquipment.rentalPrice}
                    onChange={(e) =>
                      setEditingEquipment({ ...editingEquipment, rentalPrice: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-base-content/70 block mb-1">Available Quantity</label>
                  <input
                    type="number"
                    required
                    value={editingEquipment.availableQuantity}
                    onChange={(e) =>
                      setEditingEquipment({
                        ...editingEquipment,
                        availableQuantity: parseInt(e.target.value, 10) || 0
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-base-content/70 block mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={editingEquipment.location}
                    onChange={(e) => setEditingEquipment({ ...editingEquipment, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs"
                  />
                </div>
              </div>

              {/* Admin Moderation Status in Modal */}
              {isAdmin && (
                <div>
                  <label className="font-bold text-base-content/70 block mb-1">Moderation Status</label>
                  <select
                    value={editingEquipment.status || 'Approved'}
                    onChange={(e) => setEditingEquipment({ ...editingEquipment, status: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs font-bold"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              )}

              <div>
                <label className="font-bold text-base-content/70 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingEquipment.description}
                  onChange={(e) => setEditingEquipment({ ...editingEquipment, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-base-200">
                <button
                  type="button"
                  onClick={() => setEditingEquipment(null)}
                  className="px-4 py-2 rounded-xl border border-base-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="btn-premium-primary px-5 py-2 text-xs font-bold"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

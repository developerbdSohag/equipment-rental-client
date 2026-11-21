'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
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
  CreditCard,
  Star,
  Clock,
  Sparkles,
  Info
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
  const autoOpenBooking = searchParams.get('book') === 'true';

  const { user } = useAuth();

  const [equipment, setEquipment] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(autoOpenBooking);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [contactNumber, setContactNumber] = useState(user?.phone || '+880 1711-234567');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || 'Plot 14-15, Tejgaon Industrial Area, Dhaka-1208');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Fetch Equipment & Favorite Status
  useEffect(() => {
    if (!id) return;

    // Check localStorage cache first for instant responsiveness
    try {
      const storedFavs = JSON.parse(localStorage.getItem('gearup_favorites') || '[]');
      if (storedFavs.some((f: any) => f.equipmentId === id || f._id === id || f.equipment?._id === id)) {
        setIsFavorite(true);
      }
    } catch {}

    const fetchData = async () => {
      try {
        const res = await api.get(`/equipment/${id}`);
        if (res.data.success) {
          setEquipment(res.data.equipment);
          setSelectedImage(res.data.equipment.image);
        }

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

  useEffect(() => {
    if (autoOpenBooking) {
      setIsBookingModalOpen(true);
    }
  }, [autoOpenBooking]);

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
    let unitRate = equipment.rentalPrice;
    if (equipment.rentalType === 'Weekly') unitRate = unitRate / 7;
    if (equipment.rentalType === 'Monthly') unitRate = unitRate / 30;
    return Math.round(unitRate * days * quantity * 100) / 100;
  };

  const handleToggleFavorite = async () => {
    if (!equipment) return;
    setFavLoading(true);
    try {
      const storedFavs = JSON.parse(localStorage.getItem('gearup_favorites') || '[]');
      if (isFavorite) {
        // Remove locally
        const updated = storedFavs.filter(
          (f: any) => f.equipmentId !== equipment._id && f._id !== equipment._id && f.equipment?._id !== equipment._id
        );
        localStorage.setItem('gearup_favorites', JSON.stringify(updated));
        setIsFavorite(false);
        // Call API
        await api.delete(`/favorites/${equipment._id}`).catch(() => {});
        toast.success('Removed from favorites');
      } else {
        // Save locally
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
        // Call API
        await api.post(`/favorites/${equipment._id}`, { equipment }).catch(() => {});
        toast.success('Saved to your favorites!');
      }
    } catch (err) {
      toast.error('Could not update favorites.');
    } finally {
      setFavLoading(false);
    }
  };

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

      try {
        localStorage.setItem('gearup_latest_booking', JSON.stringify(createdBooking));
      } catch {}

      const checkoutRes = await api.post('/payments/create-checkout-session', {
        bookingId: createdBooking._id,
        bookingData: createdBooking
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
        
        {/* Back Link & Breadcrumbs */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-xs font-bold text-base-content/70 hover:text-electric-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Back to Equipment Catalog</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleFavorite}
              disabled={favLoading}
              className={`p-2.5 rounded-2xl glass-card border transition-all ${
                isFavorite
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'text-base-content/70 hover:text-rose-500'
              }`}
              title="Save to favorites"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Main 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column (7 cols): Gallery & Specifications */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Main Image Stage */}
            <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-navy-950 border border-white/60 shadow-glass-lg">
              <img
                src={selectedImage || equipment.image}
                alt={equipment.name}
                className="w-full h-full object-cover transition-all duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/90 dark:bg-navy-950/90 backdrop-blur-md text-navy-900 dark:text-white shadow-sm border border-white/20">
                  {equipment.category}
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery Preview */}
            <div className="grid grid-cols-4 gap-3">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === img
                      ? 'border-electric-500 shadow-glow-blue scale-[1.03]'
                      : 'border-base-300/80 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Equipment Overview & Description */}
            <div className="glass-card p-8 rounded-3xl border border-white/60 dark:border-white/10 space-y-4">
              <h3 className="text-lg font-black text-navy-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-electric-500" />
                Equipment Description & Capabilities
              </h3>
              <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed whitespace-pre-line">
                {equipment.description}
              </p>
            </div>

            {/* Technical Specifications Matrix */}
            <div className="glass-card p-8 rounded-3xl border border-white/60 dark:border-white/10 space-y-4">
              <h3 className="text-lg font-black text-navy-900 dark:text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-orange-500" />
                Technical Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-base-200/80">
                  <span className="text-[10px] font-black uppercase text-base-content/50 block">Brand</span>
                  <span className="text-xs font-bold text-navy-900 dark:text-white">{equipment.brand || 'Enterprise'}</span>
                </div>
                <div className="p-4 rounded-2xl bg-base-200/80">
                  <span className="text-[10px] font-black uppercase text-base-content/50 block">Model</span>
                  <span className="text-xs font-bold text-navy-900 dark:text-white">{equipment.model || 'Standard Tier'}</span>
                </div>
                <div className="p-4 rounded-2xl bg-base-200/80">
                  <span className="text-[10px] font-black uppercase text-base-content/50 block">Condition</span>
                  <span className="text-xs font-bold text-navy-900 dark:text-white">{equipment.condition || 'Inspected'}</span>
                </div>
                <div className="p-4 rounded-2xl bg-base-200/80">
                  <span className="text-[10px] font-black uppercase text-base-content/50 block">Location</span>
                  <span className="text-xs font-bold text-navy-900 dark:text-white">{equipment.location}</span>
                </div>
                <div className="p-4 rounded-2xl bg-base-200/80">
                  <span className="text-[10px] font-black uppercase text-base-content/50 block">Available Units</span>
                  <span className="text-xs font-bold text-emerald-600">{equipment.availableQuantity} in stock</span>
                </div>
                <div className="p-4 rounded-2xl bg-base-200/80">
                  <span className="text-[10px] font-black uppercase text-base-content/50 block">Rental Frequency</span>
                  <span className="text-xs font-bold text-navy-900 dark:text-white">{equipment.rentalType}</span>
                </div>
              </div>
            </div>

            {/* Rental Terms and Conditions */}
            <div className="glass-card p-8 rounded-3xl border border-white/60 dark:border-white/10 space-y-4">
              <h3 className="text-lg font-black text-navy-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Rental Terms & Insurance Protection
              </h3>
              <p className="text-xs text-base-content/80 leading-relaxed bg-base-200/60 p-4 rounded-2xl border border-base-200">
                {equipment.terms || 'Standard peer-to-peer equipment contract applies. Inspection checklist completed on handover. Clean and operational return expected.'}
              </p>
            </div>

            {/* Customer Reviews Section on Details */}
            <div className="glass-card p-8 rounded-3xl border border-white/60 dark:border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-navy-900 dark:text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  Renter Feedback & Ratings
                </h3>
                <span className="text-xs font-bold text-electric-500">
                  {ratingValue} / 5.0 ({reviewCountValue} Verified Reviews)
                </span>
              </div>

              <div className="divide-y divide-base-200 pt-2 space-y-4">
                <div className="pt-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-navy-900 dark:text-white">Marcus Vance • General Contractor</p>
                    <span className="text-[10px] text-base-content/50">2 weeks ago</span>
                  </div>
                  <div className="flex items-center text-amber-400 my-1">
                    {'★★★★★'}
                  </div>
                  <p className="text-xs text-base-content/70">
                    "Unit was delivered directly on site at 7:00 AM sharp. Completely clean, inspected, and ready to work. Smooth Stripe escrow checkout."
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): Sticky Booking Summary Card */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="sticky top-24 glass-card p-8 rounded-3xl border border-white/70 shadow-glass-lg space-y-6">
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-electric-500">
                    {equipment.category}
                  </span>
                  {isAvailable ? (
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      In Stock
                    </span>
                  ) : (
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      Rented Out
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-navy-900 dark:text-white tracking-tight">
                  {equipment.name}
                </h1>

                <div className="mt-4 flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-navy-900 dark:text-white">৳{Number(equipment.rentalPrice).toLocaleString('en-BD')}</span>
                  <span className="text-xs text-base-content/60 font-bold">/{equipment.rentalType?.toLowerCase() || 'day'}</span>
                </div>
              </div>

              {/* Owner Info Box */}
              <div className="p-4 rounded-2xl bg-base-200/80 border border-base-200 flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-electric-500/15 text-electric-500 flex items-center justify-center font-bold">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-base-content/50 uppercase font-black tracking-wider">Verified Equipment Provider</p>
                  <p className="text-xs font-black text-navy-900 dark:text-white">{equipment.ownerName || 'Apex Equipment Pro'}</p>
                  <p className="text-[11px] text-base-content/60">{equipment.location} • 100% Response Rate</p>
                </div>
              </div>

              {/* Booking Action */}
              <button
                disabled={!isAvailable}
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full btn-premium-orange py-4 text-xs font-black uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{isAvailable ? 'Reserve & Book via Stripe' : 'Currently Rented Out'}</span>
              </button>

              <div className="p-3 rounded-2xl bg-electric-500/5 border border-electric-500/20 text-[11px] text-base-content/70 space-y-1">
                <p className="font-bold text-navy-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-electric-500" />
                  Stripe 100% Escrow Guarantee
                </p>
                <p>Funds are secured until equipment is inspected and verified on your site.</p>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="glass-card rounded-3xl border border-white/80 dark:border-white/10 shadow-glass-lg max-w-lg w-full p-6 sm:p-8 space-y-5 relative">
            
            <div className="flex items-center justify-between pb-3 border-b border-base-200">
              <div>
                <h3 className="text-lg font-black text-navy-900 dark:text-white">Book {equipment.name}</h3>
                <p className="text-xs text-base-content/60">Complete reservation parameters for Stripe Checkout</p>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="p-2 rounded-xl text-base-content/60 hover:bg-base-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-black text-base-content/70 block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-3 rounded-xl bg-base-100 border border-base-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="font-black text-base-content/70 block mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-3 rounded-xl bg-base-100 border border-base-300 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-black text-base-content/70 block mb-1">
                  Required Units (Max: {equipment.availableQuantity})
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={equipment.availableQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full p-3 rounded-xl bg-base-100 border border-base-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="font-black text-base-content/70 block mb-1">Site Contact Phone</label>
                <input
                  type="tel"
                  required
                  placeholder="+880 1711-234567"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full p-3 rounded-xl bg-base-100 border border-base-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="font-black text-base-content/70 block mb-1">Job Site / Delivery Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Plot 14-15, Tejgaon Industrial Area, Dhaka-1208"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full p-3 rounded-xl bg-base-100 border border-base-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="font-black text-base-content/70 block mb-1">Additional Notes</label>
                <textarea
                  rows={2}
                  placeholder="Site gate number, unloading guidance..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full p-3 rounded-xl bg-base-100 border border-base-300 text-xs font-bold"
                />
              </div>

              {/* Summary calculation box */}
              <div className="p-4 rounded-2xl bg-electric-500/10 border border-electric-500/20 space-y-1">
                <div className="flex justify-between text-xs text-base-content/70">
                  <span>Duration:</span>
                  <span className="font-bold text-navy-900 dark:text-white">{calculateDays()} day(s)</span>
                </div>
                <div className="flex justify-between text-xs text-base-content/70">
                  <span>Quantity:</span>
                  <span className="font-bold text-navy-900 dark:text-white">{quantity} unit(s)</span>
                </div>
                <div className="flex justify-between text-sm font-black text-navy-900 dark:text-white pt-2 border-t border-electric-500/20">
                  <span>Estimated Total:</span>
                  <span className="text-electric-500 text-base">৳{calculateTotal().toLocaleString('en-BD')}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="w-1/3 py-3 rounded-xl border border-base-300 font-bold text-base-content/70 hover:bg-base-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-2/3 btn-premium-primary py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  {bookingLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Proceed to Stripe (৳{calculateTotal().toLocaleString('en-BD')})</span>
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

'use client';

import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import ProfileTab from '@/components/dashboard/ProfileTab';
import CustomerAnalyticsSuite from '@/components/dashboard/CustomerAnalyticsSuite';
import api from '@/lib/api';
import {
  Calendar,
  Heart,
  User,
  ShoppingBag,
  Trash2,
  ExternalLink,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomerDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['Customer', 'Admin', 'Owner']}>
      <CustomerDashboardContent />
    </ProtectedRoute>
  );
}

function CustomerDashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'rentals';

  const [activeTab, setActiveTab] = useState<'rentals' | 'favorites' | 'analytics' | 'profile'>(
    initialTab as any
  );
  const { user } = useAuth();

  // Sync activeTab when searchParams changes (e.g. clicking "My Favorites" in navigation)
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['rentals', 'favorites', 'analytics', 'profile'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  // Data states
  const [rentals, setRentals] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCustomerData = async () => {
    setLoading(true);
    try {
      const [rentalsRes, favoritesRes, analyticsRes] = await Promise.all([
        api.get('/bookings/my-rentals').catch(() => ({ data: { success: false, rentals: [] } })),
        api.get('/favorites').catch(() => ({ data: { success: false, favorites: [] } })),
        api.get('/analytics/customer').catch(() => ({ data: { success: false } })),
      ]);

      // Rentals: merge API with client-side confirmed rentals
      let combinedRentals = rentalsRes.data?.success ? [...(rentalsRes.data.rentals || [])] : [];
      try {
        const rawLocalRentals = localStorage.getItem('gearup_customer_rentals');
        if (rawLocalRentals) {
          const localRentals = JSON.parse(rawLocalRentals);
          for (const lr of localRentals) {
            if (!combinedRentals.some((cr: any) => cr._id === lr._id || (cr.transactionId && cr.transactionId === lr.transactionId))) {
              combinedRentals.unshift(lr);
            }
          }
        }
      } catch {}
      setRentals(combinedRentals);

      // Favorites: merge API with client-side saved favorites
      let combinedFavorites = favoritesRes.data?.success ? [...(favoritesRes.data.favorites || [])] : [];
      try {
        const rawLocalFavs = localStorage.getItem('gearup_favorites');
        if (rawLocalFavs) {
          const localFavs = JSON.parse(rawLocalFavs);
          for (const lf of localFavs) {
            const lfId = lf.equipmentId || lf._id || lf.equipment?._id;
            const exists = combinedFavorites.some((cf: any) => {
              const cfId = cf.equipmentId || cf._id || cf.equipment?._id;
              return cfId === lfId;
            });
            if (!exists) {
              combinedFavorites.unshift(lf);
            }
          }
        }
      } catch {}
      setFavorites(combinedFavorites);

      if (analyticsRes?.data?.success) {
        setAnalytics(analyticsRes.data.analytics);
      }
    } catch (err) {
      console.error('Error fetching customer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const handleRemoveFavorite = async (equipmentId: string) => {
    try {
      // Remove locally
      try {
        const rawLocalFavs = localStorage.getItem('gearup_favorites');
        if (rawLocalFavs) {
          const localFavs = JSON.parse(rawLocalFavs);
          const updated = localFavs.filter(
            (f: any) => f.equipmentId !== equipmentId && f._id !== equipmentId && f.equipment?._id !== equipmentId
          );
          localStorage.setItem('gearup_favorites', JSON.stringify(updated));
        }
      } catch {}

      // Update state
      setFavorites((prev) =>
        prev.filter((f) => f.equipmentId !== equipmentId && f.equipment?._id !== equipmentId && f._id !== equipmentId)
      );

      // Call API
      await api.delete(`/favorites/${equipmentId}`).catch(() => {});
      toast.success('Removed from favorites.');
    } catch (err) {
      toast.error('Failed to remove favorite.');
    }
  };

  return (
    <div className="min-h-screen bg-base-100 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Top Banner */}
        <div className="bg-gradient-to-r from-primary/10 via-base-200 to-base-200 p-8 rounded-3xl border border-base-300 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
              alt={user?.name || 'User'}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/40 shadow-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'User')}`;
              }}
            />
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Customer Portal</span>
              <h1 className="text-2xl font-black text-base-content tracking-tight">
                Welcome, {user?.name}
              </h1>
              <p className="text-xs text-base-content/60">Manage your active rentals, saved equipment, and account settings</p>
            </div>
          </div>

          <NextLink
            href="/equipment"
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all shrink-0"
          >
            Browse More Equipment
          </NextLink>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-base-300 pb-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('rentals')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'rentals'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-base-200 text-base-content/70 hover:bg-base-300'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>My Rentals ({rentals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'favorites'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-base-200 text-base-content/70 hover:bg-base-300'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Favorites ({favorites.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'analytics'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-base-200 text-base-content/70 hover:bg-base-300'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Spend & Savings Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'profile'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-base-200 text-base-content/70 hover:bg-base-300'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Account Profile</span>
          </button>
        </div>

        {/* Tab 1: My Rentals Table */}
        {activeTab === 'rentals' && (
          <div className="bg-base-100 rounded-3xl border border-base-300 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-base-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-base-content">My Equipment Rentals</h3>
                <p className="text-xs text-base-content/60">Overview of all confirmed, active, and completed equipment bookings</p>
              </div>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-2">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-xs text-base-content/60">Loading rental history...</p>
              </div>
            ) : rentals.length === 0 ? (
              <div className="py-20 text-center p-6 space-y-3">
                <ShoppingBag className="w-12 h-12 text-base-content/30 mx-auto" />
                <p className="text-sm font-bold text-base-content">No rentals yet</p>
                <p className="text-xs text-base-content/60">You haven't rented any equipment yet. Explore our catalog to get started!</p>
                <NextLink href="/equipment" className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold">
                  Rent Equipment
                </NextLink>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full text-left text-xs">
                  <thead className="bg-base-200/50 text-base-content/70 uppercase text-[11px] font-bold">
                    <tr>
                      <th className="py-4 px-6">Equipment Name</th>
                      <th>Rental Start Date</th>
                      <th>Rental End Date</th>
                      <th>Booking Date</th>
                      <th>Total Amount</th>
                      <th>Payment Status</th>
                      <th>Booking Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-200">
                    {rentals.map((r) => (
                      <tr key={r._id} className="hover:bg-base-200/40 transition-colors">
                        <td className="py-4 px-6 font-bold text-base-content">
                          <div className="flex items-center space-x-3">
                            {r.equipmentImage && (
                              <img
                                src={r.equipmentImage || 'https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=600&q=80'}
                                alt={r.equipmentName}
                                className="w-10 h-10 rounded-xl object-cover shrink-0 bg-base-200"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=600&q=80';
                                }}
                              />
                            )}
                            <div>
                              <p className="font-bold line-clamp-1">{r.equipmentName}</p>
                              <p className="text-[10px] text-base-content/50">{r.category} • Qty: {r.quantity}</p>
                            </div>
                          </div>
                        </td>
                        <td className="font-medium text-base-content/80">{r.startDate}</td>
                        <td className="font-medium text-base-content/80">{r.endDate}</td>
                        <td className="text-base-content/60">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td className="font-black text-primary text-sm">৳{Number(r.totalAmount).toLocaleString('en-BD')}</td>
                        <td>
                          {r.paymentStatus === 'Paid' ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600">
                              <Clock className="w-3 h-3 mr-1" />
                              Unpaid
                            </span>
                          )}
                        </td>
                        <td>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            r.bookingStatus === 'Completed'
                              ? 'bg-blue-500/10 text-blue-600'
                              : r.bookingStatus === 'Confirmed' || r.bookingStatus === 'Active'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : 'bg-base-300 text-base-content/70'
                          }`}>
                            {r.bookingStatus || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Favorites Table */}
        {activeTab === 'favorites' && (
          <div className="bg-base-100 rounded-3xl border border-base-300 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-base-200">
              <h3 className="text-lg font-bold text-base-content">Saved Favorites</h3>
              <p className="text-xs text-base-content/60">Equipment items you have bookmarked for quick future rental</p>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-2">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-xs text-base-content/60">Loading saved favorites...</p>
              </div>
            ) : favorites.length === 0 ? (
              <div className="py-20 text-center p-6 space-y-3">
                <Heart className="w-12 h-12 text-base-content/30 mx-auto" />
                <p className="text-sm font-bold text-base-content">No favorites saved yet</p>
                <p className="text-xs text-base-content/60">Click the heart icon on any equipment details page to bookmark it here.</p>
                <NextLink href="/equipment" className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold">
                  Browse Catalog
                </NextLink>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full text-left text-xs">
                  <thead className="bg-base-200/50 text-base-content/70 uppercase text-[11px] font-bold">
                    <tr>
                      <th className="py-4 px-6">Equipment</th>
                      <th>Category</th>
                      <th>Rental Rate</th>
                      <th>Location</th>
                      <th className="text-right px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-200">
                    {favorites.map((f) => {
                      const eq = f.equipment;
                      if (!eq) return null;
                      return (
                        <tr key={f._id} className="hover:bg-base-200/40 transition-colors">
                          <td className="py-4 px-6 font-bold text-base-content">
                            <div className="flex items-center space-x-3">
                              <img
                                src={eq.image || 'https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=600&q=80'}
                                alt={eq.name}
                                className="w-12 h-12 rounded-xl object-cover shrink-0 bg-base-200"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=600&q=80';
                                }}
                              />
                              <div>
                                <p className="font-bold line-clamp-1">{eq.name}</p>
                                <p className="text-[10px] text-base-content/50">{eq.brand} • {eq.condition}</p>
                              </div>
                            </div>
                          </td>
                          <td className="text-base-content/80 font-medium">{eq.category}</td>
                          <td className="font-black text-primary text-sm">
                            ৳{Number(eq.rentalPrice).toLocaleString('en-BD')}/{eq.rentalType?.toLowerCase() || 'day'}
                          </td>
                          <td className="text-base-content/70">{eq.location}</td>
                          <td className="text-right px-6 space-x-2">
                            <NextLink
                              href={`/equipment/${eq._id}`}
                              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold text-[11px] transition-colors"
                            >
                              <span>View Details</span>
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </NextLink>

                            <button
                              onClick={() => handleRemoveFavorite(eq._id)}
                              className="inline-flex items-center p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                              title="Remove Favorite"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Spend & Savings Analytics */}
        {activeTab === 'analytics' && (
          <CustomerAnalyticsSuite
            analytics={analytics}
            rentalsList={rentals}
          />
        )}

        {/* Tab 4: Profile */}
        {activeTab === 'profile' && (
          <ProfileTab />
        )}

      </div>
    </div>
  );
}

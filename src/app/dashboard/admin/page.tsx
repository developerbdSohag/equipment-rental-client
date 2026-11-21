'use client';

import React, { useEffect, useState, useMemo } from 'react';
import NextLink from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import ProfileTab from '@/components/dashboard/ProfileTab';
import AdminAnalyticsSuite from '@/components/dashboard/AdminAnalyticsSuite';
import api from '@/lib/api';
import {
  BarChart3,
  Users,
  Package,
  CalendarCheck,
  User,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  DollarSign,
  TrendingUp,
  Loader2,
  ExternalLink,
  Edit3,
  Eye,
  Search,
  Filter,
  Calendar,
  MapPin,
  Phone,
  FileText,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['Admin']}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'analytics';

  const [activeTab, setActiveTab] = useState<
    'analytics' | 'users' | 'equipment' | 'rentals' | 'profile'
  >(initialTab as any);

  const { user } = useAuth();

  // Data states
  const [analytics, setAnalytics] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [rentalsList, setRentalsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit equipment state for admin
  const [editingItem, setEditingItem] = useState<any>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Rental management state
  const [viewingRental, setViewingRental] = useState<any>(null);
  const [rentalSearch, setRentalSearch] = useState('');
  const [rentalStatusFilter, setRentalStatusFilter] = useState('All');
  const [rentalPaymentFilter, setRentalPaymentFilter] = useState('All');

  // React to URL query tab changes
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['analytics', 'users', 'equipment', 'rentals', 'profile'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, usersRes, equipmentRes, rentalsRes] = await Promise.all([
        api.get('/analytics/admin').catch(() => ({ data: { success: false } })),
        api.get('/users').catch(() => ({ data: { success: false, users: [] } })),
        api.get('/equipment/admin/all').catch(() => ({ data: { success: false, equipment: [] } })),
        api.get('/bookings/all').catch(() => ({ data: { success: false, rentals: [] } })),
      ]);

      if (analyticsRes.data?.success) {
        setAnalytics(analyticsRes.data.analytics);
      }
      if (usersRes.data?.success) {
        setUsersList(usersRes.data.users || []);
      }
      if (equipmentRes.data?.success) {
        setEquipmentList(equipmentRes.data.equipment || []);
      }

      // Synchronize client-created rentals with server audit log
      let combinedRentals = rentalsRes.data?.success ? [...(rentalsRes.data.rentals || [])] : [];
      try {
        const rawGlobal = localStorage.getItem('gearup_global_rentals') || localStorage.getItem('gearup_customer_rentals');
        if (rawGlobal) {
          const globalList = JSON.parse(rawGlobal);
          for (const gr of globalList) {
            if (!combinedRentals.some((cr: any) => cr._id === gr._id || (cr.transactionId && cr.transactionId === gr.transactionId))) {
              combinedRentals.unshift(gr);
            }
          }
          // Sync with server in background
          api.post('/bookings/sync', { bookings: globalList }).catch(() => {});
        }
      } catch {}

      setRentalsList(combinedRentals);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Change user role
  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      const res = await api.put(`/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        toast.success(res.data.message);
        setUsersList((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update role.');
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: string, name: string) => {
    const result = await Swal.fire({
      title: 'Remove User Account?',
      text: `Are you sure you want to delete user ${name}? This action cannot be reversed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete user',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/users/${userId}`);
        setUsersList((prev) => prev.filter((u) => u._id !== userId));
        toast.success('User removed.');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to delete user.');
      }
    }
  };

  // Approve or Reject equipment
  const handleUpdateEquipmentStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
      const res = await api.put(`/equipment/${id}/status`, { status });
      if (res.data.success) {
        toast.success(`Equipment marked as ${status}.`);
        setEquipmentList((prev) =>
          prev.map((e) => (e._id === id ? { ...e, status } : e))
        );
        fetchAdminData(); // refresh counters
      }
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  // Delete equipment
  const handleDeleteEquipment = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: 'Delete Equipment?',
      text: `Permanently delete "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/equipment/${id}`);
        setEquipmentList((prev) => prev.filter((e) => e._id !== id));
        toast.success('Equipment removed.');
      } catch (err) {
        toast.error('Failed to delete equipment.');
      }
    }
  };

  // Save equipment edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSavingEdit(true);

    try {
      const res = await api.put(`/equipment/${editingItem._id}`, editingItem);
      if (res.data.success) {
        toast.success('Equipment updated.');
        setEquipmentList((prev) =>
          prev.map((item) => (item._id === editingItem._id ? res.data.equipment : item))
        );
        setEditingItem(null);
      }
    } catch (err) {
      toast.error('Failed to save update.');
    } finally {
      setSavingEdit(false);
    }
  };

  // Admin Change Booking Status
  const handleChangeBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Booking marked as ${newStatus}`);
        setRentalsList((prev) =>
          prev.map((r) => (r._id === bookingId ? { ...r, bookingStatus: newStatus } : r))
        );
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update booking status.');
    }
  };

  // Admin Change Payment Status
  const handleChangePaymentStatus = async (bookingId: string, newPaymentStatus: string) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/payment-status`, { paymentStatus: newPaymentStatus });
      if (res.data.success) {
        toast.success(`Payment marked as ${newPaymentStatus}`);
        setRentalsList((prev) =>
          prev.map((r) => (r._id === bookingId ? { ...r, paymentStatus: newPaymentStatus } : r))
        );
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update payment status.');
    }
  };

  // Admin Delete Booking
  const handleDeleteBooking = async (bookingId: string, equipmentName: string) => {
    const result = await Swal.fire({
      title: 'Delete Booking Record?',
      text: `Are you sure you want to delete the rental record for "${equipmentName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete record',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/bookings/${bookingId}`);
        setRentalsList((prev) => prev.filter((r) => r._id !== bookingId));
        toast.success('Booking record deleted.');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to delete booking.');
      }
    }
  };

  // Filtered rentals for the table
  const filteredRentals = useMemo(() => {
    return rentalsList.filter((r) => {
      const matchSearch =
        !rentalSearch ||
        r.equipmentName?.toLowerCase().includes(rentalSearch.toLowerCase()) ||
        r.customerName?.toLowerCase().includes(rentalSearch.toLowerCase()) ||
        r.customerEmail?.toLowerCase().includes(rentalSearch.toLowerCase()) ||
        r.contactNumber?.toLowerCase().includes(rentalSearch.toLowerCase()) ||
        r.deliveryAddress?.toLowerCase().includes(rentalSearch.toLowerCase());

      const matchBookingStatus =
        rentalStatusFilter === 'All' || r.bookingStatus === rentalStatusFilter;

      const matchPaymentStatus =
        rentalPaymentFilter === 'All' || r.paymentStatus === rentalPaymentFilter;

      return matchSearch && matchBookingStatus && matchPaymentStatus;
    });
  }, [rentalsList, rentalSearch, rentalStatusFilter, rentalPaymentFilter]);

  return (
    <div className="min-h-screen bg-base-100 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-base-200 to-base-200 p-8 rounded-3xl border border-base-300 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=Admin`}
              alt="Admin"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/40 shadow-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=Admin`;
              }}
            />
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Master Administration</span>
              <h1 className="text-2xl font-black text-base-content tracking-tight">
                Admin Control Center
              </h1>
              <p className="text-xs text-base-content/60">Platform-wide overview of users, equipment approvals, and rental transactions</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Full Access Mode</span>
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-base-300 pb-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'analytics'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-base-200 text-base-content/70 hover:bg-base-300'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Platform Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'users'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-base-200 text-base-content/70 hover:bg-base-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>All Users ({usersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('equipment')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'equipment'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-base-200 text-base-content/70 hover:bg-base-300'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>All Equipment ({equipmentList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rentals')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'rentals'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-base-200 text-base-content/70 hover:bg-base-300'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>All Rentals ({rentalsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'profile'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-base-200 text-base-content/70 hover:bg-base-300'
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Profile</span>
          </button>
        </div>

        {/* Tab 1: Platform Analytics */}
        {activeTab === 'analytics' && (
          <AdminAnalyticsSuite
            analytics={analytics}
            rawEquipment={equipmentList}
            rawRentals={rentalsList}
          />
        )}

        {/* Tab 2: All Users Table */}
        {activeTab === 'users' && (
          <div className="bg-base-100 rounded-3xl border border-base-300 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-base-200">
              <h3 className="text-lg font-bold text-base-content">Registered Platform Users</h3>
              <p className="text-xs text-base-content/60">Manage accounts, assign roles (Customer, Owner, Admin), and monitor registrations</p>
            </div>

            <div className="overflow-x-auto">
              <table className="table w-full text-left text-xs">
                <thead className="bg-base-200/50 text-base-content/70 uppercase text-[11px] font-bold">
                  <tr>
                    <th className="py-4 px-6">User</th>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>Registration Date</th>
                    <th className="text-right px-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200">
                  {usersList.map((u) => (
                    <tr key={u._id} className="hover:bg-base-200/40 transition-colors">
                      <td className="py-4 px-6 font-bold text-base-content">
                        <div className="flex items-center space-x-3">
                          <img
                            src={u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name || 'User')}`}
                            alt={u.name}
                            className="w-10 h-10 rounded-xl object-cover shrink-0 ring-1 ring-base-300"
                          />
                          <div>
                            <p className="font-bold">{u.name}</p>
                            <p className="text-[10px] text-base-content/50">{u.phone || 'No phone set'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-base-content/80 font-medium">{u.email}</td>
                      <td>
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u._id, e.target.value)}
                          className="p-1.5 rounded-lg bg-base-200 border border-base-300 text-xs font-bold text-base-content focus:outline-none focus:border-primary"
                        >
                          <option value="Customer">Customer</option>
                          <option value="Owner">Owner</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>
                      <td className="text-base-content/70">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="text-right px-6">
                        <button
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: All Equipment Table */}
        {activeTab === 'equipment' && (
          <div className="bg-base-100 rounded-3xl border border-base-300 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-base-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-base-content">Equipment Moderation & Management</h3>
                <p className="text-xs text-base-content/60">Approve pending listings, reject non-compliant items, or edit specifications</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table w-full text-left text-xs">
                <thead className="bg-base-200/50 text-base-content/70 uppercase text-[11px] font-bold">
                  <tr>
                    <th className="py-4 px-6">Equipment</th>
                    <th>Category</th>
                    <th>Owner Info</th>
                    <th>Rental Rate</th>
                    <th>Status</th>
                    <th className="text-right px-6">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200">
                  {equipmentList.map((eq) => (
                    <tr key={eq._id} className="hover:bg-base-200/40 transition-colors">
                      <td className="py-4 px-6 font-bold text-base-content">
                        <div className="flex items-center space-x-3">
                          <img
                            src={eq.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'}
                            alt={eq.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 bg-base-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                          <div>
                            <p className="font-bold line-clamp-1">{eq.name}</p>
                            <p className="text-[10px] text-base-content/50">{eq.location} • Qty: {eq.availableQuantity}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-base-content/80 font-medium">{eq.category}</td>
                      <td className="text-base-content/70">
                        <p className="font-bold">{eq.ownerName || 'Apex Equipment Pro'}</p>
                        <p className="text-[10px] text-base-content/50">{eq.ownerEmail}</p>
                      </td>
                      <td className="font-black text-primary text-sm">
                        ৳{Number(eq.rentalPrice).toLocaleString('en-BD')}/{eq.rentalType?.toLowerCase() || 'day'}
                      </td>
                      <td>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            eq.status === 'Approved'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : eq.status === 'Pending'
                              ? 'bg-amber-500/10 text-amber-600'
                              : 'bg-rose-500/10 text-rose-600'
                          }`}
                        >
                          {eq.status || 'Approved'}
                        </span>
                      </td>
                      <td className="text-right px-6 space-x-1.5 whitespace-nowrap">
                        {eq.status === 'Pending' && (
                          <button
                            onClick={() => handleUpdateEquipmentStatus(eq._id, 'Approved')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        {eq.status !== 'Rejected' && (
                          <button
                            onClick={() => handleUpdateEquipmentStatus(eq._id, 'Rejected')}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 font-bold hover:bg-rose-500 hover:text-white transition-colors"
                          >
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => setEditingItem(eq)}
                          className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                          title="Edit Equipment"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEquipment(eq._id, eq.name)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: All Rentals Table with Interactive Management Controls */}
        {activeTab === 'rentals' && (
          <div className="bg-base-100 rounded-3xl border border-base-300 overflow-hidden shadow-sm space-y-4">
            
            <div className="p-6 border-b border-base-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-black text-base-content">Master Platform Rentals</h3>
                <p className="text-xs text-base-content/60">
                  Real-time audit log of all bookings with full administrative status overrides and customer details
                </p>
              </div>

              {/* Search & Status Filters */}
              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <div className="relative flex-1 md:w-56">
                  <input
                    type="text"
                    value={rentalSearch}
                    onChange={(e) => setRentalSearch(e.target.value)}
                    placeholder="Search by customer, machine..."
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-base-200 border border-base-300 text-xs font-bold text-base-content focus:outline-none focus:border-primary"
                  />
                  <Search className="w-3.5 h-3.5 text-base-content/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                <select
                  value={rentalStatusFilter}
                  onChange={(e) => setRentalStatusFilter(e.target.value)}
                  className="p-2 rounded-xl bg-base-200 border border-base-300 text-xs font-bold text-base-content focus:outline-none focus:border-primary"
                >
                  <option value="All">All Booking Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <select
                  value={rentalPaymentFilter}
                  onChange={(e) => setRentalPaymentFilter(e.target.value)}
                  className="p-2 rounded-xl bg-base-200 border border-base-300 text-xs font-bold text-base-content focus:outline-none focus:border-primary"
                >
                  <option value="All">All Payment Status</option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>
            </div>

            {filteredRentals.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <CalendarCheck className="w-12 h-12 text-base-content/30 mx-auto" />
                <p className="text-sm font-bold text-base-content">No rental bookings matched your filter criteria.</p>
                <button
                  onClick={() => {
                    setRentalSearch('');
                    setRentalStatusFilter('All');
                    setRentalPaymentFilter('All');
                  }}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full text-left text-xs">
                  <thead className="bg-base-200/50 text-base-content/70 uppercase text-[11px] font-bold">
                    <tr>
                      <th className="py-4 px-6">Customer & Site Contact</th>
                      <th>Equipment & Qty</th>
                      <th>Duration & Dates</th>
                      <th>Total Amount</th>
                      <th>Payment Status Control</th>
                      <th>Booking Status Control</th>
                      <th className="text-right px-6">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-200">
                    {filteredRentals.map((r) => (
                      <tr key={r._id} className="hover:bg-base-200/40 transition-colors">
                        
                        {/* Customer Info */}
                        <td className="py-4 px-6 font-bold text-base-content">
                          <p className="font-bold">{r.customerName || 'Customer'}</p>
                          <p className="text-[10px] text-base-content/50 font-mono">{r.customerEmail}</p>
                          <p className="text-[10px] text-primary font-bold">{r.contactNumber || 'No phone set'}</p>
                        </td>

                        {/* Equipment */}
                        <td className="font-bold text-base-content">
                          <div className="flex items-center space-x-2.5">
                            {r.equipmentImage && (
                              <img
                                src={r.equipmentImage}
                                alt={r.equipmentName}
                                className="w-10 h-10 rounded-lg object-cover bg-base-200 shrink-0"
                              />
                            )}
                            <div>
                              <p className="line-clamp-1 font-bold">{r.equipmentName}</p>
                              <p className="text-[10px] text-base-content/50">{r.category} • Qty: {r.quantity || 1}</p>
                            </div>
                          </div>
                        </td>

                        {/* Duration */}
                        <td className="text-base-content/70">
                          <p className="font-bold text-base-content">{r.durationDays || 1} Day(s)</p>
                          <p className="text-[10px] text-base-content/50">{r.startDate} → {r.endDate}</p>
                        </td>

                        {/* Amount */}
                        <td className="font-black text-primary text-sm whitespace-nowrap">
                          ৳{Number(r.totalAmount || 0).toLocaleString('en-BD')}
                        </td>

                        {/* Payment Status Dropdown Control */}
                        <td>
                          <select
                            value={r.paymentStatus || 'Unpaid'}
                            onChange={(e) => handleChangePaymentStatus(r._id, e.target.value)}
                            className={`p-1.5 rounded-lg text-xs font-bold border focus:outline-none ${
                              r.paymentStatus === 'Paid'
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                : r.paymentStatus === 'Refunded'
                                ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                                : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                            }`}
                          >
                            <option value="Paid">Paid</option>
                            <option value="Unpaid">Unpaid</option>
                            <option value="Refunded">Refunded</option>
                          </select>
                        </td>

                        {/* Booking Status Dropdown Control */}
                        <td>
                          <select
                            value={r.bookingStatus || 'Pending'}
                            onChange={(e) => handleChangeBookingStatus(r._id, e.target.value)}
                            className={`p-1.5 rounded-lg text-xs font-bold border focus:outline-none ${
                              r.bookingStatus === 'Completed'
                                ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                                : r.bookingStatus === 'Confirmed' || r.bookingStatus === 'Active'
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                : r.bookingStatus === 'Cancelled'
                                ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                                : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="text-right px-6 space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => setViewingRental(r)}
                            className="p-1.5 rounded-lg bg-base-200 text-base-content/80 hover:bg-primary hover:text-white transition-colors"
                            title="View Full Booking Dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(r._id, r.equipmentName)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                            title="Delete Rental"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Tab 5: My Profile */}
        {activeTab === 'profile' && (
          <ProfileTab />
        )}

      </div>

      {/* Viewing Rental Details Modal */}
      {viewingRental && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-base-100 rounded-3xl border border-base-300 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-base-200">
              <div>
                <h3 className="text-lg font-black text-base-content">Rental Booking Dossier</h3>
                <p className="text-xs text-base-content/50 font-mono">ID: {viewingRental._id}</p>
              </div>
              <button
                onClick={() => setViewingRental(null)}
                className="p-1.5 rounded-xl hover:bg-base-200 text-base-content/60"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center space-x-3 p-3 bg-base-200/60 rounded-2xl">
                {viewingRental.equipmentImage && (
                  <img
                    src={viewingRental.equipmentImage}
                    alt={viewingRental.equipmentName}
                    className="w-14 h-14 rounded-xl object-cover bg-base-200 shrink-0"
                  />
                )}
                <div>
                  <h4 className="font-black text-sm text-base-content">{viewingRental.equipmentName}</h4>
                  <p className="text-primary font-bold">
                    ৳{Number(viewingRental.totalAmount || 0).toLocaleString('en-BD')} Total Paid
                  </p>
                  <p className="text-[10px] text-base-content/50">Units: {viewingRental.quantity || 1} • {viewingRental.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-base-200/40 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-base-content/50">Customer Name</span>
                  <p className="font-bold text-base-content">{viewingRental.customerName}</p>
                  <p className="text-[10px] text-base-content/60">{viewingRental.customerEmail}</p>
                </div>
                <div className="p-3 bg-base-200/40 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-base-content/50">Site Contact Phone</span>
                  <p className="font-bold text-primary">{viewingRental.contactNumber || 'N/A'}</p>
                  <p className="text-[10px] text-base-content/60">Owner: {viewingRental.ownerName || 'Apex Equipment'}</p>
                </div>
              </div>

              <div className="p-3 bg-base-200/40 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-base-content/50">Job Site Delivery Address</span>
                <p className="font-bold text-base-content">{viewingRental.deliveryAddress || 'Site Address Not Provided'}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-base-200/40 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-base-content/50">Rental Period</span>
                  <p className="font-bold text-base-content">{viewingRental.startDate} → {viewingRental.endDate}</p>
                  <p className="text-[10px] text-base-content/60">{viewingRental.durationDays || 1} Operational Day(s)</p>
                </div>
                <div className="p-3 bg-base-200/40 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-base-content/50">Transaction ID</span>
                  <p className="font-mono font-bold text-emerald-600 text-[11px] truncate">{viewingRental.transactionId || 'Stripe Escrow Verified'}</p>
                  <p className="text-[10px] text-base-content/60">Method: {viewingRental.paymentMethod || 'Stripe Card'}</p>
                </div>
              </div>

              {viewingRental.additionalNotes && (
                <div className="p-3 bg-base-200/40 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-base-content/50">Additional Site Notes</span>
                  <p className="text-base-content/80">{viewingRental.additionalNotes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-base-200">
              <button
                onClick={() => setViewingRental(null)}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Equipment Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-base-100 rounded-3xl border border-base-300 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-base-200">
              <h3 className="text-lg font-black text-base-content">Admin Equipment Edit</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg hover:bg-base-200 text-base-content/60"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-base-content/70 block mb-1">Equipment Name</label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-base-content/70 block mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-base-content/70 block mb-1">Rental Price (৳)</label>
                  <input
                    type="number"
                    required
                    value={editingItem.rentalPrice}
                    onChange={(e) => setEditingItem({ ...editingItem, rentalPrice: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-base-content/70 block mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={editingItem.location}
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-base-content/70 block mb-1">Available Quantity</label>
                  <input
                    type="number"
                    required
                    value={editingItem.availableQuantity}
                    onChange={(e) => setEditingItem({ ...editingItem, availableQuantity: parseInt(e.target.value, 10) || 1 })}
                    className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-base-200">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
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

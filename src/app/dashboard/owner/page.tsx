'use client';

import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import ProfileTab from '@/components/dashboard/ProfileTab';
import api from '@/lib/api';
import {
  BarChart3,
  PlusCircle,
  Package,
  CalendarCheck,
  User,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  Trash2,
  Edit3,
  ExternalLink,
  Loader2,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function OwnerDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['Owner', 'Admin']}>
      <OwnerDashboardContent />
    </ProtectedRoute>
  );
}

function OwnerDashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'analytics';

  const [activeTab, setActiveTab] = useState<
    'analytics' | 'add-equipment' | 'my-equipment' | 'rentals' | 'profile'
  >(initialTab as any);

  const { user } = useAuth();

  // Data states
  const [analytics, setAnalytics] = useState<any>(null);
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Equipment Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Construction Equipment',
    location: '',
    rentalPrice: '',
    rentalType: 'Daily',
    availableQuantity: 1,
    condition: 'Excellent',
    brand: '',
    model: '',
    image: '',
    terms: 'Standard operator inspection required. Fuel returned as dispatched.',
  });
  const [addingEquipment, setAddingEquipment] = useState(false);

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<any>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchOwnerData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, equipmentRes, rentalsRes] = await Promise.all([
        api.get('/analytics/owner'),
        api.get('/equipment/owner/my-equipment'),
        api.get('/bookings/owner-rentals'),
      ]);

      if (analyticsRes.data.success) {
        setAnalytics(analyticsRes.data.analytics);
      }
      if (equipmentRes.data.success) {
        setEquipmentList(equipmentRes.data.equipment || []);
      }
      if (rentalsRes.data.success) {
        setRentals(rentalsRes.data.rentals || []);
      }
    } catch (err) {
      console.error('Error fetching owner data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerData();
  }, []);

  // Handle Add Equipment
  const handleAddEquipmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingEquipment(true);

    try {
      const res = await api.post('/equipment', formData);
      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Equipment Listed!',
          text: 'Your equipment has been submitted with Pending status for Admin review.',
          confirmButtonColor: '#16a34a',
        });

        // Reset form & reload
        setFormData({
          name: '',
          description: '',
          category: 'Construction Equipment',
          location: '',
          rentalPrice: '',
          rentalType: 'Daily',
          availableQuantity: 1,
          condition: 'Excellent',
          brand: '',
          model: '',
          image: '',
          terms: 'Standard operator inspection required. Fuel returned as dispatched.',
        });
        fetchOwnerData();
        setActiveTab('my-equipment');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add equipment.');
    } finally {
      setAddingEquipment(false);
    }
  };

  // Handle Delete Equipment
  const handleDeleteEquipment = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: 'Delete Equipment?',
      text: `Are you sure you want to permanently delete "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/equipment/${id}`);
        setEquipmentList((prev) => prev.filter((item) => item._id !== id));
        toast.success('Equipment deleted.');
      } catch (err) {
        toast.error('Failed to delete equipment.');
      }
    }
  };

  // Handle Update Equipment
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSavingEdit(true);

    try {
      const res = await api.put(`/equipment/${editingItem._id}`, editingItem);
      if (res.data.success) {
        toast.success('Equipment updated successfully.');
        setEquipmentList((prev) =>
          prev.map((item) => (item._id === editingItem._id ? res.data.equipment : item))
        );
        setEditingItem(null);
      }
    } catch (err) {
      toast.error('Failed to update equipment.');
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Owner Header */}
        <div className="bg-gradient-to-r from-secondary/10 via-base-200 to-base-200 p-8 rounded-3xl border border-base-300 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'Owner')}`}
              alt={user?.name || 'Owner'}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-secondary/40 shadow-sm"
            />
            <div>
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">Owner Portal</span>
              <h1 className="text-2xl font-black text-base-content tracking-tight">
                {user?.name}
              </h1>
              <p className="text-xs text-base-content/60">Manage your machinery listings, bookings, and track rental earnings</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('add-equipment')}
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-1.5 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List New Equipment</span>
          </button>
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
            <span>Owner Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('my-equipment')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'my-equipment'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-base-200 text-base-content/70 hover:bg-base-300'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Equipment ({equipmentList.length})</span>
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
            <span>Incoming Rentals ({rentals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('add-equipment')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'add-equipment'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-base-200 text-base-content/70 hover:bg-base-300'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Equipment</span>
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

        {/* Tab 1: Owner Analytics (Challenge 3) */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 rounded-3xl bg-base-100 border border-base-300 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase text-base-content/50">Total Listed</span>
                  <p className="text-3xl font-black text-base-content mt-1">
                    {analytics?.totalListedEquipment ?? equipmentList.length}
                  </p>
                  <span className="text-[10px] text-emerald-600 font-medium">Approved & Pending units</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-base-100 border border-base-300 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase text-base-content/50">Completed Rentals</span>
                  <p className="text-3xl font-black text-emerald-600 mt-1">
                    {analytics?.completedRentals ?? 0}
                  </p>
                  <span className="text-[10px] text-base-content/60 font-medium">Successfully completed</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-base-100 border border-base-300 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase text-base-content/50">Active Bookings</span>
                  <p className="text-3xl font-black text-secondary mt-1">
                    {analytics?.activeRentals ?? 0}
                  </p>
                  <span className="text-[10px] text-base-content/60 font-medium">Dispatched on site</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-base-100 border border-base-300 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase text-base-content/50">Total Earnings</span>
                  <p className="text-3xl font-black text-primary mt-1">
                    ৳{(analytics?.totalEarnings ?? 0).toLocaleString('en-BD')}
                  </p>
                  <span className="text-[10px] text-primary font-medium">Paid via Stripe Escrow</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

            </div>

            {/* Monthly Earnings Chart */}
            <div className="bg-base-100 p-8 rounded-3xl border border-base-300 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-base-content flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Monthly Rental Earnings Overview
                  </h3>
                  <p className="text-xs text-base-content/60">Calculated dynamically from completed Stripe payouts</p>
                </div>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.monthlyStats || []}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="label" fontSize={11} stroke="currentColor" opacity={0.6} />
                    <YAxis fontSize={11} stroke="currentColor" opacity={0.6} />
                    <Tooltip
                      formatter={(val) => [`৳${Number(val).toLocaleString('en-BD')}`, 'Earnings (BDT ৳)']}
                      contentStyle={{
                        borderRadius: '1rem',
                        backgroundColor: '#1f2937',
                        border: 'none',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="revenue" fill="#16a34a" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: My Equipment Table */}
        {activeTab === 'my-equipment' && (
          <div className="bg-base-100 rounded-3xl border border-base-300 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-base-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-base-content">My Equipment Listings</h3>
                <p className="text-xs text-base-content/60">All equipment added by your account with review status</p>
              </div>
              <button
                onClick={() => setActiveTab('add-equipment')}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold"
              >
                + Add New
              </button>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-2">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-xs text-base-content/60">Loading equipment...</p>
              </div>
            ) : equipmentList.length === 0 ? (
              <div className="py-20 text-center p-6 space-y-3">
                <Package className="w-12 h-12 text-base-content/30 mx-auto" />
                <p className="text-sm font-bold text-base-content">No equipment listed yet</p>
                <p className="text-xs text-base-content/60">List your machinery and gear to start receiving rental requests.</p>
                <button
                  onClick={() => setActiveTab('add-equipment')}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold"
                >
                  List Equipment Now
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full text-left text-xs">
                  <thead className="bg-base-200/50 text-base-content/70 uppercase text-[11px] font-bold">
                    <tr>
                      <th className="py-4 px-6">Equipment Name</th>
                      <th>Category</th>
                      <th>Rental Price</th>
                      <th>Available Quantity</th>
                      <th>Status</th>
                      <th className="text-right px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-200">
                    {equipmentList.map((eq) => (
                      <tr key={eq._id} className="hover:bg-base-200/40 transition-colors">
                        <td className="py-4 px-6 font-bold text-base-content">
                          <div className="flex items-center space-x-3">
                            <img
                              src={eq.image}
                              alt={eq.name}
                              className="w-10 h-10 rounded-xl object-cover shrink-0"
                            />
                            <div>
                              <p className="font-bold line-clamp-1">{eq.name}</p>
                              <p className="text-[10px] text-base-content/50">{eq.location}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-base-content/80 font-medium">{eq.category}</td>
                        <td className="font-black text-primary text-sm">৳{Number(eq.rentalPrice).toLocaleString('en-BD')}/{eq.rentalType?.toLowerCase() || 'day'}</td>
                        <td className="font-bold">{eq.availableQuantity} units</td>
                        <td>
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              eq.status === 'Approved'
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : eq.status === 'Rejected'
                                ? 'bg-rose-500/10 text-rose-600'
                                : 'bg-amber-500/10 text-amber-600'
                            }`}
                          >
                            {eq.status || 'Pending'}
                          </span>
                        </td>
                        <td className="text-right px-6 space-x-2">
                          <NextLink
                            href={`/equipment/${eq._id}`}
                            className="inline-flex items-center p-1.5 rounded-lg text-base-content/70 hover:bg-base-200"
                            title="View Details"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </NextLink>

                          <button
                            onClick={() => setEditingItem({ ...eq })}
                            className="inline-flex items-center p-1.5 rounded-lg text-primary hover:bg-primary/10"
                            title="Update"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteEquipment(eq._id, eq.name)}
                            className="inline-flex items-center p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10"
                            title="Delete"
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

        {/* Tab 3: My Equipment Rental Table */}
        {activeTab === 'rentals' && (
          <div className="bg-base-100 rounded-3xl border border-base-300 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-base-200">
              <h3 className="text-lg font-bold text-base-content">Equipment Rental Orders</h3>
              <p className="text-xs text-base-content/60">Rentals placed by customers for your machinery</p>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-2">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-xs text-base-content/60">Loading rental orders...</p>
              </div>
            ) : rentals.length === 0 ? (
              <div className="py-20 text-center p-6 space-y-3">
                <CalendarCheck className="w-12 h-12 text-base-content/30 mx-auto" />
                <p className="text-sm font-bold text-base-content">No rental bookings yet</p>
                <p className="text-xs text-base-content/60">When customers book your equipment, bookings will display here in real time.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full text-left text-xs">
                  <thead className="bg-base-200/50 text-base-content/70 uppercase text-[11px] font-bold">
                    <tr>
                      <th className="py-4 px-6">Customer Information</th>
                      <th>Equipment Information</th>
                      <th>Rental Duration</th>
                      <th>Required Qty</th>
                      <th>Booking Amount</th>
                      <th>Payment Status</th>
                      <th>Booking Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-200">
                    {rentals.map((r) => (
                      <tr key={r._id} className="hover:bg-base-200/40 transition-colors">
                        <td className="py-4 px-6 font-bold text-base-content">
                          <p className="font-bold">{r.customerName || 'Customer'}</p>
                          <p className="text-[10px] text-base-content/50">{r.customerEmail}</p>
                          <p className="text-[10px] text-base-content/50">{r.contactNumber}</p>
                        </td>
                        <td className="font-medium text-base-content/80">
                          <p className="font-bold line-clamp-1">{r.equipmentName}</p>
                          <p className="text-[10px] text-base-content/50">{r.category}</p>
                        </td>
                        <td className="text-base-content/70">
                          {r.startDate} to {r.endDate} ({r.durationDays}d)
                        </td>
                        <td className="font-bold">{r.quantity}</td>
                        <td className="font-black text-primary text-sm">৳{Number(r.totalAmount).toLocaleString('en-BD')}</td>
                        <td>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            r.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                          }`}>
                            {r.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            r.bookingStatus === 'Completed' ? 'bg-blue-500/10 text-blue-600' : 'bg-emerald-500/10 text-emerald-600'
                          }`}>
                            {r.bookingStatus}
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

        {/* Tab 4: Add Equipment Form */}
        {activeTab === 'add-equipment' && (
          <div className="max-w-3xl bg-base-100 p-8 rounded-3xl border border-base-300 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-black text-base-content">List New Equipment for Rent</h3>
              <p className="text-xs text-base-content/60">Fill in the complete equipment specifications. Submissions will be marked Pending for Admin verification.</p>
            </div>

            <form onSubmit={handleAddEquipmentSubmit} className="space-y-4 text-xs">
              
              {/* Equipment Name */}
              <div>
                <label className="font-bold text-base-content/70 block mb-1">Equipment Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Caterpillar 320 Hydraulic Excavator"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                />
              </div>

              {/* Category & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-base-content/70 block mb-1">Category (Dropdown) *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                  >
                    <option value="Construction Equipment">Construction Equipment</option>
                    <option value="Photography Equipment">Photography Equipment</option>
                    <option value="Vehicles & Transportation">Vehicles & Transportation</option>
                    <option value="Agriculture Equipment">Agriculture Equipment</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Event Equipment">Event Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-base-content/70 block mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tejgaon, Dhaka or Agrabad, Chattogram"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Price, Rental Type, Available Qty */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-base-content/70 block mb-1">Rental Price (BDT ৳) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="35000"
                    value={formData.rentalPrice}
                    onChange={(e) => setFormData({ ...formData, rentalPrice: e.target.value })}
                    className="w-full p-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-base-content/70 block mb-1">Rental Type *</label>
                  <select
                    value={formData.rentalType}
                    onChange={(e) => setFormData({ ...formData, rentalType: e.target.value })}
                    className="w-full p-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-base-content/70 block mb-1">Available Quantity *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.availableQuantity}
                    onChange={(e) => setFormData({ ...formData, availableQuantity: parseInt(e.target.value, 10) || 1 })}
                    className="w-full p-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Condition, Brand, Model */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-base-content/70 block mb-1">Equipment Condition</label>
                  <input
                    type="text"
                    placeholder="e.g. Excellent / Like New"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full p-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-base-content/70 block mb-1">Brand</label>
                  <input
                    type="text"
                    placeholder="e.g. Caterpillar, Sony, Ford"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full p-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-base-content/70 block mb-1">Model</label>
                  <input
                    type="text"
                    placeholder="e.g. CAT 320 Next Gen"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full p-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Image URL / ImgBB */}
              <div>
                <label className="font-bold text-base-content/70 block mb-1">
                  Equipment Image (Image URL or imgbb upload) *
                </label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/... or https://i.ibb.co/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-base-content/70 block mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed specifications, included implements, engine size, operational capacity..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                />
              </div>

              {/* Rental Terms and Conditions */}
              <div>
                <label className="font-bold text-base-content/70 block mb-1">Rental Terms & Conditions</label>
                <textarea
                  rows={2}
                  placeholder="Fuel policy, security deposit, insurance requirements, operator credentials..."
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  className="w-full p-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={addingEquipment}
                className="w-full py-4 rounded-xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-2"
              >
                {addingEquipment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Listing Equipment...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Submit Equipment for Rent (Status: Pending)</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Tab 5: My Profile */}
        {activeTab === 'profile' && (
          <ProfileTab />
        )}

      </div>

      {/* Edit Equipment Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-base-100 rounded-3xl border border-base-300 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-base-200">
              <h3 className="text-lg font-black text-base-content">Update Equipment</h3>
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
                  <label className="font-bold text-base-content/70 block mb-1">Rental Price (BDT ৳)</label>
                  <input
                    type="number"
                    required
                    value={editingItem.rentalPrice}
                    onChange={(e) => setEditingItem({ ...editingItem, rentalPrice: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-base-content/70 block mb-1">Available Qty</label>
                  <input
                    type="number"
                    required
                    value={editingItem.availableQuantity}
                    onChange={(e) => setEditingItem({ ...editingItem, availableQuantity: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs"
                  />
                </div>
              </div>

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
                <label className="font-bold text-base-content/70 block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={editingItem.image}
                  onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-base-content/70 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl border border-base-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 rounded-xl bg-primary text-white font-bold"
                >
                  {savingEdit ? 'Saving...' : 'Save Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

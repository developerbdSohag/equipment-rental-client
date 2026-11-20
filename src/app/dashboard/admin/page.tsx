'use client';

import React, { useEffect, useState } from 'react';
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
  Edit3
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

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, usersRes, equipmentRes, rentalsRes] = await Promise.all([
        api.get('/analytics/admin'),
        api.get('/users'),
        api.get('/equipment/admin/all'),
        api.get('/bookings/all'),
      ]);

      if (analyticsRes.data.success) {
        setAnalytics(analyticsRes.data.analytics);
      }
      if (usersRes.data.success) {
        setUsersList(usersRes.data.users || []);
      }
      if (equipmentRes.data.success) {
        setEquipmentList(equipmentRes.data.equipment || []);
      }
      if (rentalsRes.data.success) {
        setRentalsList(rentalsRes.data.rentals || []);
      }
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
            <div className="p-6 border-b border-base-200">
              <h3 className="text-lg font-bold text-base-content">Equipment Moderation & Management</h3>
              <p className="text-xs text-base-content/60">Approve pending listings, reject non-compliant items, or edit specifications</p>
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
                            src={eq.image}
                            alt={eq.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                          <div>
                            <p className="font-bold line-clamp-1">{eq.name}</p>
                            <p className="text-[10px] text-base-content/50">{eq.location} • Qty: {eq.availableQuantity}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-base-content/80 font-medium">{eq.category}</td>
                      <td className="text-base-content/70">
                        <p className="font-bold">{eq.ownerName || 'Owner'}</p>
                        <p className="text-[10px] text-base-content/50">{eq.ownerEmail}</p>
                      </td>
                      <td className="font-black text-primary text-sm">৳{Number(eq.rentalPrice).toLocaleString('en-BD')}/{eq.rentalType?.toLowerCase() || 'day'}</td>
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
                      <td className="text-right px-6 space-x-1.5">
                        {eq.status !== 'Approved' && (
                          <button
                            onClick={() => handleUpdateEquipmentStatus(eq._id, 'Approved')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white font-bold text-[11px] transition-colors"
                          >
                            Approve
                          </button>
                        )}

                        {eq.status !== 'Rejected' && (
                          <button
                            onClick={() => handleUpdateEquipmentStatus(eq._id, 'Rejected')}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white font-bold text-[11px] transition-colors"
                          >
                            Reject
                          </button>
                        )}

                        <button
                          onClick={() => setEditingItem({ ...eq })}
                          className="p-1.5 rounded-lg text-primary hover:bg-primary/10"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteEquipment(eq._id, eq.name)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10"
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
          </div>
        )}

        {/* Tab 4: All Rentals Table */}
        {activeTab === 'rentals' && (
          <div className="bg-base-100 rounded-3xl border border-base-300 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-base-200">
              <h3 className="text-lg font-bold text-base-content">Master Platform Rentals</h3>
              <p className="text-xs text-base-content/60">Complete audit log of all equipment rental bookings and payment statuses</p>
            </div>

            <div className="overflow-x-auto">
              <table className="table w-full text-left text-xs">
                <thead className="bg-base-200/50 text-base-content/70 uppercase text-[11px] font-bold">
                  <tr>
                    <th className="py-4 px-6">Customer Information</th>
                    <th>Owner Information</th>
                    <th>Equipment Name</th>
                    <th>Rental Duration</th>
                    <th>Booking Amount</th>
                    <th>Payment Status</th>
                    <th>Booking Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200">
                  {rentalsList.map((r) => (
                    <tr key={r._id} className="hover:bg-base-200/40 transition-colors">
                      <td className="py-4 px-6 font-bold text-base-content">
                        <p className="font-bold">{r.customerName || 'Customer'}</p>
                        <p className="text-[10px] text-base-content/50">{r.customerEmail}</p>
                        <p className="text-[10px] text-base-content/50">{r.contactNumber}</p>
                      </td>
                      <td className="text-base-content/80 font-medium">
                        <p className="font-bold">{r.ownerName || 'Owner'}</p>
                        <p className="text-[10px] text-base-content/50">{r.ownerEmail}</p>
                      </td>
                      <td className="font-bold text-base-content">
                        <p className="line-clamp-1">{r.equipmentName}</p>
                        <p className="text-[10px] text-base-content/50">Qty: {r.quantity}</p>
                      </td>
                      <td className="text-base-content/70">
                        {r.startDate} to {r.endDate} ({r.durationDays}d)
                      </td>
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
          </div>
        )}

        {/* Tab 5: My Profile */}
        {activeTab === 'profile' && (
          <ProfileTab />
        )}

      </div>

      {/* Edit Modal */}
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
                <label className="font-bold text-base-content/70 block mb-1">Status</label>
                <select
                  value={editingItem.status}
                  onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs font-bold"
                >
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
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

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Phone, MapPin, Image as ImageIcon, Save, Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProfileTab: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({
      name,
      photoURL: photoURL || undefined,
      phone,
      address,
    });
    setSaving(false);
  };

  return (
    <div className="max-w-2xl bg-base-100 p-8 rounded-3xl border border-base-300 shadow-sm space-y-8">
      
      {/* Profile Header */}
      <div className="flex items-center space-x-5 pb-6 border-b border-base-200">
        <img
          src={photoURL || user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
          alt={user?.name || 'User'}
          className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/20 shadow-md"
        />
        <div>
          <h2 className="text-xl font-black text-base-content">{user?.name}</h2>
          <p className="text-xs text-base-content/60">{user?.email}</p>
          <div className="mt-2 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{user?.role} Account</span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="font-bold text-base-content/70 block mb-1">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-base-content/70 block mb-1">Email Address (Read Only)</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-base-300/50 border border-base-300 text-xs font-medium text-base-content/60 cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-base-content/70 block mb-1">Profile Photo Image URL</label>
          <div className="relative">
            <ImageIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="url"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="https://..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-base-content/70 block mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-base-content/70 block mb-1">Address / Location</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="City, State"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/20 hover:bg-primary/90 flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Information</span>
              </>
            )}
          </button>
        </div>
      </form>

    </div>
  );
};

export default ProfileTab;

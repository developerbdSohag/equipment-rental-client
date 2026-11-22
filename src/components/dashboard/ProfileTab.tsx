'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Image as ImageIcon,
  Save,
  Loader2,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Key,
  Camera,
  Check,
  AlertCircle,
  Building,
  FileText,
  Sparkles,
  Upload,
  RefreshCw,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

// Preset professional avatars for instant selection
const PRESET_AVATARS = [
  {
    label: 'Corporate Pro',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  },
  {
    label: 'Fleet Engineer',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    label: 'Site Director',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
  },
  {
    label: 'Operations Lead',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
  },
  {
    label: 'Heavy Tech',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
  },
  {
    label: 'Machinery Specialist',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
  }
];

export const ProfileTab: React.FC = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Information State
  const [name, setName] = useState(user?.name || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [company, setCompany] = useState(user?.company || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Avatar Management Mode
  const [showAvatarPresets, setShowAvatarPresets] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');

  // Password Management State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Active Tab View within Profile Suite
  const [profileSection, setProfileSection] = useState<'info' | 'security'>('info');

  // Password Strength Calculation
  const getPasswordStrength = () => {
    let score = 0;
    if (newPassword.length >= 6) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[a-z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword) || /[^A-Za-z0-9]/.test(newPassword)) score++;
    return score;
  };

  const passwordScore = getPasswordStrength();
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  // Handle Local File Upload for Profile Photo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error('Photo size should be under 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoURL(reader.result);
        toast.success('Photo loaded! Click "Save Profile Information" to apply.');
      }
    };
    reader.onerror = () => {
      toast.error('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  // Apply Custom URL
  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) {
      toast.error('Please enter a valid image URL.');
      return;
    }
    setPhotoURL(customUrlInput.trim());
    setCustomUrlInput('');
    toast.success('Custom image URL applied to preview!');
  };

  // Reset Photo to Generated Initials Avatar
  const handleResetPhoto = () => {
    const defaultDicebear = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || user?.name || 'User')}`;
    setPhotoURL(defaultDicebear);
    toast.success('Reset to generated avatar.');
  };

  // Submit Profile Information
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Full Name is required.');
      return;
    }

    setSavingProfile(true);
    try {
      const success = await updateProfile({
        name: name.trim(),
        photoURL: photoURL || undefined,
        phone: phone.trim(),
        address: address.trim(),
        bio: bio.trim(),
        company: company.trim(),
      });

      if (success) {
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          text: 'Your personal information and avatar have been saved successfully.',
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: 'rounded-3xl' }
        });
      }
    } catch {
      toast.error('Could not save profile changes.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Submit Password Change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword) {
      toast.error('Please enter your new password.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      toast.error('Password must contain at least one uppercase letter (A-Z).');
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      toast.error('Password must contain at least one lowercase letter (a-z).');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await changePassword(currentPassword, newPassword, confirmPassword);
      if (res.success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        Swal.fire({
          icon: 'success',
          title: 'Password Changed!',
          text: 'Your account password has been updated securely. Keep your credentials safe.',
          confirmButtonColor: '#3878FF',
          customClass: { popup: 'rounded-3xl' }
        });
      }
    } catch {
      toast.error('Failed to change password. Please check your current password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* 1. HERO PROFILE CARD */}
      <div className="p-7 sm:p-9 rounded-3xl bg-base-100 border border-base-300 shadow-xl relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          
          {/* Avatar with Camera Trigger Overlay */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden ring-4 ring-primary/30 shadow-xl bg-navy-950">
              <img
                src={
                  photoURL ||
                  user?.photoURL ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'User')}`
                }
                alt={user?.name || 'User'}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'User')}`;
                }}
              />
            </div>

            {/* Click to Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-2.5 rounded-2xl bg-primary text-white shadow-lg hover:bg-primary/90 transition-all hover:scale-110 ring-4 ring-base-100"
              title="Change Profile Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* User Identity Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h2 className="text-2xl sm:text-3xl font-black text-navy-900 dark:text-white tracking-tight">
                {user?.name || 'User Account'}
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{user?.role} Account</span>
              </span>
            </div>

            <p className="text-xs font-medium text-base-content/60 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{user?.email}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-[11px] text-base-content/60">
              {user?.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span>{user.phone}</span>
                </span>
              )}
              {user?.address && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>{user.address}</span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                <span>Verified Account • Enterprise Active</span>
              </span>
            </div>

            {/* Quick Photo Controls Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-base-200 hover:bg-base-300 text-base-content text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-primary" />
                <span>Upload Photo</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAvatarPresets(!showAvatarPresets)}
                className="px-3 py-1.5 rounded-xl bg-base-200 hover:bg-base-300 text-base-content text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Choose Avatar Presets</span>
              </button>

              {photoURL && (
                <button
                  type="button"
                  onClick={handleResetPhoto}
                  className="px-3 py-1.5 rounded-xl bg-error/10 hover:bg-error/20 text-error text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset Photo</span>
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Expandable Avatar Presets Selector */}
        {showAvatarPresets && (
          <div className="mt-6 pt-6 border-t border-base-200 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-base-content/70">
                Select from Curated Professional Avatars
              </span>
              <button
                type="button"
                onClick={() => setShowAvatarPresets(false)}
                className="text-xs text-base-content/50 hover:text-base-content font-bold"
              >
                Close Presets
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {PRESET_AVATARS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPhotoURL(preset.url);
                    toast.success(`Selected "${preset.label}"! Click Save to apply.`);
                  }}
                  className={`group relative rounded-2xl overflow-hidden aspect-square border-2 transition-all p-1 ${
                    photoURL === preset.url
                      ? 'border-primary ring-2 ring-primary/30 shadow-md scale-105'
                      : 'border-base-300 hover:border-primary/50 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <span className="absolute bottom-1 inset-x-1 text-[9px] font-black text-white bg-black/70 rounded-md text-center py-0.5 truncate">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Image URL Bar */}
            <div className="pt-2">
              <label className="text-[11px] font-bold text-base-content/70 block mb-1">
                Or Paste Image Web URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or https://..."
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomUrl}
                  className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shrink-0"
                >
                  Apply URL
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 2. SECTION SWITCHER TABS */}
      <div className="flex items-center space-x-2 border-b border-base-300 pb-3">
        <button
          type="button"
          onClick={() => setProfileSection('info')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
            profileSection === 'info'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'bg-base-200 text-base-content/70 hover:bg-base-300 hover:text-base-content'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Information</span>
        </button>

        <button
          type="button"
          onClick={() => setProfileSection('security')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
            profileSection === 'security'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'bg-base-200 text-base-content/70 hover:bg-base-300 hover:text-base-content'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Security & Password</span>
        </button>
      </div>

      {/* 3. SECTION A: PROFILE INFORMATION FORM */}
      {profileSection === 'info' && (
        <div className="p-7 sm:p-9 rounded-3xl bg-base-100 border border-base-300 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-black text-navy-900 dark:text-white">
              Personal & Contact Information
            </h3>
            <p className="text-xs text-base-content/60">
              Update your identity details, primary phone number, and fleet dispatch address.
            </p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-5 text-xs">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="font-bold text-base-content/80 block">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. System Administrator"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Email (Read Only) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-base-content/80 block">Email Address (Read Only)</label>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Primary Authentication Email
                </span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-base-300/50 border border-base-300 text-xs font-medium text-base-content/60 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Profile Photo Image URL */}
            <div className="space-y-1.5">
              <label className="font-bold text-base-content/80 block">Profile Photo Image URL</label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="url"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://images.unsplash.com/... or upload via top camera button"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Phone & Address in 2 cols */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-base-content/80 block">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1711-234567"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-base-content/80 block">Address / Base Location</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Plot 14-15, Tejgaon Industrial Area, Dhaka"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Company / Organization Name */}
            <div className="space-y-1.5">
              <label className="font-bold text-base-content/80 block">
                Company / Organization (Optional)
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Apex Equipment Pro Ltd. / Heavy Civil Logistics"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Bio / Professional Notes */}
            <div className="space-y-1.5">
              <label className="font-bold text-base-content/80 block">
                Professional Bio & Fleet Background
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Briefly describe your equipment fleet operations, customer service standards, or rental preferences..."
                  className="w-full p-4 rounded-2xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-8 py-3.5 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/25 hover:bg-primary/90 flex items-center gap-2 transition-all hover:scale-[1.01]"
              >
                {savingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Profile...</span>
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
      )}

      {/* 4. SECTION B: SECURITY & CHANGE PASSWORD */}
      {profileSection === 'security' && (
        <div className="p-7 sm:p-9 rounded-3xl bg-base-100 border border-base-300 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-base-200">
            <div>
              <h3 className="text-lg font-black text-navy-900 dark:text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                <span>Security & Password Management</span>
              </h3>
              <p className="text-xs text-base-content/60">
                Ensure your account is protected with a secure, high-entropy password.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-primary/10 text-primary hidden sm:block">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-5 text-xs">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="font-bold text-base-content/80 block">Current Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current account password"
                  className="w-full pl-10 pr-12 py-3 rounded-2xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="font-bold text-base-content/80 block">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter a secure new password (min. 6 characters, A-Z, a-z)"
                  className="w-full pl-10 pr-12 py-3 rounded-2xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {newPassword.length > 0 && (
                <div className="pt-2 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-base-content/60">Password Strength:</span>
                    <span
                      className={
                        passwordScore <= 2
                          ? 'text-rose-500 font-extrabold'
                          : passwordScore === 3
                          ? 'text-amber-500 font-extrabold'
                          : 'text-emerald-500 font-extrabold'
                      }
                    >
                      {passwordScore <= 2 ? 'Weak' : passwordScore === 3 ? 'Medium' : 'Strong & Secure'}
                    </span>
                  </div>
                  <div className="w-full bg-base-300 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordScore <= 2
                          ? 'w-1/3 bg-rose-500'
                          : passwordScore === 3
                          ? 'w-2/3 bg-amber-500'
                          : 'w-full bg-emerald-500'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Password Requirements Checklist */}
            <div className="p-4 rounded-2xl bg-base-200/60 border border-base-300 grid grid-cols-2 gap-2 text-[11px]">
              <div
                className={`flex items-center gap-1.5 ${
                  newPassword.length >= 6 ? 'text-emerald-600 font-bold' : 'text-base-content/50'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>At least 6 characters</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${
                  /[A-Z]/.test(newPassword) ? 'text-emerald-600 font-bold' : 'text-base-content/50'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>One uppercase letter (A-Z)</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${
                  /[a-z]/.test(newPassword) ? 'text-emerald-600 font-bold' : 'text-base-content/50'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>One lowercase letter (a-z)</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${
                  /[0-9]/.test(newPassword) || /[^A-Za-z0-9]/.test(newPassword)
                    ? 'text-emerald-600 font-bold'
                    : 'text-base-content/50'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Number or symbol</span>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-base-content/80 block">Confirm New Password</label>
                {confirmPassword.length > 0 && (
                  <span
                    className={`text-[10px] font-bold flex items-center gap-1 ${
                      passwordsMatch ? 'text-emerald-600' : 'text-rose-500'
                    }`}
                  >
                    {passwordsMatch ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> Passwords match
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" /> Passwords do not match
                      </>
                    )}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  className="w-full pl-10 pr-12 py-3 rounded-2xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Password Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={savingPassword || (newPassword.length > 0 && !passwordsMatch)}
                className="px-8 py-3.5 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/25 hover:bg-primary/90 flex items-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                {savingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>Update Account Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. ACCOUNT ACTIVITY & SECURITY STATUS */}
      <div className="p-6 rounded-3xl bg-base-100 border border-base-300 text-xs text-base-content/70 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-base-content">Enterprise Security & Authentication</p>
            <p className="text-[11px] text-base-content/50">
              JWT sessions are encrypted and securely signed. Profile updates sync immediately across your session.
            </p>
          </div>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 font-extrabold text-[10px] shrink-0 border border-emerald-500/20">
          Account Status: Active & Secured
        </span>
      </div>

    </div>
  );
};

export default ProfileTab;

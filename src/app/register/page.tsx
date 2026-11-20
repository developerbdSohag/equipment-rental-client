'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Mail,
  Lock,
  Image as ImageIcon,
  Phone,
  MapPin,
  ArrowRight,
  Truck,
  Loader2,
  Check,
  X,
  Upload
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [role, setRole] = useState<'Customer' | 'Owner'>('Customer');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Live password validation checks
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;
  const isPasswordValid = hasUpperCase && hasLowerCase && hasMinLength;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error('Password must have an uppercase letter, a lowercase letter, and at least 6 characters.', {
        duration: 4000
      });
      return;
    }

    setSubmitting(true);
    const success = await register(
      name,
      email,
      password,
      photoURL || undefined,
      role,
      phone,
      address
    );
    setSubmitting(false);

    if (success) {
      if (role === 'Owner') {
        router.push('/dashboard/owner');
      } else {
        router.push('/dashboard/customer');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200/50 via-base-100 to-base-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-lg w-full space-y-8 bg-base-100 p-8 sm:p-10 rounded-3xl border border-base-300 shadow-xl">
        
        {/* Brand & Heading */}
        <div className="text-center space-y-2">
          <NextLink href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-white shadow-md shadow-primary/20">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-base-content">
              Gear<span className="text-primary">Up</span>
            </span>
          </NextLink>

          <h2 className="text-2xl font-black text-base-content tracking-tight pt-2">
            Create Your Account
          </h2>
          <p className="text-xs text-base-content/60">
            Join as a Customer to rent gear or as an Equipment Owner to earn rental income
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="p-1 rounded-2xl bg-base-200 border border-base-300 flex">
          <button
            type="button"
            onClick={() => setRole('Customer')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              role === 'Customer'
                ? 'bg-primary text-white shadow-sm'
                : 'text-base-content/70 hover:text-base-content'
            }`}
          >
            👤 Customer (Renter)
          </button>
          <button
            type="button"
            onClick={() => setRole('Owner')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              role === 'Owner'
                ? 'bg-primary text-white shadow-sm'
                : 'text-base-content/70 hover:text-base-content'
            }`}
          >
            🚜 Equipment Owner
          </button>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Full Name */}
          <div>
            <label className="font-bold text-base-content/70 block mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe or Apex Machinery"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content placeholder-base-content/40 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="font-bold text-base-content/70 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content placeholder-base-content/40 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Photo URL */}
          <div>
            <label className="font-bold text-base-content/70 block mb-1">
              Profile Photo URL (direct image link or imgbb upload)
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://i.ibb.co/... or https://images.unsplash.com/..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content placeholder-base-content/40 focus:outline-none focus:border-primary"
              />
            </div>
            <p className="text-[10px] text-base-content/50 mt-1">Leave empty to generate an avatar automatically.</p>
          </div>

          {/* Optional Phone & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-base-content/70 block mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content placeholder-base-content/40 focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-base-content/70 block mb-1">City, Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Chicago, IL"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content placeholder-base-content/40 focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="font-bold text-base-content/70 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content placeholder-base-content/40 focus:outline-none focus:border-primary"
              />
            </div>

            {/* Live Password Validation Indicators */}
            <div className="mt-2.5 p-3 rounded-xl bg-base-200/50 border border-base-200 space-y-1.5 text-[11px]">
              <span className="font-bold text-base-content/60 block mb-1">Password requirements:</span>
              <div className="flex items-center gap-2">
                {hasMinLength ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                )}
                <span className={hasMinLength ? 'text-emerald-600 font-medium' : 'text-base-content/60'}>
                  At least 6 characters
                </span>
              </div>

              <div className="flex items-center gap-2">
                {hasUpperCase ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                )}
                <span className={hasUpperCase ? 'text-emerald-600 font-medium' : 'text-base-content/60'}>
                  At least one uppercase letter (A-Z)
                </span>
              </div>

              <div className="flex items-center gap-2">
                {hasLowerCase ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                )}
                <span className={hasLowerCase ? 'text-emerald-600 font-medium' : 'text-base-content/60'}>
                  At least one lowercase letter (a-z)
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Redirect link to Login */}
        <p className="text-center text-xs text-base-content/70">
          Already registered?{' '}
          <NextLink href="/login" className="font-bold text-primary hover:underline">
            Login to your account
          </NextLink>
        </p>

      </div>
    </div>
  );
}

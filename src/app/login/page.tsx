'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Mail,
  Lock,
  ArrowRight,
  Truck,
  Loader2,
  Sparkles,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const { login, googleLogin, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      if (user.role === 'Admin') router.push('/dashboard/admin');
      else if (user.role === 'Owner') router.push('/dashboard/owner');
      else router.push(redirectPath || '/dashboard/customer');
    }
  }, [user, router, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    const success = await login(email, password);
    setSubmitting(false);

    if (success) {
      router.push(redirectPath);
    }
  };

  const handleGoogleAuth = async () => {
    setSubmitting(true);
    const success = await googleLogin();
    setSubmitting(false);
    if (success) {
      router.push(redirectPath);
    }
  };

  // Demo Login helpers for examiner convenience
  const handleQuickDemoLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setSubmitting(true);
    const success = await login(demoEmail, demoPass);
    setSubmitting(false);
    if (success) {
      router.push(redirectPath);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200/50 via-base-100 to-base-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8 bg-base-100 p-8 sm:p-10 rounded-3xl border border-base-300 shadow-xl">
        
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
            Welcome Back
          </h2>
          <p className="text-xs text-base-content/60">
            Sign in to access your equipment rentals, listings, or dashboard
          </p>
        </div>

        {/* Demo Login Quick-Fill Buttons for Examiner */}
        <div className="bg-primary/5 p-3 rounded-2xl border border-primary/20 space-y-2">
          <p className="text-[11px] font-bold text-primary flex items-center gap-1.5 justify-center">
            <UserCheck className="w-3.5 h-3.5" />
            Examiner / Demo Quick Logins:
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin@rentalequip.com', 'AdminPassword123!')}
              className="py-1 px-2 text-[10px] font-bold rounded-lg bg-base-100 border border-base-300 hover:border-primary text-base-content"
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('owner@rentalequip.com', 'OwnerPassword123!')}
              className="py-1 px-2 text-[10px] font-bold rounded-lg bg-base-100 border border-base-300 hover:border-primary text-base-content"
            >
              🚜 Owner
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('customer@rentalequip.com', 'CustomerPassword123!')}
              className="py-1 px-2 text-[10px] font-bold rounded-lg bg-base-100 border border-base-300 hover:border-primary text-base-content"
            >
              👤 Customer
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-base-content/70 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content placeholder-base-content/40 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

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
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In to Platform</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-base-300 w-full" />
          <span className="bg-base-100 px-3 text-[11px] font-semibold text-base-content/50 uppercase absolute">
            Or continue with
          </span>
        </div>

        {/* Google Social Login */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={submitting}
          className="w-full py-3 rounded-xl border border-base-300 bg-base-100 hover:bg-base-200 text-xs font-bold text-base-content flex items-center justify-center gap-3 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google (Customer Role)</span>
        </button>

        {/* Redirect link to Register */}
        <p className="text-center text-xs text-base-content/70">
          Don't have an account yet?{' '}
          <NextLink href="/register" className="font-bold text-primary hover:underline">
            Register here
          </NextLink>
        </p>

      </div>
    </div>
  );
}

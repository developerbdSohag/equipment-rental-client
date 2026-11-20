'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  ArrowRight,
  Truck,
  Loader2,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  Layers
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const { login, googleLogin, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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
      toast.error('Please enter both your email address and password.');
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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-base-200">
      
      {/* LEFT SIDE: Split-screen dramatic industrial showcase */}
      <div className="hidden lg:flex lg:col-span-6 relative overflow-hidden bg-navy-950 p-12 flex-col justify-between text-white">
        
        {/* Background Machinery Photo with Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1600&q=80"
            alt="Heavy Construction Crane"
            className="w-full h-full object-cover opacity-35 scale-105 transform hover:scale-110 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/30" />
        </div>

        {/* Ambient floating glows */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-electric-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        {/* Brand Top */}
        <div className="relative z-10">
          <NextLink href="/" className="inline-flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-navy-900 via-electric-500 to-cyan-400 flex items-center justify-center text-white shadow-glow-blue">
              <Truck className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Gear<span className="text-electric-400">Up</span>
            </span>
          </NextLink>
        </div>

        {/* Middle Headlines & Floating Glass Stats */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-wider text-electric-300">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Industrial Equipment Network</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.15] text-white">
            Welcome Back!
          </h2>

          <p className="text-base text-white/80 font-medium leading-relaxed">
            Your next project starts with the right equipment. Access your fleet dashboard, track rental agreements, and schedule certified job-site deliveries.
          </p>

          {/* Floating Glassmorphism Cards */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="glass-surface p-4 rounded-2xl border border-white/20 backdrop-blur-md">
              <div className="w-8 h-8 rounded-xl bg-electric-500/20 text-electric-400 flex items-center justify-center mb-2">
                <Layers className="w-4 h-4" />
              </div>
              <p className="text-xl font-black text-white">1,450+ Units</p>
              <p className="text-[11px] text-white/70">Verified in Fleet</p>
            </div>

            <div className="glass-surface p-4 rounded-2xl border border-white/20 backdrop-blur-md">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-2">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-xl font-black text-white">100% Escrow</p>
              <p className="text-[11px] text-white/70">Stripe Protected</p>
            </div>
          </div>
        </div>

        {/* Bottom Trust note */}
        <div className="relative z-10 text-xs text-white/60">
          <p>© 2026 GearUp Marketplace. Trusted by 380+ certified equipment providers nationwide.</p>
        </div>

      </div>

      {/* RIGHT SIDE: Premium Glassmorphism Login Form */}
      <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full glass-card p-8 sm:p-10 rounded-3xl border border-white/80 shadow-glass-lg space-y-6"
        >
          {/* Header */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-electric-500">
              Account Authentication
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
              Sign In to GearUp
            </h2>
            <p className="text-xs text-base-content/60">
              Enter your registered credentials or select a 1-click test role below.
            </p>
          </div>

          {/* 1-Click Demo Login Selector for Examiner */}
          <div className="bg-electric-500/5 p-3.5 rounded-2xl border border-electric-500/20 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-wider text-electric-500 flex items-center gap-1.5 justify-center">
              <UserCheck className="w-3.5 h-3.5" />
              Examiner 1-Click Fast Logins:
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin@rentalequip.com', 'AdminPassword123!')}
                className="py-1.5 px-2 text-[10px] font-bold rounded-xl bg-base-100 border border-base-300 hover:border-electric-500 text-navy-900 transition-all shadow-sm"
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('owner@rentalequip.com', 'OwnerPassword123!')}
                className="py-1.5 px-2 text-[10px] font-bold rounded-xl bg-base-100 border border-base-300 hover:border-electric-500 text-navy-900 transition-all shadow-sm"
              >
                🚜 Owner
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('customer@rentalequip.com', 'CustomerPassword123!')}
                className="py-1.5 px-2 text-[10px] font-bold rounded-xl bg-base-100 border border-base-300 hover:border-electric-500 text-navy-900 transition-all shadow-sm"
              >
                👤 Customer
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
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
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-base-100 border border-base-300/80 text-xs font-bold text-navy-900 focus:outline-none focus:border-electric-500 focus:ring-2 focus:ring-electric-500/20 transition-all"
                />
              </div>
            </div>

            {/* Password with Show/Hide toggle */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-base-content/70">Password</label>
                <span className="text-[11px] font-semibold text-electric-500 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3.5 rounded-xl bg-base-100 border border-base-300/80 text-xs font-bold text-navy-900 focus:outline-none focus:border-electric-500 focus:ring-2 focus:ring-electric-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 cursor-pointer text-xs font-medium text-base-content/80">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox checkbox-primary checkbox-xs rounded-md"
                />
                <span>Remember this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-premium-primary py-4 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social login divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-base-300 w-full" />
            <span className="bg-base-100 px-3 text-[10px] font-black uppercase tracking-wider text-base-content/40 absolute">
              Or authenticate with
            </span>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={submitting}
            className="w-full py-3.5 rounded-xl border border-base-300 bg-base-100 hover:bg-base-200 text-xs font-bold text-navy-900 flex items-center justify-center gap-3 transition-colors shadow-sm"
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

          {/* Register Link */}
          <p className="text-center text-xs text-base-content/70">
            Don't have an account yet?{' '}
            <NextLink href="/register" className="font-bold text-electric-500 hover:underline">
              Create an account
            </NextLink>
          </p>

        </motion.div>
      </div>

    </div>
  );
}

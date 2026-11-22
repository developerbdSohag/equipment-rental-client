'use client';

import React, { useState, useRef } from 'react';
import NextLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  CheckCircle2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  MessageSquare,
  Phone,
  ShieldCheck,
  Check,
  ArrowLeft,
  Truck,
  Sparkles,
  Zap,
  Building2
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

// High-resolution verified fleet machinery showcase
const SHOWCASE_MACHINES = [
  {
    title: '25 Ton Hydraulic Crane',
    category: 'Mobile Heavy Lifting',
    image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80',
    link: '/equipment/6afff0e18ab535911d632a2c'
  },
  {
    title: '22 Meter Telescopic Boom',
    category: 'Aerial Work Platform',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    link: '/equipment/6affc217a3282c28aad9361b'
  },
  {
    title: '10 Ton Heavy Pneumatic Forklift',
    category: 'Industrial Material Handling',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80',
    link: '/equipment/6afff0e18ab535911d632a2e'
  },
  {
    title: 'ZT-50 HDD Rig - Trenchless Drill',
    category: 'Underground Infrastructure',
    image: 'https://images.unsplash.com/photo-1579487785973-74d2ca7abdd5?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=600&q=80',
    link: '/equipment/6affc217a3282c28aad93613'
  },
  {
    title: '20 Meter Articulated Manlift',
    category: 'Elevated Facility Access',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
    link: '/equipment/6afff0e18ab535911d632a33'
  },
  {
    title: 'Kubota Deluxe Farm & Site Tractor',
    category: 'Commercial Agriculture & Earthwork',
    image: 'https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1579487785973-74d2ca7abdd5?auto=format&fit=crop&w=600&q=80',
    link: '/equipment/6affc217a3282c28aad9361d'
  }
];

export const OwnerLoginPortal: React.FC<{ redirectPath?: string }> = ({
  redirectPath = '/dashboard/owner'
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || redirectPath;

  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Magnetic Enlightenment Touch Coordinate State for Sign In Button
  const signInButtonRef = useRef<HTMLButtonElement>(null);
  const [signInGlowPos, setSignInGlowPos] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false
  });

  // Magnetic Enlightenment Touch Coordinate State for Create Account Button
  const createAccountRef = useRef<HTMLAnchorElement>(null);
  const [createGlowPos, setCreateGlowPos] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false
  });

  const handleSignInMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!signInButtonRef.current) return;
    const rect = signInButtonRef.current.getBoundingClientRect();
    setSignInGlowPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true
    });
  };

  const handleSignInMouseLeave = () => {
    setSignInGlowPos((prev) => ({ ...prev, active: false }));
  };

  const handleCreateMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!createAccountRef.current) return;
    const rect = createAccountRef.current.getBoundingClientRect();
    setCreateGlowPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true
    });
  };

  const handleCreateMouseLeave = () => {
    setCreateGlowPos((prev) => ({ ...prev, active: false }));
  };

  // Submit Owner Sign In
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both your email and password.');
      return;
    }

    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Welcome to the Owner Fleet Portal!');
        router.push(redirect);
      }
    } catch {
      toast.error('Unable to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Auto-Fill for Owner
  const handleQuickDemo = () => {
    setEmail('owner@rentalequip.com');
    setPassword('OwnerPassword123!');
    toast.success('Owner credentials loaded! Click "SIGN IN" to proceed.');
  };

  // Handle Forgot Password
  const handleForgotPassword = () => {
    Swal.fire({
      title: 'Reset Owner Password',
      text: 'Enter your registered fleet owner email address to receive secure password recovery instructions.',
      input: 'email',
      inputValue: email || 'owner@rentalequip.com',
      inputPlaceholder: 'owner@rentalequip.com',
      showCancelButton: true,
      confirmButtonText: 'Send Reset Link',
      confirmButtonColor: '#EA580C',
      cancelButtonColor: '#6B7280',
      customClass: { popup: 'rounded-3xl' }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Reset Link Dispatched',
          text: `A password reset link has been dispatched to ${result.value}. Check your email or contact support.`,
          confirmButtonColor: '#EA580C',
          customClass: { popup: 'rounded-3xl' }
        });
      }
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white dark:bg-[#0c1427] text-neutral-800 dark:text-neutral-100 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden transition-colors">
      
      {/* Top Header Bar */}
      <div className="bg-[#FAF7F2] dark:bg-[#0f172a] px-6 py-3.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <NextLink
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-[#EA580C] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace Home</span>
        </NextLink>

        <span className="text-[11px] font-black uppercase tracking-wider text-[#EA580C] bg-[#EA580C]/10 px-3 py-1 rounded-full border border-[#EA580C]/20 flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5" />
          <span>Machinery Owner & Vendor Network</span>
        </span>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* =========================================================================
            LEFT COLUMN (7 cols): COMMERCIAL VALUE PROPOSITION & ONBOARDING STEPS
        ========================================================================= */}
        <div className="lg:col-span-6 xl:col-span-7 p-6 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-neutral-200 dark:border-neutral-800 bg-[#FCFBF8] dark:bg-[#0a1122] space-y-7">
          
          {/* Tag & Heading */}
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#C2410C] block flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-[#C2410C]" />
              <span>GEARUP FLEET VENDOR NETWORK</span>
            </span>
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black text-[#8C2D0B] dark:text-[#FB923C] tracking-tight leading-tight uppercase font-serif">
              KEEP YOUR MACHINES WORKING & PROFITABLE
            </h1>
          </div>

          {/* Professional Value Proposition */}
          <div className="space-y-2 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <p className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
              An idle machine in your yard is income lost every day. Partner with GearUp to keep your fleet continuously deployed with high-value contracts.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">
              We connect your heavy industrial machinery directly with vetted infrastructure developers, EPC contractors, and commercial builders across Bangladesh. Zero intermediaries, guaranteed escrow settlements, and complete operational transparency.
            </p>
          </div>

          {/* 5 High-Impact Business Benefits */}
          <div className="space-y-5 pt-1">
            
            {/* Benefit 1 */}
            <div className="flex items-start space-x-3.5">
              <div className="w-5 h-5 rounded-full bg-[#EA580C] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="space-y-0.5 text-xs">
                <p className="font-black text-neutral-900 dark:text-neutral-100">
                  Continuous Contract Inflow
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Gain instant exposure to mega-infrastructure projects, industrial plants, deep foundation works, and commercial construction sites nationwide.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex items-start space-x-3.5">
              <div className="w-5 h-5 rounded-full bg-[#EA580C] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="space-y-0.5 text-xs">
                <p className="font-black text-neutral-900 dark:text-neutral-100">
                  Centralized Fleet Telemetry & Registry
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Organize every machine with high-resolution photos, load test ratings, daily tariffs, and live deployment statuses in one unified digital dashboard.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex items-start space-x-3.5">
              <div className="w-5 h-5 rounded-full bg-[#EA580C] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="space-y-0.5 text-xs">
                <p className="font-black text-neutral-900 dark:text-neutral-100">
                  Verified Commercial Reputation
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Build brand equity with verified client reviews, on-time delivery ratings, and verified vendor badges that drive recurring corporate orders.
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex items-start space-x-3.5">
              <div className="w-5 h-5 rounded-full bg-[#EA580C] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="space-y-0.5 text-xs">
                <p className="font-black text-neutral-900 dark:text-neutral-100">
                  Total Operational & Pricing Control
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Set your custom rental prices, establish minimum booking durations, and toggle machines between Available and On-Rent with one tap.
                </p>
              </div>
            </div>

            {/* Benefit 5 */}
            <div className="flex items-start space-x-3.5">
              <div className="w-5 h-5 rounded-full bg-[#EA580C] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="space-y-0.5 text-xs">
                <p className="font-black text-neutral-900 dark:text-neutral-100">
                  Inspection Certificates in One Place
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Store digital fitness certificates, load charts, and operator licenses right alongside each machinery listing for rapid compliance audits.
                </p>
              </div>
            </div>

          </div>

          {/* 4-Step Process Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0e1628] border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              
              {/* Step 1 */}
              <div className="p-2 sm:p-3 border-r border-neutral-100 dark:border-neutral-800/80 last:border-r-0 space-y-1">
                <div className="w-6 h-6 rounded-full bg-[#EA580C] text-white text-[11px] font-black flex items-center justify-center mx-auto mb-1.5 shadow-sm">
                  1
                </div>
                <p className="text-[11px] font-black text-neutral-800 dark:text-neutral-200">
                  Create Account
                </p>
                <p className="text-[10px] text-neutral-500">
                  Takes under 2 mins
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-2 sm:p-3 border-r border-neutral-100 dark:border-neutral-800/80 last:border-r-0 space-y-1">
                <div className="w-6 h-6 rounded-full bg-[#EA580C] text-white text-[11px] font-black flex items-center justify-center mx-auto mb-1.5 shadow-sm">
                  2
                </div>
                <p className="text-[11px] font-black text-neutral-800 dark:text-neutral-200">
                  Add Equipment
                </p>
                <p className="text-[10px] text-neutral-500">
                  Upload specs & rates
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-2 sm:p-3 border-r border-neutral-100 dark:border-neutral-800/80 last:border-r-0 space-y-1">
                <div className="w-6 h-6 rounded-full bg-[#EA580C] text-white text-[11px] font-black flex items-center justify-center mx-auto mb-1.5 shadow-sm">
                  3
                </div>
                <p className="text-[11px] font-black text-neutral-800 dark:text-neutral-200">
                  We Verify & List
                </p>
                <p className="text-[10px] text-neutral-500">
                  Fast compliance check
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-2 sm:p-3 space-y-1">
                <div className="w-6 h-6 rounded-full bg-[#EA580C] text-white text-[11px] font-black flex items-center justify-center mx-auto mb-1.5 shadow-sm">
                  4
                </div>
                <p className="text-[11px] font-black text-neutral-800 dark:text-neutral-200">
                  Get Rental Work
                </p>
                <p className="text-[10px] text-neutral-500">
                  Instant escrow payout
                </p>
              </div>

            </div>
          </div>

          {/* Footer Helpline */}
          <div className="flex flex-wrap items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 gap-2">
            <p>
              Onboarding takes only 5 minutes. Need phone or WhatsApp guidance?
            </p>
            <a
              href="https://wa.me/8801759765387"
              target="_blank"
              rel="noreferrer"
              className="text-[#EA580C] font-black hover:underline inline-flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>+880 1759-765387</span>
            </a>
          </div>

        </div>

        {/* =========================================================================
            RIGHT COLUMN (5 cols): MAGNETIC TOUCH FORM, CONCIERGE & SHOWCASE
        ========================================================================= */}
        <div className="lg:col-span-6 xl:col-span-5 p-6 sm:p-10 lg:p-12 bg-white dark:bg-[#0c1427] space-y-7">
          
          {/* Top Tabs: SIGN IN vs CREATE ACCOUNT with Magnetic Enlightenment Touch */}
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            
            {/* Active SIGN IN Tab */}
            <div className="relative pb-3 -mb-3 border-b-2 border-[#EA580C]">
              <span className="text-xs sm:text-sm font-black text-[#EA580C] uppercase tracking-wide cursor-default flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>SIGN IN</span>
              </span>
            </div>

            {/* CREATE ACCOUNT Button with Magnetic Enlightenment Touch */}
            <NextLink
              ref={createAccountRef}
              href="/register?role=Owner"
              onMouseMove={handleCreateMouseMove}
              onMouseLeave={handleCreateMouseLeave}
              className="relative px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black text-neutral-600 dark:text-neutral-300 hover:text-white uppercase tracking-wide transition-all duration-300 overflow-hidden group border border-transparent hover:border-[#EA580C]/40"
              style={{
                boxShadow: createGlowPos.active
                  ? '0 0 25px rgba(234, 88, 12, 0.45)'
                  : 'none',
                transform: createGlowPos.active ? 'translateY(-1px) scale(1.02)' : 'none'
              }}
            >
              {/* Dynamic Magnetic Touch Flare */}
              {createGlowPos.active && (
                <span
                  className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 opacity-100"
                  style={{
                    background: `radial-gradient(circle 90px at ${createGlowPos.x}px ${createGlowPos.y}px, rgba(234, 88, 12, 0.85), rgba(234, 88, 12, 0.5) 50%, transparent 100%)`
                  }}
                />
              )}

              <span className="relative z-10 flex items-center gap-1 transition-colors duration-200 group-hover:text-white">
                <span>CREATE ACCOUNT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </NextLink>

          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="font-bold text-neutral-700 dark:text-neutral-300 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. owner@rentalequip.com"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-white dark:bg-[#0e1628] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
                />
              </div>
            </div>

            {/* Password Field with Eye Toggle */}
            <div className="space-y-1.5">
              <label className="font-bold text-neutral-700 dark:text-neutral-300 block">
                Account Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white dark:bg-[#0e1628] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* MAGNETIC ENLIGHTENMENT TOUCH SIGN IN BUTTON */}
            <button
              ref={signInButtonRef}
              type="submit"
              disabled={loading}
              onMouseMove={handleSignInMouseMove}
              onMouseLeave={handleSignInMouseLeave}
              className="relative w-full py-3.5 rounded-xl bg-gradient-to-r from-[#EA580C] via-[#F97316] to-[#EA580C] text-white text-xs font-black uppercase tracking-wider overflow-hidden shadow-lg transition-all duration-300 ease-out flex items-center justify-center gap-2 mt-2 group cursor-pointer"
              style={{
                boxShadow: signInGlowPos.active
                  ? '0 0 35px rgba(249, 115, 22, 0.75), 0 4px 20px rgba(234, 88, 12, 0.45)'
                  : '0 4px 14px rgba(234, 88, 12, 0.3)',
                transform: signInGlowPos.active ? 'translateY(-2px) scale(1.015)' : 'translateY(0) scale(1)',
                filter: signInGlowPos.active ? 'brightness(1.1)' : 'brightness(1)'
              }}
            >
              {/* Dynamic Magnetic Touch Flare */}
              {signInGlowPos.active && (
                <span
                  className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-200 opacity-100"
                  style={{
                    background: `radial-gradient(circle 130px at ${signInGlowPos.x}px ${signInGlowPos.y}px, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.15) 45%, transparent 75%)`
                  }}
                />
              )}

              {/* Luminous Glow Edge Shimmer */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4" />
                    <span>SIGN IN TO FLEET PORTAL</span>
                  </>
                )}
              </span>
            </button>

            {/* Forgot Password & Demo Credentials */}
            <div className="flex items-center justify-between pt-1 text-[11px]">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[#EA580C] hover:underline font-bold"
              >
                Forgot password?
              </button>

              <button
                type="button"
                onClick={handleQuickDemo}
                className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 underline font-medium"
              >
                ⚡ Auto-fill Owner Demo
              </button>
            </div>

          </form>

          {/* Green WhatsApp Concierge Box with 01759-765387 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#E8F5E9] dark:bg-[#064E3B]/20 border border-[#81C784]/60 dark:border-emerald-600/40 text-xs text-neutral-800 dark:text-neutral-200 space-y-2.5">
            <h4 className="font-black text-[#1B5E20] dark:text-emerald-400 text-xs sm:text-sm flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span>Busy on the Jobsite? We'll List It For You</span>
            </h4>
            <p className="text-[11px] text-[#2E7D32] dark:text-emerald-300 leading-relaxed">
              Send photos, equipment specifications, and rental rates on WhatsApp. Our onboarding operations team will configure and publish your fleet listings immediately.
            </p>
            <div>
              <a
                href="https://wa.me/8801759765387?text=Hello%20GearUp%20Team,%20I%20am%20an%20equipment%20owner%20and%20want%20to%20list%20my%20machinery"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-black text-xs shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp 01759-765387</span>
              </a>
            </div>
          </div>

          {/* Active Fleet Showcase with Guaranteed High-Res Images & Fallbacks */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>Active Fleet Machinery on GearUp</span>
              </h4>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Live Inventory
              </span>
            </div>

            {/* 6 Grid Thumbnails with Reliable Fallbacks */}
            <div className="grid grid-cols-3 gap-2">
              {SHOWCASE_MACHINES.map((item, idx) => (
                <NextLink
                  key={idx}
                  href={item.link}
                  className="group block rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 transition-all hover:border-[#EA580C] hover:shadow-sm"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-900 relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = item.fallback;
                      }}
                    />
                  </div>
                  <p className="p-1.5 text-[9px] font-bold text-neutral-700 dark:text-neutral-300 truncate group-hover:text-[#EA580C]">
                    {item.title}
                  </p>
                </NextLink>
              ))}
            </div>

            {/* See All Equipment Link */}
            <div className="pt-1 text-right">
              <NextLink
                href="/equipment"
                className="text-xs font-black text-[#EA580C] hover:underline inline-flex items-center gap-1"
              >
                <span>Explore Full Machinery Fleet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </NextLink>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default OwnerLoginPortal;

'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useRef } from 'react';
import NextLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Check,
  Eye,
  EyeOff,
  Play,
  X,
  Volume2,
  VolumeX,
  Building2,
  Users,
  ShieldCheck,
  MessageCircle,
  Sparkles,
  Trophy,
  ArrowLeft,
  Truck
} from 'lucide-react';
import toast from 'react-hot-toast';
import OwnerLoginPortal from '@/components/auth/OwnerLoginPortal';
import { GoogleAccountChooserModal } from '@/components/auth/GoogleAccountChooserModal';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';
  const roleParam = searchParams.get('role');
  const [loginMode, setLoginMode] = useState<'standard' | 'owner'>(
    roleParam?.toLowerCase() === 'owner' ? 'owner' : 'standard'
  );

  const { login, googleLogin, githubLogin, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const bgVideoRef = useRef<HTMLVideoElement>(null);

  // Guarantee seamless video autoplay on page load
  React.useEffect(() => {
    if (bgVideoRef.current) {
      bgVideoRef.current.defaultMuted = true;
      bgVideoRef.current.muted = true;
      const playPromise = bgVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Video autoplay prevented by browser:', err);
        });
      }
    }
  }, []);

  // Handle OAuth callback parameters (Google / GitHub redirect returns)
  React.useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      toast.error(`Authentication error: ${errorParam}`);
      return;
    }

    const authStatus = searchParams.get('auth');
    const provider = searchParams.get('provider');
    if (authStatus === 'success') {
      const savedRedirect = typeof window !== 'undefined' ? sessionStorage.getItem('equipment_auth_redirect') : null;
      if (provider === 'google') {
        toast.loading('Finalizing Google authentication...', { id: 'social-finalize' });
        googleLogin('customer.google@rentalhub.com', 'Google Verified Customer').then((success) => {
          toast.dismiss('social-finalize');
          if (success) {
            router.push(savedRedirect || redirectPath || '/dashboard/customer');
          }
        });
      } else if (provider === 'github') {
        toast.loading('Finalizing GitHub authentication...', { id: 'social-finalize' });
        githubLogin('contractor.github@rentalhub.com', 'GitHub Verified Contractor').then((success) => {
          toast.dismiss('social-finalize');
          if (success) {
            router.push(savedRedirect || redirectPath || '/dashboard/customer');
          }
        });
      }
    }
  }, [searchParams, googleLogin, githubLogin, router, redirectPath]);

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

  const handleGoogleAuth = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('equipment_auth_redirect', redirectPath || '/dashboard/customer');
    }
    setGoogleModalOpen(true);
  };

  const handleGoogleAccountSelect = async (
    selectedEmail: string,
    selectedName: string,
    selectedPhoto?: string
  ): Promise<boolean> => {
    setSubmitting(true);
    const success = await googleLogin(selectedEmail, selectedName, selectedPhoto);
    setSubmitting(false);
    if (success) {
      router.push(redirectPath || '/dashboard/customer');
      return true;
    }
    return false;
  };

  const handleGithubAuth = async () => {
    setSubmitting(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('equipment_auth_redirect', redirectPath || '/dashboard/customer');
    }
    toast.loading('Redirecting to GitHub Accounts...', { id: 'social-redirect' });
    await githubLogin();
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

  const toggleSound = () => {
    if (bgVideoRef.current) {
      bgVideoRef.current.muted = !bgVideoRef.current.muted;
      setIsMuted(bgVideoRef.current.muted);
    }
  };

  if (loginMode === 'owner') {
    return (
      <div className="min-h-screen bg-[#F7F5F0] dark:bg-[#070d19] py-8 sm:py-14 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center space-y-5 transition-colors">
        <div className="w-full max-w-6xl flex justify-between items-center px-2">
          <NextLink
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Marketplace Home</span>
          </NextLink>

          <button
            onClick={() => setLoginMode('standard')}
            className="text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white underline"
          >
            Switch to Customer / Admin Sign In →
          </button>
        </div>

        <OwnerLoginPortal redirectPath={redirectPath} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden overflow-y-auto lg:overflow-hidden bg-[#070d19] text-white flex flex-col justify-between select-none">
      
      {/* 1. CINEMATIC FULLY RESPONSIVE VIDEO BACKGROUND */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-[#070d19] pointer-events-none">
        {/* Seamless looping animated video with adaptive responsive focal framing */}
        <video
          ref={bgVideoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-[70%_center] sm:object-[65%_center] md:object-center filter brightness-[0.82] contrast-[1.08] transition-all duration-500"
        >
          <source src="/videos/login-bg.mp4" type="video/mp4" />
        </video>

        {/* Adaptive Overlays: mobile/tablet vs laptop/desktop */}
        {/* Mobile & Tablet: slightly deeper ambient overlay for maximum readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070d19]/85 via-[#070d19]/65 to-[#070d19]/95 lg:hidden" />
        {/* Desktop / Laptop: directional cinematic horizontal fade */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#070d19]/80 via-[#070d19]/35 to-[#070d19]/85" />
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-[#070d19] via-transparent to-[#070d19]/60" />

        {/* Responsive Neon Curved Glow Orbs */}
        <div className="absolute top-1/4 left-1/4 lg:left-1/3 w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] lg:w-[550px] lg:h-[550px] rounded-full border-2 border-[#FF7A1A]/30 blur-sm pointer-events-none -rotate-12 opacity-70" />
        <div className="absolute top-1/4 left-1/4 lg:left-1/3 w-[260px] h-[260px] sm:w-[380px] sm:h-[380px] lg:w-[520px] lg:h-[520px] rounded-full bg-gradient-to-tr from-[#FF7A1A]/20 to-transparent blur-3xl pointer-events-none" />

        <div className="absolute top-6 sm:top-10 right-0 w-[280px] h-[280px] sm:w-[450px] sm:h-[450px] lg:w-[600px] lg:h-[600px] rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-4 sm:right-10 w-[240px] h-[240px] sm:w-[380px] sm:h-[380px] lg:w-[500px] lg:h-[500px] rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
      </div>

      {/* 2. TOP NAVIGATION BAR */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 flex items-center justify-between">
        
        {/* Left: RentMach Logo with Cogwheel Icon */}
        <NextLink href="/" className="flex items-center space-x-2.5 sm:space-x-3 group">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-[#E65C00] to-[#FF8A35] flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,122,26,0.5)] group-hover:rotate-45 transition-transform duration-500">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-white" viewBox="0 0 24 24">
              <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.488.488 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65z"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center">
              RentMach
            </span>
            <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 tracking-widest uppercase -mt-0.5 sm:-mt-1">
              Rent • Work • Grow
            </span>
          </div>
        </NextLink>

        {/* Right: Create Account pill button & Owner Portal switch */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* Owner Portal switch button */}
          <button
            onClick={() => setLoginMode('owner')}
            className="px-3 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-black text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-md transition-all flex items-center gap-1.5"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Owner Portal</span>
          </button>

          {/* Audio toggle button for background video */}
          <button
            onClick={toggleSound}
            aria-label="Toggle Sound"
            className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 transition-all backdrop-blur-md"
            title={isMuted ? 'Unmute Video' : 'Mute Video'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF7A1A]" />}
          </button>

          <span className="text-xs text-slate-300 hidden md:inline-block font-medium">
            Don't have an account?
          </span>

          <NextLink
            href="/register"
            className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-bold text-[#FF8A35] bg-black/40 hover:bg-[#FF8A35]/15 border border-[#FF8A35]/50 transition-all duration-300 shadow-[0_0_15px_rgba(255,138,53,0.15)] flex items-center space-x-1 sm:space-x-1.5"
          >
            <span>Create Account</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </NextLink>
        </div>

      </header>

      {/* 3. MAIN CENTER CONTAINER: Left Hero Info + Right Glass Card */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* LEFT COLUMN (7 cols): Hero Content & Floating Stats Card */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6 lg:space-y-7 text-left">
          
          {/* Badge: #1 Equipment Rental Platform */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-bold text-white shadow-sm"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="tracking-wide text-slate-200">#1 Equipment Rental Platform</span>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-2 sm:space-y-3"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08] text-white">
              Welcome <span className="text-[#FF7A1A]">Back!</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-200 font-medium max-w-xl leading-relaxed">
              Your next project starts with the right equipment.
            </p>
          </motion.div>

          {/* Checklist Bullets */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm font-semibold text-slate-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded-full bg-[#FF7A1A] flex items-center justify-center text-white shrink-0 shadow-[0_0_10px_rgba(255,122,26,0.5)]">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span>Rent from trusted owners</span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded-full bg-[#FF7A1A] flex items-center justify-center text-white shrink-0 shadow-[0_0_10px_rgba(255,122,26,0.5)]">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span>Get the best rates</span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded-full bg-[#FF7A1A] flex items-center justify-center text-white shrink-0 shadow-[0_0_10px_rgba(255,122,26,0.5)]">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span>Build bigger together</span>
            </div>
          </motion.div>

          {/* Interactive "Watch Video" Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-1 sm:pt-2"
          >
            <button
              onClick={() => setVideoModalOpen(true)}
              className="group inline-flex items-center space-x-3 sm:space-x-4 pr-4 sm:pr-5 py-1.5 sm:py-2 pl-1.5 sm:pl-2 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/20 transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 group-hover:bg-[#FF7A1A] text-white flex items-center justify-center shadow-md transition-colors duration-300">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white ml-0.5" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide">Watch Video</span>
            </button>
          </motion.div>

          {/* Floating Glass Stats Card (Responsive: 3 columns on all screens) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-2 sm:pt-4"
          >
            <div className="grid grid-cols-3 sm:inline-flex items-center divide-x divide-white/15 px-3 sm:px-6 py-3 sm:py-4 rounded-2xl sm:rounded-3xl bg-white/[0.08] backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.4)] max-w-full">
              
              {/* Stat 1: 50K+ Equipment */}
              <div className="flex flex-col sm:flex-row items-center sm:space-x-3 px-2 sm:px-0 sm:pr-6 py-1 text-center sm:text-left">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#FF7A1A]/20 text-[#FF7A1A] flex items-center justify-center mb-1 sm:mb-0">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-base sm:text-lg font-black text-white">50K+</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium">Equipment</p>
                </div>
              </div>

              {/* Stat 2: 25K+ Happy Users */}
              <div className="flex flex-col sm:flex-row items-center sm:space-x-3 px-2 sm:px-6 py-1 text-center sm:text-left">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#FF7A1A]/20 text-[#FF7A1A] flex items-center justify-center mb-1 sm:mb-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-base sm:text-lg font-black text-white">25K+</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium">Happy Users</p>
                </div>
              </div>

              {/* Stat 3: 99% Satisfaction */}
              <div className="flex flex-col sm:flex-row items-center sm:space-x-3 px-2 sm:px-0 sm:pl-6 py-1 text-center sm:text-left">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#FF7A1A]/20 text-[#FF7A1A] flex items-center justify-center mb-1 sm:mb-0">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-base sm:text-lg font-black text-white">99%</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium">Satisfaction</p>
                </div>
              </div>

            </div>
          </motion.div>

        </div>

        {/* RIGHT COLUMN (5 cols): The Glassmorphism Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-5 relative w-full max-w-md sm:max-w-lg lg:max-w-none mx-auto"
        >
          {/* High-End Glassmorphism Card */}
          <div className="relative rounded-3xl sm:rounded-[2.5rem] bg-[#0c162c]/65 backdrop-blur-2xl border border-cyan-400/35 p-6 sm:p-8 lg:p-10 shadow-[0_0_50px_rgba(56,120,255,0.25)] space-y-5 sm:space-y-6">
            
            {/* Header: Cyan Glowing Lock Icon */}
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.35)]">
                <Lock className="w-7 h-7 stroke-[2.2]" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Login to <span className="text-[#FF8A35]">RentMach</span>
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  Access your account and continue your journey
                </p>
              </div>
            </div>

            {/* 1-Click Fast Demo Fill Buttons for Examiner */}
            <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 block text-center">
                Examiner 1-Click Demo Logins:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin@rentalequip.com', 'AdminPassword123!')}
                  className="py-1 px-1.5 text-[10px] font-extrabold rounded-xl bg-white/10 hover:bg-[#FF7A1A]/20 hover:border-[#FF7A1A] border border-white/10 text-white transition-all text-center"
                >
                  👑 Admin
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMode('owner')}
                  className="py-1 px-1.5 text-[10px] font-extrabold rounded-xl bg-white/10 hover:bg-[#FF7A1A]/20 hover:border-[#FF7A1A] border border-white/10 text-white transition-all text-center"
                >
                  🚜 Owner Portal
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('customer@rentalequip.com', 'CustomerPassword123!')}
                  className="py-1 px-1.5 text-[10px] font-extrabold rounded-xl bg-white/10 hover:bg-[#FF7A1A]/20 hover:border-[#FF7A1A] border border-white/10 text-white transition-all text-center"
                >
                  👤 Customer
                </button>
              </div>
            </div>

            {/* Direct Owner Portal Card Banner */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-[#EA580C]/25 via-amber-500/20 to-transparent border border-[#EA580C]/40 text-center space-y-1.5">
              <span className="text-[11px] text-amber-300 font-bold block">
                Are you an Equipment Owner or Vendor?
              </span>
              <button
                type="button"
                onClick={() => setLoginMode('owner')}
                className="w-full py-2.5 px-3 rounded-xl bg-[#EA580C] hover:bg-[#D94E07] text-white text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Open Owner & Fleet Vendor Portal Sign In →</span>
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Email Input */}
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/[0.06] border border-white/15 text-xs font-semibold text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all backdrop-blur-md"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-white/[0.06] border border-white/15 text-xs font-semibold text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all backdrop-blur-md"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center space-x-2 cursor-pointer text-slate-300 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-white/10 border-white/30 text-cyan-400 focus:ring-0 focus:ring-offset-0 accent-cyan-400 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => toast('Password reset link has been dispatched to your email.', { icon: '🔑' })}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Radiant Orange Pill Button: Login -> */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-full font-black text-sm text-white uppercase tracking-wider bg-gradient-to-r from-[#FF6A00] via-[#FF7A1A] to-[#FF8A35] hover:brightness-110 shadow-[0_0_25px_rgba(255,122,26,0.45)] hover:shadow-[0_0_35px_rgba(255,122,26,0.65)] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <div className="w-6 h-6 rounded-full bg-white text-[#FF7A1A] flex items-center justify-center shadow-sm">
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  </>
                )}
              </button>
            </form>

            {/* Divider: or */}
            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-white/15 w-full" />
              <span className="bg-[#0c162c] px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 absolute">
                or
              </span>
            </div>

            {/* Social Logins: 2 Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={submitting}
                className="group relative overflow-hidden py-3 px-3 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/15 hover:border-blue-400/60 text-xs font-bold text-white flex items-center justify-center gap-2.5 transition-all shadow-sm hover:shadow-[0_0_22px_rgba(66,133,244,0.35)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span className="truncate">Continue with Google</span>
              </button>

              {/* GitHub */}
              <button
                type="button"
                onClick={handleGithubAuth}
                disabled={submitting}
                className="group relative overflow-hidden py-3 px-3 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/15 hover:border-slate-300/60 text-xs font-bold text-white flex items-center justify-center gap-2.5 transition-all shadow-sm hover:shadow-[0_0_22px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="w-4 h-4 fill-white shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span className="truncate">Continue with GitHub</span>
              </button>
            </div>

            {/* Bottom Register Redirect */}
            <p className="text-center text-xs text-slate-300 pt-2">
              New to GearUp?{' '}
              <NextLink href="/register" className="font-extrabold text-[#FF8A35] hover:underline">
                Create an account
              </NextLink>
            </p>

          </div>
        </motion.div>

      </main>

      {/* 4. BOTTOM FLOATING CHAT BUTTON */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => toast('Live dispatch support is ready. Contact dispatch@gearupequipment.com', { icon: '💬' })}
          className="w-13 h-13 p-3.5 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
          title="Customer Dispatch Chat"
        >
          <MessageCircle className="w-6 h-6 fill-white" />
        </button>
      </div>

      {/* 5. INTERACTIVE RESPONSIVE VIDEO LIGHTBOX MODAL */}
      <AnimatePresence>
        {videoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-black border border-white/20 shadow-2xl"
            >
              <div className="flex items-center justify-between p-3.5 sm:p-4 bg-[#0a1222] border-b border-white/10">
                <span className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#FF7A1A] text-[#FF7A1A]" />
                  RentMach Equipment Showcase
                </span>
                <button
                  onClick={() => setVideoModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-white/70 hover:text-white"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="aspect-video w-full bg-black flex items-center justify-center">
                <video
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                  src="/videos/login-bg.mp4"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. GOOGLE ACCOUNT CHOOSER MODAL (Customized strictly to equipment-rental-client-three.vercel.app) */}
      <GoogleAccountChooserModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onSelectAccount={handleGoogleAccountSelect}
      />

    </div>
  );
}

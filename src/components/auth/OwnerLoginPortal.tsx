'use client';

import React, { useState } from 'react';
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
  Truck
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

// Showcase machines from the real active fleet (matching image right column)
const SHOWCASE_MACHINES = [
  {
    title: '25 ton mobile crane',
    bnTitle: '২৫ টন মোবাইল ক্রেন',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=600&q=80',
    link: '/equipment/6afff0e18ab535911d632a2c'
  },
  {
    title: '22 meter Boom Lift',
    bnTitle: '২২ মিটার বুম লিফট',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
    link: '/equipment/6affc217a3282c28aad9361b'
  },
  {
    title: '10 ton forklift',
    bnTitle: '১০ টন ফর্কলিফট',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
    link: '/equipment/6afff0e18ab535911d632a2e'
  },
  {
    title: 'ZT-50 HDD Rig - Horizontal Directional Drilling',
    bnTitle: 'হরাইজন্টাল ডিরেকশনাল ড্রিলিং রিগ',
    image: 'https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=600&q=80',
    link: '/equipment/6affc217a3282c28aad93613'
  },
  {
    title: 'Manlift 20 Meter',
    bnTitle: 'ম্যানলিফট ২০ মিটার',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
    link: '/equipment/6afff0e18ab535911d632a33'
  },
  {
    title: '40 meter Boom Lift',
    bnTitle: '৪০ মিটার বুম লিফট',
    image: 'https://images.unsplash.com/photo-1579487785973-74d2ca7abdd5?auto=format&fit=crop&w=400&q=80',
    link: '/equipment/6affc217a3282c28aad93619'
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
      toast.error('Unable to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Auto-Fill for Owner
  const handleQuickDemo = () => {
    setEmail('owner@rentalequip.com');
    setPassword('OwnerPassword123!');
    toast.success('Owner credentials auto-filled! Click "SIGN IN" to continue.');
  };

  // Handle Forgot Password
  const handleForgotPassword = () => {
    Swal.fire({
      title: 'Reset Password · পাসওয়ার্ড রিসেট',
      text: 'Enter your registered owner email address to receive password recovery instructions.',
      input: 'email',
      inputValue: email || 'owner@rentalequip.com',
      inputPlaceholder: 'owner@rentalequip.com',
      showCancelButton: true,
      confirmButtonText: 'Send Reset Link',
      confirmButtonColor: '#E65100',
      cancelButtonColor: '#6B7280',
      customClass: { popup: 'rounded-3xl' }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Reset Link Dispatched!',
          text: `A temporary password recovery link has been sent to ${result.value}. Check your inbox or WhatsApp.`,
          confirmButtonColor: '#E65100',
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
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-[#E65100] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace · হোমপেজে ফিরে যান</span>
        </NextLink>

        <span className="text-[11px] font-black uppercase tracking-wider text-[#E65100] bg-[#E65100]/10 px-3 py-1 rounded-full border border-[#E65100]/20">
          Owner & Vendor Portal · ভেন্ডর পোর্টাল
        </span>
      </div>

      {/* Main 2-Column Grid (Image Reference Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* =========================================================================
            LEFT COLUMN (7 cols): VALUE PROPOSITION & ONBOARDING ROADMAP
        ========================================================================= */}
        <div className="lg:col-span-6 xl:col-span-7 p-6 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-neutral-200 dark:border-neutral-800 bg-[#FCFBF8] dark:bg-[#0a1122] space-y-7">
          
          {/* Tag & Main Heading */}
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#C2410C] block">
              GEARUP VENDOR NETWORK · ভেন্ডর নেটওয়ার্ক
            </span>
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black text-[#8C2D0B] dark:text-[#FB923C] tracking-tight leading-tight uppercase font-serif">
              KEEP YOUR MACHINES WORKING
            </h1>
          </div>

          {/* Bilingual Intro Text */}
          <div className="space-y-2 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <p className="font-bold text-neutral-900 dark:text-neutral-100">
              আপনার যন্ত্র অলস বসে থাকলে প্রতিদিনই আয় হারাচ্ছেন। গিয়ারআপ-এর সাথে যুক্ত হন — কাজ আমরা আনব, আপনার যন্ত্র ব্যস্ত থাকবে।
            </p>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs">
              An idle machine is income lost every day. Join GearUp — we bring the work, your equipment stays busy.
            </p>
          </div>

          {/* 5 Benefits with Orange Checked Circles */}
          <div className="space-y-5 pt-1">
            
            {/* Benefit 1 */}
            <div className="flex items-start space-x-3.5">
              <div className="w-5 h-5 rounded-full bg-[#EA580C] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="space-y-0.5 text-xs">
                <p className="font-bold text-neutral-900 dark:text-neutral-100">
                  More rental work · বেশি ভাড়ার কাজ
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Your equipment reaches construction, factory and project clients across Bangladesh through GearUp. · গিয়ারআপ-এর মাধ্যমে সারা দেশের নির্মাণ, কারখানা ও প্রজেক্টের ক্লায়েন্টের কাছে আপনার যন্ত্র পৌঁছাবে।
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex items-start space-x-3.5">
              <div className="w-5 h-5 rounded-full bg-[#EA580C] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="space-y-0.5 text-xs">
                <p className="font-bold text-neutral-900 dark:text-neutral-100">
                  Your whole fleet, organized · আপনার সব যন্ত্র এক জায়গায় গোছানো
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Every machine with photos, capacity, price and status in one neat list — open it from your phone any time. · প্রতিটি যন্ত্রের ছবি, ক্যাপাসিটি, দাম ও অবস্থা এক তালিকায় — মোবাইল থেকে যখন খুশি দেখুন।
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex items-start space-x-3.5">
              <div className="w-5 h-5 rounded-full bg-[#EA580C] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="space-y-0.5 text-xs">
                <p className="font-bold text-neutral-900 dark:text-neutral-100">
                  Grow with GearUp · গিয়ারআপ-এর সাথে ব্যবসা বাড়ান
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Every job done well builds your name with new clients — more trust, more repeat work. · প্রতিটি ভালো কাজে নতুন ক্লায়েন্টের কাছে আপনার পরিচিতি বাড়ে — আস্থা বাড়ে, বারবার কাজ আসে।
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex items-start space-x-3.5">
              <div className="w-5 h-5 rounded-full bg-[#EA580C] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="space-y-0.5 text-xs">
                <p className="font-bold text-neutral-900 dark:text-neutral-100">
                  You stay in control · নিয়ন্ত্রণ আপনার হাতে
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Add photos and your price, mark a machine "available" or "on rent" any time. · ছবি ও দাম দিন, যন্ত্র ফাঁকা নাকি ভাড়ায় — যখন খুশি বদলান।
                </p>
              </div>
            </div>

            {/* Benefit 5 */}
            <div className="flex items-start space-x-3.5">
              <div className="w-5 h-5 rounded-full bg-[#EA580C] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="space-y-0.5 text-xs">
                <p className="font-bold text-neutral-900 dark:text-neutral-100">
                  Certificates in one place · সার্টিফিকেট এক জায়গায়
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Keep inspection and load test certificates with each machine — ready when a client asks. · ইন্সপেকশন ও লোড টেস্ট সার্টিফিকেট যন্ত্রের সাথে রাখুন।
                </p>
              </div>
            </div>

          </div>

          {/* 4-Step Process Box (Matching Image 4-column card) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0e1628] border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              
              {/* Step 1 */}
              <div className="p-2 sm:p-3 border-r border-neutral-100 dark:border-neutral-800/80 last:border-r-0 space-y-1">
                <div className="w-6 h-6 rounded-full bg-[#EA580C] text-white text-[11px] font-black flex items-center justify-center mx-auto mb-1.5">
                  1
                </div>
                <p className="text-[11px] font-black text-neutral-800 dark:text-neutral-200">
                  Create an account
                </p>
                <p className="text-[10px] text-neutral-500">
                  অ্যাকাউন্ট খুলুন
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-2 sm:p-3 border-r border-neutral-100 dark:border-neutral-800/80 last:border-r-0 space-y-1">
                <div className="w-6 h-6 rounded-full bg-[#EA580C] text-white text-[11px] font-black flex items-center justify-center mx-auto mb-1.5">
                  2
                </div>
                <p className="text-[11px] font-black text-neutral-800 dark:text-neutral-200">
                  Add your equipment
                </p>
                <p className="text-[10px] text-neutral-500">
                  যন্ত্র যোগ করুন
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-2 sm:p-3 border-r border-neutral-100 dark:border-neutral-800/80 last:border-r-0 space-y-1">
                <div className="w-6 h-6 rounded-full bg-[#EA580C] text-white text-[11px] font-black flex items-center justify-center mx-auto mb-1.5">
                  3
                </div>
                <p className="text-[11px] font-black text-neutral-800 dark:text-neutral-200">
                  We check & list it
                </p>
                <p className="text-[10px] text-neutral-500">
                  যাচাই করে তালিকায় তুলি
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-2 sm:p-3 space-y-1">
                <div className="w-6 h-6 rounded-full bg-[#EA580C] text-white text-[11px] font-black flex items-center justify-center mx-auto mb-1.5">
                  4
                </div>
                <p className="text-[11px] font-black text-neutral-800 dark:text-neutral-200">
                  Get rental work
                </p>
                <p className="text-[10px] text-neutral-500">
                  কাজ পান
                </p>
              </div>

            </div>
          </div>

          {/* Footer Helpline text */}
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            It takes about 5 minutes. Questions? Call / WhatsApp{' '}
            <a href="https://wa.me/8801309002853" target="_blank" rel="noreferrer" className="text-[#EA580C] font-black underline">
              01309-002853
            </a>
            {' '}· মাত্র ৫ মিনিট লাগে। প্রশ্ন থাকলে কল বা হোয়াটসঅ্যাপ করুন।
          </p>

        </div>

        {/* =========================================================================
            RIGHT COLUMN (5 cols): SIGN IN FORM, CONCIERGE & SHOWCASE
        ========================================================================= */}
        <div className="lg:col-span-6 xl:col-span-5 p-6 sm:p-10 lg:p-12 bg-white dark:bg-[#0c1427] space-y-7">
          
          {/* Top Tabs: SIGN IN vs CREATE ACCOUNT */}
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            
            {/* Active SIGN IN Tab */}
            <div className="relative pb-3 -mb-3 border-b-2 border-[#EA580C]">
              <span className="text-xs sm:text-sm font-black text-[#EA580C] uppercase tracking-wide cursor-default">
                SIGN IN · সাইন ইন
              </span>
            </div>

            {/* Inactive CREATE ACCOUNT Tab (Takes to Register Page) */}
            <NextLink
              href="/register?role=Owner"
              className="text-xs sm:text-sm font-bold text-neutral-500 dark:text-neutral-400 hover:text-[#EA580C] uppercase tracking-wide transition-colors"
            >
              CREATE ACCOUNT · নতুন অ্যাকাউন্ট
            </NextLink>

          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="font-bold text-neutral-700 dark:text-neutral-300 block">
                E-mail · ইমেইল
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. owner@rentalequip.com"
                className="w-full p-3 rounded-xl bg-white dark:bg-[#0e1628] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
              />
            </div>

            {/* Password Field with Eye Toggle */}
            <div className="space-y-1.5">
              <label className="font-bold text-neutral-700 dark:text-neutral-300 block">
                Password · পাসওয়ার্ড
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 pr-10 rounded-xl bg-white dark:bg-[#0e1628] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#EA580C] hover:bg-[#D94E07] text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>SIGN IN · সাইন ইন</span>
              )}
            </button>

            {/* Forgot Password Link & Demo Credentials Trigger */}
            <div className="flex items-center justify-between pt-1 text-[11px]">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[#EA580C] hover:underline font-bold"
              >
                Forgot password? · পাসওয়ার্ড ভুলে গেছেন?
              </button>

              <button
                type="button"
                onClick={handleQuickDemo}
                className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 underline"
              >
                ⚡ Auto-fill Owner Demo
              </button>
            </div>

          </form>

          {/* Green WhatsApp Concierge Box (Image Reference Style) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#E8F5E9] dark:bg-[#064E3B]/20 border border-[#81C784]/60 dark:border-emerald-600/40 text-xs text-neutral-800 dark:text-neutral-200 space-y-2.5">
            <h4 className="font-black text-[#1B5E20] dark:text-emerald-400 text-xs sm:text-sm">
              Busy on site? We'll list it for you · ব্যস্ত? আমরাই তুলে দেব
            </h4>
            <p className="text-[11px] text-[#2E7D32] dark:text-emerald-300 leading-relaxed">
              Send photos and details of your machine on WhatsApp — our team adds it to your account. · যন্ত্রের ছবি ও তথ্য হোয়াটসঅ্যাপে পাঠান, আমাদের টিম আপনার হয়ে যোগ করে দেবে।
            </p>
            <div>
              <a
                href="https://wa.me/8801309002853?text=Hello%20GearUp%20Team,%20I%20want%20to%20list%20my%20equipment"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-black text-[11px] shadow-sm transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp 01309-002853</span>
              </a>
            </div>
          </div>

          {/* Machinery Showcase Section (Image Reference Style) */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200">
              Machines already on gearup.com · ওয়েবসাইটে যে যন্ত্রপাতি আছে
            </h4>

            {/* 6 Grid Thumbnails */}
            <div className="grid grid-cols-3 gap-2">
              {SHOWCASE_MACHINES.slice(0, 6).map((item, idx) => (
                <NextLink
                  key={idx}
                  href={item.link}
                  className="group block rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 transition-all hover:border-[#EA580C]"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="p-1.5 text-[9px] font-bold text-neutral-700 dark:text-neutral-300 truncate">
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
                <span>See all equipment · সব যন্ত্র দেখুন</span>
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

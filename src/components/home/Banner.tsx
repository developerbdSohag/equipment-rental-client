'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

export const Banner: React.FC = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (name.trim()) params.append('search', name.trim());
    if (category && category !== 'All') params.append('category', category);
    if (location.trim()) params.append('search', location.trim());
    router.push(`/equipment?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-24 lg:pt-16 lg:pb-32">
      
      {/* Background Soft Glows & Ambient Gradient */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-electric-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Text */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-surface border border-electric-500/30 text-electric-500 text-xs font-black uppercase tracking-widest shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>Next-Generation Heavy Equipment Marketplace</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-7xl font-black text-navy-900 dark:text-white tracking-tight leading-[1.15]"
          >
            Rent Smarter.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-500 via-blue-600 to-orange-500">
              Build Bigger.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-lg text-base-content/75 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Find the right equipment, at the right price, exactly when you need it.
            Direct from verified contractors, industrial owners, and equipment dealers nationwide.
          </motion.p>
        </div>

        {/* Interactive Multi-Parameter Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 max-w-5xl mx-auto"
        >
          <form
            onSubmit={handleSearch}
            className="glass-card p-4 sm:p-5 rounded-3xl border border-white/60 shadow-glass-lg backdrop-blur-xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
              
              {/* 1. Equipment Name / Keyword */}
              <div className="p-2.5 rounded-2xl bg-base-100/90 border border-base-300/80 focus-within:border-electric-500 focus-within:ring-2 focus-within:ring-electric-500/20 transition-all">
                <label className="text-[10px] font-black uppercase text-base-content/50 block tracking-wider">
                  Equipment
                </label>
                <div className="flex items-center space-x-2 mt-0.5">
                  <Search className="w-4 h-4 text-electric-500 shrink-0" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Excavator, Crane..."
                    className="w-full bg-transparent text-xs font-bold text-base-content placeholder-base-content/40 focus:outline-none"
                  />
                </div>
              </div>

              {/* 2. Category Dropdown */}
              <div className="p-2.5 rounded-2xl bg-base-100/90 border border-base-300/80 focus-within:border-electric-500 focus-within:ring-2 focus-within:ring-electric-500/20 transition-all">
                <label className="text-[10px] font-black uppercase text-base-content/50 block tracking-wider">
                  Category
                </label>
                <div className="flex items-center space-x-2 mt-0.5">
                  <Layers className="w-4 h-4 text-orange-500 shrink-0" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-base-content focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    <option value="Excavators">Excavators</option>
                    <option value="Cranes">Cranes</option>
                    <option value="Generators">Generators</option>
                    <option value="Forklifts">Forklifts</option>
                    <option value="Bulldozers">Bulldozers</option>
                    <option value="Loaders">Loaders</option>
                    <option value="Concrete Mixers">Concrete Mixers</option>
                    <option value="Trucks">Trucks</option>
                    <option value="Lifting Equipment">Lifting Equipment</option>
                    <option value="Other Machinery">Other Machinery</option>
                  </select>
                </div>
              </div>

              {/* 3. Location */}
              <div className="p-2.5 rounded-2xl bg-base-100/90 border border-base-300/80 focus-within:border-electric-500 focus-within:ring-2 focus-within:ring-electric-500/20 transition-all">
                <label className="text-[10px] font-black uppercase text-base-content/50 block tracking-wider">
                  Location
                </label>
                <div className="flex items-center space-x-2 mt-0.5">
                  <MapPin className="w-4 h-4 text-electric-500 shrink-0" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Dhaka, Chattogram, Gazipur..."
                    className="w-full bg-transparent text-xs font-bold text-base-content placeholder-base-content/40 focus:outline-none"
                  />
                </div>
              </div>

              {/* 4. Rental Start Date */}
              <div className="p-2.5 rounded-2xl bg-base-100/90 border border-base-300/80 focus-within:border-electric-500 focus-within:ring-2 focus-within:ring-electric-500/20 transition-all">
                <label className="text-[10px] font-black uppercase text-base-content/50 block tracking-wider">
                  Start Date
                </label>
                <div className="flex items-center space-x-2 mt-0.5">
                  <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
                  <input
                    type="date"
                    value={startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-base-content focus:outline-none"
                  />
                </div>
              </div>

              {/* 5. Animated Search Button */}
              <div className="w-full lg:w-auto">
                <button
                  type="submit"
                  className="w-full btn-premium-orange py-4 px-6 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Gear</span>
                </button>
              </div>

            </div>
          </form>
        </motion.div>

        {/* Hero Machinery Showcase & Floating Glass Cards */}
        <div className="mt-10 sm:mt-14 relative max-w-5xl mx-auto">
          
          {/* Main Hero Machinery Image Card */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white/60 dark:border-white/10 bg-navy-950 min-h-[380px] sm:min-h-[420px] lg:min-h-[460px] flex flex-col justify-end p-5 sm:p-8">
            <img
              src="https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=1600&q=80"
              alt="CAT 320 Next Gen Hydraulic Excavator"
              className="absolute inset-0 w-full h-full object-cover object-center"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80';
              }}
            />
            {/* Multi-stop contrast gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-navy-950/25 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between text-white gap-4 sm:gap-6">
              <div className="space-y-1.5 sm:space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-electric-300">
                  Featured Fleet
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">
                  CAT 320 Next Gen Hydraulic Excavator
                </h3>
                <p className="text-xs sm:text-sm text-white/80 max-w-lg leading-relaxed">
                  Available for immediate jobsite dispatch with Grade Assist and 1.2 cu yd bucket.
                </p>
              </div>

              <div className="pt-3 sm:pt-0 border-t border-white/15 sm:border-none flex items-center justify-between sm:justify-end gap-4 shrink-0">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-white/70 block uppercase font-bold tracking-wider">Daily Rate</span>
                  <span className="text-xl sm:text-2xl font-black text-white whitespace-nowrap">
                    ৳35,000<span className="text-xs font-medium text-white/70">/day</span>
                  </span>
                </div>
                <button
                  onClick={() => router.push('/equipment')}
                  className="btn-premium-primary px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap shadow-lg"
                >
                  <span>Rent Now</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Floating Glassmorphism Card 1: Available Equipment */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-6 -left-6 sm:top-8 sm:-left-8 glass-card p-4 rounded-3xl border border-white/80 dark:border-white/10 shadow-glass-lg hidden md:flex items-center space-x-3.5 z-20"
          >
            <div className="w-12 h-12 rounded-2xl bg-electric-500/15 text-electric-500 flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-lg font-black text-navy-900 dark:text-white">1,450+ Units</p>
              <p className="text-[11px] font-semibold text-base-content/70">Available for Rent</p>
            </div>
          </motion.div>

          {/* Floating Glassmorphism Card 2: Verified Rental Providers */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 -right-6 sm:-right-8 glass-card p-4 rounded-3xl border border-white/80 dark:border-white/10 shadow-glass-lg hidden md:flex items-center space-x-3.5 z-20"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-500/15 text-orange-500 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-lg font-black text-navy-900 dark:text-white">380+ Verified</p>
              <p className="text-[11px] font-semibold text-base-content/70">Inspected Equipment Owners</p>
            </div>
          </motion.div>

          {/* Floating Glassmorphism Card 3: Successful Bookings */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-6 left-12 glass-card p-4 rounded-3xl border border-white/80 dark:border-white/10 shadow-glass-lg hidden md:flex items-center space-x-3.5 z-20"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-lg font-black text-navy-900 dark:text-white">12,800+</p>
              <p className="text-[11px] font-semibold text-base-content/70">Successful Bookings</p>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default Banner;

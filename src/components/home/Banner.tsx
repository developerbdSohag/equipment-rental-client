'use client';

import React from 'react';
import NextLink from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Sparkles, ArrowRight, CheckCircle, Search } from 'lucide-react';

export const Banner: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-base-100 to-base-100 py-16 lg:py-24 border-b border-base-200">
      
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Next-Gen Equipment Marketplace</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-base-content tracking-tight leading-[1.15]">
              Rent Top Equipment.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-500 to-teal-400">
                Anytime. Anywhere.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-base-content/75 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Connect with verified equipment owners across construction, cinema, commercial transport, and agriculture. Secure booking with instant Stripe checkout and verified owner protection.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <NextLink
                href="/equipment"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl text-base font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Search className="w-5 h-5 mr-2" />
                <span>Explore All Equipment</span>
              </NextLink>

              <NextLink
                href="/dashboard/owner"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl text-base font-bold text-base-content bg-base-200 hover:bg-base-300 border border-base-300 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>List Your Gear</span>
                <ArrowRight className="w-5 h-5 ml-2 text-primary" />
              </NextLink>
            </div>

            {/* Trust points */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-base-200 text-left">
              <div>
                <p className="text-2xl font-black text-base-content">1,200+</p>
                <p className="text-xs text-base-content/60 font-medium">Verified Equipment</p>
              </div>
              <div>
                <p className="text-2xl font-black text-primary">99.8%</p>
                <p className="text-xs text-base-content/60 font-medium">Rental Satisfaction</p>
              </div>
              <div>
                <p className="text-2xl font-black text-secondary">100%</p>
                <p className="text-xs text-base-content/60 font-medium">Stripe Protected</p>
              </div>
            </div>

          </motion.div>

          {/* Right Column: High-Res Interactive Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Glow Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-base-100 bg-base-200 aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
                  alt="Industrial Excavator Equipment"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20">
                  <p className="text-sm font-bold flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    Verified Inspection Guaranteed
                  </p>
                  <p className="text-xs text-white/80">Every piece inspected before handover</p>
                </div>
              </div>

              {/* Floating verified badge card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -top-6 -left-6 bg-base-100 rounded-2xl p-4 shadow-xl border border-base-300 hidden sm:flex items-center space-x-3 z-10"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-base-content">Instant Booking</p>
                  <p className="text-[11px] text-base-content/60">Zero paper hassle</p>
                </div>
              </motion.div>

              {/* Floating stats card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -bottom-6 -right-6 bg-base-100 rounded-2xl p-4 shadow-xl border border-base-300 hidden sm:flex items-center space-x-3 z-10"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-base-content">Commercial Grade</p>
                  <p className="text-[11px] text-base-content/60">Ready to work</p>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Banner;

'use client';

import React from 'react';
import NextLink from 'next/link';
import { motion } from 'framer-motion';
import { PlusCircle, ShieldCheck, DollarSign, ArrowRight, Star, Sparkles } from 'lucide-react';

export const OwnerCTA: React.FC = () => {
  return (
    <section className="py-24 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white p-8 sm:p-12 lg:p-16 shadow-glass-lg border border-white/20"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-electric-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-electric-300 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>Equipment Owners Network</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Turn Idle Machinery Into Predictable Monthly Revenue
              </h2>

              <p className="text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed font-medium">
                Join 380+ verified equipment owners across the country. List your machinery, set your terms and rental prices, and receive guaranteed payouts directly via Stripe Escrow.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-white/90">
                <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1.5 text-electric-400" /> Equipment Insurance Included</span>
                <span className="flex items-center"><DollarSign className="w-4 h-4 mr-1.5 text-orange-400" /> Guaranteed Fast Stripe Payouts</span>
                <span className="flex items-center"><PlusCircle className="w-4 h-4 mr-1.5 text-emerald-400" /> Free Listing & Easy Management</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 justify-center lg:items-end">
              <NextLink
                href="/dashboard/owner"
                className="btn-premium-orange px-8 py-4 text-xs tracking-wider font-black text-center uppercase"
              >
                <span>List Your Equipment</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </NextLink>

              <NextLink
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl text-xs font-bold text-white border border-white/20 hover:bg-white/10 transition-all text-center"
              >
                Learn How Owners Earn
              </NextLink>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OwnerCTA;

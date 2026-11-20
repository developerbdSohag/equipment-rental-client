'use client';

import React from 'react';
import NextLink from 'next/link';
import { motion } from 'framer-motion';
import { PlusCircle, ShieldCheck, DollarSign, ArrowRight, Star } from 'lucide-react';

export const OwnerCTA: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-tr from-base-200 via-base-100 to-primary/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-neutral to-neutral/95 text-neutral-content p-8 sm:p-12 lg:p-16 shadow-2xl border border-neutral/50"
        >
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary-content text-xs font-bold uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Equipment Owners Network</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Turn Your Idle Equipment Into Monthly Revenue
              </h2>

              <p className="text-sm sm:text-base text-neutral-content/80 max-w-2xl leading-relaxed">
                Join hundreds of vetted equipment owners across the country. List your machinery, set your terms and rental prices, and receive guaranteed payouts directly to your account.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-neutral-content/90">
                <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1.5 text-primary" /> Comprehensive Insurance Included</span>
                <span className="flex items-center"><DollarSign className="w-4 h-4 mr-1.5 text-primary" /> Guaranteed Fast Stripe Payouts</span>
                <span className="flex items-center"><PlusCircle className="w-4 h-4 mr-1.5 text-primary" /> Free Listing & Easy Dashboard</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 justify-center lg:items-end">
              <NextLink
                href="/dashboard/owner"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl text-sm font-bold text-neutral bg-white hover:bg-white/90 shadow-xl hover:scale-105 active:scale-95 transition-all text-center"
              >
                <span>Become an Equipment Owner</span>
                <ArrowRight className="w-4 h-4 ml-2 text-primary" />
              </NextLink>

              <NextLink
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl text-sm font-bold text-white border border-white/20 hover:bg-white/10 transition-all text-center"
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

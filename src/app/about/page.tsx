'use client';

import React from 'react';
import NextLink from 'next/link';
import { Truck, ShieldCheck, DollarSign, Award, Users, CheckCircle, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-base-100 py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">About Our Platform</span>
          <h1 className="text-4xl sm:text-5xl font-black text-base-content tracking-tight">
            Democratizing Heavy Equipment & Production Gear
          </h1>
          <p className="text-base text-base-content/75 leading-relaxed">
            GearUp was established to eliminate the enormous capital barrier of purchasing commercial machinery. We connect contractors, farmers, and film creators directly with vetted owners.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-base-200/50 border border-base-300 text-center">
            <p className="text-4xl font-black text-primary">1,200+</p>
            <p className="text-xs text-base-content/70 font-semibold mt-1">Listed Machinery</p>
          </div>
          <div className="p-6 rounded-3xl bg-base-200/50 border border-base-300 text-center">
            <p className="text-4xl font-black text-secondary">98.5%</p>
            <p className="text-xs text-base-content/70 font-semibold mt-1">On-Time Dispatches</p>
          </div>
          <div className="p-6 rounded-3xl bg-base-200/50 border border-base-300 text-center">
            <p className="text-4xl font-black text-accent">৳45 Cr+</p>
            <p className="text-xs text-base-content/70 font-semibold mt-1">Owner Earnings</p>
          </div>
          <div className="p-6 rounded-3xl bg-base-200/50 border border-base-300 text-center">
            <p className="text-4xl font-black text-emerald-500">64 Dist.</p>
            <p className="text-xs text-base-content/70 font-semibold mt-1">All Bangladesh Coverage</p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl border border-base-300 bg-base-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-base-content">Vetted Inspection Quality</h3>
            <p className="text-xs text-base-content/70 leading-relaxed">
              Every listing on GearUp is subjected to comprehensive visual and mechanical review, ensuring zero equipment surprises when deployed on your job site.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-base-300 bg-base-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-base-content">Stripe Protected Escrow</h3>
            <p className="text-xs text-base-content/70 leading-relaxed">
              We leverage secure Stripe checkout sessions. Funds are held in escrow and released smoothly upon verified equipment delivery and return.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-base-300 bg-base-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-base-content">Peer-to-Peer Community</h3>
            <p className="text-xs text-base-content/70 leading-relaxed">
              We empower local machinery owners to monetize their equipment downtime while providing small businesses with affordable access to top-tier brands.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-base-200/60 p-10 rounded-3xl border border-base-300 space-y-4">
          <h2 className="text-2xl font-bold text-base-content">Ready to upgrade your equipment fleet?</h2>
          <div className="flex justify-center gap-3">
            <NextLink href="/equipment" className="px-6 py-3 rounded-2xl bg-primary text-white text-xs font-bold">
              Browse All Equipment
            </NextLink>
            <NextLink href="/contact" className="px-6 py-3 rounded-2xl border border-base-300 text-xs font-bold">
              Contact Our Team
            </NextLink>
          </div>
        </div>

      </div>
    </div>
  );
}

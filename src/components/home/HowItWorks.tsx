'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, CalendarCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: Search,
    title: 'Discover & Compare',
    description: 'Search hundreds of certified equipment listings across 10 categories with transparent pricing and specs.',
    color: 'text-electric-500 bg-electric-500/10'
  },
  {
    step: '02',
    icon: CalendarCheck,
    title: 'Book & Pay Securely',
    description: 'Select your rental duration, confirm equipment availability, and pay with 100% Stripe escrow checkout.',
    color: 'text-orange-500 bg-orange-500/10'
  },
  {
    step: '03',
    icon: Truck,
    title: 'Dispatch & Work',
    description: 'Pick up on-site or get rapid direct job-site delivery with verified inspection logs and equipment checklist.',
    color: 'text-emerald-500 bg-emerald-500/10'
  },
  {
    step: '04',
    icon: RotateCcw,
    title: 'Return & Review',
    description: 'Hand over upon completion, release deposit funds, and submit verified feedback for your equipment owner.',
    color: 'text-purple-500 bg-purple-500/10'
  }
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-base-100/60 border-t border-base-300/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-electric-500">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Frictionless Rental Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
            How Renting Works on GearUp
          </h2>
          <p className="text-sm text-base-content/70">
            From initial search to on-site delivery, renting commercial equipment has never been more transparent.
          </p>
        </div>

        {/* 4 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, index) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card relative flex flex-col p-7 rounded-3xl border border-white/60 shadow-soft hover:shadow-glass-lg hover:border-electric-500/40 transition-all hover:-translate-y-1.5"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-navy-900/15">
                    {s.step}
                  </span>
                </div>

                <h3 className="text-base font-black text-navy-900 mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-base-content/70 leading-relaxed font-medium">
                  {s.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;

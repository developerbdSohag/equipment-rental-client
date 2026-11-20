'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, CalendarCheck, Truck, RotateCcw } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: Search,
    title: 'Discover & Compare',
    description: 'Search hundreds of certified equipment listings with transparent pricing and specs.',
    color: 'border-primary text-primary'
  },
  {
    step: '02',
    icon: CalendarCheck,
    title: 'Book & Pay Securely',
    description: 'Select your rental duration, confirm equipment availability, and pay with Stripe card checkout.',
    color: 'border-secondary text-secondary'
  },
  {
    step: '03',
    icon: Truck,
    title: 'Dispatch & Work',
    description: 'Pick up on-site or get rapid direct job-site delivery with verified inspection logs.',
    color: 'border-accent text-accent'
  },
  {
    step: '04',
    icon: RotateCcw,
    title: 'Return & Review',
    description: 'Hand over upon completion, release deposit funds, and rate your equipment owner.',
    color: 'border-emerald-500 text-emerald-500'
  }
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-base-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight">
            How Renting Works
          </h2>
          <p className="text-sm sm:text-base text-base-content/70">
            From initial search to on-site delivery, renting commercial equipment has never been more frictionless.
          </p>
        </div>

        {/* 4 Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, index) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="relative flex flex-col p-6 rounded-3xl border border-base-300 bg-base-100 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-2xl font-black text-base-content/20">
                    {s.step}
                  </span>
                </div>

                <h3 className="text-base font-bold text-base-content mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-base-content/70 leading-relaxed">
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

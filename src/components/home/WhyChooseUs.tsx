'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShieldCheck, CalendarRange, CreditCard, Clock, Award } from 'lucide-react';

const benefits = [
  {
    icon: DollarSign,
    title: 'Affordable Rental Prices',
    description: 'Save up to 60% compared to purchasing capital machinery. Direct peer-to-peer pricing with zero hidden surcharges.',
    badge: 'Cost Savings',
    color: 'text-emerald-500 bg-emerald-500/10'
  },
  {
    icon: ShieldCheck,
    title: 'Verified Equipment Owners',
    description: 'Every equipment owner undergoes business identity checks, maintenance validation, and operating permit verification.',
    badge: '100% Inspected',
    color: 'text-blue-500 bg-blue-500/10'
  },
  {
    icon: CalendarRange,
    title: 'Flexible Rental Periods',
    description: 'Rent on your terms: daily, weekly, or monthly schedules. Extend or return early with responsive owner coordination.',
    badge: 'Total Flexibility',
    color: 'text-amber-500 bg-amber-500/10'
  },
  {
    icon: CreditCard,
    title: 'Secure Online Payments',
    description: 'Bank-grade Stripe processing holds escrow until equipment handover, keeping both renters and owners protected.',
    badge: 'Stripe Escrow',
    color: 'text-purple-500 bg-purple-500/10'
  }
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-20 bg-base-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            The GearUp Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight">
            Why Professionals Choose Our Platform
          </h2>
          <p className="text-sm sm:text-base text-base-content/70">
            Engineered specifically to reduce downtime, lower equipment overhead, and deliver enterprise-grade trust to every rental transaction.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, index) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col p-6 rounded-3xl border border-base-300 bg-base-100 hover:border-primary/40 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${b.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-base-200 text-base-content/70">
                    {b.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-base-content group-hover:text-primary transition-colors">
                  {b.title}
                </h3>
                <p className="text-xs text-base-content/70 mt-2 leading-relaxed">
                  {b.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;

'use client';

import React from 'react';
import NextLink from 'next/link';
import { motion } from 'framer-motion';
import {
  Hammer,
  Camera,
  Truck,
  Tractor,
  Cpu,
  Speaker,
  ArrowRight
} from 'lucide-react';

const categories = [
  {
    id: 'construction',
    name: 'Construction Equipment',
    query: 'Construction',
    icon: Hammer,
    description: 'Excavators, loaders, boom lifts, and heavy compaction machinery.',
    color: 'from-amber-500/20 to-orange-500/10',
    iconColor: 'text-amber-500',
    count: '240+ Units'
  },
  {
    id: 'photography',
    name: 'Photography Equipment',
    query: 'Photography',
    icon: Camera,
    description: 'Cinema cameras, prime lenses, drone kits, and studio lighting.',
    color: 'from-blue-500/20 to-indigo-500/10',
    iconColor: 'text-blue-500',
    count: '310+ Units'
  },
  {
    id: 'vehicles',
    name: 'Vehicles & Transportation',
    query: 'Vehicles',
    icon: Truck,
    description: 'Flatbed trucks, heavy equipment trailers, and cargo vans.',
    color: 'from-emerald-500/20 to-teal-500/10',
    iconColor: 'text-emerald-500',
    count: '150+ Units'
  },
  {
    id: 'agriculture',
    name: 'Agriculture Equipment',
    query: 'Agriculture',
    icon: Tractor,
    description: 'Utility tractors, balers, seeders, and harvesting implements.',
    color: 'from-green-500/20 to-lime-500/10',
    iconColor: 'text-green-500',
    count: '95+ Units'
  },
  {
    id: 'electronics',
    name: 'Electronics & Sensors',
    query: 'Electronics',
    icon: Cpu,
    description: 'Thermal cameras, RTK enterprise drones, and calibration kits.',
    color: 'from-purple-500/20 to-pink-500/10',
    iconColor: 'text-purple-500',
    count: '180+ Units'
  },
  {
    id: 'event',
    name: 'Event Equipment',
    query: 'Event',
    icon: Speaker,
    description: 'Concert line arrays, moving head stage beams, and power generators.',
    color: 'from-rose-500/20 to-red-500/10',
    iconColor: 'text-rose-500',
    count: '120+ Units'
  }
];

export const CategoriesSection: React.FC = () => {
  return (
    <section className="py-20 bg-base-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Industry Domains
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight">
              Popular Equipment Categories
            </h2>
            <p className="text-sm sm:text-base text-base-content/70 max-w-xl">
              Browse thousands of certified machinery and production gear curated for high-stakes projects.
            </p>
          </div>

          <NextLink
            href="/equipment"
            className="mt-4 md:mt-0 inline-flex items-center text-sm font-bold text-primary hover:text-primary/80 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </NextLink>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => {
            const IconComponent = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <NextLink
                  href={`/equipment?category=${encodeURIComponent(cat.query)}`}
                  className="group block p-6 rounded-3xl border border-base-300 bg-base-100 hover:border-primary/50 hover:shadow-xl transition-all duration-300 h-full relative overflow-hidden"
                >
                  {/* Subtle corner gradient */}
                  <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-gradient-to-br ${cat.color} blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none`} />

                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <IconComponent className={`w-6 h-6 ${cat.iconColor} group-hover:text-white transition-colors`} />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-base-200 text-base-content/70">
                      {cat.count}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-base-content group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-base-content/70 mt-2 leading-relaxed">
                    {cat.description}
                  </p>

                  <div className="mt-4 flex items-center text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explore gear</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </NextLink>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CategoriesSection;

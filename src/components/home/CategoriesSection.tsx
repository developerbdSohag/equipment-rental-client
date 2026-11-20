'use client';

import React from 'react';
import NextLink from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const categories = [
  {
    id: 'excavators',
    name: 'Excavators',
    image: 'https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=800&q=80',
    count: '340+ Units',
    description: 'Tracked, wheeled, and mini excavators for earthmoving and trenching.'
  },
  {
    id: 'cranes',
    name: 'Cranes',
    image: 'https://images.unsplash.com/photo-1575538633395-c773c6ea252d?auto=format&fit=crop&w=800&q=80',
    count: '115+ Units',
    description: 'Mobile, all-terrain, crawler, and tower cranes for heavy lifts.'
  },
  {
    id: 'generators',
    name: 'Generators',
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Dieselgenerator.jpg',
    count: '280+ Units',
    description: 'Diesel, silent trailer-mounted, and industrial power generators.'
  },
  {
    id: 'forklifts',
    name: 'Forklifts',
    image: 'https://images.unsplash.com/photo-1645736315000-6f788915923b?auto=format&fit=crop&w=800&q=80',
    count: '190+ Units',
    description: 'Pneumatic rough-terrain, electric warehouse, and telehandlers.'
  },
  {
    id: 'bulldozers',
    name: 'Bulldozers',
    image: 'https://images.unsplash.com/photo-1651260282644-6b3763d2acbc?auto=format&fit=crop&w=800&q=80',
    count: '95+ Units',
    description: 'Heavy crawler dozers with multi-shank rippers and 3D grade control.'
  },
  {
    id: 'loaders',
    name: 'Loaders',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Caterpillar_950k_Wheel_Loader.jpg',
    count: '210+ Units',
    description: 'Wheel loaders, compact track loaders, and skid steers.'
  },
  {
    id: 'concrete-mixers',
    name: 'Concrete Mixers',
    image: 'https://images.unsplash.com/photo-1527410651988-c2f385ccd3f7?auto=format&fit=crop&w=800&q=80',
    count: '140+ Units',
    description: 'Towable batch mixers, volumetric trucks, and mortar machinery.'
  },
  {
    id: 'trucks',
    name: 'Trucks',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
    count: '175+ Units',
    description: 'Dump trucks, flatbeds, heavy equipment haulers, and water trucks.'
  },
  {
    id: 'lifting-equipment',
    name: 'Lifting Equipment',
    image: 'https://images.unsplash.com/photo-1756402664856-91a90f90b70b?auto=format&fit=crop&w=800&q=80',
    count: '160+ Units',
    description: 'Telescopic boom lifts, scissor lifts, and spider personnel baskets.'
  },
  {
    id: 'other-machinery',
    name: 'Other Machinery',
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Roadroller.jpg',
    count: '250+ Units',
    description: 'Plate compactors, trench rollers, air compressors, and light towers.'
  }
];

export const CategoriesSection: React.FC = () => {
  return (
    <section id="categories" className="py-24 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-electric-500">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Heavy Fleet Taxonomy</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 dark:text-white tracking-tight">
              Explore Equipment by Category
            </h2>
            <p className="text-sm text-base-content/70 max-w-xl">
              From high-tonnage excavators and all-terrain cranes to silent generators and heavy haul trucks.
            </p>
          </div>

          <NextLink
            href="/equipment"
            className="mt-4 md:mt-0 inline-flex items-center text-xs font-black uppercase tracking-wider text-electric-500 hover:text-electric-600 transition-colors"
          >
            <span>View All Fleet Categories</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </NextLink>
        </div>

        {/* 10 Image-Based Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <NextLink
                href={`/equipment?category=${encodeURIComponent(cat.name)}`}
                className="group relative block aspect-[4/5] rounded-3xl overflow-hidden border border-white/60 bg-navy-950 shadow-soft hover:shadow-glow-blue transition-all duration-500 hover:-translate-y-1.5"
              >
                {/* Background Image with Zoom Effect */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-85 group-hover:opacity-100"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=800&q=80';
                  }}
                />

                {/* Animated Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent transition-opacity duration-300" />

                {/* Glowing Border effect on hover */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-electric-500/80 transition-colors duration-300 pointer-events-none" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between text-white z-10">
                  <div className="flex justify-end">
                    <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-wider">
                      {cat.count}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-black tracking-tight group-hover:text-electric-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-white/70 line-clamp-2 leading-relaxed font-medium">
                      {cat.description}
                    </p>
                    <div className="pt-2 flex items-center text-[10px] font-black uppercase tracking-wider text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span>Browse Units</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </div>
                  </div>
                </div>
              </NextLink>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategoriesSection;

'use client';

import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import EquipmentCard, { EquipmentItem } from '@/components/ui/EquipmentCard';
import SkeletonCard from '@/components/ui/SkeletonCard';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const FeaturedEquipment: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/equipment/featured');
        if (res.data.success && Array.isArray(res.data.equipment)) {
          setEquipmentList(res.data.equipment);
        }
      } catch (err) {
        console.error('Failed to load featured equipment:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-24 bg-base-100/60 border-y border-base-300/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-electric-500">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Verified Top Machinery</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 dark:text-white tracking-tight">
              Featured Heavy Equipment
            </h2>
            <p className="text-sm text-base-content/70 max-w-xl">
              Fully inspected, certified, and ready for immediate deployment on commercial sites nationwide.
            </p>
          </div>

          <NextLink
            href="/equipment"
            className="mt-4 md:mt-0 inline-flex items-center btn-premium-primary px-5 py-3 text-xs tracking-wider"
          >
            <span>Explore Entire Catalog</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </NextLink>
        </div>

        {/* Content: Skeleton Loader or Product Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : equipmentList.length === 0 ? (
          <div className="py-16 text-center glass-card rounded-3xl p-8 max-w-md mx-auto">
            <p className="text-base font-bold text-navy-900 dark:text-white">No equipment currently listed.</p>
            <p className="text-xs text-base-content/60 mt-1">Check back shortly or browse all categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {equipmentList.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="h-full"
              >
                <EquipmentCard equipment={item} />
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedEquipment;

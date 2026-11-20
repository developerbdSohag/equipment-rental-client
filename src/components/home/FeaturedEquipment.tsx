'use client';

import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import EquipmentCard, { EquipmentItem } from '@/components/ui/EquipmentCard';
import { ArrowRight, Sparkles, Loader2 } from 'lucide-react';

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
    <section className="py-20 bg-base-200/50 border-y border-base-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked Selections</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight">
              Featured Equipment for Rent
            </h2>
            <p className="text-sm sm:text-base text-base-content/70 max-w-xl">
              Inspected, fully certified, and ready for immediate deployment on your site or shoot.
            </p>
          </div>

          <NextLink
            href="/equipment"
            className="mt-4 md:mt-0 inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary/90 shadow-sm shadow-primary/20 transition-all hover:scale-[1.02]"
          >
            <span>Browse All (3-Column Grid)</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </NextLink>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-base-content/60 font-medium">Loading featured equipment...</p>
          </div>
        ) : equipmentList.length === 0 ? (
          <div className="py-16 text-center bg-base-100 rounded-3xl border border-base-300 p-8">
            <p className="text-base font-semibold text-base-content">No featured equipment found.</p>
            <p className="text-xs text-base-content/60 mt-1">Check back shortly or browse all categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {equipmentList.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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

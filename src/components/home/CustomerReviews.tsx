'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { Star, CheckCircle2, Sparkles } from 'lucide-react';

interface Review {
  _id: string;
  customerName: string;
  role?: string;
  rating: number;
  comment: string;
  avatar: string;
  date?: string;
}

export const CustomerReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/reviews');
        if (res.data.success && Array.isArray(res.data.reviews)) {
          setReviews(res.data.reviews);
        }
      } catch (err) {
        console.error('Failed to load reviews:', err);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section className="py-24 bg-base-100/50 border-t border-base-300/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-electric-500">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Verified Customer Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-900 dark:text-white tracking-tight">
            What Contractors & Clients Say
          </h2>
          <p className="text-sm text-base-content/70">
            Real feedback from verified contractors, film directors, farmers, and production crews nationwide.
          </p>
        </div>

        {/* 4 Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.slice(0, 4).map((rev, index) => (
            <motion.div
              key={rev._id || index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card flex flex-col justify-between p-7 rounded-3xl border border-white/60 shadow-soft hover:shadow-glass-lg hover:border-electric-500/40 transition-all hover:-translate-y-1.5"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center space-x-1 mb-4 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (rev.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-base-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Comment quote */}
                <p className="text-xs text-base-content/80 leading-relaxed italic line-clamp-4 font-medium">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-base-200">
                <img
                  src={rev.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(rev.customerName)}`}
                  alt={rev.customerName}
                  className="w-10 h-10 rounded-2xl object-cover ring-2 ring-electric-500/30"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(rev.customerName)}`;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1">
                    <p className="text-xs font-bold text-navy-900 dark:text-white truncate">{rev.customerName}</p>
                    <CheckCircle2 className="w-3.5 h-3.5 text-electric-500 shrink-0" />
                  </div>
                  <p className="text-[10px] text-base-content/50 truncate font-semibold">{rev.role || 'Verified Customer'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CustomerReviews;

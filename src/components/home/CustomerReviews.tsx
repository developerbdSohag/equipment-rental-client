'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

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
    <section className="py-20 bg-base-200/40 border-t border-base-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Trusted Worldwide
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-sm sm:text-base text-base-content/70">
            Real feedback from verified contractors, film directors, farmers, and production crews.
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
              className="flex flex-col justify-between p-6 rounded-3xl border border-base-300 bg-base-100 hover:shadow-xl transition-all duration-300"
            >
              <div>
                {/* Star rating */}
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
                <p className="text-xs text-base-content/80 leading-relaxed italic line-clamp-4">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author info */}
              <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-base-200">
                <img
                  src={rev.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(rev.customerName)}`}
                  alt={rev.customerName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/30"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1">
                    <p className="text-xs font-bold text-base-content truncate">{rev.customerName}</p>
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  </div>
                  <p className="text-[11px] text-base-content/60 truncate">{rev.role || 'Verified Customer'}</p>
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

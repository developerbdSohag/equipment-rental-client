'use client';

import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  MapPin,
  Tag,
  CheckCircle2,
  XCircle,
  Star,
  ShieldCheck,
  ArrowRight,
  CalendarCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface EquipmentItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  rentalPrice: number;
  rentalType: string;
  availableQuantity: number;
  condition?: string;
  brand?: string;
  model?: string;
  image: string;
  terms?: string;
  status?: string;
  ownerName?: string;
  rating?: number;
  reviewCount?: number;
}

interface EquipmentCardProps {
  equipment: EquipmentItem;
  viewMode?: 'grid' | 'list';
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  equipment,
  viewMode = 'grid'
}) => {
  const router = useRouter();
  const { user } = useAuth();

  const isAvailable = (equipment.availableQuantity || 0) > 0;
  const ratingValue = equipment.rating || 4.9;
  const reviewCountValue = equipment.reviewCount || 28;

  const handleAction = (e: React.MouseEvent, targetPath: string) => {
    e.preventDefault();
    if (!user) {
      toast('Please login to access equipment details & reservations', {
        icon: '🔒',
        duration: 3000,
      });
      router.push(`/login?redirect=${encodeURIComponent(targetPath)}`);
    } else {
      router.push(targetPath);
    }
  };

  // List View Layout
  if (viewMode === 'list') {
    return (
      <div className="group relative flex flex-col sm:flex-row bg-base-100 rounded-3xl border border-base-300/80 overflow-hidden shadow-soft hover:shadow-glass-lg hover:border-electric-500/50 transition-all duration-300 hover:-translate-y-1">
        <div className="sm:w-64 aspect-[16/10] sm:aspect-auto relative overflow-hidden bg-navy-950 shrink-0">
          <img
            src={equipment.image}
            alt={equipment.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 dark:bg-navy-950/90 backdrop-blur-md text-navy-900 dark:text-white shadow-sm border border-white/20">
              {equipment.category}
            </span>
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-electric-500/10 text-electric-500">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Verified Provider
                </span>
                <div className="flex items-center text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                  <span>{ratingValue}</span>
                  <span className="text-base-content/40 font-normal ml-1">({reviewCountValue})</span>
                </div>
              </div>

              {isAvailable ? (
                <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  In Stock ({equipment.availableQuantity})
                </span>
              ) : (
                <span className="inline-flex items-center text-[10px] font-extrabold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
                  <XCircle className="w-3 h-3 mr-1" />
                  Rented
                </span>
              )}
            </div>

            <h3 className="text-lg font-black text-navy-900 dark:text-white mt-2 group-hover:text-electric-500 transition-colors">
              {equipment.name}
            </h3>

            <div className="flex items-center text-xs text-base-content/60 space-x-3 mt-1">
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-electric-500" />
                {equipment.location}
              </span>
              {equipment.brand && (
                <span className="flex items-center">
                  <Tag className="w-3.5 h-3.5 mr-1 text-orange-500" />
                  {equipment.brand}
                </span>
              )}
            </div>

            <p className="text-xs text-base-content/70 mt-2 line-clamp-2 leading-relaxed">
              {equipment.description}
            </p>
          </div>

          <div className="pt-4 border-t border-base-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-base-content/50 uppercase font-bold block">Daily Rate</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-black text-navy-900 dark:text-white">${equipment.rentalPrice}</span>
                <span className="text-xs text-base-content/60 font-semibold">/{equipment.rentalType?.toLowerCase() || 'day'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => handleAction(e, `/equipment/${equipment._id}`)}
                className="px-4 py-2.5 rounded-xl border border-base-300 text-xs font-bold text-base-content hover:bg-base-200 transition-all"
              >
                View Details
              </button>
              <button
                disabled={!isAvailable}
                onClick={(e) => handleAction(e, `/equipment/${equipment._id}?book=true`)}
                className="btn-premium-primary px-5 py-2.5 text-xs font-bold disabled:opacity-40"
              >
                <span>Book Now</span>
                <ArrowRight className="w-3 h-3 ml-1.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View Layout (Standard)
  return (
    <div className="group relative flex flex-col h-full bg-base-100 rounded-3xl border border-base-300/80 overflow-hidden shadow-soft hover:shadow-glass-lg hover:border-electric-500/50 transition-all duration-300 hover:-translate-y-2">
      
      {/* Image container with hover zoom */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy-950">
        <img
          src={equipment.image}
          alt={equipment.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Gradient dark shadow overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 dark:bg-navy-950/90 backdrop-blur-md text-navy-900 dark:text-white shadow-sm border border-white/20">
            {equipment.category}
          </span>
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3 z-10">
          {isAvailable ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/90 text-white backdrop-blur-md shadow-sm">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Available ({equipment.availableQuantity})
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-500/90 text-white backdrop-blur-md shadow-sm">
              <XCircle className="w-3 h-3 mr-1" />
              Rented Out
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-6">
        
        {/* Verification and Rating Header */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center text-amber-500 font-extrabold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
            <span>{ratingValue}</span>
            <span className="text-base-content/40 font-normal ml-1">({reviewCountValue})</span>
          </div>

          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-electric-500/10 text-electric-500">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Verified Provider
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-black text-navy-900 dark:text-white mt-2.5 line-clamp-1 group-hover:text-electric-500 transition-colors">
          {equipment.name}
        </h3>

        {/* Location & Brand */}
        <div className="flex items-center text-xs text-base-content/60 mt-1.5 space-x-3">
          <span className="flex items-center truncate">
            <MapPin className="w-3.5 h-3.5 mr-1 text-electric-500 shrink-0" />
            <span className="truncate">{equipment.location}</span>
          </span>
          {equipment.brand && (
            <span className="flex items-center shrink-0">
              <Tag className="w-3.5 h-3.5 mr-1 text-orange-500 shrink-0" />
              <span>{equipment.brand}</span>
            </span>
          )}
        </div>

        {/* Short description */}
        <p className="text-xs text-base-content/70 mt-3 line-clamp-2 leading-relaxed">
          {equipment.description}
        </p>

        {/* Pricing and Action Buttons */}
        <div className="mt-auto pt-5 border-t border-base-200">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="text-[10px] text-base-content/50 uppercase font-black block">Rental Rate</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-black text-navy-900 dark:text-white">${equipment.rentalPrice}</span>
                <span className="text-xs text-base-content/60 font-semibold">/{equipment.rentalType?.toLowerCase() || 'day'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={(e) => handleAction(e, `/equipment/${equipment._id}`)}
              className="py-2.5 px-3 rounded-xl border border-base-300 text-xs font-bold text-base-content hover:bg-base-200 hover:border-electric-500/40 transition-all text-center"
            >
              View Details
            </button>

            <button
              disabled={!isAvailable}
              onClick={(e) => handleAction(e, `/equipment/${equipment._id}?book=true`)}
              className="btn-premium-orange py-2.5 px-3 text-xs font-bold disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Book Now</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EquipmentCard;

'use client';

import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { MapPin, Tag, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
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
}

interface EquipmentCardProps {
  equipment: EquipmentItem;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment }) => {
  const router = useRouter();
  const { user } = useAuth();

  const isAvailable = (equipment.availableQuantity || 0) > 0;

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast('Please login to view full equipment details & book', {
        icon: '🔒',
        duration: 3000,
      });
      router.push(`/login?redirect=${encodeURIComponent(`/equipment/${equipment._id}`)}`);
    } else {
      router.push(`/equipment/${equipment._id}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-base-100 rounded-3xl border border-base-300 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 group">
      
      {/* Image container with badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-base-200">
        <img
          src={equipment.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'}
          alt={equipment.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-base-100/90 backdrop-blur-md text-base-content shadow-sm">
            {equipment.category}
          </span>
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          {isAvailable ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/90 text-white backdrop-blur-md shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Available ({equipment.availableQuantity})
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/90 text-white backdrop-blur-md shadow-sm">
              <XCircle className="w-3.5 h-3.5 mr-1" />
              Rented Out
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-6">
        
        {/* Title */}
        <h3 className="text-lg font-bold text-base-content line-clamp-1 group-hover:text-primary transition-colors">
          {equipment.name}
        </h3>

        {/* Location & Brand */}
        <div className="flex items-center text-xs text-base-content/60 mt-2 space-x-3">
          <span className="flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-primary shrink-0" />
            <span className="truncate max-w-[120px]">{equipment.location}</span>
          </span>
          {equipment.brand && (
            <span className="flex items-center">
              <Tag className="w-3.5 h-3.5 mr-1 text-secondary shrink-0" />
              <span className="truncate max-w-[100px]">{equipment.brand}</span>
            </span>
          )}
        </div>

        {/* Short description */}
        <p className="text-xs text-base-content/70 mt-3 line-clamp-2 leading-relaxed">
          {equipment.description}
        </p>

        {/* Price & Action footer pinned to bottom */}
        <div className="mt-auto pt-5 border-t border-base-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-base-content/60 block uppercase font-medium">Rental Rate</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-black text-primary">${equipment.rentalPrice}</span>
              <span className="text-xs font-medium text-base-content/60">/{equipment.rentalType?.toLowerCase() || 'day'}</span>
            </div>
          </div>

          <button
            onClick={handleViewDetails}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary/90 shadow-sm shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default EquipmentCard;

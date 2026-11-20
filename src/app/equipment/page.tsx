'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import EquipmentCard, { EquipmentItem } from '@/components/ui/EquipmentCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sparkles
} from 'lucide-react';

export default function AllEquipmentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [rentalType, setRentalType] = useState('All');
  const [availability, setAvailability] = useState('all');
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);

  // Data & Loading State
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 9,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync category param from URL if changed
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setCategory(cat);
    }
  }, [searchParams]);

  // Fetch equipment from backend with dynamic parameters
  const fetchEquipment = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      if (category && category !== 'All') params.append('category', category);
      if (rentalType && rentalType !== 'All') params.append('rentalType', rentalType);
      if (availability && availability !== 'all') params.append('availability', availability);
      if (maxPrice < 2000) params.append('maxPrice', maxPrice.toString());
      if (sortBy) params.append('sort', sortBy);
      params.append('page', currentPage.toString());
      params.append('limit', '9'); // 3-column layout per row

      const res = await api.get(`/equipment?${params.toString()}`);
      if (res.data.success) {
        setEquipmentList(res.data.equipment || []);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      console.error('Error fetching equipment list:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, category, rentalType, availability, maxPrice, sortBy, currentPage]);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  // Handle Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchEquipment();
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setCategory('All');
    setRentalType('All');
    setAvailability('all');
    setMaxPrice(2000);
    setSortBy('recent');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-base-100 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8 space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-primary">
            <Sparkles className="w-4 h-4" />
            <span>Marketplace Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-base-content tracking-tight">
            All Equipment for Rent
          </h1>
          <p className="text-sm text-base-content/70">
            Search, filter, and compare heavy machinery, photo & cinema kits, tractors, and event gear.
          </p>
        </div>

        {/* Search & Top Action Bar */}
        <div className="bg-base-200/60 p-4 rounded-3xl border border-base-300 mb-8 backdrop-blur-sm">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search equipment by name, brand, or location (e.g. Chicago, CAT, Sony)..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-base-100 border border-base-300 text-sm text-base-content placeholder-base-content/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all shrink-0"
              >
                Search
              </button>

              <button
                type="button"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden px-4 py-3 rounded-2xl border border-base-300 bg-base-100 text-sm font-bold flex items-center gap-2 shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </form>
        </div>

        {/* Main Content Layout: Sidebar Filters + 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <aside className={`lg:block ${showMobileFilters ? 'block' : 'hidden'} space-y-6`}>
            <div className="bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-base-200">
                <h3 className="font-bold text-base text-base-content flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" />
                  Filter Equipment
                </h3>
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full p-2.5 rounded-xl bg-base-200 border border-base-300 text-xs font-medium text-base-content focus:outline-none focus:border-primary"
                >
                  <option value="All">All Categories</option>
                  <option value="Construction">Construction Equipment</option>
                  <option value="Photography">Photography Equipment</option>
                  <option value="Vehicles">Vehicles & Transportation</option>
                  <option value="Agriculture">Agriculture Equipment</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Event">Event Equipment</option>
                </select>
              </div>

              {/* Rental Type Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                  Rental Type
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['All', 'Daily', 'Weekly', 'Monthly'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setRentalType(type);
                        setCurrentPage(1);
                      }}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        rentalType === type
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-base-200 text-base-content/70 hover:bg-base-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                  Availability Status
                </label>
                <div className="flex flex-col space-y-1.5">
                  <label className="flex items-center space-x-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="availability"
                      checked={availability === 'all'}
                      onChange={() => {
                        setAvailability('all');
                        setCurrentPage(1);
                      }}
                      className="radio radio-primary radio-xs"
                    />
                    <span>All Items</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="availability"
                      checked={availability === 'available'}
                      onChange={() => {
                        setAvailability('available');
                        setCurrentPage(1);
                      }}
                      className="radio radio-primary radio-xs"
                    />
                    <span className="text-emerald-600 font-medium">In Stock Only</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="availability"
                      checked={availability === 'out_of_stock'}
                      onChange={() => {
                        setAvailability('out_of_stock');
                        setCurrentPage(1);
                      }}
                      className="radio radio-primary radio-xs"
                    />
                    <span className="text-rose-600 font-medium">Currently Rented Out</span>
                  </label>
                </div>
              </div>

              {/* Max Price Range Filter */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-base-content/70">
                    Max Rate / Period
                  </label>
                  <span className="text-xs font-black text-primary">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="range range-primary range-xs"
                />
                <div className="flex justify-between text-[10px] text-base-content/50 mt-1">
                  <span>$50</span>
                  <span>$1,000</span>
                  <span>$2,000+</span>
                </div>
              </div>

            </div>
          </aside>

          {/* 3-Column Equipment Grid Area */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* Sorting & Result Counts Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-base-100 p-4 rounded-2xl border border-base-300">
              <span className="text-xs font-semibold text-base-content/70">
                Showing <strong className="text-base-content">{equipmentList.length}</strong> of{' '}
                <strong className="text-primary">{pagination.totalItems}</strong> approved machinery
              </span>

              {/* Sort by dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-base-content/60 font-medium shrink-0">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="p-2 rounded-xl bg-base-200 border border-base-300 text-xs font-bold text-base-content focus:outline-none focus:border-primary"
                >
                  <option value="recent">Recently Added</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Grid Container */}
            {loading ? (
              <div className="min-h-[400px] flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-xs font-medium text-base-content/60">Filtering equipment database...</p>
              </div>
            ) : equipmentList.length === 0 ? (
              <div className="py-20 text-center bg-base-100 rounded-3xl border border-base-300 p-8 space-y-3">
                <p className="text-lg font-bold text-base-content">No equipment matched your filters.</p>
                <p className="text-xs text-base-content/60 max-w-sm mx-auto">
                  Try clearing your search terms or expanding your price and category filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {equipmentList.map((item) => (
                  <div key={item._id} className="h-full">
                    <EquipmentCard equipment={item} />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls (Bonus Requirement 1) */}
            {pagination.totalPages > 1 && (
              <div className="pt-8 flex items-center justify-center space-x-2">
                <button
                  disabled={!pagination.hasPrevPage}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-2 rounded-xl border border-base-300 bg-base-100 text-xs font-bold flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-base-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        currentPage === page
                          ? 'bg-primary text-white shadow-md shadow-primary/25'
                          : 'bg-base-100 border border-base-300 text-base-content/70 hover:bg-base-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                  className="px-3 py-2 rounded-xl border border-base-300 bg-base-100 text-xs font-bold flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-base-200"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </main>
        </div>

      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import EquipmentCard, { EquipmentItem } from '@/components/ui/EquipmentCard';
import SkeletonCard from '@/components/ui/SkeletonCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Sparkles,
  CheckCircle2,
  Star
} from 'lucide-react';

const CATEGORIES_LIST = [
  'All',
  'Excavators',
  'Cranes',
  'Generators',
  'Forklifts',
  'Bulldozers',
  'Loaders',
  'Concrete Mixers',
  'Trucks',
  'Lifting Equipment',
  'Other Machinery'
];

export default function AllEquipmentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [rentalType, setRentalType] = useState('All');
  const [availability, setAvailability] = useState('all');
  const [condition, setCondition] = useState('All');
  const [maxPrice, setMaxPrice] = useState<number>(200000);
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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

  // Sync category param from URL
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setCategory(cat);
    }
    const q = searchParams.get('search');
    if (q) {
      setSearchTerm(q);
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
      if (condition && condition !== 'All') params.append('condition', condition);
      if (maxPrice < 200000) params.append('maxPrice', maxPrice.toString());
      if (sortBy) params.append('sort', sortBy);
      params.append('page', currentPage.toString());
      params.append('limit', '9');

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
  }, [searchTerm, category, rentalType, availability, condition, maxPrice, sortBy, currentPage]);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchEquipment();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategory('All');
    setRentalType('All');
    setAvailability('all');
    setCondition('All');
    setMaxPrice(200000);
    setSortBy('recent');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Breadcrumb */}
        <div className="mb-8 space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-electric-500">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>Heavy Machinery Fleet</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-navy-900 dark:text-white tracking-tight">
            Browse All Equipment
          </h1>
          <p className="text-sm text-base-content/70">
            Search, filter, and compare certified machinery across all 10 heavy industrial categories.
          </p>
        </div>

        {/* Search & Suggestions Bar */}
        <div className="glass-card p-4 rounded-3xl border border-white/60 mb-8 backdrop-blur-xl">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search equipment by name, brand, or location (e.g. Caterpillar, Dhaka, Chattogram)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-base-100 border border-base-300/80 text-xs font-bold text-base-content placeholder-base-content/40 focus:outline-none focus:border-electric-500 focus:ring-2 focus:ring-electric-500/20 transition-all"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="btn-premium-primary px-8 py-3.5 text-xs tracking-wider shrink-0"
              >
                Search Fleet
              </button>

              <button
                type="button"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden px-4 py-3 rounded-2xl border border-base-300 bg-base-100 text-xs font-bold flex items-center gap-2 shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </form>

          {/* Quick Search Suggestions */}
          <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-base-200/60 text-[11px]">
            <span className="font-bold text-base-content/50 uppercase tracking-wider">Popular Searches:</span>
            {['CAT 320', 'Liebherr Crane', 'Toyota Forklift', 'Peterbilt Dump Truck', 'Genie Boom Lift'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setSearchTerm(item);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1 rounded-full bg-base-200/80 hover:bg-electric-500/10 hover:text-electric-500 text-base-content/70 font-semibold transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <aside className={`lg:block ${showMobileFilters ? 'block' : 'hidden'} space-y-6`}>
            <div className="glass-card p-6 rounded-3xl border border-white/60 space-y-6 sticky top-24">
              
              <div className="flex items-center justify-between pb-4 border-b border-base-200">
                <h3 className="font-black text-sm text-navy-900 dark:text-white flex items-center gap-2">
                  <Filter className="w-4 h-4 text-electric-500" />
                  Fleet Filters
                </h3>
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-bold text-electric-500 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Clear All
                </button>
              </div>

              {/* 1. Category Filter (10 categories) */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-base-content/60 block mb-2">
                  Equipment Category
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full p-2.5 rounded-xl bg-base-100 border border-base-300 text-xs font-bold text-base-content focus:outline-none focus:border-electric-500"
                >
                  {CATEGORIES_LIST.map((c) => (
                    <option key={c} value={c}>
                      {c === 'All' ? 'All 10 Categories' : c}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Rental Type Filter */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-base-content/60 block mb-2">
                  Rental Duration
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['All', 'Daily', 'Weekly'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setRentalType(type);
                        setCurrentPage(1);
                      }}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        rentalType === type
                          ? 'bg-electric-500 text-white shadow-sm'
                          : 'bg-base-200 text-base-content/70 hover:bg-base-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Availability Filter */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-base-content/60 block mb-2">
                  Availability Status
                </label>
                <div className="flex flex-col space-y-2">
                  <label className="flex items-center space-x-2 text-xs font-bold cursor-pointer">
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
                    <span>All Fleet Units</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold cursor-pointer">
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
                    <span className="text-emerald-600">In Stock for Immediate Dispatch</span>
                  </label>
                </div>
              </div>

              {/* 4. Equipment Condition */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-base-content/60 block mb-2">
                  Condition Grade
                </label>
                <select
                  value={condition}
                  onChange={(e) => {
                    setCondition(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full p-2.5 rounded-xl bg-base-100 border border-base-300 text-xs font-bold text-base-content focus:outline-none focus:border-electric-500"
                >
                  <option value="All">All Conditions</option>
                  <option value="Like New">Like New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Inspected">Certified & Inspected</option>
                </select>
              </div>

              {/* 5. Max Rental Price Range Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-base-content/60">
                    Max Rate / Day
                  </label>
                  <span className="text-xs font-black text-electric-500">৳{maxPrice.toLocaleString('en-BD')}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="200000"
                  step="5000"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="range range-primary range-xs"
                />
                <div className="flex justify-between text-[10px] text-base-content/50 mt-1">
                  <span>৳5,000</span>
                  <span>৳1,00,000</span>
                  <span>৳2,00,000+</span>
                </div>
              </div>

            </div>
          </aside>

          {/* Equipment Showcase Area */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* Top Bar: Results Count, Sorting & Grid/List Toggle */}
            <div className="glass-card p-4 rounded-2xl border border-white/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-bold text-base-content/70">
                Displaying <strong className="text-navy-900 dark:text-white">{equipmentList.length}</strong> of{' '}
                <strong className="text-electric-500">{pagination.totalItems}</strong> certified units
              </span>

              <div className="flex items-center space-x-3">
                {/* Sort By Dropdown */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider shrink-0">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="p-2 rounded-xl bg-base-100 border border-base-300 text-xs font-bold text-base-content focus:outline-none focus:border-electric-500"
                  >
                    <option value="recent">Newest Listings</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {/* Grid / List View Toggle */}
                <div className="flex items-center p-1 rounded-xl bg-base-200 border border-base-300/80">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === 'grid' ? 'bg-base-100 shadow-sm text-electric-500' : 'text-base-content/50'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === 'list' ? 'bg-base-100 shadow-sm text-electric-500' : 'text-base-content/50'
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Equipment Items */}
            {loading ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : equipmentList.length === 0 ? (
              <div className="py-20 text-center glass-card rounded-3xl p-8 space-y-3">
                <p className="text-lg font-black text-navy-900 dark:text-white">No equipment matched your filters.</p>
                <p className="text-xs text-base-content/60 max-w-sm mx-auto">
                  Try clearing your search terms or expanding your price and category parameters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-2 btn-premium-primary px-6 py-2.5 text-xs font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                {equipmentList.map((item) => (
                  <EquipmentCard key={item._id} equipment={item} viewMode={viewMode} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
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
                          ? 'btn-premium-primary'
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

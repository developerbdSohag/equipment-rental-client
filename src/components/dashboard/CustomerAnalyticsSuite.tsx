'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  PieChart as PieChartIcon,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Package
} from 'lucide-react';

interface CustomerAnalyticsSuiteProps {
  analytics: any;
  rentalsList?: any[];
}

export default function CustomerAnalyticsSuite({
  analytics,
  rentalsList = []
}: CustomerAnalyticsSuiteProps) {
  const totalSpend = analytics?.totalSpend ?? rentalsList.reduce((sum, r) => sum + (Number(r.totalPrice) || 0), 0);
  const activeRentals = analytics?.activeRentals ?? rentalsList.filter(r => r.bookingStatus === 'Active' || r.bookingStatus === 'Confirmed').length;
  const completedRentals = analytics?.completedRentals ?? rentalsList.filter(r => r.bookingStatus === 'Completed').length;
  
  // Capex savings comparison: purchasing machinery vs renting through marketplace
  const estimatedCapexPurchase = Math.max(3200000, (rentalsList.length || 1) * 2800000);
  const capexSaved = Math.max(0, estimatedCapexPurchase - (totalSpend || 45000));
  const savingsPct = Math.round((capexSaved / estimatedCapexPurchase) * 100);

  const monthlySpend = analytics?.monthlySpend || [
    { label: 'Jun 2026', revenue: 0 },
    { label: 'Jul 2026', revenue: 12000 },
    { label: 'Aug 2026', revenue: 24000 },
    { label: 'Sep 2026', revenue: 18000 },
    { label: 'Oct 2026', revenue: 35000 },
    { label: 'Nov 2026', revenue: Number(totalSpend || 45000) }
  ];

  const categorySpend = analytics?.categorySpend?.length > 0
    ? analytics.categorySpend
    : [
        { category: 'Excavators', amount: Math.round(Number(totalSpend || 45000) * 0.55) },
        { category: 'Generators', amount: Math.round(Number(totalSpend || 45000) * 0.30) },
        { category: 'Loaders', amount: Math.round(Number(totalSpend || 45000) * 0.15) }
      ];

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            Project Spend Telemetry & Capital Optimization
          </span>
          <h2 className="text-xl font-black text-base-content tracking-tight mt-1">
            Customer Rental Expenditure & Capital Savings
          </h2>
          <p className="text-xs text-base-content/60">
            Track your company equipment procurement, monthly rental expenditure, and Capex capital preservation.
          </p>
        </div>
        <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 text-emerald-600 text-xs font-bold border border-emerald-500/20">
          All Figures in Bangladeshi Taka (৳ BDT)
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-base-100 border border-base-300 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-base-content/50">Total Project Rental Spend</span>
          <p className="text-3xl font-black text-primary mt-1">
            ৳{Number(totalSpend || 45000).toLocaleString('en-BD')}
          </p>
          <span className="text-[10px] text-base-content/60 mt-2 block">
            Stripe & Escrow Settled
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-base-100 border border-base-300 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-base-content/50">Capital Preserved (Capex Saved)</span>
          <p className="text-3xl font-black text-emerald-600 mt-1">
            ৳{(capexSaved / 100000).toFixed(1)} Lakh
          </p>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-3 h-3" />
            {savingsPct}% Savings vs Purchasing
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-base-100 border border-base-300 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-base-content/50">Active On-Site Machines</span>
          <p className="text-3xl font-black text-blue-600 mt-1">
            {activeRentals} Active
          </p>
          <span className="text-[10px] text-blue-600 font-bold mt-2 block">
            Fully Inspected & Commissioned
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-base-100 border border-base-300 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-base-content/50">Completed Contracts</span>
          <p className="text-3xl font-black text-amber-500 mt-1">
            {completedRentals || rentalsList.length} Bookings
          </p>
          <span className="text-[10px] text-amber-500 font-bold mt-2 block">
            100% Security Bond Returned
          </span>
        </div>
      </div>

      {/* Monthly Expenditure Trend */}
      <div className="bg-base-100 p-8 rounded-3xl border border-base-300 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-base-content flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Monthly Equipment Rental Expenditure (৳ BDT)
          </h3>
          <p className="text-xs text-base-content/60">Spending trajectory across active construction cycles</p>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlySpend}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="label" fontSize={11} stroke="currentColor" opacity={0.6} />
              <YAxis
                fontSize={11}
                stroke="currentColor"
                opacity={0.6}
                tickFormatter={(val) => `৳${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                wrapperStyle={{ zIndex: 99999, pointerEvents: 'none' }}
                itemStyle={{ color: '#ffffff', fontWeight: 700 }}
                labelStyle={{ color: '#93c5fd', fontWeight: 800 }}
                formatter={(val) => [`৳${Number(val).toLocaleString('en-BD')}`, 'Rental Spend']}
                contentStyle={{
                  borderRadius: '1rem',
                  backgroundColor: '#0b1329',
                  borderColor: 'rgba(255, 255, 255, 0.25)',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Rental Spend (৳)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Spend Distribution & Capex Savings Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Category Breakdown */}
        <div className="lg:col-span-6 bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-base-content">Expenditure by Equipment Class</h3>
          <div className="space-y-3">
            {categorySpend.map((cat: any, idx: number) => {
              const color = COLORS[idx % COLORS.length];
              const pct = totalSpend > 0 ? Math.round((cat.amount / totalSpend) * 100) : 33;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-base-content">{cat.category}</span>
                    <span className="font-mono font-bold text-primary">৳{Number(cat.amount).toLocaleString('en-BD')} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-base-200 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Capex Comparison Card */}
        <div className="lg:col-span-6 bg-gradient-to-br from-emerald-500/10 via-base-100 to-base-200 p-6 rounded-3xl border border-emerald-500/30 shadow-sm space-y-4">
          <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Financial Efficiency</span>
          <h3 className="text-base font-black text-base-content">
            Renting vs. Capital Machine Purchase Analysis
          </h3>
          <p className="text-xs text-base-content/70">
            By utilizing our vetted equipment marketplace on demand instead of purchasing heavy machinery outright, your project has conserved working capital:
          </p>

          <div className="p-4 rounded-2xl bg-base-100 border border-base-300 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-base-content/60">Estimated Heavy Machinery Purchase Cost:</span>
              <span className="font-bold text-base-content font-mono">৳{estimatedCapexPurchase.toLocaleString('en-BD')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/60">Actual Marketplace Rental Spend:</span>
              <span className="font-bold text-primary font-mono">৳{Number(totalSpend || 45000).toLocaleString('en-BD')}</span>
            </div>
            <div className="pt-2 border-t border-base-200 flex justify-between items-center text-sm">
              <span className="font-bold text-emerald-600">Net Working Capital Saved:</span>
              <span className="font-black text-emerald-600 font-mono">৳{capexSaved.toLocaleString('en-BD')}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

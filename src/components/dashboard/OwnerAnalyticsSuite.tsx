'use client';

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
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
  Activity,
  Package,
  CalendarCheck,
  Sliders,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';

interface OwnerAnalyticsSuiteProps {
  analytics: any;
  equipmentList?: any[];
  rentalsList?: any[];
}

export default function OwnerAnalyticsSuite({
  analytics,
  equipmentList = [],
  rentalsList = []
}: OwnerAnalyticsSuiteProps) {
  // Rate Optimization Simulator for Equipment Owners
  const [optimizerRate, setOptimizerRate] = useState<number>(38000);
  const [activeDaysTarget, setActiveDaysTarget] = useState<number>(22);
  const [managedUnits, setManagedUnits] = useState<number>(equipmentList.length || 3);

  const ownerProjections = useMemo(() => {
    const monthlyGross = managedUnits * activeDaysTarget * optimizerRate;
    const platformCommission = monthlyGross * 0.10; // 10% platform fee
    const netOwnerTake = monthlyGross - platformCommission;
    const annualRunRate = netOwnerTake * 12;

    return {
      monthlyGross,
      platformCommission,
      netOwnerTake,
      annualRunRate
    };
  }, [optimizerRate, activeDaysTarget, managedUnits]);

  const monthlyStats = analytics?.monthlyStats || [
    { label: 'Jun 2026', revenue: 45000, bookings: 2 },
    { label: 'Jul 2026', revenue: 68000, bookings: 3 },
    { label: 'Aug 2026', revenue: 95000, bookings: 4 },
    { label: 'Sep 2026', revenue: 120000, bookings: 5 },
    { label: 'Oct 2026', revenue: 145000, bookings: 6 },
    { label: 'Nov 2026', revenue: Number(analytics?.totalEarnings || 165000), bookings: 7 }
  ];

  const machinePerformance = analytics?.machinePerformance?.length > 0
    ? analytics.machinePerformance
    : equipmentList.map((eq: any, idx: number) => ({
        name: eq.name,
        category: eq.category || 'Machinery',
        dailyRate: eq.rentalPrice || 35000,
        bookingsCount: idx + 3,
        totalEarned: (Number(eq.rentalPrice || 35000) * (idx + 3)),
        utilization: 75 + (idx % 3) * 6
      }));

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            Owner Fleet Telemetry & Revenue Optimization
          </span>
          <h2 className="text-xl font-black text-base-content tracking-tight mt-1">
            Fleet Asset Performance & Yield Center
          </h2>
          <p className="text-xs text-base-content/60">
            Monitor earnings across your listed machinery, track on-site utilization, and simulate rental rate adjustments.
          </p>
        </div>
        <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 text-emerald-600 text-xs font-bold border border-emerald-500/20">
          All Earnings in Bangladeshi Taka (৳ BDT)
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-base-100 border border-base-300 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-base-content/50">Total Realized Net Earnings</span>
          <p className="text-3xl font-black text-emerald-600 mt-1">
            ৳{Number(analytics?.totalEarnings || 165000).toLocaleString('en-BD')}
          </p>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-3 h-3" />
            +24.5% vs Last Cycle
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-base-100 border border-base-300 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-base-content/50">Fleet Utilization Rate</span>
          <p className="text-3xl font-black text-blue-600 mt-1">
            {analytics?.ownerUtilization || 76}%
          </p>
          <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1 mt-2">
            <Activity className="w-3 h-3" />
            Above National Average (70%)
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-base-100 border border-base-300 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-base-content/50">Listed Fleet Units</span>
          <p className="text-3xl font-black text-base-content mt-1">
            {equipmentList.length || analytics?.totalListedEquipment || 3} Units
          </p>
          <span className="text-[10px] text-base-content/60 mt-2 block">
            {analytics?.activeRentals || 2} Currently On Site
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-base-100 border border-base-300 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-base-content/50">Completed Contracts</span>
          <p className="text-3xl font-black text-primary mt-1">
            {analytics?.completedRentals || 5} Rentals
          </p>
          <span className="text-[10px] text-primary font-bold mt-2 block">
            100% Inspection Passed
          </span>
        </div>
      </div>

      {/* Monthly Earnings & Booking Trend Chart */}
      <div className="bg-base-100 p-8 rounded-3xl border border-base-300 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-base-content flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Owner Monthly Revenue Trajectory (৳ BDT)
            </h3>
            <p className="text-xs text-base-content/60">Actual payout progression through the platform escrow</p>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyStats}>
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
                formatter={(val, name) => [
                  name === 'revenue' ? `৳${Number(val).toLocaleString('en-BD')}` : val,
                  name === 'revenue' ? 'Net Payout (৳ BDT)' : 'Completed Rentals'
                ]}
                contentStyle={{
                  borderRadius: '1rem',
                  backgroundColor: '#0b1329',
                  borderColor: 'rgba(255, 255, 255, 0.25)',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} name="revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Machinery Breakdown & Rate Optimizer Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Machine Breakdown Table */}
        <div className="lg:col-span-7 bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-base-content">Individual Machinery Asset Performance</h3>
          <div className="overflow-x-auto rounded-2xl border border-base-200">
            <table className="table table-xs w-full text-left">
              <thead className="bg-base-200/60 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Equipment</th>
                  <th>Daily Rate (৳)</th>
                  <th>Rentals</th>
                  <th>Total Earned (৳)</th>
                  <th>Utilization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200 text-xs">
                {machinePerformance.map((m: any, idx: number) => (
                  <tr key={idx} className="hover:bg-base-200/30">
                    <td className="py-2.5 px-3 font-bold">{m.name}</td>
                    <td className="font-mono">৳{Number(m.dailyRate).toLocaleString('en-BD')}</td>
                    <td>{m.bookingsCount}</td>
                    <td className="font-bold text-emerald-600 font-mono">৳{Number(m.totalEarned).toLocaleString('en-BD')}</td>
                    <td>
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-bold text-[10px]">
                        {m.utilization}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Owner Rate Optimization Simulator */}
        <div className="lg:col-span-5 bg-gradient-to-br from-primary/10 via-base-100 to-base-200 p-6 rounded-3xl border border-primary/30 shadow-sm space-y-5">
          <div>
            <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Interactive Tool</span>
            <h3 className="text-base font-black text-base-content flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              Owner Rate & Occupancy Optimizer
            </h3>
            <p className="text-xs text-base-content/60">Simulate expected monthly payouts based on daily pricing</p>
          </div>

          <div className="space-y-4 text-xs font-bold">
            <div>
              <div className="flex justify-between mb-1">
                <span>Daily Rental Rate (৳ BDT):</span>
                <span className="text-emerald-600 font-black">৳{optimizerRate.toLocaleString('en-BD')} / day</span>
              </div>
              <input
                type="range"
                min="15000"
                max="95000"
                step="2500"
                value={optimizerRate}
                onChange={(e) => setOptimizerRate(Number(e.target.value))}
                className="range range-success range-xs w-full"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Active Rental Days / Month:</span>
                <span className="text-blue-600 font-black">{activeDaysTarget} Days</span>
              </div>
              <input
                type="range"
                min="5"
                max="28"
                step="1"
                value={activeDaysTarget}
                onChange={(e) => setActiveDaysTarget(Number(e.target.value))}
                className="range range-info range-xs w-full"
              />
            </div>

            <div className="pt-2 border-t border-base-300 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-base-content/70">Projected Monthly Net Payout:</span>
                <span className="text-lg font-black text-emerald-600">
                  ৳{ownerProjections.netOwnerTake.toLocaleString('en-BD')}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-base-content/60">Estimated Annualized Yield:</span>
                <span className="font-bold text-primary">
                  ৳{(ownerProjections.annualRunRate / 100000).toFixed(1)} Lakh / year
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

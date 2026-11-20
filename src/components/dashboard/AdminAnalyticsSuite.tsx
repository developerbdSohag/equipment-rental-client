'use client';

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  GitCommit,
  Sliders,
  MapPin,
  Workflow,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Package,
  Users,
  DollarSign,
  Activity,
  Layers,
  Clock,
  Compass,
  CheckCircle2,
  Calendar,
  Filter,
  RefreshCw,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface AdminAnalyticsSuiteProps {
  analytics: any;
  rawEquipment?: any[];
  rawRentals?: any[];
}

export default function AdminAnalyticsSuite({
  analytics,
  rawEquipment = [],
  rawRentals = []
}: AdminAnalyticsSuiteProps) {
  // Navigation filter for analytics dimensions
  const [activeDimension, setActiveDimension] = useState<
    'all' | 'comparison' | 'trends' | 'distribution' | 'correlation' | 'composition' | 'process' | 'geographic' | 'simulator'
  >('all');

  // Timeframe selector for trend series
  const [timeframe, setTimeframe] = useState<'monthly' | 'quarterly' | 'forecast'>('monthly');

  // Selected Bangladesh Division for Geographic deep-dive
  const [selectedDivision, setSelectedDivision] = useState<string>('dhaka');

  // What-If Scenario Simulator state
  const [simulatorParams, setSimulatorParams] = useState({
    fleetSize: 28,
    dailyRate: 42000,
    utilization: 75,
    rentalDuration: 12,
    commissionRate: 10
  });

  // Simulator preset handlers
  const applyPreset = (preset: 'conservative' | 'balanced' | 'mega' | 'corridor') => {
    if (preset === 'conservative') {
      setSimulatorParams({
        fleetSize: 15,
        dailyRate: 26000,
        utilization: 55,
        rentalDuration: 7,
        commissionRate: 10
      });
    } else if (preset === 'balanced') {
      setSimulatorParams({
        fleetSize: 35,
        dailyRate: 42000,
        utilization: 75,
        rentalDuration: 12,
        commissionRate: 10
      });
    } else if (preset === 'mega') {
      setSimulatorParams({
        fleetSize: 75,
        dailyRate: 68000,
        utilization: 85,
        rentalDuration: 21,
        commissionRate: 12
      });
    } else if (preset === 'corridor') {
      setSimulatorParams({
        fleetSize: 120,
        dailyRate: 85000,
        utilization: 92,
        rentalDuration: 30,
        commissionRate: 15
      });
    }
  };

  // Real-time calculation of What-If Simulator results
  const simulatedResults = useMemo(() => {
    const { fleetSize, dailyRate, utilization, commissionRate } = simulatorParams;
    const monthlyActiveDays = 30 * (utilization / 100);
    const monthlyGrossRevenue = Math.round(fleetSize * monthlyActiveDays * dailyRate);
    const platformCommission = Math.round(monthlyGrossRevenue * (commissionRate / 100));
    const ownerPayout = monthlyGrossRevenue - platformCommission;
    const annualizedRunRate = monthlyGrossRevenue * 12;
    // Estimated capital investment per machine in Bangladesh market ~৳35,00,000
    const totalFleetCapEx = fleetSize * 3500000;
    const estimatedPaybackMonths = monthlyGrossRevenue > 0 ? (totalFleetCapEx / monthlyGrossRevenue).toFixed(1) : '0';
    const annualizedROI = totalFleetCapEx > 0 ? Math.round((annualizedRunRate / totalFleetCapEx) * 100) : 0;

    return {
      monthlyGrossRevenue,
      platformCommission,
      ownerPayout,
      annualizedRunRate,
      estimatedPaybackMonths,
      annualizedROI
    };
  }, [simulatorParams]);

  // Fallback data structures if API is still generating
  const comparisonData = analytics?.comparisonStats || {
    monthlyRevenue: { actual: 340000, target: 300000, variancePct: 13.3, growthPct: 28.4 },
    bookings: { actual: 26, target: 20, variancePct: 30.0, growthPct: 25.0 },
    utilizationRate: { actual: 76.4, target: 70.0, variancePct: 9.1 },
    customerSatisfaction: { actual: 96.8, target: 92.0, variancePct: 5.2 },
    categoryBenchmarks: [
      { category: 'Excavators', actualRevenue: 148500, targetRevenue: 125000, operatingCost: 32000, marginPct: 78.5 },
      { category: 'Cranes', actualRevenue: 112000, targetRevenue: 95000, operatingCost: 28000, marginPct: 75.0 },
      { category: 'Generators', actualRevenue: 78000, targetRevenue: 70000, operatingCost: 15500, marginPct: 80.1 },
      { category: 'Loaders', actualRevenue: 64500, targetRevenue: 60000, operatingCost: 14000, marginPct: 78.3 },
      { category: 'Forklifts', actualRevenue: 52000, targetRevenue: 48000, operatingCost: 11000, marginPct: 78.8 },
      { category: 'Mixers & Trucks', actualRevenue: 44000, targetRevenue: 40000, operatingCost: 9800, marginPct: 77.7 }
    ]
  };

  const trendData = analytics?.trendSeries || [
    { label: 'Jun 2026', revenue: 95000, target: 85000, bookings: 7, utilization: 58, isForecast: false },
    { label: 'Jul 2026', revenue: 125000, target: 110000, bookings: 10, utilization: 64, isForecast: false },
    { label: 'Aug 2026', revenue: 160000, target: 140000, bookings: 13, utilization: 69, isForecast: false },
    { label: 'Sep 2026', revenue: 210000, target: 180000, bookings: 16, utilization: 73, isForecast: false },
    { label: 'Oct 2026', revenue: 275000, target: 240000, bookings: 21, utilization: 78, isForecast: false },
    { label: 'Nov 2026', revenue: 340000, target: 300000, bookings: 26, utilization: 84, isForecast: false },
    { label: 'Dec 2026 (Fcst)', revenue: 415000, target: 360000, bookings: 31, utilization: 88, isForecast: true },
    { label: 'Jan 2027 (Fcst)', revenue: 480000, target: 420000, bookings: 36, utilization: 91, isForecast: true },
    { label: 'Feb 2027 (Fcst)', revenue: 540000, target: 470000, bookings: 40, utilization: 93, isForecast: true }
  ];

  const durationData = analytics?.durationDistribution || [
    { range: '1 - 3 Days', count: 18, sharePct: 26.5, avgTicket: 34500, label: 'Express / Emergency' },
    { range: '4 - 7 Days', count: 24, sharePct: 35.3, avgTicket: 86000, label: 'Weekly Project Sprint' },
    { range: '8 - 14 Days', count: 14, sharePct: 20.6, avgTicket: 172000, label: 'Bi-Weekly Earthmoving' },
    { range: '15 - 30 Days', count: 8, sharePct: 11.8, avgTicket: 365000, label: 'Monthly Frame Civil' },
    { range: '30+ Days', count: 4, sharePct: 5.8, avgTicket: 850000, label: 'Mega Infrastructure' }
  ];

  const rateTierData = analytics?.rateTierDistribution || [
    { tier: 'Economy (<৳25k)', units: 6, avgRate: 14500, utilization: 82.5, sharePct: 28.5 },
    { tier: 'Mid-Tier (৳25k - ৳50k)', units: 8, avgRate: 36000, utilization: 78.0, sharePct: 38.1 },
    { tier: 'Heavy Tier (৳50k - ৳80k)', units: 5, avgRate: 64000, utilization: 72.4, sharePct: 23.8 },
    { tier: 'Industrial (>৳80k)', units: 2, avgRate: 98000, utilization: 65.0, sharePct: 9.6 }
  ];

  const correlationPoints = analytics?.correlationData?.length > 0 ? analytics.correlationData : [
    { name: 'CAT 320D Excavator', category: 'Excavators', dailyRate: 48000, utilizationPct: 86, bookingsCount: 9 },
    { name: 'Komatsu PC200-8', category: 'Excavators', dailyRate: 42000, utilizationPct: 89, bookingsCount: 11 },
    { name: 'Zoomlion 50T Mobile Crane', category: 'Cranes', dailyRate: 85000, utilizationPct: 74, bookingsCount: 6 },
    { name: 'Sany 25T Hydraulic Crane', category: 'Cranes', dailyRate: 58000, utilizationPct: 80, bookingsCount: 8 },
    { name: 'Perkins 250kVA Generator', category: 'Generators', dailyRate: 24000, utilizationPct: 92, bookingsCount: 14 },
    { name: 'Cummins 500kVA Heavy Gen', category: 'Generators', dailyRate: 38000, utilizationPct: 85, bookingsCount: 10 },
    { name: 'Toyota 3T Diesel Forklift', category: 'Forklifts', dailyRate: 16500, utilizationPct: 94, bookingsCount: 16 },
    { name: 'Manitou 4T Rough Terrain', category: 'Forklifts', dailyRate: 28000, utilizationPct: 82, bookingsCount: 9 },
    { name: 'CAT 950H Wheel Loader', category: 'Loaders', dailyRate: 45000, utilizationPct: 84, bookingsCount: 8 },
    { name: 'JCB 3DX Super Backhoe', category: 'Loaders', dailyRate: 32000, utilizationPct: 90, bookingsCount: 12 },
    { name: 'Schwing Stetter 7cbm Mixer', category: 'Concrete Mixers', dailyRate: 36000, utilizationPct: 78, bookingsCount: 7 },
    { name: 'Scania R500 20T Dump Truck', category: 'Trucks', dailyRate: 29000, utilizationPct: 86, bookingsCount: 11 },
    { name: 'CAT D6R Heavy Crawler Dozer', category: 'Bulldozers', dailyRate: 72000, utilizationPct: 69, bookingsCount: 5 }
  ];

  const categoryComposition = analytics?.composition?.categoryComposition || [
    { name: 'Excavators', count: 5, pct: 24, revenue: 148500 },
    { name: 'Cranes', count: 4, pct: 19, revenue: 112000 },
    { name: 'Generators', count: 3, pct: 14, revenue: 78000 },
    { name: 'Loaders', count: 3, pct: 14, revenue: 64500 },
    { name: 'Forklifts', count: 2, pct: 10, revenue: 52000 },
    { name: 'Concrete Mixers', count: 2, pct: 10, revenue: 44000 },
    { name: 'Trucks & Haulers', count: 2, pct: 9, revenue: 41000 }
  ];

  const regionalRevenue = analytics?.composition?.regionalRevenue || [
    { division: 'Dhaka Division', sharePct: 44, revenue: 242000, activeHubs: 'Tejgaon, Tongi, Savar EPZ' },
    { division: 'Chattogram Division', sharePct: 28, revenue: 154000, activeHubs: 'Agrabad, Sitakunda, Matarbari' },
    { division: 'Sylhet Division', sharePct: 11, revenue: 60500, activeHubs: 'Osmani Nagar, Habiganj' },
    { division: 'Khulna Division', sharePct: 8, revenue: 44000, activeHubs: 'Mongla Port, Rupsha' },
    { division: 'Rajshahi Division', sharePct: 5, revenue: 27500, activeHubs: 'Rooppur, Bogura Highway' },
    { division: 'Others', sharePct: 4, revenue: 22000, activeHubs: 'Saidpur, Payra, Valuka' }
  ];

  const lifecycleFunnel = analytics?.lifecycleFunnel || [
    { step: 1, stage: 'Rental Requests & RFQs', count: 148, conversionPct: 100, dropoffPct: 0, medianTime: '0.0 hrs', status: 'Inquiry' },
    { step: 2, stage: 'KYC & Escrow Secured', count: 126, conversionPct: 85.1, dropoffPct: 14.9, medianTime: '2.4 hrs', status: 'Escrow Confirmed' },
    { step: 3, stage: 'Transit Logistics Dispatch', count: 114, conversionPct: 77.0, dropoffPct: 8.1, medianTime: '5.2 hrs', status: 'In Transit' },
    { step: 4, stage: 'Active On-Site Commissioning', count: 104, conversionPct: 70.3, dropoffPct: 6.7, medianTime: '12.4 days', status: 'Operational' },
    { step: 5, stage: 'Return Demobilization', count: 98, conversionPct: 66.2, dropoffPct: 4.1, medianTime: '4.1 hrs', status: 'Returned' },
    { step: 6, stage: 'Post-Inspection & Bond Release', count: 95, conversionPct: 64.2, dropoffPct: 2.0, medianTime: '1.6 hrs', status: 'Completed' }
  ];

  const geographicDemand = analytics?.geographicDemand || [
    {
      division: 'Dhaka Division',
      key: 'dhaka',
      hubs: 'Tejgaon Industrial, Tongi Gazipur, Savar EPZ, Narayanganj',
      units: 9,
      activeRentals: 7,
      revenue: 242000,
      utilizationRate: 84.5,
      demandScore: 98,
      growth: '+32.4% MoM'
    },
    {
      division: 'Chattogram Division',
      key: 'chattogram',
      hubs: 'Agrabad C/A, Sitakunda Shipbreaking, Matarbari Power, Cox\'s Bazar',
      units: 6,
      activeRentals: 5,
      revenue: 154000,
      utilizationRate: 78.2,
      demandScore: 91,
      growth: '+26.8% MoM'
    },
    {
      division: 'Sylhet Division',
      key: 'sylhet',
      hubs: 'Osmani Nagar, Habiganj Gas Hub, Bibiyana Expansion',
      units: 3,
      activeRentals: 2,
      revenue: 60500,
      utilizationRate: 72.0,
      demandScore: 78,
      growth: '+18.5% MoM'
    },
    {
      division: 'Khulna Division',
      key: 'khulna',
      hubs: 'Mongla Seaport, Rupsha Industrial, Rampal Corridor',
      units: 2,
      activeRentals: 1,
      revenue: 44000,
      utilizationRate: 68.4,
      demandScore: 72,
      growth: '+14.2% MoM'
    },
    {
      division: 'Rajshahi Division',
      key: 'rajshahi',
      hubs: 'Rooppur Nuclear Energy Zone, Bogura Highway Bypass',
      units: 2,
      activeRentals: 2,
      revenue: 38000,
      utilizationRate: 65.0,
      demandScore: 69,
      growth: '+12.0% MoM'
    },
    {
      division: 'Rangpur Division',
      key: 'rangpur',
      hubs: 'Saidpur Airport Cargo, Dinajpur Agro-Processing',
      units: 1,
      activeRentals: 1,
      revenue: 22000,
      utilizationRate: 60.5,
      demandScore: 61,
      growth: '+9.4% MoM'
    },
    {
      division: 'Barishal Division',
      key: 'barishal',
      hubs: 'Payra Deep-Sea Port, Bhola River Crossing',
      units: 1,
      activeRentals: 1,
      revenue: 19500,
      utilizationRate: 57.0,
      demandScore: 58,
      growth: '+8.1% MoM'
    },
    {
      division: 'Mymensingh Division',
      key: 'mymensingh',
      hubs: 'Valuka Garments Hub, Netrokona Haor Logistics',
      units: 1,
      activeRentals: 1,
      revenue: 16500,
      utilizationRate: 54.0,
      demandScore: 54,
      growth: '+7.5% MoM'
    }
  ];

  const currentDivisionData = geographicDemand.find((d: any) => d.key === selectedDivision) || geographicDemand[0];

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#64748b'];

  return (
    <div className="space-y-10 animate-fade-in">
      
      {/* =========================================================================
          TOP ANALYTICS CONTROL BAR & SUB-NAVIGATION
      ========================================================================= */}
      <div className="bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Advanced BI & Operations Matrix
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
              All Figures in Bangladeshi Taka (৳ BDT)
            </span>
          </div>
          <h2 className="text-2xl font-black text-base-content tracking-tight">
            Equipment Marketplace Intelligence Hub
          </h2>
          <p className="text-xs text-base-content/60">
            Real-time telemetry, target variance benchmarks, geographic demand across Bangladesh, and predictive forecasting.
          </p>
        </div>

        {/* Currency & Quick Stats Tag */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-base-200 border border-base-300 text-xs font-semibold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Stream: 21 Machines Active</span>
          </div>
          <button
            onClick={() => setActiveDimension('simulator')}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-primary to-blue-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Sliders className="w-4 h-4" />
            <span>Launch What-If Simulator</span>
          </button>
        </div>
      </div>

      {/* Analytical Dimension Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-base-300 pb-3 overflow-x-auto no-scrollbar">
        {[
          { key: 'all', label: 'All Dimensions', icon: Layers },
          { key: 'comparison', label: '1. Comparison Analysis', icon: BarChart3 },
          { key: 'trends', label: '2. Trends & Forecast', icon: TrendingUp },
          { key: 'distribution', label: '3. Distribution Analysis', icon: Activity },
          { key: 'correlation', label: '4. Correlation & Elasticity', icon: GitCommit },
          { key: 'composition', label: '5. Composition (Part-to-Whole)', icon: PieChartIcon },
          { key: 'process', label: '6. Lifecycle & Schedule', icon: Workflow },
          { key: 'geographic', label: '7. Bangladesh Geographic', icon: MapPin },
          { key: 'simulator', label: '8. Hypothetical Simulator', icon: Sliders }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeDimension === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveDimension(tab.key as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/25 scale-[1.02]'
                  : 'bg-base-100 hover:bg-base-200 text-base-content/70 border border-base-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          EXECUTIVE KPI SUMMARY METRIC TILES
      ========================================================================= */}
      {(activeDimension === 'all' || activeDimension === 'comparison') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Total Revenue */}
          <div className="p-6 rounded-3xl bg-base-100 border border-base-300 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-base-content/50 tracking-wider">Gross Platform GMV</span>
                <p className="text-3xl font-black text-base-content mt-1">
                  ৳{(comparisonData.monthlyRevenue.actual || 340000).toLocaleString('en-BD')}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-base-200 flex items-center justify-between text-xs">
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{comparisonData.monthlyRevenue.growthPct}% MoM
              </span>
              <span className="text-base-content/60">
                Target: ৳{(comparisonData.monthlyRevenue.target || 300000).toLocaleString('en-BD')}
              </span>
            </div>
          </div>

          {/* Card 2: Fleet Utilization */}
          <div className="p-6 rounded-3xl bg-base-100 border border-base-300 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-base-content/50 tracking-wider">Fleet Utilization Rate</span>
                <p className="text-3xl font-black text-blue-600 mt-1">
                  {comparisonData.utilizationRate.actual}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-base-200 flex items-center justify-between text-xs">
              <span className="text-blue-600 font-bold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{comparisonData.utilizationRate.variancePct}% vs Bench
              </span>
              <span className="text-base-content/60">Target: {comparisonData.utilizationRate.target}%</span>
            </div>
          </div>

          {/* Card 3: Total Bookings */}
          <div className="p-6 rounded-3xl bg-base-100 border border-base-300 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-base-content/50 tracking-wider">Executed Rentals</span>
                <p className="text-3xl font-black text-amber-500 mt-1">
                  {comparisonData.bookings.actual} Bookings
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-base-200 flex items-center justify-between text-xs">
              <span className="text-amber-600 font-bold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{comparisonData.bookings.growthPct}% Volume
              </span>
              <span className="text-base-content/60">Target: {comparisonData.bookings.target}</span>
            </div>
          </div>

          {/* Card 4: Customer Satisfaction & NPS */}
          <div className="p-6 rounded-3xl bg-base-100 border border-base-300 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-base-content/50 tracking-wider">Client Trust & NPS</span>
                <p className="text-3xl font-black text-emerald-600 mt-1">
                  {comparisonData.customerSatisfaction.actual}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-base-200 flex items-center justify-between text-xs">
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Operators
              </span>
              <span className="text-base-content/60">Target: {comparisonData.customerSatisfaction.target}%</span>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          DIMENSION 1: COMPARISON ANALYSIS (Target vs Actual, Benchmarks)
      ========================================================================= */}
      {(activeDimension === 'all' || activeDimension === 'comparison') && (
        <div className="bg-base-100 p-8 rounded-3xl border border-base-300 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold uppercase">
                  Analysis 1 of 8
                </span>
                <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Comparison Analysis: Target vs. Actual & Operational Benchmarks
                </h3>
              </div>
              <p className="text-xs text-base-content/60 mt-1">
                Evaluation of actual platform revenue against strategic target projections and operating expense benchmarks across machinery sectors.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-bold">
                Attainment: 113.3% of Target
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Chart: Target vs Actual Gross Revenue */}
            <div className="lg:col-span-7 h-80 w-full">
              <p className="text-xs font-bold text-base-content/70 mb-2">Monthly Target vs Actual Revenue (৳ BDT)</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData.filter((d: any) => !d.isForecast)}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="label" fontSize={11} stroke="currentColor" opacity={0.6} />
                  <YAxis
                    fontSize={11}
                    stroke="currentColor"
                    opacity={0.6}
                    tickFormatter={(val) => `৳${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(val, name) => [
                      `৳${Number(val).toLocaleString('en-BD')}`,
                      name === 'revenue' ? 'Actual Revenue (৳)' : 'Target Revenue (৳)'
                    ]}
                    contentStyle={{
                      borderRadius: '1rem',
                      backgroundColor: '#111827',
                      borderColor: '#374151',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="revenue" name="Actual Revenue (৳)" fill="#10b981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="target" name="Target Revenue (৳)" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Table: Machinery Category Performance Benchmarks */}
            <div className="lg:col-span-5 space-y-4">
              <p className="text-xs font-bold text-base-content/70">Category Profitability & Margin Benchmarks</p>
              <div className="overflow-x-auto rounded-2xl border border-base-200">
                <table className="table table-xs w-full text-left">
                  <thead className="bg-base-200/60 text-base-content/70 uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Category</th>
                      <th>Actual (৳)</th>
                      <th>Target (৳)</th>
                      <th>Net Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-200 font-medium text-xs">
                    {comparisonData.categoryBenchmarks.map((cat: any, idx: number) => {
                      const isOver = cat.actualRevenue >= cat.targetRevenue;
                      return (
                        <tr key={idx} className="hover:bg-base-200/30">
                          <td className="py-2.5 px-3 font-bold text-base-content">{cat.category}</td>
                          <td className="text-emerald-600 font-bold">৳{(cat.actualRevenue / 1000).toFixed(0)}k</td>
                          <td className="text-base-content/60">৳{(cat.targetRevenue / 1000).toFixed(0)}k</td>
                          <td>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isOver ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                            }`}>
                              {cat.marginPct}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-300 flex items-center justify-between text-xs">
                <span className="text-base-content/70">Highest Margin Yield Sector:</span>
                <span className="font-extrabold text-primary">Generators (80.1% Net Margin)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DIMENSION 2: TREND & TIME-SERIES ANALYSIS WITH 90-DAY FORECAST
      ========================================================================= */}
      {(activeDimension === 'all' || activeDimension === 'trends') && (
        <div className="bg-base-100 p-8 rounded-3xl border border-base-300 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 text-[10px] font-bold uppercase">
                  Analysis 2 of 8
                </span>
                <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Trend & Time-Series Analysis: Historical Trajectory & 90-Day Predictive Forecast
                </h3>
              </div>
              <p className="text-xs text-base-content/60 mt-1">
                Multi-metric longitudinal performance with algorithmic forecast projection through February 2027.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>+22.0% Projected Q4 Acceleration</span>
              </span>
            </div>
          </div>

          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="label" fontSize={11} stroke="currentColor" opacity={0.6} />
                <YAxis
                  yAxisId="left"
                  fontSize={11}
                  stroke="currentColor"
                  opacity={0.6}
                  tickFormatter={(val) => `৳${(val / 1000).toFixed(0)}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  fontSize={11}
                  stroke="currentColor"
                  opacity={0.6}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  formatter={(val, name) => [
                    name === 'revenue'
                      ? `৳${Number(val).toLocaleString('en-BD')}`
                      : name === 'utilization'
                      ? `${val}%`
                      : val,
                    name === 'revenue'
                      ? 'Revenue (৳ BDT)'
                      : name === 'utilization'
                      ? 'Fleet Utilization %'
                      : 'Bookings Volume'
                  ]}
                  contentStyle={{
                    borderRadius: '1rem',
                    backgroundColor: '#111827',
                    borderColor: '#374151',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  name="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                />
                <Bar
                  yAxisId="left"
                  dataKey="bookings"
                  name="bookings"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="utilization"
                  name="utilization"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  strokeDasharray="4 4"
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300">
              <span className="text-[10px] uppercase font-bold text-base-content/50">30-Day Growth Forecast</span>
              <p className="text-xl font-black text-blue-600 mt-0.5">৳4,15,000</p>
              <p className="text-[11px] text-base-content/60 mt-1">December 2026 projected revenue mobilization.</p>
            </div>
            <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300">
              <span className="text-[10px] uppercase font-bold text-base-content/50">Peak Utilization Forecast</span>
              <p className="text-xl font-black text-amber-500 mt-0.5">93.0% Fleet Peak</p>
              <p className="text-[11px] text-base-content/60 mt-1">Anticipated peak load during dry-season civil works.</p>
            </div>
            <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300">
              <span className="text-[10px] uppercase font-bold text-base-content/50">Compound Monthly Velocity</span>
              <p className="text-xl font-black text-emerald-600 mt-0.5">+24.8% CAGR</p>
              <p className="text-[11px] text-base-content/60 mt-1">Expansion momentum driven by divisional logistics hubs.</p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DIMENSION 3: DISTRIBUTION ANALYSIS (Duration & Pricing Tier Histograms)
      ========================================================================= */}
      {(activeDimension === 'all' || activeDimension === 'distribution') && (
        <div className="bg-base-100 p-8 rounded-3xl border border-base-300 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase">
                  Analysis 3 of 8
                </span>
                <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-500" />
                  Distribution Analysis: Rental Durations & Equipment Pricing Tiers
                </h3>
              </div>
              <p className="text-xs text-base-content/60 mt-1">
                Frequency histogram distribution across rental contract duration windows and daily rental pricing brackets in ৳ BDT.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart 1: Duration Distribution Histogram */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-base-content/70">Rental Contract Duration Distribution</p>
                <span className="text-[10px] text-base-content/50">Median: 6.8 Days</span>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={durationData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="range" fontSize={10} stroke="currentColor" opacity={0.6} />
                    <YAxis fontSize={10} stroke="currentColor" opacity={0.6} />
                    <Tooltip
                      formatter={(val, name, item: any) => [
                        `${val} Bookings (Avg: ৳${Number(item?.payload?.avgTicket || 0).toLocaleString('en-BD')})`,
                        'Rental Volume'
                      ]}
                      contentStyle={{
                        borderRadius: '1rem',
                        backgroundColor: '#111827',
                        borderColor: '#374151',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]}>
                      {durationData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[11px] text-base-content/60 text-center">
                Primary cluster: <span className="font-bold text-base-content">4 - 7 Days (35.3%)</span> representing weekly site prep and civil milestones.
              </p>
            </div>

            {/* Chart 2: Pricing Tier Distribution */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-base-content/70">Machinery Daily Pricing Tiers (৳ BDT)</p>
                <span className="text-[10px] text-base-content/50">4 Categorical Tiers</span>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rateTierData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="tier" fontSize={10} stroke="currentColor" opacity={0.6} />
                    <YAxis fontSize={10} stroke="currentColor" opacity={0.6} />
                    <Tooltip
                      formatter={(val, name, item: any) => [
                        `${val} Machines listed (Avg Rate: ৳${Number(item?.payload?.avgRate || 0).toLocaleString('en-BD')}/day, Util: ${item?.payload?.utilization}%)`,
                        'Fleet Units'
                      ]}
                      contentStyle={{
                        borderRadius: '1rem',
                        backgroundColor: '#111827',
                        borderColor: '#374151',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="units" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[11px] text-base-content/60 text-center">
                Highest fleet concentration in <span className="font-bold text-base-content">Mid-Tier (৳25k - ৳50k)</span> with 78% average occupancy.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DIMENSION 4: RELATIONSHIP & CORRELATION ANALYSIS (Scatter & Elasticity)
      ========================================================================= */}
      {(activeDimension === 'all' || activeDimension === 'correlation') && (
        <div className="bg-base-100 p-8 rounded-3xl border border-base-300 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-600 text-[10px] font-bold uppercase">
                  Analysis 4 of 8
                </span>
                <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
                  <GitCommit className="w-5 h-5 text-violet-600" />
                  Relationship & Correlation Analysis: Daily Rate vs. Equipment Utilization Rate
                </h3>
              </div>
              <p className="text-xs text-base-content/60 mt-1">
                Scatter elasticity analysis examining correlation between machine rental rate (৳ BDT) and actual utilization percentage.
              </p>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-violet-500/10 text-violet-600 text-xs font-bold">
              Optimal Corridor: ৳35k - ৳55k / Day
            </div>
          </div>

          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis
                  type="number"
                  dataKey="dailyRate"
                  name="Daily Rental Rate"
                  unit=" ৳"
                  fontSize={11}
                  stroke="currentColor"
                  opacity={0.6}
                  tickFormatter={(val) => `৳${(val / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="number"
                  dataKey="utilizationPct"
                  name="Utilization %"
                  unit="%"
                  fontSize={11}
                  stroke="currentColor"
                  opacity={0.6}
                  domain={[40, 100]}
                />
                <ZAxis type="number" dataKey="bookingsCount" range={[60, 300]} name="Rental Volume" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-gray-900 text-white p-3.5 rounded-2xl border border-gray-700 shadow-xl text-xs space-y-1">
                          <p className="font-black text-sm text-primary">{data.name}</p>
                          <p className="text-gray-300">Category: <span className="font-semibold text-white">{data.category}</span></p>
                          <p className="text-emerald-400 font-bold">Daily Rate: ৳{Number(data.dailyRate).toLocaleString('en-BD')} / day</p>
                          <p className="text-amber-400 font-bold">Utilization: {data.utilizationPct}%</p>
                          <p className="text-blue-300">Booking Frequency: {data.bookingsCount} completed contracts</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Machinery Units" data={correlationPoints} fill="#8b5cf6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center font-bold shrink-0">
                α
              </span>
              <div>
                <p className="font-bold text-base-content">Elasticity Sweet-Spot Indicator</p>
                <p className="text-base-content/60">Machinery priced between ৳35,000 and ৳55,000 achieves maximum 84.5% fleet utilization with peak gross margin.</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-base-100 border border-base-300 font-bold text-emerald-600">
              Pearson R: -0.42 (Optimal Elasticity)
            </span>
          </div>
        </div>
      )}

      {/* =========================================================================
          DIMENSION 5: COMPOSITION (PART-TO-WHOLE) ANALYSIS (Donut & Shares)
      ========================================================================= */}
      {(activeDimension === 'all' || activeDimension === 'composition') && (
        <div className="bg-base-100 p-8 rounded-3xl border border-base-300 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-pink-500/10 text-pink-600 text-[10px] font-bold uppercase">
                  Analysis 5 of 8
                </span>
                <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-pink-500" />
                  Composition (Part-to-Whole) Analysis: Fleet Category Share & Revenue Split
                </h3>
              </div>
              <p className="text-xs text-base-content/60 mt-1">
                Structural breakdown of listed machinery inventory, division revenue shares, and payment channel distribution.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Donut Chart */}
            <div className="lg:col-span-5 h-72 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    formatter={(val, name, item: any) => [
                      `${val} Units (${item?.payload?.pct}%) - ৳${Number(item?.payload?.revenue || 0).toLocaleString('en-BD')} GMV`,
                      name
                    ]}
                    contentStyle={{
                      borderRadius: '1rem',
                      backgroundColor: '#111827',
                      borderColor: '#374151',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Pie
                    data={categoryComposition}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                  >
                    {categoryComposition.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Inner Center Metric */}
              <div className="absolute text-center pointer-events-none">
                <p className="text-2xl font-black text-base-content">
                  {categoryComposition.reduce((sum: number, c: any) => sum + (c.count || 0), 0)}
                </p>
                <p className="text-[10px] uppercase font-bold text-base-content/50">Active Fleet</p>
              </div>
            </div>

            {/* Category Breakdown Progress Bars & Legends */}
            <div className="lg:col-span-7 space-y-3.5">
              <p className="text-xs font-bold text-base-content/70">Category Share & Revenue Contribution (৳ BDT)</p>
              <div className="space-y-2.5">
                {categoryComposition.map((cat: any, idx: number) => {
                  const color = COLORS[idx % COLORS.length];
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
                          <span className="font-bold text-base-content">{cat.name}</span>
                          <span className="text-[10px] text-base-content/50">({cat.count} units)</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="font-bold text-emerald-600">৳{Number(cat.revenue).toLocaleString('en-BD')}</span>
                          <span className="text-[11px] text-base-content/60 font-semibold">{cat.pct}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-base-200 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${cat.pct}%`, backgroundColor: color }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DIMENSION 6: PROCESS, FLOW & SCHEDULE ANALYSIS (Lifecycle Funnel)
      ========================================================================= */}
      {(activeDimension === 'all' || activeDimension === 'process') && (
        <div className="bg-base-100 p-8 rounded-3xl border border-base-300 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase">
                  Analysis 6 of 8
                </span>
                <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
                  <Workflow className="w-5 h-5 text-emerald-600" />
                  Process, Flow & Schedule Analysis: 6-Stage Rental Lifecycle Funnel
                </h3>
              </div>
              <p className="text-xs text-base-content/60 mt-1">
                End-to-end operational pipeline conversion from initial equipment quote request to post-rental inspection and security bond release.
              </p>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-bold">
              Median Cycle: 1.8 hrs to Dispatch
            </div>
          </div>

          {/* Funnel Pipeline Visualizer */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 pt-2">
            {lifecycleFunnel.map((stage: any, idx: number) => {
              const isFirst = idx === 0;
              const isLast = idx === lifecycleFunnel.length - 1;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-base-200/50 border border-base-300 relative flex flex-col justify-between hover:bg-base-200 transition-all group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-black flex items-center justify-center">
                        0{stage.step}
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-600">
                        {stage.conversionPct}%
                      </span>
                    </div>
                    <p className="text-xs font-bold text-base-content leading-snug pt-1">
                      {stage.stage}
                    </p>
                    <p className="text-lg font-black text-primary">
                      {stage.count} <span className="text-[10px] font-normal text-base-content/50">events</span>
                    </p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-base-300 text-[10px] text-base-content/60 flex items-center justify-between">
                    <span>Turnaround:</span>
                    <span className="font-bold text-base-content">{stage.medianTime}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fleet Status Snapshot */}
          <div className="p-5 rounded-2xl bg-base-200/40 border border-base-300 flex flex-wrap items-center justify-between gap-4 text-xs">
            <span className="font-bold text-base-content flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Live Machinery Deployment Allocation:
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Active on Site: 62%
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-blue-600">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Available in Depot: 24%
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-amber-500">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                In Transit Logistics: 9%
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-base-content/60">
                <span className="w-2 h-2 rounded-full bg-base-content/40"></span>
                Preventive Maintenance: 5%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DIMENSION 7: GEOGRAPHIC & SPATIAL ANALYSIS (All 8 Bangladesh Divisions)
      ========================================================================= */}
      {(activeDimension === 'all' || activeDimension === 'geographic') && (
        <div className="bg-base-100 p-8 rounded-3xl border border-base-300 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase">
                  Analysis 7 of 8
                </span>
                <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  Geographic & Spatial Analysis: Deployment Across All 8 Bangladesh Divisions
                </h3>
              </div>
              <p className="text-xs text-base-content/60 mt-1">
                Regional demand intensity, active industrial hubs, fleet density, and revenue distribution across Bangladesh.
              </p>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-bold">
              8 Divisions • National Coverage
            </div>
          </div>

          {/* Division Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {geographicDemand.map((div: any) => {
              const isSelected = selectedDivision === div.key;
              return (
                <button
                  key={div.key}
                  onClick={() => setSelectedDivision(div.key)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'bg-primary text-white border-primary shadow-md scale-[1.03]'
                      : 'bg-base-200/50 hover:bg-base-200 border-base-300 text-base-content'
                  }`}
                >
                  <p className="text-xs font-black truncate">{div.division.replace(' Division', '')}</p>
                  <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-base-content/60'}`}>
                    {div.units} Units
                  </p>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Division Insight Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-base-200 via-base-200 to-base-300/40 border border-base-300 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 space-y-2">
              <span className="text-[10px] uppercase font-bold text-primary tracking-wider">
                Regional Focus Hub
              </span>
              <h4 className="text-2xl font-black text-base-content">
                {currentDivisionData.division}
              </h4>
              <p className="text-xs text-base-content/70">
                <span className="font-bold text-base-content">Key Industrial Corridors: </span>
                {currentDivisionData.hubs}
              </p>
              <div className="pt-2 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold">
                  Growth: {currentDivisionData.growth}
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-bold">
                  Demand Index: {currentDivisionData.demandScore}/100
                </span>
              </div>
            </div>

            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-base-100 border border-base-300">
                <span className="text-[10px] uppercase font-bold text-base-content/50">Regional GMV</span>
                <p className="text-xl font-black text-emerald-600 mt-1">
                  ৳{Number(currentDivisionData.revenue).toLocaleString('en-BD')}
                </p>
                <span className="text-[10px] text-base-content/50">Stripe Settled</span>
              </div>

              <div className="p-4 rounded-2xl bg-base-100 border border-base-300">
                <span className="text-[10px] uppercase font-bold text-base-content/50">Utilization</span>
                <p className="text-xl font-black text-blue-600 mt-1">
                  {currentDivisionData.utilizationRate}%
                </p>
                <span className="text-[10px] text-base-content/50">Occupancy</span>
              </div>

              <div className="p-4 rounded-2xl bg-base-100 border border-base-300 col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-bold text-base-content/50">Active Fleet</span>
                <p className="text-xl font-black text-primary mt-1">
                  {currentDivisionData.units} Units
                </p>
                <span className="text-[10px] text-base-content/50">{currentDivisionData.activeRentals} On Site</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DIMENSION 8: HYPOTHETICAL ANALYSIS ("WHAT-IF" SCENARIO SIMULATOR)
      ========================================================================= */}
      {(activeDimension === 'all' || activeDimension === 'simulator') && (
        <div className="bg-base-100 p-8 rounded-3xl border border-base-300 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-primary to-blue-600 text-white text-[10px] font-black uppercase tracking-wider">
                  Analysis 8 of 8 • Interactive
                </span>
                <h3 className="text-xl font-black text-base-content flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-primary" />
                  Hypothetical Analysis: "What-If" Marketplace Yield & Expansion Simulator
                </h3>
              </div>
              <p className="text-xs text-base-content/60 mt-1">
                Adjust key operational parameters to simulate real-time projected gross revenue, platform take-rate, owner earnings, and capital payback periods in ৳ BDT.
              </p>
            </div>

            {/* Quick Scenario Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-base-content/60 font-semibold mr-1">Presets:</span>
              <button
                onClick={() => applyPreset('conservative')}
                className="px-2.5 py-1 rounded-lg bg-base-200 hover:bg-base-300 text-base-content text-[11px] font-bold transition-all"
              >
                Conservative Base
              </button>
              <button
                onClick={() => applyPreset('balanced')}
                className="px-2.5 py-1 rounded-lg bg-base-200 hover:bg-base-300 text-base-content text-[11px] font-bold transition-all"
              >
                Balanced Urban
              </button>
              <button
                onClick={() => applyPreset('mega')}
                className="px-2.5 py-1 rounded-lg bg-base-200 hover:bg-base-300 text-base-content text-[11px] font-bold transition-all"
              >
                Mega Infrastructure
              </button>
              <button
                onClick={() => applyPreset('corridor')}
                className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-bold hover:bg-primary/20 transition-all"
              >
                Padma-Karnaphuli Boom
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sliders Input Panel */}
            <div className="lg:col-span-6 space-y-5 bg-base-200/40 p-6 rounded-3xl border border-base-300">
              
              {/* Slider 1: Fleet Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-base-content">Fleet Size (Active Machinery Units)</span>
                  <span className="text-primary font-black">{simulatorParams.fleetSize} Machines</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="1"
                  value={simulatorParams.fleetSize}
                  onChange={(e) => setSimulatorParams({ ...simulatorParams, fleetSize: Number(e.target.value) })}
                  className="range range-primary range-sm w-full"
                />
                <div className="flex justify-between text-[10px] text-base-content/50">
                  <span>5 Units (Boutique)</span>
                  <span>75 Units (Standard)</span>
                  <span>150 Units (National Fleet)</span>
                </div>
              </div>

              {/* Slider 2: Average Daily Rental Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-base-content">Average Daily Rental Rate (৳ BDT)</span>
                  <span className="text-emerald-600 font-black">৳{simulatorParams.dailyRate.toLocaleString('en-BD')} / day</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="120000"
                  step="2500"
                  value={simulatorParams.dailyRate}
                  onChange={(e) => setSimulatorParams({ ...simulatorParams, dailyRate: Number(e.target.value) })}
                  className="range range-success range-sm w-full"
                />
                <div className="flex justify-between text-[10px] text-base-content/50">
                  <span>৳10,000 (Light)</span>
                  <span>৳65,000 (Heavy)</span>
                  <span>৳120,000 (Mega Crane)</span>
                </div>
              </div>

              {/* Slider 3: Target Utilization Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-base-content">Target Fleet Utilization Rate</span>
                  <span className="text-blue-600 font-black">{simulatorParams.utilization}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="95"
                  step="1"
                  value={simulatorParams.utilization}
                  onChange={(e) => setSimulatorParams({ ...simulatorParams, utilization: Number(e.target.value) })}
                  className="range range-info range-sm w-full"
                />
                <div className="flex justify-between text-[10px] text-base-content/50">
                  <span>20% (Monsoon Slack)</span>
                  <span>65% (Benchmark)</span>
                  <span>95% (Peak Infrastructure)</span>
                </div>
              </div>

              {/* Slider 4: Platform Take-Rate Commission */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-base-content">Platform Commission Take-Rate</span>
                  <span className="text-amber-500 font-black">{simulatorParams.commissionRate}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="20"
                  step="1"
                  value={simulatorParams.commissionRate}
                  onChange={(e) => setSimulatorParams({ ...simulatorParams, commissionRate: Number(e.target.value) })}
                  className="range range-warning range-sm w-full"
                />
                <div className="flex justify-between text-[10px] text-base-content/50">
                  <span>5% (Partner Tier)</span>
                  <span>10% (Standard)</span>
                  <span>20% (Managed Fleet)</span>
                </div>
              </div>

            </div>

            {/* Dynamic Results Display Panel */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 via-base-100 to-base-200 border-2 border-primary/30 shadow-lg space-y-6">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-primary tracking-wider">
                    Simulated Output Matrix
                  </span>
                  <p className="text-xs text-base-content/60">
                    Real-time projected platform revenue and partner yields based on current slider parameters.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-base-100 border border-base-300">
                    <span className="text-[10px] uppercase font-bold text-base-content/50">Monthly Gross Volume</span>
                    <p className="text-2xl font-black text-emerald-600 mt-1">
                      ৳{simulatedResults.monthlyGrossRevenue.toLocaleString('en-BD')}
                    </p>
                    <span className="text-[10px] text-base-content/60">Per 30-Day Operational Cycle</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-base-100 border border-base-300">
                    <span className="text-[10px] uppercase font-bold text-base-content/50">Annualized Run-Rate (ARR)</span>
                    <p className="text-2xl font-black text-primary mt-1">
                      ৳{(simulatedResults.annualizedRunRate / 10000000).toFixed(2)} Cr
                    </p>
                    <span className="text-[10px] text-base-content/60">৳{simulatedResults.annualizedRunRate.toLocaleString('en-BD')}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-base-100 border border-base-300">
                    <span className="text-[10px] uppercase font-bold text-base-content/50">Platform Take Revenue</span>
                    <p className="text-2xl font-black text-amber-500 mt-1">
                      ৳{simulatedResults.platformCommission.toLocaleString('en-BD')}
                    </p>
                    <span className="text-[10px] text-base-content/60">Net Platform Commission</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-base-100 border border-base-300">
                    <span className="text-[10px] uppercase font-bold text-base-content/50">Owner Net Payouts</span>
                    <p className="text-2xl font-black text-blue-600 mt-1">
                      ৳{simulatedResults.ownerPayout.toLocaleString('en-BD')}
                    </p>
                    <span className="text-[10px] text-base-content/60">Equipment Owner Earnings</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-base-100/80 border border-base-300 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-base-content">Estimated Asset Payback Period:</p>
                    <p className="text-base-content/60">Based on standard Bangladeshi equipment replacement CAPEX.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-emerald-600">{simulatedResults.estimatedPaybackMonths} Months</span>
                    <p className="text-[10px] font-bold text-base-content/50">ROI: {simulatedResults.annualizedROI}% Annualized</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

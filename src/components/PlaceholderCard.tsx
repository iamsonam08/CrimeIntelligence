/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Map, 
  Network, 
  TrendingUp, 
  ChevronRight, 
  Database, 
  Bell, 
  Fingerprint,
  Radio,
  Eye,
  Info,
  Compass,
  Link as LinkIcon,
  Shield,
  Activity,
  UserCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Send,
  SlidersHorizontal,
  RefreshCw,
  PlusCircle,
  Users,
  MapPin
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

interface PlaceholderCardProps {
  label: string;
  className?: string;
  id?: string;
  realValue?: number | string;
  realAlerts?: Array<{ district: string; crime_type: string; severity: string; z_score: number }>;
  realHotspots?: Array<{ district: string; crime_count: number; top_crime_type: string; center_lat: number; center_lon: number }>;
  realRisk?: Array<{ district: string; risk_score: number; risk_level: string; recent_90d_crimes: number }>;
}

const Sparkline = ({ points, color }: { points: number[]; color: string }) => {
  const width = 100;
  const height = 30;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  
  const coordinates = points.map((p, index) => {
    const x = (index / (points.length - 1)) * width;
    const y = height - ((p - min) / range) * (height - 4) - 2;
    return { x, y };
  });
  
  const linePath = coordinates.reduce((acc, coord, idx) => {
    return idx === 0 ? `M ${coord.x} ${coord.y}` : `${acc} L ${coord.x} ${coord.y}`;
  }, "");
  
  const areaPath = linePath ? `${linePath} L ${width} ${height} L 0 ${height} Z` : "";
  const gradId = `spark-grad-${color.replace('#', '')}`;
  
  return (
    <svg className="w-24 h-8 overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {areaPath && (
        <path d={areaPath} fill={`url(#${gradId})`} className="transition-all duration-300" />
      )}
      {linePath && (
        <path 
          d={linePath} 
          fill="none" 
          stroke={color} 
          strokeWidth="1.75" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="transition-all duration-300"
        />
      )}
    </svg>
  );
};

export function PlaceholderCard({ label, className = '', id, realValue, realAlerts, realHotspots, realRisk }: PlaceholderCardProps) {
  const isKPICard = label.startsWith('KPI Card');

  /* -------------------------------------------------------------
   * 1. KEY PERFORMANCE INDICATORS (KPI) CARDS (Enterprise Glassmorphism)
   * ------------------------------------------------------------- */
  if (isKPICard) {
    const cardNumber = label.split(' ')[2] || '1';
    
    const kpis = [
      {
        title: 'Total Crime Cases',
        value: '1,248',
        trend: '↓ 8.4%',
        trendColor: '#3B8D72', // muted mint for decreasing crime
        updateTime: 'Last updated 2 min ago',
        status: 'SYNCED',
        color: '#796B9A', // Muted Purple
        sparkline: [142, 138, 135, 131, 129, 126, 124],
        insight: 'Patrol latency optimized',
        icon: <Shield className="w-5 h-5 text-[#796B9A]" strokeWidth={1.5} />
      },
      {
        title: 'Active Criminals',
        value: '342',
        trend: '↓ 3.1%',
        trendColor: '#3B8D72', // muted mint
        updateTime: 'Last updated 5 min ago',
        status: 'TRACKED',
        color: '#4D7FA9', // Muted Blue
        sparkline: [365, 360, 355, 348, 350, 345, 342],
        insight: '14 apprehensions this week',
        icon: <Users className="w-5 h-5 text-[#4D7FA9]" strokeWidth={1.5} />
      },
      {
        title: 'High Risk Areas',
        value: '14 Sectors',
        trend: '↑ 1.2%',
        trendColor: '#C0832F', // muted amber
        updateTime: 'Last updated 10 min ago',
        status: 'ALERTED',
        color: '#C0832F', // Muted Amber
        sparkline: [12, 13, 13, 14, 14, 13, 14],
        insight: 'Sector 4 anomaly detected',
        icon: <MapPin className="w-5 h-5 text-[#C0832F]" strokeWidth={1.5} />
      },
      {
        title: 'Active Alerts',
        value: '18',
        trend: '+5.3%',
        trendColor: '#C65555', // muted coral
        updateTime: 'Last updated 1 min ago',
        status: 'CRITICAL',
        color: '#C65555', // Muted Coral
        sparkline: [8, 12, 15, 14, 18, 16, 18],
        insight: '9 pending dispatcher signoff',
        icon: <Bell className="w-5 h-5 text-[#C65555]" strokeWidth={1.5} />
      }
    ];
    
    const index = parseInt(cardNumber) - 1;
    const item = kpis[index] || kpis[0];
    const displayValue = (realValue !== undefined && realValue !== null) ? realValue.toString() : item.value;

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={`soft-neumorphic p-6 relative overflow-hidden group rounded-[24px] cursor-pointer hover:-translate-y-1 hover:border-[#3B8D72]/15 transition-all duration-200 shadow-sm ${className}`}
        id={id}
      >
        {/* Soft radial glass highlights */}
        <div 
          className="absolute -right-8 -top-8 w-28 h-28 rounded-full blur-3xl opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-300 pointer-events-none animate-pulse-slow"
          style={{ backgroundColor: item.color }}
        />

        {/* Circular Icon and Update Time Indicator */}
        <div className="flex items-start justify-between mb-5">
          <div 
            className="w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300 group-hover:scale-105 shadow-sm bg-white"
            style={{ 
              borderColor: `${item.color}25` 
            }}
          >
            {item.icon}
          </div>
          
          <span className="text-[10px] font-mono text-slate-400 font-medium tracking-wide">
            {item.updateTime}
          </span>
        </div>

        {/* Numeric and Metric values */}
        <div className="space-y-4">
          <div className="space-y-1.5 text-left">
            <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-bold block leading-none">
              {item.title}
            </span>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-3xl font-extrabold text-[#1E293B] tracking-tight font-sans">
                {displayValue}
              </span>
              
              <span 
                className="text-xs font-mono font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-full border shadow-sm select-none"
                style={{ 
                  color: item.trendColor || item.color,
                  borderColor: `${item.trendColor || item.color}20`,
                  backgroundColor: `${item.trendColor || item.color}08`
                }}
              >
                {item.trend}
              </span>
            </div>
          </div>

          {/* Contextual Insight and Sparkline */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-4">
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[11px] font-sans text-slate-700 font-bold truncate leading-tight">
                {item.insight}
              </p>
              <div className="flex items-center gap-1.5 mt-1 font-mono text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.status}</span>
              </div>
            </div>

            <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Sparkline points={item.sparkline} color={item.color} />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  /* -------------------------------------------------------------
   * 2. CRIME HEATMAP (INTERACTIVE TACTICAL GIS MAP)
   * ------------------------------------------------------------- */
  if (label === 'Crime Heatmap') {
    const [selectedSector, setSelectedSector] = useState("SECTOR_ALPHA");
    const [mapOverlay, setMapOverlay] = useState<"HEAT" | "PATROL" | "INCIDENT">("HEAT");
    const [densityFilter, setDensityFilter] = useState<number>(65);

    const sectorDetails: Record<string, {
      name: string;
      risk: string;
      patrols: number;
      incidents: number;
      hotspots: string[];
      coordinates: string;
    }> = {
      SECTOR_ALPHA: {
        name: "Sector Alpha (Downtown Core)",
        risk: "HIGH",
        patrols: 8,
        incidents: 42,
        hotspots: ["Broadway Crossing", "Commercial Harbor", "Subway Line 2 Plaza"],
        coordinates: "40.7128° N, 74.0060° W"
      },
      SECTOR_DELTA: {
        name: "Sector Delta (Industrial Sector)",
        risk: "MODERATE",
        patrols: 5,
        incidents: 19,
        hotspots: ["Warehouse Gate 4", "South Canal Docks"],
        coordinates: "40.7306° N, 73.9352° W"
      }
    };

    const currentSector = sectorDetails[selectedSector] || sectorDetails.SECTOR_ALPHA;
    const topHotspots = (realHotspots || []).slice(0, 3);
    const realTargetDistrict = topHotspots[0]?.district || currentSector.name;
    const realCrimeCount = topHotspots[0]?.crime_count;
    const realHotspotNames = topHotspots.map(h => `${h.district} — ${h.top_crime_type} (${h.crime_count} cases)`);

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className={`premium-card p-6 flex flex-col justify-between wireframe-mesh min-h-[440px] ${className}`}
        id={id}
      >
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-[14px] bg-white border border-slate-200/60 shadow-sm">
              <Map className="w-5 h-5 text-[#3B8D72]" />
            </div>
            <div>
              <h3 className="text-sm font-sans font-bold text-[#1E293B] tracking-tight">{label}</h3>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest font-semibold">GEOSPATIAL VECTOR MAP MATRIX</p>
            </div>
          </div>
          
          {/* Custom Toggle Chips */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-[14px] border border-slate-200">
            {["SECTOR_ALPHA", "SECTOR_DELTA"].map((sector) => (
              <button
                key={sector}
                onClick={() => setSelectedSector(sector)}
                className={`px-3 py-1 text-[9px] font-mono rounded-[10px] transition-all duration-200 font-medium ${
                  selectedSector === sector 
                    ? 'bg-white border border-slate-200 text-[#1E293B] shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800 border border-transparent'
                }`}
              >
                {sector === "SECTOR_ALPHA" ? "Alpha Core" : "Delta Wharf"}
              </button>
            ))}
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 flex-1">
          
          {/* Left Side: Vector SVG Map Frame */}
          <div className="md:col-span-7 rounded-[20px] bg-white/80 border border-slate-200 relative p-4 flex flex-col justify-between min-h-[240px] overflow-hidden group shadow-inner">
            {/* Grid coordinates and radial layers */}
            <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(59,141,114,0.01)_0%,transparent_70%]" />
            <div className="absolute inset-0 m-auto w-36 h-36 rounded-full border border-slate-200/60 pointer-events-none" />
            <div className="absolute inset-x-4 top-1/2 h-[1px] bg-slate-100 pointer-events-none" />
            <div className="absolute inset-y-4 left-1/2 w-[1px] bg-slate-100 pointer-events-none" />

            {/* Simulated Vector Heat Boundaries or Pins */}
            <div className="absolute inset-0 pointer-events-none p-6">
              <AnimatePresence mode="wait">
                {mapOverlay === "HEAT" && (
                  <motion.div 
                    key="heat"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="w-full h-full relative"
                  >
                    <div className="absolute top-[25%] left-[30%] w-16 h-16 rounded-full bg-[#C65555]/8 animate-pulse border border-[#C65555]/20" />
                    <div className="absolute top-[29%] left-[34%] w-6 h-6 rounded-full bg-[#C65555]/30" />
                    
                    <div className="absolute bottom-[20%] right-[35%] w-24 h-24 rounded-full bg-[#C0832F]/5 border border-[#C0832F]/15" />
                    <div className="absolute bottom-[30%] right-[42%] w-8 h-8 rounded-full bg-[#C0832F]/25" />
                  </motion.div>
                )}

                {mapOverlay === "PATROL" && (
                  <motion.div 
                    key="patrol"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="w-full h-full relative font-mono text-[8px]"
                  >
                    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <path d="M 20,40 L 150,50 L 220,130" fill="none" stroke="#796B9A" strokeWidth="1" strokeDasharray="3 3" />
                      <path d="M 100,180 L 120,110 L 250,90" fill="none" stroke="#3B8D72" strokeWidth="1" strokeDasharray="2 2" />
                    </svg>
                    <div className="absolute top-[45px] left-[140px] px-2 py-0.5 bg-white border border-slate-200 text-[#796B9A] rounded shadow-sm">UNIT_7A</div>
                    <div className="absolute bottom-[60px] right-[100px] px-2 py-0.5 bg-white border border-slate-200 text-[#3B8D72] rounded shadow-sm">K9_SHIELD</div>
                  </motion.div>
                )}

                {mapOverlay === "INCIDENT" && (
                  <motion.div 
                    key="incident"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="w-full h-full relative"
                  >
                    <div className="absolute top-[25%] left-[32%] flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-lg shadow-md">
                      <span className="w-2 h-2 rounded-full bg-[#C65555] animate-ping" />
                      <span className="text-[9px] font-mono text-slate-700">INCIDENT #291A</span>
                    </div>
                    <div className="absolute bottom-[35%] right-[25%] flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-lg shadow-md">
                      <span className="w-2 h-2 rounded-full bg-[#C0832F]" />
                      <span className="text-[9px] font-mono text-slate-700">DISPATCHED #182</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Map Scale / Details */}
            <div className="flex items-center justify-between z-10">
              <span className="text-[9px] font-mono text-slate-400">{currentSector.coordinates}</span>
              <span className="text-[9px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-[6px] select-none uppercase tracking-wider shadow-sm">{mapOverlay} LAYER</span>
            </div>

            {/* Compass Overlay HUD */}
            <div className="absolute top-4 right-4 bg-white/90 border border-slate-200 p-2 rounded-[14px] flex flex-col gap-1 items-center z-10 shadow-sm">
              <Compass className="w-4 h-4 text-[#3B8D72]" />
              <span className="text-[7px] font-mono text-slate-400 uppercase">GRID_WGS84</span>
            </div>

            {/* Map layer toggle buttons */}
            <div className="flex gap-1.5 z-10 pt-4">
              {[
                { id: "HEAT", label: "Heatmap" },
                { id: "PATROL", label: "Patrol Units" },
                { id: "INCIDENT", label: "Incidents" }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setMapOverlay(btn.id as any)}
                  className={`px-2.5 py-1 text-[9px] font-mono rounded-[12px] border transition-all duration-150 shadow-sm ${
                    mapOverlay === btn.id 
                      ? 'bg-[#3B8D72]/10 border-[#3B8D72]/30 text-[#3B8D72] font-bold' 
                      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

          </div>

          {/* Right Side: Sector Details HUD */}
          <div className="md:col-span-5 flex flex-col justify-between text-left space-y-4">
            
            <div className="space-y-3">
              <div className="p-3 bg-slate-50/80 border border-slate-200 rounded-[18px] shadow-inner">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold mb-1">Target Sector (Live)</div>
                <div className="text-xs font-bold text-slate-800 truncate">{realTargetDistrict}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[9px] font-mono text-slate-400">CRIME_COUNT:</span>
                  <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded border bg-red-50 border-red-200/50 text-[#C65555]">
                    {realCrimeCount ?? currentSector.incidents} cases
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-semibold pl-1">Primary Hot Spots</span>
                <div className="space-y-1">
                  {(realHotspotNames.length > 0 ? realHotspotNames : currentSector.hotspots).map((spot, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-white/80 border border-slate-200 rounded-[12px] hover:bg-white hover:border-slate-300 transition-all shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C65555]" />
                      <span className="text-[11px] text-slate-700 font-sans font-medium">{spot}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Slider Control */}
            <div className="space-y-2 p-3 bg-slate-50/80 border border-slate-200 rounded-[18px]">
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                <span className="flex items-center gap-1"><Sliders className="w-3 h-3 text-slate-400" /> Hazard Highlight Floor</span>
                <span className="text-[#3B8D72] font-bold">{densityFilter}%</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={densityFilter}
                onChange={(e) => setDensityFilter(parseInt(e.target.value))}
                className="w-full accent-[#3B8D72] bg-slate-200 h-1 rounded-[20px] focus:outline-none cursor-pointer"
              />
            </div>

          </div>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-4 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3B8D72]" />
            <span>RENDER_MODE: VECTOR_GL</span>
          </div>
          <span>GRID SCALE: 1:25,000</span>
        </div>
      </motion.div>
    );
  }

  /* -------------------------------------------------------------
   * 3. CRIMINAL ASSOCIATION NETWORK (INTERACTIVE LINK NODE MAP)
   * ------------------------------------------------------------- */
  if (label === 'Criminal Network') {
    const [selectedProfileId, setSelectedProfileId] = useState<string>("MARCUS");

    const profiles: Record<string, {
      name: string;
      role: string;
      threat: string;
      status: string;
      affiliation: string;
      coConspirators: string[];
      bio: string;
      coArrests: number;
    }> = {
      DON_V: {
        name: "Victor 'Don' Volkov",
        role: "Syndicate Kingpin",
        threat: "SEVERE (LVL-5)",
        status: "UNDER VEIL",
        affiliation: "Apex Cartel / Northern Syndicate",
        coConspirators: ["Marcus 'Apex'", "Elena R.", "Slick"],
        bio: "Identified financier of illegal trade channels. Commands high-level command network operations.",
        coArrests: 14
      },
      MARCUS: {
        name: "Marcus 'Apex' Chen",
        role: "Chief Field Coordinator",
        threat: "CRITICAL (LVL-4)",
        status: "ACTIVE PATROL TARGET",
        affiliation: "Apex Cartel / Field Operations",
        coConspirators: ["Don Victor", "Elena R.", "Slick"],
        bio: "Primary tactical lead on coordinated field operations. Direct connection to logistics channels.",
        coArrests: 8
      },
      ELENA: {
        name: "Elena Rostova",
        role: "Offshore Treasurer",
        threat: "ELEVATED (LVL-3)",
        status: "MONITORED STATUS",
        affiliation: "Northern Capital Group",
        coConspirators: ["Don Victor", "Marcus 'Apex'"],
        bio: "Manages offshore asset accounts and financial distribution models. Master's in Cryptography.",
        coArrests: 3
      },
      SLICK: {
        name: "Slick 'J' Malone",
        role: "Tactical Delivery Enforcer",
        threat: "MODERATE (LVL-2)",
        status: "PROBATION TRACKING",
        affiliation: "Apex Cartel / Supply Division",
        coConspirators: ["Marcus 'Apex'"],
        bio: "Enforcement lead. Charged in 2024 with high-value transport obstruction. Released on ankle telemetry.",
        coArrests: 9
      }
    };

    const currentProfile = profiles[selectedProfileId] || profiles.MARCUS;

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12 }}
        className={`premium-card p-6 flex flex-col justify-between wireframe-mesh min-h-[440px] ${className}`}
        id={id}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-[14px] bg-white border border-slate-200/60 shadow-sm">
              <Network className="w-5 h-5 text-[#3B8D72]" />
            </div>
            <div>
              <h3 className="text-sm font-sans font-bold text-[#1E293B] tracking-tight">{label}</h3>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest font-semibold">LINK CORRELATION SYSTEM</p>
            </div>
          </div>
          
          <div className="text-[10px] font-mono text-slate-500 bg-white px-2.5 py-1 rounded-[10px] border border-slate-200 shadow-sm">
            ACTIVE PROFILE EXPLORER
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 flex-1">
          {/* Left Side: Interactive Nodes Graph Illustration */}
          <div className="md:col-span-6 rounded-[20px] bg-white/85 border border-slate-200 relative p-4 flex flex-col justify-between min-h-[220px] overflow-hidden shadow-inner">
            <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
              {/* Communication paths between nodes */}
              <line x1="50%" y1="20%" x2="25%" y2="55%" stroke="#3B8D72" strokeWidth={selectedProfileId === "DON_V" || selectedProfileId === "MARCUS" ? "2" : "1"} />
              <line x1="50%" y1="20%" x2="75%" y2="55%" stroke="#3B8D72" strokeWidth={selectedProfileId === "DON_V" || selectedProfileId === "ELENA" ? "2" : "1"} />
              <line x1="25%" y1="55%" x2="75%" y2="55%" stroke="#3B8D72" strokeWidth={selectedProfileId === "MARCUS" || selectedProfileId === "ELENA" ? "2" : "1"} strokeDasharray="3 3" />
              <line x1="25%" y1="55%" x2="50%" y2="85%" stroke="#3B8D72" strokeWidth={selectedProfileId === "MARCUS" || selectedProfileId === "SLICK" ? "2" : "1"} />
            </svg>

            <div className="text-[8px] font-mono text-slate-400 text-left">CLICK NODES TO AUDIT CO-OCCURRENCES</div>

            {/* Interactive Node Anchors */}
            <div className="absolute inset-0">
              {/* Don Volkov */}
              <button 
                onClick={() => setSelectedProfileId("DON_V")}
                className={`absolute top-[12%] left-[42%] w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 shadow-sm ${
                  selectedProfileId === "DON_V"
                    ? 'bg-[#3B8D72]/10 border-[#3B8D72] text-[#3B8D72] shadow-[0_0_15px_rgba(59,141,114,0.15)] scale-110'
                    : 'bg-white border-slate-200 hover:border-slate-400 hover:scale-105'
                }`}
              >
                <span className={`font-mono text-[9px] font-bold ${selectedProfileId === "DON_V" ? "text-[#3B8D72]" : "text-slate-700"}`}>DV</span>
              </button>

              {/* Marcus Chen */}
              <button 
                onClick={() => setSelectedProfileId("MARCUS")}
                className={`absolute top-[48%] left-[17%] w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 shadow-sm ${
                  selectedProfileId === "MARCUS"
                    ? 'bg-[#3B8D72]/10 border-[#3B8D72] text-[#3B8D72] shadow-[0_0_15px_rgba(59,141,114,0.15)] scale-110'
                    : 'bg-white border-slate-200 hover:border-slate-400 hover:scale-105'
                }`}
              >
                <span className={`font-mono text-[9px] font-bold ${selectedProfileId === "MARCUS" ? "text-[#3B8D72]" : "text-slate-700"}`}>MC</span>
              </button>

              {/* Elena Rostova */}
              <button 
                onClick={() => setSelectedProfileId("ELENA")}
                className={`absolute top-[48%] right-[17%] w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 shadow-sm ${
                  selectedProfileId === "ELENA"
                    ? 'bg-[#3B8D72]/10 border-[#3B8D72] text-[#3B8D72] shadow-[0_0_15px_rgba(59,141,114,0.15)] scale-110'
                    : 'bg-white border-slate-200 hover:border-slate-400 hover:scale-105'
                }`}
              >
                <span className={`font-mono text-[9px] font-bold ${selectedProfileId === "ELENA" ? "text-[#3B8D72]" : "text-slate-700"}`}>ER</span>
              </button>

              {/* Slick Malone */}
              <button 
                onClick={() => setSelectedProfileId("SLICK")}
                className={`absolute bottom-[8%] left-[42%] w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 shadow-sm ${
                  selectedProfileId === "SLICK"
                    ? 'bg-[#3B8D72]/10 border-[#3B8D72] text-[#3B8D72] shadow-[0_0_15px_rgba(59,141,114,0.15)] scale-110'
                    : 'bg-white border-slate-200 hover:border-slate-400 hover:scale-105'
                }`}
              >
                <span className={`font-mono text-[9px] font-bold ${selectedProfileId === "SLICK" ? "text-[#3B8D72]" : "text-slate-700"}`}>SM</span>
              </button>
            </div>

            <div className="mt-auto flex justify-between items-center text-[9px] font-mono text-slate-400 z-10 pt-4">
              <span>TARGET_SYNDICATE: APEX_04</span>
              <span>STABILITY_INDEX: STABLE</span>
            </div>
          </div>

          {/* Right Side: Active Node Details Frame */}
          <div className="md:col-span-6 flex flex-col justify-between text-left space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-[20px] relative overflow-hidden">
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[8px] font-mono uppercase bg-[#3B8D72]/10 border border-[#3B8D72]/20 text-[#3B8D72] font-extrabold shadow-sm">
                  NODE LEVEL: {selectedProfileId === "DON_V" ? "5" : selectedProfileId === "MARCUS" ? "4" : "3"}
                </div>
                <div className="text-xs font-mono text-slate-400 uppercase tracking-widest font-semibold">{currentProfile.role}</div>
                <div className="text-sm font-bold text-slate-800 tracking-tight mt-1">{currentProfile.name}</div>
                
                <div className="text-[11px] text-slate-600 font-sans mt-2.5 leading-relaxed bg-white p-2 rounded-[12px] border border-slate-200/60 shadow-sm">
                  {currentProfile.bio}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50/40 border border-slate-200 rounded-[14px]">
                  <span className="text-[8px] font-mono text-slate-400 uppercase block font-semibold">Threat Profile</span>
                  <span className="text-[10px] font-mono font-bold text-[#C65555] block mt-1">{currentProfile.threat}</span>
                </div>
                <div className="p-3 bg-slate-50/40 border border-slate-200 rounded-[14px]">
                  <span className="text-[8px] font-mono text-slate-400 uppercase block font-semibold">Sync Status</span>
                  <span className="text-[10px] font-mono font-bold text-[#3B8D72] block mt-1">{currentProfile.status}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono p-3 bg-slate-50/80 border border-slate-200 rounded-[18px]">
              <span className="text-slate-400">CO-ARREST INDEX:</span>
              <span className="text-[#3B8D72] font-bold">{currentProfile.coArrests} CASES SEEN</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-4 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3B8D72]" />
            <span>SECURE LINK ANALYSIS SYST_ONLINE</span>
          </div>
          <span>DEGREE SEPARATION: LEVEL-2</span>
        </div>
      </motion.div>
    );
  }

  /* -------------------------------------------------------------
   * 4. TEMPORAL PREDICTIVE MODELING (STUNNING RECHARTS VISUALIZATION)
   * ------------------------------------------------------------- */
  if (label === 'Prediction Analytics') {
    const [selectedShift, setSelectedShift] = useState<"ALL" | "PROPERTY" | "VIOLENT">("ALL");
    const [confidenceFloor, setConfidenceFloor] = useState<number>(85);

    const timelineData = [
      { hour: '00:00', totalProbability: 40, property: 50, violent: 25 },
      { hour: '04:00', totalProbability: 25, property: 30, violent: 15 },
      { hour: '08:00', totalProbability: 60, property: 70, violent: 35 },
      { hour: '12:00', totalProbability: 80, property: 85, violent: 45 },
      { hour: '16:00', totalProbability: 92, property: 95, violent: 70 },
      { hour: '20:00', totalProbability: 85, property: 80, violent: 90 },
      { hour: '23:59', totalProbability: 55, property: 60, violent: 50 },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16 }}
        className={`premium-card p-6 flex flex-col justify-between wireframe-mesh min-h-[440px] ${className}`}
        id={id}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-[14px] bg-white border border-slate-200/60 shadow-sm">
              <TrendingUp className="w-5 h-5 text-[#3B8D72]" />
            </div>
            <div>
              <h3 className="text-sm font-sans font-bold text-[#1E293B] tracking-tight">{label}</h3>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest font-bold font-semibold">HAZARD TIMELINE PREDICTIVE MATRIX</p>
            </div>
          </div>
          
          {/* Custom Selector Chips */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-[14px] border border-slate-200">
            {[
              { id: "ALL", label: "Composite Proj" },
              { id: "PROPERTY", label: "Property Crime" },
              { id: "VIOLENT", label: "Violent Crime" }
            ].map((shift) => (
              <button
                key={shift.id}
                onClick={() => setSelectedShift(shift.id as any)}
                className={`px-3 py-1 text-[9px] font-mono rounded-[10px] transition-all duration-200 font-medium ${
                  selectedShift === shift.id 
                    ? 'bg-white border border-slate-200 text-[#1E293B] shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800 border border-transparent'
                }`}
              >
                {shift.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Viewport Frame */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 flex-1 items-center">
          
          {/* Left: Interactive Real Chart Grid */}
          <div className="md:col-span-8 rounded-[24px] bg-white/80 border border-slate-200 p-4 h-[250px] relative shadow-inner">
            <div className="absolute top-3 left-4 text-[9px] font-mono text-slate-400 uppercase">TEMPORAL PROBABILITY FLOW (%)</div>
            
            <div className="w-full h-full pt-4">
              <ResponsiveContainer width="100%" height="95%">
                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="probGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B8D72" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#3B8D72" stopOpacity={0.01}/>
                    </linearGradient>
                    <linearGradient id="propGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4D7FA9" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#4D7FA9" stopOpacity={0.01}/>
                    </linearGradient>
                    <linearGradient id="violGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C65555" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#C65555" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="hour" 
                    stroke="rgba(148, 163, 184, 0.4)" 
                    fontSize={8} 
                    fontFamily="JetBrains Mono"
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="rgba(148, 163, 184, 0.4)" 
                    fontSize={8} 
                    fontFamily="JetBrains Mono"
                    tickLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      borderColor: 'rgba(15, 32, 27, 0.08)',
                      borderRadius: '14px',
                      fontSize: '10px',
                      fontFamily: 'Inter',
                      color: '#1E293B',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)'
                    }}
                    itemStyle={{ color: '#1E293B' }}
                  />
                  
                  {selectedShift === "ALL" && (
                    <Area 
                      type="monotone" 
                      dataKey="totalProbability" 
                      stroke="#3B8D72" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#probGrad)" 
                    />
                  )}

                  {selectedShift === "PROPERTY" && (
                    <Area 
                      type="monotone" 
                      dataKey="property" 
                      stroke="#4D7FA9" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#propGrad)" 
                    />
                  )}

                  {selectedShift === "VIOLENT" && (
                    <Area 
                      type="monotone" 
                      dataKey="violent" 
                      stroke="#C65555" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#violGrad)" 
                    />
                  )}

                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right: Confidence thresholding sliders & Details */}
          <div className="md:col-span-4 flex flex-col justify-between h-full text-left space-y-4">
            
            <div className="space-y-3.5">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-[20px] shadow-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold mb-1">Highest Risk District (Live)</div>
                <div className="text-xl font-bold text-slate-800">{realRisk?.[0]?.district || "16:00 - 18:00"}</div>
                <p className="text-[10px] text-slate-500 mt-1.5 leading-normal font-medium">
                  {realRisk?.[0]
                    ? `Risk score: ${realRisk[0].risk_score}/100 (${realRisk[0].risk_level}). ${realRisk[0].recent_90d_crimes} crimes in last 90 days.`
                    : "Identified 92% peak incident vector. Heavy transit crossings and financial centers flag positive risk co-occurrence."}
                </p>
              </div>

              {/* Confidence interval threshold controller */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-[18px] space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                  <span className="flex items-center gap-1"><SlidersHorizontal className="w-3 h-3 text-slate-400" /> Confidence Level Floor</span>
                  <span className="text-[#3B8D72] font-bold">&gt;{confidenceFloor}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="95" 
                  value={confidenceFloor}
                  onChange={(e) => setConfidenceFloor(parseInt(e.target.value))}
                  className="w-full accent-[#3B8D72] bg-slate-200 h-1 rounded-[20px] focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-[9px] font-mono p-3 bg-slate-100/60 border border-slate-200 rounded-[14px]">
              <span className="text-slate-400">ML STATUS:</span>
              <span className="text-[#3B8D72] font-bold">RECURRENT_v5.1 ONLINE</span>
            </div>

          </div>

        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-4 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3B8D72]" />
            <span>ALGORITHM CONFIGURATION EVAL: 91.4% ACCURACY</span>
          </div>
          <span>GRID INTERVAL: 4 HOURS</span>
        </div>
      </motion.div>
    );
  }

  /* -------------------------------------------------------------
   * 5. RECENT ALERTS CAD DISPATCH STREAM (LIVE STREAM INGESTION FEED)
   * ------------------------------------------------------------- */
  if (label === 'Recent Alerts') {
    const [selectedFeedType, setSelectedFeedType] = useState<"ALL" | "CRITICAL" | "SYSTEM">("ALL");
    const [showBulletinModal, setShowBulletinModal] = useState(false);
    const [bulletinText, setBulletinText] = useState("");
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const [alerts, setAlerts] = useState([
      {
        id: "AL_983",
        severity: "CRITICAL",
        title: "Sector 4 Intrusion Signal Detected",
        time: "Just now",
        node: "UNIT_7A_DISPATCH",
        desc: "Automated gateway warning sensor activated at Broadway Crossing. Duty units requested."
      },
      {
        id: "AL_912",
        severity: "WARNING",
        title: "Traffic Intersection Camera Frame Drops",
        time: "4m ago",
        node: "CCTV_SEC_09",
        desc: "Camera node #912 experiencing signal synchronization delays. Manual bypass requested."
      },
      {
        id: "AL_882",
        severity: "INFO",
        title: "Federal Database Cache Ingestion Completed",
        time: "14m ago",
        node: "TERMINAL_983",
        desc: "2,400 active national threat matrix records incorporated securely into regional indexes."
      }
    ]);

    useEffect(() => {
      if (realAlerts && realAlerts.length > 0) {
        setAlerts(realAlerts.slice(0, 10).map((a, idx) => ({
          id: `AL_${idx}`,
          severity: a.severity === 'High' ? 'CRITICAL' : 'WARNING',
          title: `${a.crime_type} spike detected in ${a.district}`,
          time: 'Live',
          node: 'ANOMALY_DETECTOR',
          desc: `Statistical anomaly detected — z-score ${a.z_score}. Unusual increase vs historical baseline.`
        })));
      }
    }, [realAlerts]);

    const handleAddAlert = (e: React.FormEvent) => {
      e.preventDefault();
      if (!bulletinText.trim()) return;

      const newAlert = {
        id: `AL_${Math.floor(100 + Math.random() * 900)}`,
        severity: "CRITICAL",
        title: bulletinText,
        time: "Just now",
        node: "OFFICER_BULLETIN",
        desc: "High-priority direct command bulletin broadcast manually from dashboard tactical console."
      };

      setAlerts([newAlert, ...alerts]);
      setBulletinText("");
      setShowBulletinModal(false);
      setAlertMessage("High-Priority Bulletin Broadcast Completed Successfully!");
      setTimeout(() => setAlertMessage(null), 4000);
    };

    const filteredAlerts = alerts.filter(al => {
      if (selectedFeedType === "ALL") return true;
      if (selectedFeedType === "CRITICAL") return al.severity === "CRITICAL";
      return al.severity === "WARNING" || al.severity === "INFO";
    });

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className={`premium-card p-6 flex flex-col justify-between min-h-[440px] ${className}`}
        id={id}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-[14px] bg-white border border-slate-200/60 shadow-sm">
              <Bell className="w-5 h-5 text-[#C65555]" />
            </div>
            <div>
              <h3 className="text-sm font-sans font-bold text-[#1E293B] tracking-tight">{label}</h3>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest font-semibold">LIVE CAD DISPATCH SIGNAL</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-[14px] border border-slate-200">
            {[
              { id: "ALL", label: "All Logs" },
              { id: "CRITICAL", label: "Critical" },
              { id: "SYSTEM", label: "Diag Logs" }
            ].map((feed) => (
              <button
                key={feed.id}
                onClick={() => setSelectedFeedType(feed.id as any)}
                className={`px-3 py-1 text-[9px] font-mono rounded-[10px] transition-all duration-200 font-medium ${
                  selectedFeedType === feed.id 
                    ? 'bg-white border border-slate-200 text-[#1E293B] shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800 border border-transparent'
                }`}
              >
                {feed.label}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts List stream container */}
        <div className="flex-1 space-y-3 relative overflow-hidden min-h-[240px] pr-1 overflow-y-auto max-h-[250px]">
          
          {/* Animated success banner */}
          <AnimatePresence>
            {alertMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="p-3 rounded-[14px] bg-[#3B8D72]/10 border border-[#3B8D72]/30 text-[#3B8D72] text-xs font-medium text-left flex items-center gap-2 mb-2 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{alertMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2.5">
            {filteredAlerts.map((al) => (
              <div 
                key={al.id} 
                className="p-3 bg-white/60 border border-slate-200/80 rounded-[18px] text-left hover:bg-white hover:border-slate-300 transition-all flex gap-3.5 items-start shadow-sm"
              >
                <div className="mt-1">
                  {al.severity === "CRITICAL" ? (
                    <span className="flex h-2 w-2 rounded-full bg-[#C65555] shadow-[0_0_8px_rgba(198,85,85,0.4)]" />
                  ) : al.severity === "WARNING" ? (
                    <span className="flex h-2 w-2 rounded-full bg-[#C0832F]" />
                  ) : (
                    <span className="flex h-2 w-2 rounded-full bg-[#4D7FA9]" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#3B8D72] transition-colors">{al.title}</span>
                    <span className="text-[9px] font-mono text-slate-400">{al.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium leading-normal">{al.desc}</p>
                  
                  <div className="flex items-center gap-3 pt-1 text-[8px] font-mono text-slate-400 font-bold">
                    <span>CAD_ID: {al.id}</span>
                    <span>•</span>
                    <span>NODE: {al.node}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Bulletin Modal */}
          <AnimatePresence>
            {showBulletinModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-[20px] p-4 flex flex-col justify-between z-20 border border-slate-200"
              >
                <form onSubmit={handleAddAlert} className="space-y-3 flex flex-col h-full justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans font-bold text-slate-800">Draft Priority Dispatch Bulletin</span>
                      <button 
                        type="button"
                        onClick={() => setShowBulletinModal(false)}
                        className="text-[10px] font-mono text-slate-400 hover:text-slate-600 font-bold"
                      >
                        [Cancel]
                      </button>
                    </div>
                    
                    <input 
                      type="text" 
                      placeholder="Enter emergency bulletin description..." 
                      value={bulletinText}
                      onChange={(e) => setBulletinText(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 rounded-[20px] focus:outline-none focus:border-[#3B8D72]/50"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-[#3B8D72] hover:bg-[#3B8D72]/90 text-white font-sans font-semibold text-xs py-2.5 rounded-[18px] flex items-center justify-center gap-1.5 shadow-md shadow-[#3B8D72]/20 transition-all duration-200"
                    >
                      <Send className="w-3.5 h-3.5" /> Broadcast Now
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBulletinModal(false)}
                      className="px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 font-sans text-xs rounded-[18px] transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Tactical Control button area */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setShowBulletinModal(true)}
            className="px-4 py-2 bg-[#3B8D72]/10 border border-[#3B8D72]/20 text-[#3B8D72] font-sans font-semibold text-xs rounded-[18px] flex items-center gap-2 hover:bg-[#3B8D72]/20 transition-all duration-200 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" /> Trigger Agency Bulletin
          </button>

          <span className="text-[9px] font-mono text-slate-400">SOCKET_ACTIVE: TLS_SECURE</span>
        </div>
      </motion.div>
    );
  }

  // Fallback card structure
  return (
    <div className={`premium-card p-6 flex flex-col justify-between border-dashed border-slate-200 min-h-[250px] ${className}`} id={id}>
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">{label}</h3>
        <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">CONTAINER</span>
      </div>
      
      <div className="flex-1 flex items-center justify-center text-slate-400 my-4">
        <div className="flex flex-col items-center gap-2 max-w-xs text-center">
          <Info className="w-5 h-5 text-slate-400" />
          <span className="text-xs font-sans">Future interactive component layout placeholder</span>
        </div>
      </div>
      
      <div className="text-[9px] font-mono text-slate-400 text-right uppercase">NODE: STABLE</div>
    </div>
  );
}
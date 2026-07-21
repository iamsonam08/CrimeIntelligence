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
  PlusCircle
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
}

export function PlaceholderCard({ label, className = '', id }: PlaceholderCardProps) {
  const isKPICard = label.startsWith('KPI Card');
  
  /* -------------------------------------------------------------
   * 1. KEY PERFORMANCE INDICATORS (KPI) CARDS (Design-Mandated: Cards 24px, Buttons 18px)
   * ------------------------------------------------------------- */
  if (isKPICard) {
    const cardNumber = label.split(' ')[2] || '1';
    
    const kpis = [
      {
        title: 'Active Federal Investigations',
        value: '1,482',
        sub: '+12% vs last month',
        status: 'CRITICAL SYNC',
        color: '#6366F1',
        sparkline: [30, 45, 40, 60, 50, 75, 90],
        icon: <Fingerprint className="w-4 h-4 text-[#6366F1]" />
      },
      {
        title: 'High-Priority Bulletins (24h)',
        value: '29',
        sub: '3 pending dispatcher signoff',
        status: 'ALERT ACTIVE',
        color: '#F43F5E',
        sparkline: [10, 25, 20, 15, 30, 22, 29],
        icon: <ShieldAlert className="w-4 h-4 text-[#F43F5E]" />
      },
      {
        title: 'Algorithmic Risk Probability',
        value: '84.3%',
        sub: 'Sector 4 peak probability',
        status: 'MODEL STABLE',
        color: '#F59E0B',
        sparkline: [70, 75, 82, 80, 85, 83, 84.3],
        icon: <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
      },
      {
        title: 'Active Dispatch Operators',
        value: '18 / 24',
        sub: '75% maximum duty layout',
        status: 'GRID ONLINE',
        color: '#10B981',
        sparkline: [12, 14, 18, 15, 17, 19, 18],
        icon: <Radio className="w-4 h-4 text-[#10B981]" />
      }
    ];
    
    const index = parseInt(cardNumber) - 1;
    const item = kpis[index] || kpis[0];

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={`soft-neumorphic p-6 relative overflow-hidden group rounded-[24px] cursor-pointer hover:border-[#6366F1]/10 ${className}`}
        id={id}
      >
        {/* Abstract vector accent dot */}
        <div 
          className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl opacity-[0.02] pointer-events-none group-hover:opacity-[0.06] transition-opacity duration-300"
          style={{ backgroundImage: `linear-gradient(to bottom left, ${item.color}, transparent)` }}
        />

        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase font-bold">{label}</span>
          <div className="p-2.5 rounded-[14px] bg-slate-950 border border-slate-900 shadow-inner">
            {item.icon}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#F8FAFC] tracking-tight">{item.value}</span>
            <span className="text-[10px] font-mono text-slate-500 font-medium">{item.sub}</span>
          </div>
          
          <div className="text-xs font-sans font-semibold text-slate-300 tracking-tight leading-none">
            {item.title}
          </div>

          {/* Elegant Micro-Sparkline */}
          <div className="h-6 w-full pt-2 flex items-end gap-[3px]">
            {item.sparkline.map((val, idx) => {
              const max = Math.max(...item.sparkline);
              const heightPercent = `${(val / max) * 100}%`;
              return (
                <div 
                  key={idx} 
                  className="flex-1 bg-slate-800 rounded-sm transition-all duration-300 group-hover:bg-slate-700 relative" 
                  style={{ height: '100%' }}
                >
                  <div 
                    className="absolute bottom-0 left-0 right-0 rounded-sm transition-all duration-300"
                    style={{ 
                      height: heightPercent, 
                      backgroundColor: item.color,
                      opacity: idx === item.sparkline.length - 1 ? 0.9 : 0.35
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-900/60 text-[10px] font-mono text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.status}</span>
            </div>
            <span>NODE_LIVE</span>
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

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className={`premium-card premium-card-hover p-6 flex flex-col justify-between wireframe-mesh min-h-[440px] ${className}`}
        id={id}
      >
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/60 pb-4 mb-4">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-[14px] bg-slate-950 border border-slate-900 shadow-inner">
              <Map className="w-5 h-5 text-[#6366F1]" />
            </div>
            <div>
              <h3 className="text-sm font-sans font-bold text-[#F8FAFC] tracking-tight">{label}</h3>
              <p className="text-[10px] text-[#94A3B8] font-mono uppercase tracking-widest font-semibold">GEOSPATIAL VECTOR MAP MATRIX</p>
            </div>
          </div>
          
          {/* Custom Toggle Chips (Design-Mandated: rounded-[18px]) */}
          <div className="flex items-center gap-1.5 bg-slate-950/40 p-1 rounded-[14px] border border-slate-900">
            {["SECTOR_ALPHA", "SECTOR_DELTA"].map((sector) => (
              <button
                key={sector}
                onClick={() => setSelectedSector(sector)}
                className={`px-3 py-1 text-[9px] font-mono rounded-[10px] transition-all duration-200 font-medium ${
                  selectedSector === sector 
                    ? 'bg-[#141C2F] border border-slate-800 text-[#F8FAFC] shadow-sm' 
                    : 'text-slate-500 hover:text-slate-300 border border-transparent'
                }`}
              >
                {sector === "SECTOR_ALPHA" ? "Alpha Core" : "Delta Wharf"}
              </button>
            ))}
          </div>
        </div>

        {/* Content Layout Grid (Dashboard Split) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 flex-1">
          
          {/* Left Side: Dynamic Vector SVG Map Frame */}
          <div className="md:col-span-7 rounded-[20px] bg-slate-950/60 border border-slate-900 relative p-4 flex flex-col justify-between min-h-[240px] overflow-hidden group">
            {/* Grid coordinates and radial layers */}
            <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(99,102,241,0.02)_0%,transparent_70%]" />
            <div className="absolute inset-0 m-auto w-36 h-36 rounded-full border border-slate-900/60 pointer-events-none" />
            <div className="absolute inset-x-4 top-1/2 h-[1px] bg-slate-900/40 pointer-events-none" />
            <div className="absolute inset-y-4 left-1/2 w-[1px] bg-slate-900/40 pointer-events-none" />

            {/* Simulated Vector Heat Boundaries or Pins */}
            <div className="absolute inset-0 pointer-events-none p-6">
              {/* Hot spots vector circles */}
              <AnimatePresence mode="wait">
                {mapOverlay === "HEAT" && (
                  <motion.div 
                    key="heat"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="w-full h-full relative"
                  >
                    <div className="absolute top-[25%] left-[30%] w-16 h-16 rounded-full bg-[#F43F5E]/10 animate-pulse border border-[#F43F5E]/20" />
                    <div className="absolute top-[29%] left-[34%] w-6 h-6 rounded-full bg-[#F43F5E]/40" />
                    
                    <div className="absolute bottom-[20%] right-[35%] w-24 h-24 rounded-full bg-[#F59E0B]/5 border border-[#F59E0B]/15" />
                    <div className="absolute bottom-[30%] right-[42%] w-8 h-8 rounded-full bg-[#F59E0B]/30" />
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
                    {/* Patrol pathways */}
                    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <path d="M 20,40 L 150,50 L 220,130" fill="none" stroke="#6366F1" strokeWidth="1" strokeDasharray="3 3" />
                      <path d="M 100,180 L 120,110 L 250,90" fill="none" stroke="#10B981" strokeWidth="1" strokeDasharray="2 2" />
                    </svg>
                    <div className="absolute top-[45px] left-[140px] px-2 py-0.5 bg-slate-900 border border-slate-800 text-[#6366F1] rounded">UNIT_7A</div>
                    <div className="absolute bottom-[60px] right-[100px] px-2 py-0.5 bg-slate-900 border border-slate-800 text-[#10B981] rounded">K9_SHIELD</div>
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
                    <div className="absolute top-[25%] left-[32%] flex items-center gap-1.5 px-2 py-1 bg-slate-900/90 border border-slate-800 rounded-lg shadow-xl">
                      <span className="w-2 h-2 rounded-full bg-[#F43F5E] animate-ping" />
                      <span className="text-[9px] font-mono text-slate-300">INCIDENT #291A</span>
                    </div>
                    <div className="absolute bottom-[35%] right-[25%] flex items-center gap-1.5 px-2 py-1 bg-slate-900/90 border border-slate-800 rounded-lg shadow-xl">
                      <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                      <span className="text-[9px] font-mono text-slate-300">DISPATCHED #182</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Map Scale / Details */}
            <div className="flex items-center justify-between z-10">
              <span className="text-[9px] font-mono text-slate-500">{currentSector.coordinates}</span>
              <span className="text-[9px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-[6px] select-none uppercase tracking-wider">{mapOverlay} LAYER</span>
            </div>

            {/* Compass Overlay HUD */}
            <div className="absolute top-4 right-4 bg-slate-950/80 border border-slate-900 p-2 rounded-[14px] flex flex-col gap-1 items-center z-10">
              <Compass className="w-4 h-4 text-[#6366F1]" />
              <span className="text-[7px] font-mono text-slate-500 uppercase">GRID_WGS84</span>
            </div>

            {/* Map layer toggle buttons (Design-Mandated: Buttons 18px) */}
            <div className="flex gap-1.5 z-10 pt-4">
              {[
                { id: "HEAT", label: "Heatmap" },
                { id: "PATROL", label: "Patrol Units" },
                { id: "INCIDENT", label: "Incidents" }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setMapOverlay(btn.id as any)}
                  className={`px-2.5 py-1 text-[9px] font-mono rounded-[12px] border transition-all duration-150 ${
                    mapOverlay === btn.id 
                      ? 'bg-[#6366F1]/10 border-[#6366F1]/30 text-[#6366F1] font-semibold' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
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
              <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-[18px]">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold mb-1">Target Sector</div>
                <div className="text-xs font-bold text-[#F8FAFC] truncate">{currentSector.name}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[9px] font-mono text-slate-500">RISK_RATING:</span>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    currentSector.risk === "HIGH" ? "bg-red-500/10 text-[#F43F5E]" : "bg-amber-500/10 text-[#F59E0B]"
                  }`}>{currentSector.risk}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-semibold pl-1">Primary Hot Spots</span>
                <div className="space-y-1">
                  {currentSector.hotspots.map((spot, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-slate-950/20 border border-slate-900 rounded-[12px] hover:bg-slate-900/30 transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F43F5E]" />
                      <span className="text-[11px] text-slate-300 font-sans">{spot}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Slider Control (Design-Mandated: Inputs 20px) */}
            <div className="space-y-2 p-3 bg-slate-950/40 border border-slate-900 rounded-[18px]">
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                <span className="flex items-center gap-1"><Sliders className="w-3 h-3 text-slate-500" /> Hazard Highlight Floor</span>
                <span className="text-[#6366F1] font-bold">{densityFilter}%</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={densityFilter}
                onChange={(e) => setDensityFilter(parseInt(e.target.value))}
                className="w-full accent-[#6366F1] bg-slate-900 h-1 rounded-[20px] focus:outline-none cursor-pointer"
              />
            </div>

          </div>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-4 border-t border-slate-900/60 pt-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
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
        className={`premium-card premium-card-hover p-6 flex flex-col justify-between wireframe-mesh min-h-[440px] ${className}`}
        id={id}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/60 pb-4 mb-4">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-[14px] bg-slate-950 border border-slate-900 shadow-inner">
              <Network className="w-5 h-5 text-[#6366F1]" />
            </div>
            <div>
              <h3 className="text-sm font-sans font-bold text-[#F8FAFC] tracking-tight">{label}</h3>
              <p className="text-[10px] text-[#94A3B8] font-mono uppercase tracking-widest font-semibold">LINK CORRELATION SYSTEM</p>
            </div>
          </div>
          
          <div className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2.5 py-1 rounded-[10px] border border-slate-900">
            ACTIVE PROFILE EXPLORER
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 flex-1">
          {/* Left Side: Interactive Nodes Graph Illustration */}
          <div className="md:col-span-6 rounded-[20px] bg-slate-950/60 border border-slate-900 relative p-4 flex flex-col justify-between min-h-[220px] overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
              {/* Communication paths between nodes */}
              <line x1="50%" y1="20%" x2="25%" y2="55%" stroke="#6366F1" strokeWidth={selectedProfileId === "DON_V" || selectedProfileId === "MARCUS" ? "2" : "1"} />
              <line x1="50%" y1="20%" x2="75%" y2="55%" stroke="#6366F1" strokeWidth={selectedProfileId === "DON_V" || selectedProfileId === "ELENA" ? "2" : "1"} />
              <line x1="25%" y1="55%" x2="75%" y2="55%" stroke="#6366F1" strokeWidth={selectedProfileId === "MARCUS" || selectedProfileId === "ELENA" ? "2" : "1"} strokeDasharray="3 3" />
              <line x1="25%" y1="55%" x2="50%" y2="85%" stroke="#6366F1" strokeWidth={selectedProfileId === "MARCUS" || selectedProfileId === "SLICK" ? "2" : "1"} />
            </svg>

            <div className="text-[8px] font-mono text-slate-600">CLICK NODES TO AUDIT CO-OCCURRENCES</div>

            {/* Interactive Node Anchors (Design-Mandated: Buttons 18px / rounded-[18px]) */}
            <div className="absolute inset-0">
              {/* Don Volkov */}
              <button 
                onClick={() => setSelectedProfileId("DON_V")}
                className={`absolute top-[12%] left-[42%] w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  selectedProfileId === "DON_V"
                    ? 'bg-[#6366F1]/20 border-[#6366F1] shadow-[0_0_15px_rgba(99,102,241,0.4)] scale-110'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-600 hover:scale-105'
                }`}
              >
                <span className="font-mono text-[9px] text-white font-bold">DV</span>
              </button>

              {/* Marcus Chen */}
              <button 
                onClick={() => setSelectedProfileId("MARCUS")}
                className={`absolute top-[48%] left-[17%] w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  selectedProfileId === "MARCUS"
                    ? 'bg-[#6366F1]/20 border-[#6366F1] shadow-[0_0_15px_rgba(99,102,241,0.4)] scale-110'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-600 hover:scale-105'
                }`}
              >
                <span className="font-mono text-[9px] text-white font-bold">MC</span>
              </button>

              {/* Elena Rostova */}
              <button 
                onClick={() => setSelectedProfileId("ELENA")}
                className={`absolute top-[48%] right-[17%] w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  selectedProfileId === "ELENA"
                    ? 'bg-[#6366F1]/20 border-[#6366F1] shadow-[0_0_15px_rgba(99,102,241,0.4)] scale-110'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-600 hover:scale-105'
                }`}
              >
                <span className="font-mono text-[9px] text-white font-bold">ER</span>
              </button>

              {/* Slick Malone */}
              <button 
                onClick={() => setSelectedProfileId("SLICK")}
                className={`absolute bottom-[8%] left-[42%] w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  selectedProfileId === "SLICK"
                    ? 'bg-[#6366F1]/20 border-[#6366F1] shadow-[0_0_15px_rgba(99,102,241,0.4)] scale-110'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-600 hover:scale-105'
                }`}
              >
                <span className="font-mono text-[9px] text-white font-bold">SM</span>
              </button>
            </div>

            <div className="mt-auto flex justify-between items-center text-[9px] font-mono text-slate-500 z-10 pt-4">
              <span>TARGET_SYNDICATE: APEX_04</span>
              <span>STABILITY_INDEX: STABLE</span>
            </div>
          </div>

          {/* Right Side: Active Node Details Frame */}
          <div className="md:col-span-6 flex flex-col justify-between text-left space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-[20px] relative overflow-hidden">
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[8px] font-mono uppercase bg-[#6366F1]/10 text-[#6366F1]">
                  NODE LEVEL: {selectedProfileId === "DON_V" ? "5" : selectedProfileId === "MARCUS" ? "4" : "3"}
                </div>
                <div className="text-xs font-mono text-slate-500 uppercase tracking-widest font-semibold">{currentProfile.role}</div>
                <div className="text-sm font-bold text-[#F8FAFC] tracking-tight mt-1">{currentProfile.name}</div>
                
                <div className="text-[11px] text-slate-400 font-sans mt-2.5 leading-relaxed bg-slate-950/50 p-2 rounded-[12px] border border-slate-900/40">
                  {currentProfile.bio}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950/20 border border-slate-900 rounded-[14px]">
                  <span className="text-[8px] font-mono text-slate-500 uppercase block font-semibold">Threat Profile</span>
                  <span className="text-[10px] font-mono font-bold text-[#F43F5E] block mt-1">{currentProfile.threat}</span>
                </div>
                <div className="p-3 bg-slate-950/20 border border-slate-900 rounded-[14px]">
                  <span className="text-[8px] font-mono text-slate-500 uppercase block font-semibold">Sync Status</span>
                  <span className="text-[10px] font-mono font-bold text-[#10B981] block mt-1">{currentProfile.status}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono p-3 bg-slate-950/40 border border-slate-900 rounded-[18px]">
              <span className="text-slate-500">CO-ARREST INDEX:</span>
              <span className="text-[#6366F1] font-bold">{currentProfile.coArrests} CASES SEEN</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-4 border-t border-slate-900/60 pt-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
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

    // Dynamic, professional timeline projection data (nature inspired tones: indigo/lavender)
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
        className={`premium-card premium-card-hover p-6 flex flex-col justify-between wireframe-mesh min-h-[440px] ${className}`}
        id={id}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/60 pb-4 mb-4">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-[14px] bg-slate-950 border border-slate-900 shadow-inner">
              <TrendingUp className="w-5 h-5 text-[#6366F1]" />
            </div>
            <div>
              <h3 className="text-sm font-sans font-bold text-[#F8FAFC] tracking-tight">{label}</h3>
              <p className="text-[10px] text-[#94A3B8] font-mono uppercase tracking-widest font-semibold font-bold">HAZARD TIMELINE PREDICTIVE MATRIX</p>
            </div>
          </div>
          
          {/* Custom Selector Chips (Design-Mandated: rounded-[18px]) */}
          <div className="flex items-center gap-1.5 bg-slate-950/40 p-1 rounded-[14px] border border-slate-900">
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
                    ? 'bg-[#141C2F] border border-slate-800 text-[#F8FAFC] shadow-sm' 
                    : 'text-slate-500 hover:text-slate-300 border border-transparent'
                }`}
              >
                {shift.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Viewport Frame (Design-Mandated: Charts 24px) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 flex-1 items-center">
          
          {/* Left: Interactive Real Chart Grid */}
          <div className="md:col-span-8 rounded-[24px] bg-slate-950/60 border border-slate-900 p-4 h-[250px] relative">
            <div className="absolute top-3 left-4 text-[9px] font-mono text-slate-500 uppercase">TEMPORAL PROBABILITY FLOW (%)</div>
            
            <div className="w-full h-full pt-4">
              <ResponsiveContainer width="100%" height="95%">
                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="probGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.01}/>
                    </linearGradient>
                    <linearGradient id="propGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A5B4FC" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#A5B4FC" stopOpacity={0.01}/>
                    </linearGradient>
                    <linearGradient id="violGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="hour" 
                    stroke="rgba(148, 163, 184, 0.25)" 
                    fontSize={8} 
                    fontFamily="JetBrains Mono"
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="rgba(148, 163, 184, 0.25)" 
                    fontSize={8} 
                    fontFamily="JetBrains Mono"
                    tickLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0A0F1D', 
                      borderColor: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '14px',
                      fontSize: '10px',
                      fontFamily: 'Inter'
                    }}
                    itemStyle={{ color: '#F8FAFC' }}
                  />
                  
                  {selectedShift === "ALL" && (
                    <Area 
                      type="monotone" 
                      dataKey="totalProbability" 
                      stroke="#6366F1" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#probGrad)" 
                    />
                  )}

                  {selectedShift === "PROPERTY" && (
                    <Area 
                      type="monotone" 
                      dataKey="property" 
                      stroke="#A5B4FC" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#propGrad)" 
                    />
                  )}

                  {selectedShift === "VIOLENT" && (
                    <Area 
                      type="monotone" 
                      dataKey="violent" 
                      stroke="#F43F5E" 
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
              <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-[20px]">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold mb-1">Peak Hazard Proj</div>
                <div className="text-xl font-bold text-[#F8FAFC]">16:00 - 18:00</div>
                <p className="text-[10px] text-slate-400 mt-1.5 leading-normal">
                  Identified 92% peak incident vector. Heavy transit crossings and financial centers flag positive risk co-occurrence.
                </p>
              </div>

              {/* Confidence interval threshold controller */}
              <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-[18px] space-y-2">
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                  <span className="flex items-center gap-1"><SlidersHorizontal className="w-3 h-3 text-slate-500" /> Confidence Level Floor</span>
                  <span className="text-[#6366F1] font-bold">&gt;{confidenceFloor}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="95" 
                  value={confidenceFloor}
                  onChange={(e) => setConfidenceFloor(parseInt(e.target.value))}
                  className="w-full accent-[#6366F1] bg-slate-900 h-1 rounded-[20px] focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-[9px] font-mono p-3 bg-slate-950/20 border border-slate-900 rounded-[14px]">
              <span className="text-slate-500">ML STATUS:</span>
              <span className="text-[#10B981] font-bold">RECURRENT_v5.1 ONLINE</span>
            </div>

          </div>

        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-4 border-t border-slate-900/60 pt-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
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

    // Dynamic, interactive custom alerts list
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
        className={`premium-card premium-card-hover p-6 flex flex-col justify-between min-h-[440px] ${className}`}
        id={id}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/60 pb-4 mb-4">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-[14px] bg-slate-950 border border-slate-900 shadow-inner">
              <Bell className="w-5 h-5 text-[#F43F5E]" />
            </div>
            <div>
              <h3 className="text-sm font-sans font-bold text-[#F8FAFC] tracking-tight">{label}</h3>
              <p className="text-[10px] text-[#94A3B8] font-mono uppercase tracking-widest font-semibold">LIVE CAD DISPATCH SIGNAL</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 bg-slate-950/40 p-1 rounded-[14px] border border-slate-900">
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
                    ? 'bg-[#141C2F] border border-slate-800 text-[#F8FAFC]' 
                    : 'text-slate-500 hover:text-slate-300 border border-transparent'
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
                className="p-3 rounded-[14px] bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-xs font-medium text-left flex items-center gap-2 mb-2 shadow-sm"
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
                className="p-3 bg-slate-950/30 border border-slate-900/80 rounded-[18px] text-left hover:border-slate-800/80 transition-colors group flex gap-3.5 items-start"
              >
                <div className="mt-1">
                  {al.severity === "CRITICAL" ? (
                    <span className="flex h-2 w-2 rounded-full bg-[#F43F5E] shadow-[0_0_8px_#F43F5E]" />
                  ) : al.severity === "WARNING" ? (
                    <span className="flex h-2 w-2 rounded-full bg-[#F59E0B]" />
                  ) : (
                    <span className="flex h-2 w-2 rounded-full bg-[#6366F1]" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F8FAFC] group-hover:text-[#6366F1] transition-colors">{al.title}</span>
                    <span className="text-[9px] font-mono text-slate-500">{al.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">{al.desc}</p>
                  
                  <div className="flex items-center gap-3 pt-1 text-[8px] font-mono text-slate-500">
                    <span>CAD_ID: {al.id}</span>
                    <span>•</span>
                    <span>NODE: {al.node}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Bulletin Modal or Inline Trigger */}
          <AnimatePresence>
            {showBulletinModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/90 rounded-[20px] p-4 flex flex-col justify-between z-20 border border-slate-800/80"
              >
                <form onSubmit={handleAddAlert} className="space-y-3 flex flex-col h-full justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans font-bold text-[#F8FAFC]">Draft Priority Dispatch Bulletin</span>
                      <button 
                        type="button"
                        onClick={() => setShowBulletinModal(false)}
                        className="text-[10px] font-mono text-slate-500 hover:text-slate-300"
                      >
                        [Cancel]
                      </button>
                    </div>
                    
                    {/* Input field (Design-Mandated: Inputs 20px) */}
                    <input 
                      type="text" 
                      placeholder="Enter emergency bulletin description..." 
                      value={bulletinText}
                      onChange={(e) => setBulletinText(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 text-xs text-[#F8FAFC] placeholder-slate-600 rounded-[20px] focus:outline-none focus:border-[#6366F1]/50"
                      required
                    />
                  </div>

                  {/* Buttons (Design-Mandated: Buttons 18px) */}
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-[#6366F1] hover:bg-[#6366F1]/90 text-white font-sans font-semibold text-xs py-2.5 rounded-[18px] flex items-center justify-center gap-1.5 shadow-lg shadow-[#6366F1]/20 transition-all duration-200"
                    >
                      <Send className="w-3.5 h-3.5" /> Broadcast Now
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBulletinModal(false)}
                      className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-300 font-sans text-xs rounded-[18px] transition-colors"
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
        <div className="pt-4 mt-4 border-t border-slate-900/60 flex items-center justify-between">
          <button
            onClick={() => setShowBulletinModal(true)}
            className="px-4 py-2 bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] font-sans font-semibold text-xs rounded-[18px] flex items-center gap-2 hover:bg-[#6366F1]/20 transition-all duration-200"
          >
            <PlusCircle className="w-4 h-4" /> Trigger Agency Bulletin
          </button>

          <span className="text-[9px] font-mono text-slate-500">SOCKET_ACTIVE: TLS_SECURE</span>
        </div>
      </motion.div>
    );
  }

  // Fallback card structure
  return (
    <div className={`premium-card p-6 flex flex-col justify-between border-dashed border-slate-800 min-h-[250px] ${className}`} id={id}>
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] font-bold">{label}</h3>
        <span className="text-[9px] font-mono text-slate-600 bg-slate-900 px-1.5 py-0.5 rounded">CONTAINER</span>
      </div>
      
      <div className="flex-1 flex items-center justify-center text-[#94A3B8] my-4">
        <div className="flex flex-col items-center gap-2 max-w-xs text-center">
          <Info className="w-5 h-5 text-slate-600" />
          <span className="text-xs font-sans">Future interactive component layout placeholder</span>
        </div>
      </div>
      
      <div className="text-[9px] font-mono text-slate-600 text-right uppercase">NODE: STABLE</div>
    </div>
  );
}

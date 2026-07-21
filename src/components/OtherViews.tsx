/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Map, 
  Network, 
  TrendingUp, 
  Bell, 
  Settings, 
  Sliders, 
  ShieldAlert, 
  Shield, 
  Database, 
  Lock, 
  Key, 
  UserCheck, 
  Terminal,
  Activity,
  FileCheck,
  Compass,
  Link as LinkIcon,
  Search,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Fingerprint,
  Radio,
  Send,
  Plus
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

/* -------------------------------------------------------------
 * 1. CRIME MAP VIEW CONSOLE (INTERACTIVE RADIAL GRID & DISPATCH CHIPS)
 * ------------------------------------------------------------- */
export function CrimeMapView() {
  const [selectedLayer, setSelectedLayer] = useState<"VECTORS" | "HEAT" | "PATROLS">("VECTORS");
  const [activeSector, setActiveSector] = useState<string>("ALPHA");
  const [patrolSlider, setPatrolSlider] = useState<number>(8);

  const sectors: Record<string, {
    name: string;
    threatIndex: string;
    patrols: number;
    incidents: number;
    description: string;
    coordinates: string;
    status: string;
  }> = {
    ALPHA: {
      name: "Sector Alpha (Downtown Core)",
      threatIndex: "CRITICAL (84%)",
      patrols: 12,
      incidents: 42,
      description: "Heavy commercial sector showing dense vehicular traffic. High frequency of late-night signal anomalies.",
      coordinates: "40.7128° N, 74.0060° W",
      status: "TACTICAL ACCELERATION"
    },
    BETA: {
      name: "Sector Beta (Commercial Harbor)",
      threatIndex: "ELEVATED (59%)",
      patrols: 6,
      incidents: 24,
      description: "Coastal logistical warehouses. Active container checking and maritime telemetry integrations in progress.",
      coordinates: "40.7012° N, 74.0150° W",
      status: "STEADY MONITORING"
    },
    DELTA: {
      name: "Sector Delta (Industrial Wharves)",
      threatIndex: "MODERATE (41%)",
      patrols: 5,
      incidents: 12,
      description: "Low-density processing yards. Automated gate sensors reporting nominal, secure patterns.",
      coordinates: "40.7306° N, 73.9352° W",
      status: "NOMINAL PATROL"
    }
  };

  const activeData = sectors[activeSector] || sectors.ALPHA;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6"
      id="crime-map-view"
    >
      <div className="premium-card p-6 wireframe-mesh min-h-[500px] flex flex-col justify-between">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/60 pb-5">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-[14px] bg-slate-950 border border-slate-900 shadow-inner">
              <Map className="w-5 h-5 text-[#6366F1]" />
            </div>
            <div>
              <h3 className="text-base font-sans font-bold text-[#F8FAFC] tracking-tight">Crime Mapping Console</h3>
              <p className="text-xs text-[#94A3B8] font-sans">Geospatial Vector Analytics & Live Tactical Grids</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Custom layer switcher buttons (Design-Mandated: Buttons 18px) */}
            <div className="flex items-center gap-1.5 bg-slate-950/40 p-1 rounded-[14px] border border-slate-900">
              {(["VECTORS", "HEAT", "PATROLS"] as const).map((layer) => (
                <button
                  key={layer}
                  onClick={() => setSelectedLayer(layer)}
                  className={`px-3 py-1.5 text-[10px] font-mono rounded-[10px] transition-all duration-200 font-semibold ${
                    selectedLayer === layer 
                      ? 'bg-[#141C2F] border border-slate-800 text-[#F8FAFC] shadow-sm' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {layer === "VECTORS" ? "Vector GL Grid" : layer === "HEAT" ? "Heat Bounds" : "Active Patrols"}
                </button>
              ))}
            </div>

            <div className="px-3 py-1.5 bg-slate-950 border border-slate-900 rounded-[18px] text-[10px] font-mono text-[#10B981] flex items-center gap-2 select-none font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" /> SYSTEM_LIVE
            </div>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 flex-1">
          
          {/* Interactive GIS Visual Map Canvas (Desktop view) */}
          <div className="lg:col-span-8 rounded-[28px] border border-slate-900 bg-slate-950/50 p-6 relative flex flex-col justify-between min-h-[350px] overflow-hidden">
            {/* Background grid indicators */}
            <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(99,102,241,0.03)_0%,transparent_70%]" />
            <div className="absolute inset-y-0 left-1/4 w-[1px] bg-slate-900/30 pointer-events-none" />
            <div className="absolute inset-y-0 left-2/4 w-[1px] bg-slate-900/30 pointer-events-none" />
            <div className="absolute inset-y-0 left-3/4 w-[1px] bg-slate-900/30 pointer-events-none" />
            <div className="absolute inset-x-0 top-1/3 h-[1px] bg-slate-900/30 pointer-events-none" />
            <div className="absolute inset-x-0 top-2/3 h-[1px] bg-slate-900/30 pointer-events-none" />

            {/* Clickable Sector hotspots vector SVG overlay */}
            <div className="absolute inset-0 p-8 flex items-center justify-center pointer-events-none">
              <div className="w-full h-full relative">
                {/* Sector Alpha click hub */}
                <button 
                  onClick={() => setActiveSector("ALPHA")}
                  className={`absolute top-[25%] left-[25%] p-3.5 rounded-[18px] border flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto ${
                    activeSector === "ALPHA"
                      ? "bg-[#6366F1]/10 border-[#6366F1] shadow-[0_0_20px_rgba(99,102,241,0.25)] scale-105"
                      : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <span className="font-mono text-[9px] font-bold text-white">SEC_ALPHA</span>
                  {selectedLayer === "HEAT" && <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E] animate-ping" />}
                </button>

                {/* Sector Beta click hub */}
                <button 
                  onClick={() => setActiveSector("BETA")}
                  className={`absolute bottom-[35%] right-[30%] p-3.5 rounded-[18px] border flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto ${
                    activeSector === "BETA"
                      ? "bg-[#6366F1]/10 border-[#6366F1] shadow-[0_0_20px_rgba(99,102,241,0.25)] scale-105"
                      : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <span className="font-mono text-[9px] font-bold text-white">SEC_BETA</span>
                  {selectedLayer === "HEAT" && <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] animate-pulse" />}
                </button>

                {/* Sector Delta click hub */}
                <button 
                  onClick={() => setActiveSector("DELTA")}
                  className={`absolute top-[45%] right-[20%] p-3.5 rounded-[18px] border flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto ${
                    activeSector === "DELTA"
                      ? "bg-[#6366F1]/10 border-[#6366F1] shadow-[0_0_20px_rgba(99,102,241,0.25)] scale-105"
                      : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <span className="font-mono text-[9px] font-bold text-white">SEC_DELTA</span>
                  {selectedLayer === "HEAT" && <span className="w-2 h-2 rounded-full bg-[#10B981]" />}
                </button>
              </div>
            </div>

            {/* Scale / HUD Indicator lines */}
            <div className="flex justify-between items-center text-slate-500 text-[10px] font-mono z-10">
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#6366F1] animate-spin-slow" />
                TACTICAL RADIAL HUD ACTIVE
              </span>
              <span>FOV: 120° AZIMUTH</span>
            </div>

            <div className="flex justify-between items-end z-10 pt-4">
              <div className="text-left font-mono text-[9px] text-slate-500 space-y-0.5">
                <div>SYSTEM MODEL: WGS-84 HEIGHT GRID</div>
                <div>PRECISION RATIO: 1:1,500 LAT-OFFSET</div>
              </div>
              <div className="text-xs font-mono text-slate-300 bg-slate-950 border border-slate-900 px-3 py-1 rounded-[12px] select-none uppercase tracking-wider">
                {selectedLayer} ACTIVE
              </div>
            </div>

          </div>

          {/* Side Panel Details HUD */}
          <div className="lg:col-span-4 flex flex-col justify-between text-left space-y-5">
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-[20px] space-y-3">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Selected Region</div>
                <div className="text-sm font-sans font-bold text-[#F8FAFC] tracking-tight">{activeData.name}</div>
                <div className="text-[11px] text-slate-400 font-sans leading-relaxed">{activeData.description}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950/20 border border-slate-900 rounded-[14px]">
                  <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">Incidents (24h)</span>
                  <span className="text-lg font-bold text-[#F8FAFC] block mt-0.5">{activeData.incidents} Incidents</span>
                </div>
                <div className="p-3 bg-slate-950/20 border border-slate-900 rounded-[14px]">
                  <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">Risk Rating</span>
                  <span className="text-lg font-bold text-[#F43F5E] block mt-0.5">{activeData.threatIndex}</span>
                </div>
              </div>
            </div>

            {/* Slider Patrol Units calibrator (Design-Mandated: Inputs 20px) */}
            <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-[24px] space-y-3">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5 text-slate-500" /> Allocate Patrol Units</span>
                <span className="text-[#6366F1] font-bold">{patrolSlider} Vehicles</span>
              </div>
              <input 
                type="range" 
                min="2" 
                max="24" 
                value={patrolSlider}
                onChange={(e) => setPatrolSlider(parseInt(e.target.value))}
                className="w-full accent-[#6366F1] bg-slate-900 h-1 rounded-[20px] focus:outline-none cursor-pointer"
              />
              <div className="text-[9px] font-mono text-slate-500 leading-normal text-center uppercase">
                AUTOMATED RESPONSE CALCULATION ACTIVE
              </div>
            </div>

          </div>

        </div>

        {/* Footer Section */}
        <div className="border-t border-slate-900/60 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <span>ALIGNED COORDINATE MATRIX: EPSG:4326 // WGS-84</span>
          <div className="flex gap-4">
            <span>RECEIVER STATE: COMPLETED</span>
            <span>POLYGON_INDEX: CACHED</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------
 * 2. CRIMINAL NETWORK VIEW CONSOLE (INTERACTIVE SYNDICATE DIRECTORY)
 * ------------------------------------------------------------- */
export function CriminalNetworkView() {
  const [selectedDepth, setSelectedDepth] = useState<"SYNDICATE" | "ASSOCIATES">("SYNDICATE");
  const [selectedProfileId, setSelectedProfileId] = useState<string>("MARCUS");

  const syndicateProfiles: Record<string, {
    name: string;
    alias: string;
    role: string;
    riskIndex: string;
    status: string;
    description: string;
    connections: string[];
    associatedCrimes: string[];
  }> = {
    DON_V: {
      name: "Victor J. Volkov",
      alias: "Don Victor",
      role: "Fictional Syndicate Kingpin",
      riskIndex: "CRITICAL [LEVEL-5]",
      status: "UNDER INVESTIGATION",
      description: "Identified logistical and financial coordinator of northern distribution channels. Commands operations via secured digital keys.",
      connections: ["Marcus Chen", "Elena Rostova"],
      associatedCrimes: ["Digital wire fraud", "Illegal port distribution", "Coordinated conspiracy"]
    },
    MARCUS: {
      name: "Marcus Chen",
      alias: "Apex Lead",
      role: "Tactical Coordinator",
      riskIndex: "SEVERE [LEVEL-4]",
      status: "ACTIVE PATROL ALERT",
      description: "Direct field contact managing physical transport networks. Heavy association with Sector 4 incident clusters.",
      connections: ["Victor Volkov", "Slick Malone"],
      associatedCrimes: ["High-value cargo obstruction", "Conspiracy under investigation"]
    },
    ELENA: {
      name: "Elena Rostova",
      alias: "Treasurer",
      role: "Offshore Ledger Administrator",
      riskIndex: "ELEVATED [LEVEL-3]",
      status: "SURVEILLANCE NODE",
      description: "Manages encrypted distributed asset transfers and financial routing models. Operational lead on cryptology systems.",
      connections: ["Victor Volkov", "Marcus Chen"],
      associatedCrimes: ["Asset relocation", "Electronic laundering proxy"]
    }
  };

  const activeProfile = syndicateProfiles[selectedProfileId] || syndicateProfiles.MARCUS;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6"
      id="criminal-network-view"
    >
      <div className="premium-card p-6 wireframe-mesh min-h-[500px] flex flex-col justify-between">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/60 pb-5">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-[14px] bg-slate-950 border border-slate-900 shadow-inner">
              <Network className="w-5 h-5 text-[#6366F1]" />
            </div>
            <div>
              <h3 className="text-base font-sans font-bold text-[#F8FAFC] tracking-tight">Criminal Network Link Analysis</h3>
              <p className="text-xs text-[#94A3B8] font-sans">Syndicate Affiliation, Direct Associations & Target Node Directory</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 bg-slate-950/40 p-1 rounded-[14px] border border-slate-900">
            {(["SYNDICATE", "ASSOCIATES"] as const).map((depth) => (
              <button
                key={depth}
                onClick={() => setSelectedDepth(depth)}
                className={`px-3 py-1.5 text-[10px] font-mono rounded-[10px] transition-all duration-200 font-semibold ${
                  selectedDepth === depth 
                    ? 'bg-[#141C2F] border border-slate-800 text-[#F8FAFC]' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {depth === "SYNDICATE" ? "Core Targets" : "Secondary Connections"}
              </button>
            ))}
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 flex-1">
          
          {/* Target Selection list (Left side) */}
          <div className="lg:col-span-5 space-y-2.5 text-left">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold pl-1">Key Targets Catalog</span>
            <div className="space-y-2">
              {Object.entries(syndicateProfiles).map(([id, p]) => (
                <div
                  key={id}
                  onClick={() => setSelectedProfileId(id)}
                  className={`p-3.5 rounded-[18px] border transition-all duration-200 cursor-pointer flex justify-between items-center ${
                    selectedProfileId === id
                      ? "bg-[#141C2F] border-[#6366F1]/50 shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                      : "bg-slate-950/40 border-slate-900 hover:border-slate-800 hover:bg-slate-900/30"
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-sans font-bold text-[#F8FAFC]">{p.name}</p>
                    <p className="text-[10px] font-mono text-slate-500">{p.role}</p>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-slate-950 rounded border border-slate-900 text-slate-400 uppercase">{p.alias}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Target Profile HUD (Right side) */}
          <div className="lg:col-span-7 rounded-[28px] border border-slate-900 bg-slate-950/50 p-6 flex flex-col justify-between text-left min-h-[300px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-900/60 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">Target Identity Document</span>
                  <h4 className="text-base font-sans font-bold text-[#F8FAFC] tracking-tight">{activeProfile.name}</h4>
                </div>
                <span className="text-[9px] font-mono font-bold px-2 py-1 bg-red-500/10 text-[#F43F5E] rounded border border-red-500/10">
                  {activeProfile.riskIndex}
                </span>
              </div>

              <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-[18px] border border-slate-900">
                <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block">Biographical Assessment</span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeProfile.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block">Direct Affiliations</span>
                  <div className="flex flex-wrap gap-1">
                    {activeProfile.connections.map((c, i) => (
                      <span key={i} className="text-[9px] font-mono bg-slate-950 border border-slate-900 text-[#6366F1] px-2.5 py-1 rounded-[10px]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block">Incidence Indicators</span>
                  <div className="flex flex-wrap gap-1 animate-pulse">
                    <span className="text-[9px] font-mono bg-slate-950 border border-slate-900 text-slate-400 px-2 py-0.5 rounded-[8px]">
                      {activeProfile.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block">Associated Investigation Files</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-400 font-sans">
                  {activeProfile.associatedCrimes.map((crime, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-slate-950/30 border border-slate-900 rounded-[12px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />
                      <span className="truncate">{crime}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-4 border-t border-slate-900/60 mt-4">
              <span>SECURITY RATING: HIGH ASSIGNMENT</span>
              <span>SYNCHRONIZED METRICS CACHED</span>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500 font-bold">
          <span>CO-OCCURRENCE RATIO: STRICT INDEX ACTIVE</span>
          <span>SOURCE SEED: REGIONAL_TACTICAL_FILES</span>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------
 * 3. PREDICTIONS VIEW CONSOLE (PRECISE AREA CHARTS & ESTIMATES)
 * ------------------------------------------------------------- */
export function PredictionsView() {
  const [selectedConfidence, setSelectedConfidence] = useState<"HIGH" | "ALL">("HIGH");
  const [timelineFilter, setTimelineFilter] = useState<number>(85);

  const mockForecastTimeline = [
    { hour: '00:00', generalRisk: 30, criticalRisk: 10 },
    { hour: '04:00', generalRisk: 15, criticalRisk: 5 },
    { hour: '08:00', generalRisk: 45, criticalRisk: 20 },
    { hour: '12:00', generalRisk: 75, criticalRisk: 40 },
    { hour: '16:00', generalRisk: 90, criticalRisk: 75 },
    { hour: '20:00', generalRisk: 80, criticalRisk: 55 },
    { hour: '23:59', generalRisk: 45, criticalRisk: 15 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6"
      id="predictions-view"
    >
      <div className="premium-card p-6 wireframe-mesh min-h-[500px] flex flex-col justify-between">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/60 pb-5">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-[14px] bg-slate-950 border border-slate-900 shadow-inner">
              <TrendingUp className="w-5 h-5 text-[#6366F1]" />
            </div>
            <div>
              <h3 className="text-base font-sans font-bold text-[#F8FAFC] tracking-tight">Predictive Modeling & Risk Matrix</h3>
              <p className="text-xs text-[#94A3B8] font-sans">Temporal Forecast Timelines & Machine Learning Confidence Ranges</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 bg-slate-950/40 p-1 rounded-[14px] border border-slate-900">
            {(["HIGH", "ALL"] as const).map((conf) => (
              <button
                key={conf}
                onClick={() => setSelectedConfidence(conf)}
                className={`px-3 py-1.5 text-[10px] font-mono rounded-[10px] transition-all duration-200 font-semibold ${
                  selectedConfidence === conf 
                    ? 'bg-[#141C2F] border border-slate-800 text-[#F8FAFC] shadow-sm' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {conf === "HIGH" ? "Confidence High (>85%)" : "All Forecast Vectors"}
              </button>
            ))}
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 flex-1 items-center">
          
          {/* Real Recharts Forecast Grid Frame (Design-Mandated: Charts 24px) */}
          <div className="lg:col-span-8 rounded-[24px] bg-slate-950/50 border border-slate-900 p-5 h-[280px] relative">
            <div className="absolute top-4 left-4 text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">24-HOUR RADIAL RISK DISTRIBUTION MODEL</div>
            
            <div className="w-full h-full pt-6">
              <ResponsiveContainer width="100%" height="95%">
                <AreaChart data={mockForecastTimeline} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="generalRiskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.01}/>
                    </linearGradient>
                    <linearGradient id="criticalRiskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="hour" 
                    stroke="rgba(148, 163, 184, 0.2)" 
                    fontSize={8} 
                    fontFamily="JetBrains Mono"
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="rgba(148, 163, 184, 0.2)" 
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

                  {selectedConfidence === "ALL" && (
                    <Area 
                      type="monotone" 
                      dataKey="generalRisk" 
                      stroke="#6366F1" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#generalRiskGrad)" 
                    />
                  )}

                  <Area 
                    type="monotone" 
                    dataKey="criticalRisk" 
                    stroke="#F43F5E" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#criticalRiskGrad)" 
                  />

                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Parameters Box */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full text-left space-y-4">
            <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-[20px] space-y-3">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Forecasting Model Details</div>
              <div className="text-xs font-sans font-bold text-slate-300">Model: Recurrent Neural (v5.1)</div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Predictive accuracy evaluates historic variables, seasonal heatmaps, and spatial co-occurrence algorithms to model daily peak risk zones.
              </p>
            </div>

            {/* Slider calibrator (Design-Mandated: Inputs 20px) */}
            <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-[24px] space-y-3">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5"><SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" /> Confidence Level Floor</span>
                <span className="text-[#6366F1] font-bold">&gt;{timelineFilter}%</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="98" 
                value={timelineFilter}
                onChange={(e) => setTimelineFilter(parseInt(e.target.value))}
                className="w-full accent-[#6366F1] bg-slate-900 h-1 rounded-[20px] focus:outline-none cursor-pointer"
              />
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <span>ALGORITHM CONFIDENCE: MACHINE_EVAL_CALIBRATED</span>
          <span>ACCURACY RATIO: 91.4% COMPLETED</span>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------
 * 4. ALERTS CONSOLE VIEW (DPR DISPATCH FEED EVENT STREAM)
 * ------------------------------------------------------------- */
export function AlertsView() {
  const [activeTab, setActiveTab] = useState<"DISPATCH" | "CRITICAL">("DISPATCH");
  const [dispatchAlerts, setDispatchAlerts] = useState([
    { id: "CAD_91A", type: "CRITICAL", title: "Biometric Signal Anomaly Reported", sector: "SEC_ALPHA", time: "Just now", desc: "Wearable signal tracking lost for designated asset. Emergency check sequence initiated." },
    { id: "CAD_88C", type: "WARNING", title: "CCTV Traffic Camera Synchronization Failure", sector: "SEC_BETA", time: "4m ago", desc: "Camera node #88 experiencing high jitter and packet drops on regional fiber lines." },
    { id: "CAD_72E", type: "INFO", title: "Federal Registry Sync Completed", sector: "SEC_DELTA", time: "18m ago", desc: "Daily ingestion loop incorporated state-wide threat files. Cache validated successfully." }
  ]);
  const [newIncidentTitle, setNewIncidentTitle] = useState("");

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncidentTitle.trim()) return;

    const freshEvent = {
      id: `CAD_${Math.floor(100 + Math.random() * 900)}X`,
      type: "CRITICAL",
      title: newIncidentTitle,
      sector: "OFFICER_DIRECTIVE",
      time: "Just now",
      desc: "Emergency dispatcher instruction propagated directly from crime analytics command workstation."
    };

    setDispatchAlerts([freshEvent, ...dispatchAlerts]);
    setNewIncidentTitle("");
  };

  const filteredLogs = dispatchAlerts.filter(al => {
    if (activeTab === "CRITICAL") return al.type === "CRITICAL";
    return true;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6"
      id="alerts-view"
    >
      <div className="premium-card p-6 min-h-[500px] flex flex-col justify-between">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/60 pb-5">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-[14px] bg-slate-950 border border-slate-900 shadow-inner">
              <Bell className="w-5 h-5 text-[#F43F5E]" />
            </div>
            <div>
              <h3 className="text-base font-sans font-bold text-[#F8FAFC] tracking-tight">Active Incident Dispatch Console</h3>
              <p className="text-xs text-[#94A3B8] font-sans">High-Priority CAD Dispatch Streams & Tactical Patrol Signals</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 bg-slate-950/40 p-1 rounded-[14px] border border-slate-900">
            {(["DISPATCH", "CRITICAL"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-[10px] font-mono rounded-[10px] transition-all duration-200 font-semibold ${
                  activeTab === tab 
                    ? 'bg-[#141C2F] border border-slate-800 text-[#F8FAFC]' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab === "DISPATCH" ? "All Logs" : "Critical Only"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 flex-1">
          
          {/* Interactive Incident Event Stream (Left side) */}
          <div className="lg:col-span-7 space-y-3.5 text-left overflow-y-auto max-h-[360px] pr-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold pl-1">Live CAD Dispatch Stream</span>
            
            <div className="space-y-2.5">
              {filteredLogs.map((log) => (
                <div 
                  key={log.id}
                  className="p-3.5 bg-slate-950/30 border border-slate-900/80 rounded-[18px] hover:border-slate-800 transition-colors flex gap-3.5 items-start group"
                >
                  <div className="mt-1">
                    {log.type === "CRITICAL" ? (
                      <span className="flex h-2.5 w-2.5 rounded-full bg-[#F43F5E] shadow-[0_0_8px_#F43F5E]" />
                    ) : log.type === "WARNING" ? (
                      <span className="flex h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
                    ) : (
                      <span className="flex h-2.5 w-2.5 rounded-full bg-[#6366F1]" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-sans font-bold text-[#F8FAFC] group-hover:text-[#6366F1] transition-colors">{log.title}</p>
                      <span className="text-[9px] font-mono text-slate-500">{log.time}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed">{log.desc}</p>
                    
                    <div className="flex items-center gap-3 pt-1 text-[8.5px] font-mono text-slate-500">
                      <span>ID: {log.id}</span>
                      <span>•</span>
                      <span>REGION: {log.sector}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trigger Dispatch Event form (Right side - Design-Mandated: Inputs 20px, Buttons 18px) */}
          <div className="lg:col-span-5 rounded-[28px] border border-slate-900 bg-slate-950/50 p-6 flex flex-col justify-between text-left min-h-[300px]">
            <form onSubmit={handleCreateIncident} className="space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="border-b border-slate-900/60 pb-3">
                  <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block">Incident Dispatch Tool</span>
                  <h4 className="text-sm font-sans font-bold text-[#F8FAFC] tracking-tight mt-0.5">Propagate Sector Incident Directive</h4>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Alert Action Description</label>
                  <input 
                    type="text" 
                    placeholder="Enter precise incident signal..." 
                    value={newIncidentTitle}
                    onChange={(e) => setNewIncidentTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 text-xs text-[#F8FAFC] placeholder-slate-600 rounded-[20px] focus:outline-none focus:border-[#6366F1]/50"
                    required
                  />
                </div>

                <div className="p-3 bg-slate-950 border border-slate-900 rounded-[18px] text-[10px] text-slate-500 leading-normal font-mono">
                  Biometric credentials, workstation parameters, and GPS coordinate hashes are incorporated securely inside this CAD telemetry packet.
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#6366F1] hover:bg-[#6366F1]/90 text-white font-sans font-bold text-xs py-3 rounded-[18px] flex items-center justify-center gap-2 shadow-lg shadow-[#6366F1]/20 transition-all duration-200 mt-4"
              >
                <Send className="w-4 h-4" /> Broadcast Dispatch Alert
              </button>
            </form>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <span>SECURE LINK STATUS: CONNECTED</span>
          <span>LAST FLUSH CALIBRATION: ONLINE</span>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------
 * 5. SYSTEM SETTINGS VIEW (AGENCY PARAMETERS & CLEARANCE MODULE)
 * ------------------------------------------------------------- */
export function SettingsView() {
  const [telemetryFrequency, setTelemetryFrequency] = useState<number>(30);
  const [biometricPass, setBiometricPass] = useState("");
  const [isCredentialActive, setIsCredentialActive] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleUpdateBiometric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!biometricPass.trim()) return;

    setIsCredentialActive(true);
    setStatusMsg("Cryptographic Access Key Refreshed successfully!");
    setBiometricPass("");
    setTimeout(() => setStatusMsg(null), 3500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6"
      id="settings-view"
    >
      <div className="premium-card p-6 min-h-[500px] flex flex-col justify-between">
        
        {/* Header Section */}
        <div className="flex items-center gap-3 border-b border-slate-900/60 pb-5">
          <div className="p-2.5 rounded-[14px] bg-slate-950 border border-slate-900 shadow-inner">
            <Settings className="w-5 h-5 text-[#6366F1]" />
          </div>
          <div className="text-left">
            <h3 className="text-base font-sans font-bold text-[#F8FAFC] tracking-tight">System Security & Access Controls</h3>
            <p className="text-xs text-[#94A3B8] font-sans">Manage Police Agency Integration Channels, Biometrics, and Sync Telemetry</p>
          </div>
        </div>

        {/* Setting Modules Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 flex-1 text-left">
          
          {/* Clearance Config Card with Soft Neumorphism */}
          <div className="p-5 soft-neumorphic rounded-[24px] flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-[#F59E0B]" />
                <h4 className="text-xs font-mono uppercase tracking-widest font-bold text-[#F8FAFC]">Clearance Biometric Keys</h4>
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed font-sans">
                Establish secure encryption passkeys to query national databases. Security protocols automatically terminate inactive officer sessions.
              </p>

              {/* Success notification banner */}
              {statusMsg && (
                <div className="p-2.5 rounded-[14px] bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-[10px] font-sans font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{statusMsg}</span>
                </div>
              )}

              {/* Form elements (Design-Mandated: Inputs 20px, Buttons 18px) */}
              <form onSubmit={handleUpdateBiometric} className="space-y-2.5 pt-1">
                <input 
                  type="password" 
                  placeholder="Enter cryptographic clearance key..." 
                  value={biometricPass}
                  onChange={(e) => setBiometricPass(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-900 text-xs text-[#F8FAFC] placeholder-slate-600 rounded-[20px] focus:outline-none focus:border-[#6366F1]/50"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-[#141C2F] border border-slate-800 text-[#F8FAFC] font-sans font-bold text-xs py-2.5 rounded-[18px] hover:border-slate-700 hover:bg-[#1C2843] transition-colors"
                >
                  Configure Cryptographic Key
                </button>
              </form>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-900/60 flex justify-between items-center text-[9px] font-mono text-slate-500">
              <span className="flex items-center gap-1"><UserCheck className="w-3.5 h-3.5 text-slate-500" /> POLICY ACCESS: STABLE</span>
              <span className="text-slate-400">ROLE: CMD_OFFICER</span>
            </div>
          </div>

          {/* Database Ingest Pipelines */}
          <div className="p-5 soft-neumorphic rounded-[24px] flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <Key className="w-4 h-4 text-[#6366F1]" />
                <h4 className="text-xs font-mono uppercase tracking-widest font-bold text-[#F8FAFC]">API Node Connectors</h4>
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed font-sans">
                Review integration pipes syncing intelligence files from federal networks, state dispatch systems, and county registries.
              </p>

              <div className="space-y-2 pt-1">
                <div className="p-2.5 bg-slate-950/60 border border-slate-900 rounded-[14px] flex items-center justify-between">
                  <span className="text-xs font-sans font-semibold text-slate-300">FED_CENTRAL_DB</span>
                  <span className="text-[8.5px] font-mono px-2 py-0.5 bg-[#10B981]/10 text-[#10B981] rounded-full">ACTIVE</span>
                </div>
                <div className="p-2.5 bg-slate-950/60 border border-slate-900 rounded-[14px] flex items-center justify-between">
                  <span className="text-xs font-sans font-semibold text-slate-300">REGIONAL_CAD_LINK</span>
                  <span className="text-[8.5px] font-mono px-2 py-0.5 bg-[#10B981]/10 text-[#10B981] rounded-full">ACTIVE</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-900/60 flex justify-between items-center text-[9px] font-mono text-slate-500">
              <span className="flex items-center gap-1"><Database className="w-3.5 h-3.5 text-slate-500" /> 5 CORE CHANNELS ACTIVE</span>
              <span className="text-[#6366F1] hover:underline cursor-pointer font-bold">MANAGE APIS</span>
            </div>
          </div>

          {/* Telemetry settings with slider customisation */}
          <div className="p-5 soft-neumorphic rounded-[24px] flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-[#10B981]" />
                <h4 className="text-xs font-mono uppercase tracking-widest font-bold text-[#F8FAFC]">Telemetry Sync Rate</h4>
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed font-sans">
                Adjust precision and polling intervals for live geofencing maps and terminal query synchronizations. Lower intervals require wider channels.
              </p>

              {/* Telemetry slider (Design-Mandated: Inputs 20px) */}
              <div className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-[20px] space-y-2">
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                  <span>Replication Polling Frequency</span>
                  <span className="text-[#10B981] font-bold">{telemetryFrequency} Seconds</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="120" 
                  value={telemetryFrequency}
                  onChange={(e) => setTelemetryFrequency(parseInt(e.target.value))}
                  className="w-full accent-[#10B981] bg-slate-900 h-1 rounded-[20px] focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-900/60 flex justify-between items-center text-[9px] font-mono text-slate-500">
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-slate-500" /> SECURE TUNING ACTIVE</span>
              <span className="text-[#6366F1] hover:underline cursor-pointer font-bold">RE-CALIBRATE</span>
            </div>
          </div>

          {/* Crytographic Audit Trail logs */}
          <div className="p-5 soft-neumorphic rounded-[24px] flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-slate-400" />
                <h4 className="text-xs font-mono uppercase tracking-widest font-bold text-[#F8FAFC]">Cryptographic Ledger Audits</h4>
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed font-sans">
                All incident broadcasts and clearance modifications are cryptographically sealed and written permanently into regional oversight files.
              </p>

              <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-[18px] text-[10px] font-mono text-slate-500 space-y-1">
                <div className="truncate">LOG: CLEARANCE_KEY_ROTATED // AUTH: SMITH_RJ</div>
                <div className="truncate">LOG: REGIONAL_CAD_POLLING // SUCCESSFUL_SYNC</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-900/60 flex justify-between items-center text-[9px] font-mono text-slate-500">
              <span className="flex items-center gap-1"><FileCheck className="w-3.5 h-3.5 text-slate-500" /> TAMPER-EVIDENT ACTIVATED</span>
              <span className="text-[#6366F1] hover:underline cursor-pointer font-bold">EXPORT COPIES</span>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <span>SECURITY LEVEL ASSIGNMENT: FULL CLEARANCE</span>
          <span>BUILD VERSION: v1.12.4 SECURE_REPLICATED</span>
        </div>
      </div>
    </motion.div>
  );
}

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
  Plus,
  Users,
  MapPin,
  Clock,
  Target,
  Briefcase,
  Sparkles,
  Eye,
  X,
  Check,
  AlertCircle,
  Info,
  ShieldCheck,
  Trash2,
  Sun,
  Moon,
  Monitor,
  Palette,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { getBackendUrl, setBackendUrl, checkBackendHealth, BackendHealth } from '../services/api';

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-[14px] bg-white border border-slate-200/60 shadow-sm">
              <Map className="w-5 h-5 text-[#3B8D72]" />
            </div>
            <div>
              <h3 className="text-base font-sans font-bold text-[#1E293B] tracking-tight">Crime Mapping Console</h3>
              <p className="text-xs text-slate-400 font-sans font-medium">Geospatial Vector Analytics & Live Tactical Grids</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-[14px] border border-slate-200">
              {(["VECTORS", "HEAT", "PATROLS"] as const).map((layer) => (
                <button
                  key={layer}
                  onClick={() => setSelectedLayer(layer)}
                  className={`px-3 py-1.5 text-[10px] font-mono rounded-[10px] transition-all duration-200 font-bold ${
                    selectedLayer === layer 
                      ? 'bg-white border border-slate-200 text-[#1E293B] shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {layer === "VECTORS" ? "Vector GL Grid" : layer === "HEAT" ? "Heat Bounds" : "Active Patrols"}
                </button>
              ))}
            </div>

            <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-[18px] text-[10px] font-mono text-[#3B8D72] flex items-center gap-2 select-none font-bold shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B8D72] animate-pulse" /> SYSTEM_LIVE
            </div>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 flex-1">
          
          {/* Interactive GIS Visual Map Canvas */}
          <div className="lg:col-span-8 rounded-[28px] border border-slate-200 bg-white/80 p-6 relative flex flex-col justify-between min-h-[350px] overflow-hidden shadow-inner">
            <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(59,141,114,0.01)_0%,transparent_70%]" />
            <div className="absolute inset-y-0 left-1/4 w-[1px] bg-slate-100 pointer-events-none" />
            <div className="absolute inset-y-0 left-2/4 w-[1px] bg-slate-100 pointer-events-none" />
            <div className="absolute inset-y-0 left-3/4 w-[1px] bg-slate-100 pointer-events-none" />
            <div className="absolute inset-x-0 top-1/3 h-[1px] bg-slate-100 pointer-events-none" />
            <div className="absolute inset-x-0 top-2/3 h-[1px] bg-slate-100 pointer-events-none" />

            {/* Clickable Sector hotspots vector SVG overlay */}
            <div className="absolute inset-0 p-8 flex items-center justify-center pointer-events-none">
              <div className="w-full h-full relative">
                {/* Sector Alpha */}
                <button 
                  onClick={() => setActiveSector("ALPHA")}
                  className={`absolute top-[25%] left-[25%] p-3.5 rounded-[18px] border flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto shadow-sm ${
                    activeSector === "ALPHA"
                      ? "bg-[#3B8D72]/10 border-[#3B8D72] shadow-[0_0_20px_rgba(59,141,114,0.15)] scale-105"
                      : "bg-white border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <span className={`font-mono text-[9px] font-bold ${activeSector === "ALPHA" ? "text-[#3B8D72]" : "text-slate-700"}`}>SEC_ALPHA</span>
                  {selectedLayer === "HEAT" && <span className="w-2.5 h-2.5 rounded-full bg-[#C65555] animate-ping" />}
                </button>

                {/* Sector Beta */}
                <button 
                  onClick={() => setActiveSector("BETA")}
                  className={`absolute bottom-[35%] right-[30%] p-3.5 rounded-[18px] border flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto shadow-sm ${
                    activeSector === "BETA"
                      ? "bg-[#3B8D72]/10 border-[#3B8D72] shadow-[0_0_20px_rgba(59,141,114,0.15)] scale-105"
                      : "bg-white border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <span className={`font-mono text-[9px] font-bold ${activeSector === "BETA" ? "text-[#3B8D72]" : "text-slate-700"}`}>SEC_BETA</span>
                  {selectedLayer === "HEAT" && <span className="w-2.5 h-2.5 rounded-full bg-[#C0832F] animate-pulse" />}
                </button>

                {/* Sector Delta */}
                <button 
                  onClick={() => setActiveSector("DELTA")}
                  className={`absolute top-[45%] right-[20%] p-3.5 rounded-[18px] border flex flex-col items-center gap-1.5 transition-all duration-300 pointer-events-auto shadow-sm ${
                    activeSector === "DELTA"
                      ? "bg-[#3B8D72]/10 border-[#3B8D72] shadow-[0_0_20px_rgba(59,141,114,0.15)] scale-105"
                      : "bg-white border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <span className={`font-mono text-[9px] font-bold ${activeSector === "DELTA" ? "text-[#3B8D72]" : "text-slate-700"}`}>SEC_DELTA</span>
                  {selectedLayer === "HEAT" && <span className="w-2 h-2 rounded-full bg-[#3B8D72]" />}
                </button>
              </div>
            </div>

            {/* Scale / HUD Indicator lines */}
            <div className="flex justify-between items-center text-slate-400 text-[10px] font-mono z-10 font-bold">
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#3B8D72] animate-spin-slow" />
                TACTICAL RADIAL HUD ACTIVE
              </span>
              <span>FOV: 120° AZIMUTH</span>
            </div>

            <div className="flex justify-between items-end z-10 pt-4">
              <div className="text-left font-mono text-[9px] text-slate-400 space-y-0.5">
                <div>SYSTEM MODEL: WGS-84 HEIGHT GRID</div>
                <div>PRECISION RATIO: 1:1,500 LAT-OFFSET</div>
              </div>
              <div className="text-xs font-mono text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-[12px] select-none uppercase tracking-wider shadow-sm font-bold">
                {selectedLayer} ACTIVE
              </div>
            </div>

          </div>

          {/* Side Panel Details HUD */}
          <div className="lg:col-span-4 flex flex-col justify-between text-left space-y-5">
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-[20px] space-y-3 shadow-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Selected Region</div>
                <div className="text-sm font-sans font-bold text-slate-800 tracking-tight">{activeData.name}</div>
                <div className="text-[11px] text-slate-500 font-sans leading-relaxed font-medium">{activeData.description}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-[14px] shadow-sm">
                  <span className="text-[8px] font-mono text-slate-400 block uppercase font-bold">Incidents (24h)</span>
                  <span className="text-lg font-bold text-slate-850 block mt-0.5">{activeData.incidents} Incidents</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-[14px] shadow-sm">
                  <span className="text-[8px] font-mono text-slate-400 block uppercase font-bold">Risk Rating</span>
                  <span className="text-lg font-bold text-[#C65555] block mt-0.5">{activeData.threatIndex}</span>
                </div>
              </div>
            </div>

            {/* Slider Patrol Units calibrator */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-[24px] space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5 text-slate-400" /> Allocate Patrol Units</span>
                <span className="text-[#3B8D72] font-extrabold">{patrolSlider} Vehicles</span>
              </div>
              <input 
                type="range" 
                min="2" 
                max="24" 
                value={patrolSlider}
                onChange={(e) => setPatrolSlider(parseInt(e.target.value))}
                className="w-full accent-[#3B8D72] bg-slate-200 h-1 rounded-[20px] focus:outline-none cursor-pointer"
              />
              <div className="text-[9px] font-mono text-slate-400 leading-normal text-center uppercase font-bold">
                AUTOMATED RESPONSE CALCULATION ACTIVE
              </div>
            </div>

          </div>

        </div>

        {/* Footer Section */}
        <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400 font-semibold">
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
interface NetworkNode {
  id: string;
  name: string;
  alias: string;
  role: 'Leader' | 'Associate' | 'Suspect' | 'Victim' | 'Unknown';
  riskLevel: 'Critical' | 'Severe' | 'Elevated' | 'Medium' | 'Low' | 'Unknown';
  riskScore: number;
  age: number;
  gang: string;
  district: string;
  status: string;
  lastActivity: string;
  crimesLinked: string[];
  recentLocations: string[];
  knownAssociates: string[];
  bio: string;
  x: number;
  y: number;
  size: number;
  color: string;
  bgGlow: string;
}

const NODES: NetworkNode[] = [
  {
    id: "DON_V",
    name: "Victor J. Volkov",
    alias: "Don Victor",
    role: "Leader",
    riskLevel: "Critical",
    riskScore: 98,
    age: 54,
    gang: "Northern Syndicate",
    district: "North Port",
    status: "UNDER SECTOR SURVEILLANCE",
    lastActivity: "2 mins ago via satellite link",
    crimesLinked: ["Digital wire fraud", "Illegal port distribution", "Coordinated conspiracy"],
    recentLocations: ["North Port Terminal 3", "Sector 4 Warehouse", "Geneva Safehouse"],
    knownAssociates: ["Marcus Chen", "Elena Rostova", "Dimitri Vance"],
    bio: "Chief executive and logistics coordinator of Northern Syndicate operations. Commands distribution via custom cryptology keys and offshore shell proxies.",
    x: 400,
    y: 220,
    size: 38,
    color: "#C65555", // Muted Coral
    bgGlow: "rgba(198, 85, 85, 0.1)"
  },
  {
    id: "MARCUS",
    name: "Marcus Chen",
    alias: "Apex Lead",
    role: "Associate",
    riskLevel: "Severe",
    riskScore: 84,
    age: 39,
    gang: "Northern Syndicate",
    district: "Sector 4",
    status: "ACTIVE PATROL ALERT",
    lastActivity: "15 mins ago in Sector 4",
    crimesLinked: ["Cargo hijacking", "Smuggling logistics", "Tactical evasion"],
    recentLocations: ["Sector 4 Rail Yard", "Downtown Freight Terminal", "Bunker A"],
    knownAssociates: ["Victor Volkov", "Slick Malone", "Dimitri Vance"],
    bio: "Direct tactical commander overseeing overland transport networks. Frequently linked to automated alarm triggers and local high-intensity incidents.",
    x: 230,
    y: 150,
    size: 32,
    color: "#C0832F", // Muted Amber
    bgGlow: "rgba(192, 131, 47, 0.1)"
  },
  {
    id: "ELENA",
    name: "Elena Rostova",
    alias: "Treasurer",
    role: "Associate",
    riskLevel: "Elevated",
    riskScore: 72,
    age: 41,
    gang: "Northern Syndicate",
    district: "Downtown",
    status: "MONITORED NODE",
    lastActivity: "1 hour ago - SWIFT ledger relay",
    crimesLinked: ["Capital relocation", "Electronic laundering proxy", "Crypto asset routing"],
    recentLocations: ["Downtown Financial Plaza", "Zurich Account 4B", "Grand Capital Tower"],
    knownAssociates: ["Victor Volkov", "Sofia Geller", "Tariq Al-Fayed"],
    bio: "Oversees financial ledgers and decentralized token distribution. Highly sophisticated computer engineer specializing in offshore escrow bypassing.",
    x: 570,
    y: 150,
    size: 30,
    color: "#796B9A", // Muted Purple
    bgGlow: "rgba(121, 107, 154, 0.1)"
  },
  {
    id: "SLICK_M",
    name: "Slick Malone",
    alias: "Transit Driver",
    role: "Suspect",
    riskLevel: "Medium",
    riskScore: 48,
    age: 28,
    gang: "Sector 4 Crew",
    district: "Sector 4",
    status: "INTERPOL DIRECTIVE",
    lastActivity: "4 hours ago near border",
    crimesLinked: ["High-speed transit evasion", "Contraband transport"],
    recentLocations: ["Border Station 9", "Sector 4 Highway Pass", "Suburban Repair Shop"],
    knownAssociates: ["Marcus Chen"],
    bio: "Highly skilled pilot and tactical driver hired on contract basis. Frequently operates customized, armored heavy transport trucks.",
    x: 130,
    y: 280,
    size: 26,
    color: "#4D7FA9", // Muted Blue
    bgGlow: "rgba(77, 127, 169, 0.1)"
  },
  {
    id: "SOFIA_G",
    name: "Sofia Geller",
    alias: "Broker",
    role: "Suspect",
    riskLevel: "Medium",
    riskScore: 56,
    age: 33,
    gang: "Red Dragon",
    district: "Downtown",
    status: "TRANSACTIONAL TRACKING",
    lastActivity: "3 hours ago - offshore ledger access",
    crimesLinked: ["Bond tampering", "Shell company administration"],
    recentLocations: ["Downtown Luxury Residence", "Lakeside Marina Slip 12", "Cayman Secure Server"],
    knownAssociates: ["Elena Rostova", "Agent Zero"],
    bio: "Independent financial broker connecting European shell entities with North Port distribution operations.",
    x: 670,
    y: 280,
    size: 26,
    color: "#4D7FA9",
    bgGlow: "rgba(77, 127, 169, 0.1)"
  },
  {
    id: "DIMITRI",
    name: "Dimitri Vance",
    alias: "The Shield",
    role: "Suspect",
    riskLevel: "Severe",
    riskScore: 89,
    age: 45,
    gang: "Northern Syndicate",
    district: "North Port",
    status: "HIGH-ALERT DISPATCH",
    lastActivity: "30 mins ago in Port Security Zone",
    crimesLinked: ["Physical intimidation", "Heavy weapon storage", "Customs infiltration"],
    recentLocations: ["North Port Drydock", "Industrial Sector 2", "Co-op Shooting Range"],
    knownAssociates: ["Victor Volkov", "Marcus Chen"],
    bio: "Ex-military tactical operative acting as defensive lead for Victor Volkov's physical transport caravans.",
    x: 310,
    y: 360,
    size: 28,
    color: "#C0832F",
    bgGlow: "rgba(192, 131, 47, 0.1)"
  },
  {
    id: "TARIQ",
    name: "Tariq Al-Fayed",
    alias: "Mariner",
    role: "Associate",
    riskLevel: "Elevated",
    riskScore: 68,
    age: 50,
    gang: "Northern Syndicate",
    district: "North Port",
    status: "HARBOR RADAR LOCK",
    lastActivity: "2 hours ago at Docking Berth 8A",
    crimesLinked: ["Maritime smuggling", "Customs deceleration fraud"],
    recentLocations: ["North Port Cargo Ship Al-Star", "Harbor Control Tower", "Coastal Warehouse"],
    knownAssociates: ["Victor Volkov", "Elena Rostova"],
    bio: "Vessel captain with deep connections to global maritime cargo. Handles safe clearance of containers at the North Port terminal.",
    x: 490,
    y: 360,
    size: 28,
    color: "#796B9A",
    bgGlow: "rgba(121, 107, 154, 0.1)"
  },
  {
    id: "VINCE",
    name: "Vince Carter",
    alias: "The Shadow Underboss",
    role: "Leader",
    riskLevel: "Severe",
    riskScore: 87,
    age: 48,
    gang: "Red Dragon",
    district: "Downtown",
    status: "TARGET ACQUISITION",
    lastActivity: "Yesterday - secured ledger negotiation",
    crimesLinked: ["Strategic planning", "Cross-syndicate arbitration"],
    recentLocations: ["Downtown Penthouse 18", "The Red Club Vault", "Subway Line 3 Abandoned Terminal"],
    knownAssociates: ["Victor Volkov"],
    bio: "High-level administrative lead connecting the Northern Syndicate with external domestic gangs.",
    x: 400,
    y: 80,
    size: 30,
    color: "#C0832F",
    bgGlow: "rgba(192, 131, 47, 0.1)"
  },
  {
    id: "AGENT_Z",
    name: "Agent Zero",
    alias: "Shadow Broker",
    role: "Unknown",
    riskLevel: "Unknown",
    riskScore: 35,
    age: 0,
    gang: "Unknown",
    district: "Downtown",
    status: "DECRYPTING LINK DATA",
    lastActivity: "3 days ago via satellite IP",
    crimesLinked: ["Quantum key supply", "Intelligence brokerage"],
    recentLocations: ["Untraceable Darknet Relay", "High-frequency server nodes"],
    knownAssociates: ["Sofia Geller"],
    bio: "Unidentified facilitator of quantum encrypted networking keys. Highly elusive node with encrypted bio details.",
    x: 650,
    y: 90,
    size: 22,
    color: "#64748B",
    bgGlow: "rgba(100, 116, 139, 0.1)"
  }
];

const CONNECTIONS = [
  { source: "DON_V", target: "MARCUS", strength: "Strong", label: "Tactical Command" },
  { source: "DON_V", target: "ELENA", strength: "Strong", label: "Ledger Escrow" },
  { source: "DON_V", target: "VINCE", strength: "Strong", label: "Syndicate Line" },
  { source: "MARCUS", target: "SLICK_M", strength: "Medium", label: "Contraband Flow" },
  { source: "ELENA", target: "SOFIA_G", strength: "Medium", label: "Asset Routing" },
  { source: "DON_V", target: "DIMITRI", strength: "Strong", label: "Security Escort" },
  { source: "DON_V", target: "TARIQ", strength: "Medium", label: "Maritime Inflow" },
  { source: "DIMITRI", target: "MARCUS", strength: "Medium", label: "Tactical Backup" },
  { source: "TARIQ", target: "ELENA", strength: "Medium", label: "Clearing Ledger" },
  { source: "SOFIA_G", target: "AGENT_Z", strength: "Weak", label: "Encrypted Proxy" }
];

export function CriminalNetworkView() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("DON_V");
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  
  // Filters state
  const [filterCrime, setFilterCrime] = useState<string>("All");
  const [filterGang, setFilterGang] = useState<string>("All");
  const [filterDistrict, setFilterDistrict] = useState<string>("All");
  const [filterStrength, setFilterStrength] = useState<string>("All");
  const [filterRisk, setFilterRisk] = useState<string>("All");
  const [filterTimeline, setFilterTimeline] = useState<string>("All");

  const activeProfile = NODES.find(n => n.id === selectedNodeId) || NODES[0];

  const areConnected = (id1: string, id2: string) => {
    return CONNECTIONS.some(c => 
      (c.source === id1 && c.target === id2) || (c.source === id2 && c.target === id1)
    );
  };

  const nodeMatchesFilters = (node: NetworkNode) => {
    if (filterGang !== "All" && node.gang !== filterGang) return false;
    if (filterDistrict !== "All" && node.district !== filterDistrict) return false;
    if (filterRisk !== "All" && node.riskLevel !== filterRisk) return false;
    if (filterCrime !== "All" && !node.crimesLinked.includes(filterCrime)) return false;
    return true;
  };

  const allCrimes = Array.from(new Set(NODES.flatMap(n => n.crimesLinked)));

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6"
      id="criminal-network-workspace"
    >
      <div className="premium-card p-6 min-h-[650px] flex flex-col justify-between text-left space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1 text-left">
            <h3 className="text-lg font-sans font-extrabold text-[#1E293B] tracking-tight">
              Criminal Network Intelligence
            </h3>
            <p className="text-xs text-slate-500 font-sans font-medium">
              Discover relationships between suspects, gangs, communication networks, and criminal organizations.
            </p>
          </div>
          
          <div className="flex items-center gap-2.5 bg-slate-50 px-4 py-2 rounded-[16px] border border-slate-200 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B8D72] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3B8D72]"></span>
            </span>
            <span className="text-[10px] font-mono text-[#3B8D72] font-extrabold tracking-wider uppercase">
              Live Investigation Status
            </span>
          </div>
        </div>

        {/* Elegant Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-[20px] border border-slate-200">
          <div className="text-[10px] font-mono text-slate-400 font-bold px-1.5 flex items-center gap-1.5 uppercase tracking-wider">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filter Matrix
          </div>
          
          {/* Crime Filter */}
          <select 
            value={filterCrime}
            onChange={(e) => setFilterCrime(e.target.value)}
            className="bg-white border border-slate-200 text-xs text-slate-600 px-3 py-1.5 rounded-[12px] font-sans focus:outline-none focus:border-[#3B8D72]/50 cursor-pointer shadow-sm font-semibold"
          >
            <option value="All">All Crime Types</option>
            {allCrimes.map((crime, idx) => (
              <option key={idx} value={crime}>{crime}</option>
            ))}
          </select>

          {/* Gang Filter */}
          <select 
            value={filterGang}
            onChange={(e) => setFilterGang(e.target.value)}
            className="bg-white border border-slate-200 text-xs text-slate-600 px-3 py-1.5 rounded-[12px] font-sans focus:outline-none focus:border-[#3B8D72]/50 cursor-pointer shadow-sm font-semibold"
          >
            <option value="All">All Gangs</option>
            <option value="Northern Syndicate">Northern Syndicate</option>
            <option value="Sector 4 Crew">Sector 4 Crew</option>
            <option value="Red Dragon">Red Dragon</option>
          </select>

          {/* District Filter */}
          <select 
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="bg-white border border-slate-200 text-xs text-slate-600 px-3 py-1.5 rounded-[12px] font-sans focus:outline-none focus:border-[#3B8D72]/50 cursor-pointer shadow-sm font-semibold"
          >
            <option value="All">All Districts</option>
            <option value="North Port">North Port</option>
            <option value="Sector 4">Sector 4</option>
            <option value="Downtown">Downtown</option>
          </select>

          {/* Relationship Filter */}
          <select 
            value={filterStrength}
            onChange={(e) => setFilterStrength(e.target.value)}
            className="bg-white border border-slate-200 text-xs text-slate-600 px-3 py-1.5 rounded-[12px] font-sans focus:outline-none focus:border-[#3B8D72]/50 cursor-pointer shadow-sm font-semibold"
          >
            <option value="All">All Connections</option>
            <option value="Strong">Strong Ties Only</option>
            <option value="Medium">Medium Ties Only</option>
          </select>

          {/* Risk Filter */}
          <select 
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="bg-white border border-slate-200 text-xs text-slate-600 px-3 py-1.5 rounded-[12px] font-sans focus:outline-none focus:border-[#3B8D72]/50 cursor-pointer shadow-sm font-semibold"
          >
            <option value="All">All Risk Levels</option>
            <option value="Critical">Critical</option>
            <option value="Severe">Severe</option>
            <option value="Elevated">Elevated</option>
            <option value="Medium">Medium</option>
          </select>

          {/* Date Range Filter */}
          <select 
            value={filterTimeline}
            onChange={(e) => setFilterTimeline(e.target.value)}
            className="bg-white border border-slate-200 text-xs text-slate-600 px-3 py-1.5 rounded-[12px] font-sans focus:outline-none focus:border-[#3B8D72]/50 cursor-pointer shadow-sm font-semibold"
          >
            <option value="All">Full History</option>
            <option value="24h">Past 24 Hours</option>
            <option value="7d">Past 7 Days</option>
          </select>
        </div>

        {/* Workspace Layout Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
          
          {/* Graph Visualization Canvas (70% - lg:col-span-8) */}
          <div className="lg:col-span-8 relative rounded-[24px] border border-slate-200 bg-white/80 overflow-hidden flex flex-col justify-between min-h-[450px] shadow-inner">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none opacity-40" />
            <div className="absolute top-4 right-4 text-[9px] font-mono text-slate-400 tracking-wider pointer-events-none font-bold">
              GRID RESO: 800x450 PX
            </div>

            {/* Interactive SVG Graph Render */}
            <div className="flex-1 w-full h-full relative select-none">
              <svg 
                className="w-full h-full min-h-[400px] overflow-visible" 
                viewBox="0 0 800 450" 
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <filter id="glow-critical" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Curved Connection Edges */}
                <g>
                  {CONNECTIONS.map((conn, idx) => {
                    const sourceNode = NODES.find(n => n.id === conn.source);
                    const targetNode = NODES.find(n => n.id === conn.target);

                    if (!sourceNode || !targetNode) return null;

                    if (filterStrength !== "All" && conn.strength !== filterStrength) return null;

                    const sourceMatches = nodeMatchesFilters(sourceNode);
                    const targetMatches = nodeMatchesFilters(targetNode);
                    const connectionMatchesFilters = sourceMatches && targetMatches;

                    const isLinkHovered = hoveredNodeId === conn.source || hoveredNodeId === conn.target;
                    const isLinkSelected = selectedNodeId === conn.source || selectedNodeId === conn.target;
                    const isAnyHovered = hoveredNodeId !== null;

                    let strokeColor = "rgba(148, 163, 184, 0.3)";
                    let strokeWidth = 1.25;
                    let dashArray = "none";

                    if (isAnyHovered) {
                      if (isLinkHovered) {
                        strokeColor = sourceNode.id === hoveredNodeId ? sourceNode.color : targetNode.color;
                        strokeWidth = 2.25;
                        dashArray = "5 3";
                      } else {
                        strokeColor = "rgba(148, 163, 184, 0.1)";
                        strokeWidth = 0.75;
                      }
                    } else if (isLinkSelected) {
                      strokeColor = "rgba(59, 141, 114, 0.6)";
                      strokeWidth = 1.75;
                    }

                    if (!connectionMatchesFilters) {
                      strokeColor = "rgba(148, 163, 184, 0.08)";
                      strokeWidth = 0.5;
                    }

                    const x1 = sourceNode.x;
                    const y1 = sourceNode.y;
                    const x2 = targetNode.x;
                    const y2 = targetNode.y;

                    const midX = (x1 + x2) / 2;
                    const midY = (y1 + y2) / 2;

                    const dx = (y2 - y1) * 0.12;
                    const dy = -(x2 - x1) * 0.12;

                    const controlX = midX + dx;
                    const controlY = midY + dy;

                    const pathD = `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`;

                    return (
                      <g key={idx}>
                        <path
                          d={pathD}
                          fill="none"
                          stroke="transparent"
                          strokeWidth="10"
                          className="cursor-pointer"
                        />
                        <path
                          d={pathD}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth={strokeWidth}
                          strokeDasharray={dashArray}
                          className="transition-all duration-200"
                        />
                        {isLinkHovered && connectionMatchesFilters && (
                          <circle r="3.5" fill={sourceNode.id === hoveredNodeId ? sourceNode.color : targetNode.color} className="shadow-lg">
                            <animateMotion dur="2.2s" repeatCount="indefinite" path={pathD} />
                          </circle>
                        )}
                      </g>
                    );
                  })}
                </g>

                {/* Person Nodes */}
                <g>
                  {NODES.map((node) => {
                    const matchesFilters = nodeMatchesFilters(node);
                    const isSelected = selectedNodeId === node.id;
                    const isHovered = hoveredNodeId === node.id;
                    const isAnyHovered = hoveredNodeId !== null;
                    
                    const isDimmed = isAnyHovered && !isHovered && !areConnected(node.id, hoveredNodeId);
                    
                    let opacity = 1;
                    if (!matchesFilters) {
                      opacity = 0.15;
                    } else if (isDimmed) {
                      opacity = 0.35;
                    }

                    return (
                      <g
                        key={node.id}
                        className="cursor-pointer transition-all duration-200"
                        style={{ opacity }}
                        onClick={() => {
                          if (matchesFilters) {
                            setSelectedNodeId(node.id);
                          }
                        }}
                        onMouseEnter={(e) => {
                          setHoveredNodeId(node.id);
                          setTooltipPos({ x: node.x, y: node.y - node.size - 10 });
                        }}
                        onMouseLeave={() => {
                          setHoveredNodeId(null);
                          setTooltipPos(null);
                        }}
                      >
                        {/* Selected Hologram Ring */}
                        {isSelected && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.size + 11}
                            fill="none"
                            stroke={node.color}
                            strokeWidth="1.5"
                            className="animate-spin-slow"
                            strokeDasharray="6 4"
                          />
                        )}

                        {/* Hover Aura Glow */}
                        {isHovered && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.size + 8}
                            fill="none"
                            stroke={node.color}
                            strokeWidth="2"
                            className="opacity-40 animate-pulse"
                          />
                        )}

                        {/* Outer Ring */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={node.size + 4}
                          fill="none"
                          stroke={isSelected ? node.color : "rgba(148, 163, 184, 0.4)"}
                          strokeWidth="1.5"
                          className="transition-all duration-200"
                        />

                        {/* Base Node Circle */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={node.size}
                          fill="#FFFFFF"
                          stroke={node.color}
                          strokeWidth={isSelected ? 3 : 1.5}
                          className="transition-all duration-200 shadow-sm"
                        />

                        {/* Inner Gradient or Pattern */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={node.size - 4}
                          fill={node.color}
                          fillOpacity={isSelected || isHovered ? 0.18 : 0.05}
                          className="transition-all duration-200"
                        />

                        {/* Initials */}
                        <text
                          x={node.x}
                          y={node.y + 4}
                          textAnchor="middle"
                          fill={node.color}
                          className="text-[10px] font-mono font-extrabold select-none tracking-tighter"
                        >
                          {node.alias.split(" ").map(w => w[0]).join("")}
                        </text>

                        {/* Node Name Label Underneath */}
                        <text
                          x={node.x}
                          y={node.y + node.size + 15}
                          textAnchor="middle"
                          fill={isSelected ? "#1E293B" : "#64748B"}
                          className="text-[11px] font-sans font-bold select-none tracking-tight"
                        >
                          {node.alias}
                        </text>

                        {/* Small micro status icon above node */}
                        {node.riskLevel === "Critical" && (
                          <g transform={`translate(${node.x + node.size - 4}, ${node.y - node.size + 4})`}>
                            <circle r="4.5" fill="#C65555" />
                            <circle r="4.5" fill="none" stroke="#FFFFFF" strokeWidth="0.75" />
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>
              </svg>

              {/* Floating Graph Legend inside workspace */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md border border-slate-200 p-3.5 rounded-[18px] space-y-2 text-left pointer-events-none shadow-lg">
                <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">Node Legend</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] font-sans text-slate-600 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C65555]" /> Leader (Critical)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C0832F]" /> Associate (Severe)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#796B9A]" /> Associate (Elevated)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4D7FA9]" /> Suspect (Medium)
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#64748B]" /> Unknown Node
                  </div>
                </div>
              </div>

              {/* Interactive Node Tooltip */}
              <AnimatePresence>
                {tooltipPos && hoveredNodeId && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bg-white border border-slate-200 p-3 rounded-[16px] shadow-xl pointer-events-none z-30 space-y-1.5 w-52 text-left"
                    style={{ 
                      left: `${(tooltipPos.x / 800) * 100}%`, 
                      top: `${(tooltipPos.y / 450) * 100}%`,
                      transform: 'translate(-50%, -100%)' 
                    }}
                  >
                    {(() => {
                      const hn = NODES.find(n => n.id === hoveredNodeId);
                      if (!hn) return null;
                      return (
                        <>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xs font-sans font-bold text-slate-800">{hn.name}</p>
                              <p className="text-[9px] font-mono text-slate-400 font-bold uppercase">{hn.alias}</p>
                            </div>
                            <span 
                              className="text-[8px] font-mono px-1.5 py-0.5 rounded border font-extrabold uppercase"
                              style={{ 
                                color: hn.color, 
                                borderColor: `${hn.color}30`, 
                                backgroundColor: `${hn.color}08` 
                              }}
                            >
                              {hn.riskLevel}
                            </span>
                          </div>
                          
                          <div className="border-t border-slate-100 pt-1.5 flex items-center justify-between text-[9px] font-mono text-slate-400">
                            <span>RISK INDEX:</span>
                            <span className="font-extrabold text-slate-700">{hn.riskScore}%</span>
                          </div>
                          
                          <p className="text-[9px] text-slate-500 font-medium truncate">
                            {hn.gang} • {hn.role}
                          </p>
                        </>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>

          {/* Right Suspect Information Panel (30% - lg:col-span-4) */}
          <div className="lg:col-span-4 rounded-[24px] border border-slate-200 bg-white/80 p-5 flex flex-col justify-between text-left space-y-5 shadow-sm relative overflow-hidden">
            
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#3B8D72]/45 to-transparent animate-pulse" />
            
            <div className="space-y-5">
              
              {/* Biometric Avatar Visual Placeholder */}
              <div className="relative w-full h-36 bg-slate-50 rounded-[20px] overflow-hidden border border-slate-200 flex items-center justify-center shadow-inner">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.005)_1px,transparent_1px)] bg-[size:10px_10px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#3B8D72]/3 to-transparent h-12 w-full animate-pulse pointer-events-none" style={{ animationDuration: '3s' }} />
                
                <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full border border-dashed border-[#3B8D72]/20 animate-spin-slow p-1" />
                    <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                      <Fingerprint className="w-8 h-8 transition-colors duration-200" style={{ color: activeProfile.color }} />
                    </div>
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold px-2.5 py-0.5 bg-white border border-slate-200 rounded-full shadow-sm">
                    BIOMETRIC SCAN: {activeProfile.id}
                  </div>
                </div>
              </div>

              {/* Suspect Name and Alias */}
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono text-slate-400 uppercase font-bold tracking-wider">Identified Suspect Profile</span>
                    <h4 className="text-base font-sans font-extrabold text-slate-800 tracking-tight">{activeProfile.name}</h4>
                    <p className="text-xs text-slate-500 font-mono">Alias: <span className="font-bold" style={{ color: activeProfile.color }}>{activeProfile.alias}</span></p>
                  </div>
                  <span 
                    className="text-[9px] font-mono font-bold px-2 py-1 rounded border shadow-sm"
                    style={{ 
                      color: activeProfile.color, 
                      borderColor: `${activeProfile.color}25`, 
                      backgroundColor: `${activeProfile.color}08` 
                    }}
                  >
                    {activeProfile.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Assessment and Details */}
              <div className="space-y-3.5">
                
                {/* Risk Score Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span className="uppercase font-bold">Investigation Threat Index</span>
                    <span className="font-extrabold" style={{ color: activeProfile.color }}>{activeProfile.riskScore}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${activeProfile.riskScore}%`,
                        backgroundColor: activeProfile.color
                      }} 
                    />
                  </div>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-2 gap-3 text-[11px] font-medium">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[14px]">
                    <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold">Age Factor</span>
                    <span className="font-sans text-slate-700 font-extrabold mt-0.5 block">{activeProfile.age === 0 ? "Classified" : `${activeProfile.age} Yrs`}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[14px]">
                    <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold">Syndicate</span>
                    <span className="font-sans text-slate-700 font-extrabold mt-0.5 block truncate">{activeProfile.gang}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[14px]">
                    <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold">Primary Sector</span>
                    <span className="font-sans text-[#3B8D72] font-extrabold mt-0.5 block">{activeProfile.district}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[14px]">
                    <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold">Status Code</span>
                    <span className="font-sans text-slate-700 font-extrabold mt-0.5 block truncate flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3B8D72] inline-block animate-pulse" />
                      ACTIVE
                    </span>
                  </div>
                </div>

                {/* Brief bio */}
                <div className="bg-slate-50 p-3 rounded-[16px] border border-slate-200/80 space-y-1">
                  <span className="text-[9px] font-mono text-slate-400 uppercase font-bold tracking-wider block">Assessed Dossier Overview</span>
                  <p className="text-[11px] text-slate-600 leading-normal font-sans font-medium">{activeProfile.bio}</p>
                </div>

                {/* Recent Coordinates */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-slate-400 uppercase font-bold tracking-wider block">Recent Logged Locations</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProfile.recentLocations.map((loc, i) => (
                      <span key={i} className="text-[9px] font-sans bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-[10px] flex items-center gap-1 shadow-sm font-medium">
                        <MapPin className="w-2.5 h-2.5 text-slate-400" />
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Crimes list */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-slate-400 uppercase font-bold tracking-wider block">Associated Offense Files</span>
                  <div className="grid grid-cols-1 gap-1">
                    {activeProfile.crimesLinked.map((crime, idx) => (
                      <div key={idx} className="flex items-center justify-between p-1.5 bg-white border border-slate-200 rounded-[10px] text-[10px] font-sans text-slate-600 shadow-sm font-semibold">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: activeProfile.color }} />
                          <span className="truncate">{crime}</span>
                        </div>
                        <span className="text-[8px] font-mono text-slate-400 uppercase font-bold px-1 py-0.2 bg-slate-50 border border-slate-200 rounded">CHARGED</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Known Associates */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-slate-400 uppercase font-bold tracking-wider block">Identified Direct Associates</span>
                  <div className="flex flex-wrap gap-1">
                    {activeProfile.knownAssociates.map((assocName, i) => {
                      const linkedNode = NODES.find(n => n.name.toLowerCase().includes(assocName.toLowerCase()) || n.alias.toLowerCase().includes(assocName.toLowerCase()));
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            if (linkedNode) {
                              setSelectedNodeId(linkedNode.id);
                            }
                          }}
                          className="text-[9px] font-mono bg-white border border-slate-200 text-[#3B8D72] px-2 py-0.5 rounded-[10px] hover:border-[#3B8D72]/50 hover:bg-[#3B8D72]/5 transition-all cursor-pointer font-bold shadow-sm"
                        >
                          {assocName}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>

            {/* Panel Footer */}
            <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between items-center text-[9px] font-mono text-slate-400 font-bold">
              <span className="flex items-center gap-1 uppercase">
                <Clock className="w-3 h-3" /> Last Activity:
              </span>
              <span className="text-slate-500">{activeProfile.lastActivity}</span>
            </div>

          </div>

        </div>

        {/* Console status footer */}
        <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400 font-bold">
          <span>CO-OCCURRENCE RATIO: NEURAL SYNDICATE MAPPER [v2.4.8]</span>
          <div className="flex gap-4">
            <span>CHANNELS ONLINE: Secure VPN-9</span>
            <span>DATA SOURCE: LOCAL CRIMINAL INTELLIGENCE SERVICES</span>
          </div>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-[14px] bg-white border border-slate-200/60 shadow-sm">
              <TrendingUp className="w-5 h-5 text-[#3B8D72]" />
            </div>
            <div>
              <h3 className="text-base font-sans font-bold text-[#1E293B] tracking-tight">Predictive Modeling & Risk Matrix</h3>
              <p className="text-xs text-slate-400 font-sans font-medium">Temporal Forecast Timelines & Machine Learning Confidence Ranges</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-[14px] border border-slate-200">
            {(["HIGH", "ALL"] as const).map((conf) => (
              <button
                key={conf}
                onClick={() => setSelectedConfidence(conf)}
                className={`px-3 py-1.5 text-[10px] font-mono rounded-[10px] transition-all duration-200 font-bold ${
                  selectedConfidence === conf 
                    ? 'bg-white border border-slate-200 text-[#1E293B] shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {conf === "HIGH" ? "Confidence High (>85%)" : "All Forecast Vectors"}
              </button>
            ))}
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 flex-1 items-center">
          
          {/* Real Recharts Forecast Grid Frame */}
          <div className="lg:col-span-8 rounded-[24px] bg-white/80 border border-slate-200 p-5 h-[280px] relative shadow-inner">
            <div className="absolute top-4 left-4 text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">24-HOUR RADIAL RISK DISTRIBUTION MODEL</div>
            
            <div className="w-full h-full pt-6">
              <ResponsiveContainer width="100%" height="95%">
                <AreaChart data={mockForecastTimeline} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="generalRiskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4D7FA9" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#4D7FA9" stopOpacity={0.01}/>
                    </linearGradient>
                    <linearGradient id="criticalRiskGrad" x1="0" y1="0" x2="0" y2="1">
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

                  {selectedConfidence === "ALL" && (
                    <Area 
                      type="monotone" 
                      dataKey="generalRisk" 
                      stroke="#4D7FA9" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#generalRiskGrad)" 
                    />
                  )}

                  <Area 
                    type="monotone" 
                    dataKey="criticalRisk" 
                    stroke="#C65555" 
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
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-[20px] space-y-3 shadow-sm">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Forecasting Model Details</div>
              <div className="text-xs font-sans font-bold text-slate-700">Model: Recurrent Neural (v5.1)</div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-sans font-medium">
                Predictive accuracy evaluates historic variables, seasonal heatmaps, and spatial co-occurrence algorithms to model daily peak risk zones.
              </p>
            </div>

            {/* Slider calibrator */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-[24px] space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5"><SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" /> Confidence Level Floor</span>
                <span className="text-[#3B8D72] font-bold">&gt;{timelineFilter}%</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="98" 
                value={timelineFilter}
                onChange={(e) => setTimelineFilter(parseInt(e.target.value))}
                className="w-full accent-[#3B8D72] bg-slate-200 h-1 rounded-[20px] focus:outline-none cursor-pointer"
              />
            </div>
          </div>

        </div>

        <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400 font-bold">
          <span>ALGORITHM CONFIDENCE: MACHINE_EVAL_CALIBRATED</span>
          <span>ACCURACY RATIO: 91.4% COMPLETED</span>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------
 * 4. AI ALERT CENTER CONSOLE (OPERATIONAL INTELLIGENCE & DISPATCH FEED)
 * ------------------------------------------------------------- */
interface OperationalAlert {
  id: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  aiExplanation: string;
  location: string;
  time: string;
  confidenceScore: number;
  recommendedAction: string;
  sector: string;
  timestamp: string;
  status: 'Active' | 'Resolved';
}

const INITIAL_ALERTS: OperationalAlert[] = [
  {
    id: "ALRT-109X",
    priority: "Critical",
    title: "Coordinated Multi-Vector GPS Jitter",
    aiExplanation: "AI detected an unusual synchronized drop in transit tracking beacons. Pattern matches historical organized diversion protocols. 92% spatial correlation with high-value logistics paths.",
    location: "North Port - Container Terminal 3",
    time: "Just now",
    confidenceScore: 98,
    recommendedAction: "Establish immediate physical perimeter checkpoints. Lock down Gates 4 and 5. Redirect active harbor patrols to Terminal 3.",
    sector: "SEC_ALPHA",
    timestamp: "10:37:12 AM",
    status: "Active"
  },
  {
    id: "ALRT-084Y",
    priority: "High",
    title: "Anomalous Commercial Burglary Spikes",
    aiExplanation: "AI identified an atypical dense clustering of commercial burglary events. Incident velocity is 4.2x above historical baseline. Chronological sequence matches high-velocity crew operations.",
    location: "Sector 4 - Warehouse District",
    time: "12m ago",
    confidenceScore: 89,
    recommendedAction: "Deploy immediate tactical K-9 unit to sweep targets. Alert regional retail security dispatch corridors.",
    sector: "SEC_DELTA",
    timestamp: "10:25:04 AM",
    status: "Active"
  },
  {
    id: "ALRT-215K",
    priority: "Medium",
    title: "High-Frequency Currency Dispersion Signature",
    aiExplanation: "De-centralized ledger analysis detected micro-burst financial routing through shell proxies linked to the Northern Syndicate. Transactions are bypassing standard transit limits.",
    location: "Downtown - Financial Plaza",
    time: "41m ago",
    confidenceScore: 76,
    recommendedAction: "Initialize automated ledger tracing. Notify federal financial taskforce node for proactive freeze.",
    sector: "SEC_BETA",
    timestamp: "09:56:18 AM",
    status: "Active"
  },
  {
    id: "ALRT-004Z",
    priority: "Low",
    title: "Border Trunk Fiber Jitter",
    aiExplanation: "Regional fiber optic trunks report recurrent telemetry packet drops. Physical fiber bend radius deviations suspected, but timing matches scheduled trans-national heavy logistics arrival.",
    location: "Border Crossing - Sector 9",
    time: "1h ago",
    confidenceScore: 64,
    recommendedAction: "Request manual camera visual checks via closest field unit. Schedule field engineer calibration check.",
    sector: "SEC_OMEGA",
    timestamp: "09:30:44 AM",
    status: "Active"
  },
  {
    id: "ALRT-112H",
    priority: "Critical",
    title: "Biometric Telemetry Dropout Cluster",
    aiExplanation: "AI registered a sudden concurrent dropout of multiple officer wellness wearables within a 30-meter radius. Zero voice response on secondary radio channels.",
    location: "Industrial Sector 2 - Depot B",
    time: "2h ago",
    confidenceScore: 95,
    recommendedAction: "Issue highest level emergency response dispatch. Route backup cruisers and tactical team units with aerial drone cover.",
    sector: "SEC_GAMMA",
    timestamp: "08:14:02 AM",
    status: "Resolved"
  },
  {
    id: "ALRT-045M",
    priority: "Low",
    title: "Localized Signal Jamming Detection",
    aiExplanation: "Wireless frequency analyzers detected narrow-band RF jamming sweeps on critical regional frequencies. Low amplitude, but potential precursor to physical access breaches.",
    location: "Downtown - Government Plaza",
    time: "4h ago",
    confidenceScore: 58,
    recommendedAction: "Request local physical security patrol check-in. Monitor auxiliary backup microwave link nodes.",
    sector: "SEC_BETA",
    timestamp: "06:22:15 AM",
    status: "Resolved"
  }
];

const RECENT_TIMELINE_EVENTS = [
  { time: "10:37:12 AM", event: "Critical GPS Jitter alert generated for North Port", type: "Critical" },
  { time: "10:35:45 AM", event: "AI Scan initiated for Sector 4 spatial clusters", type: "System" },
  { time: "10:25:04 AM", event: "High Anomaly registered in Sector 4 commercial zones", type: "High" },
  { time: "10:14:19 AM", event: "Routine database ingestion loop completed", type: "System" },
  { time: "09:56:18 AM", event: "Medium ledger dispersion signal flagged", type: "Medium" },
  { time: "09:30:44 AM", event: "Low Border trunk jitter recorded", type: "Low" }
];

export function AlertsView() {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [alerts, setAlerts] = useState<OperationalAlert[]>(INITIAL_ALERTS);
  const [selectedAlertId, setSelectedAlertId] = useState<string>("ALRT-109X");
  const [timelineEvents, setTimelineEvents] = useState(RECENT_TIMELINE_EVENTS);
  
  const [newIncidentTitle, setNewIncidentTitle] = useState("");
  const [newIncidentSector, setNewIncidentSector] = useState("SEC_ALPHA");
  const [newIncidentPriority, setNewIncidentPriority] = useState<'Critical' | 'High' | 'Medium' | 'Low'>("High");
  const [newIncidentLocation, setNewIncidentLocation] = useState("");

  const [checklist, setChecklist] = useState<Record<string, Record<string, boolean>>>({
    "ALRT-109X": { notify: true, patrol: false, comms: false, log: true },
    "ALRT-084Y": { notify: false, patrol: true, comms: false, log: true },
    "ALRT-215K": { notify: false, patrol: false, comms: true, log: false },
    "ALRT-004Z": { notify: true, patrol: false, comms: false, log: false },
    "ALRT-112H": { notify: true, patrol: true, comms: true, log: true },
    "ALRT-045M": { notify: false, patrol: false, comms: false, log: true }
  });

  const handleToggleChecklist = (alertId: string, item: string) => {
    setChecklist(prev => {
      const currentAlertChecklist = prev[alertId] || { notify: false, patrol: false, comms: false, log: false };
      return {
        ...prev,
        [alertId]: {
          ...currentAlertChecklist,
          [item]: !currentAlertChecklist[item]
        }
      };
    });
  };

  const handleToggleStatus = (id: string) => {
    setAlerts(prev => prev.map(al => {
      if (al.id === id) {
        const newStatus = al.status === 'Active' ? 'Resolved' : 'Active';
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setTimelineEvents(prevEvents => [
          { 
            time: timeString, 
            event: `Alert ${id} was marked as ${newStatus}`, 
            type: newStatus === 'Resolved' ? 'System' : al.priority 
          },
          ...prevEvents
        ]);

        return { ...al, status: newStatus };
      }
      return al;
    }));
  };

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncidentTitle.trim() || !newIncidentLocation.trim()) return;

    const alertId = `ALRT-${Math.floor(100 + Math.random() * 900)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    
    let aiExplanation = "";
    let recommendedAction = "";

    if (newIncidentPriority === 'Critical') {
      aiExplanation = `AI registered a sudden multi-point vector anomaly: '${newIncidentTitle}'. Physical indicators demonstrate highly correlated, deliberate intrusion sequences. High probability of operational hazard.`;
      recommendedAction = `Broadcast regional alert. Reroute primary response units to '${newIncidentLocation}' immediately. Establish defensive operations.`;
    } else if (newIncidentPriority === 'High') {
      aiExplanation = `AI analysis identified an escalating threat vector of type '${newIncidentTitle}'. Correlation metrics align with historical target breach cycles. Incident velocity points to imminent physical breach.`;
      recommendedAction = `Dispatch tactical reconnaissance drones to assess '${newIncidentLocation}'. Place local support cruisers on immediate alert standby.`;
    } else if (newIncidentPriority === 'Medium') {
      aiExplanation = `AI flagged localized sensor discrepancy '${newIncidentTitle}'. Physical telemetry deviates by 3.8 standard deviations from the established regional baseline. Pattern suggests systemic tactical testing.`;
      recommendedAction = `Initiate localized node sweeps at '${newIncidentLocation}'. Update watch commanders and log telemetry files.`;
    } else {
      aiExplanation = `Routine diagnostic algorithms reported: '${newIncidentTitle}'. Environmental noise is probable, but coincidence with active transport lanes warrants ongoing observation.`;
      recommendedAction = `Instruct passing patrols to perform low-priority perimeter checks at '${newIncidentLocation}'. Verify telemetry at next flush cycle.`;
    }

    const confidenceScore = Math.floor(55 + Math.random() * 40);

    const freshAlert: OperationalAlert = {
      id: alertId,
      priority: newIncidentPriority,
      title: newIncidentTitle,
      aiExplanation,
      location: newIncidentLocation,
      time: "Just now",
      confidenceScore,
      recommendedAction,
      sector: newIncidentSector,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: "Active"
    };

    setAlerts(prev => [freshAlert, ...prev]);
    setSelectedAlertId(alertId);
    
    setChecklist(prev => ({
      ...prev,
      [alertId]: { notify: false, patrol: false, comms: false, log: false }
    }));

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTimelineEvents(prev => [
      { time: timeString, event: `${newIncidentPriority} operational alert generated: ${newIncidentTitle}`, type: newIncidentPriority },
      ...prev
    ]);

    setNewIncidentTitle("");
    setNewIncidentLocation("");
  };

  const filteredAlerts = alerts.filter(al => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Resolved") return al.status === "Resolved";
    return al.priority === selectedFilter && al.status === "Active";
  });

  const activeAlert = alerts.find(a => a.id === selectedAlertId) || filteredAlerts[0] || alerts[0];

  const badgeStyles: Record<string, React.CSSProperties> = {
    Critical: { color: "#C65555", borderColor: "rgba(198,85,85,0.3)", backgroundColor: "rgba(198,85,85,0.08)" },
    High: { color: "#C0832F", borderColor: "rgba(192,131,47,0.3)", backgroundColor: "rgba(192,131,47,0.08)" },
    Medium: { color: "#796B9A", borderColor: "rgba(121,107,154,0.3)", backgroundColor: "rgba(121,107,154,0.08)" },
    Low: { color: "#4D7FA9", borderColor: "rgba(77,127,169,0.3)", backgroundColor: "rgba(77,127,169,0.08)" }
  };

  const getPriorityIcon = (p: string) => {
    switch (p) {
      case 'Critical': return <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />;
      case 'High': return <AlertTriangle className="w-3.5 h-3.5" />;
      case 'Medium': return <Target className="w-3.5 h-3.5" />;
      default: return <Info className="w-3.5 h-3.5" />;
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'Critical': return '#C65555';
      case 'High': return '#C0832F';
      case 'Medium': return '#796B9A';
      default: return '#4D7FA9';
    }
  };

  const activeAlertChecklist = checklist[activeAlert?.id] || { notify: false, patrol: false, comms: false, log: false };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6"
      id="alerts-view-root"
    >
      <div className="premium-card p-6 min-h-[600px] flex flex-col justify-between space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3.5 text-left">
            <div className="p-2.5 rounded-[16px] bg-white border border-slate-200/60 shadow-sm animate-pulse-slow">
              <Sparkles className="w-5.5 h-5.5 text-[#3B8D72]" />
            </div>
            <div>
              <h3 className="text-base font-sans font-extrabold text-[#1E293B] tracking-tight">AI Alert Center</h3>
              <p className="text-xs text-slate-400 font-sans font-medium">Detect unusual crime activity, emerging threats, and operational risks in real time.</p>
            </div>
          </div>
          
          {/* Liquid Glass Badge */}
          <div className="flex items-center gap-2.5 bg-white border border-slate-200 px-4 py-2 rounded-[16px] shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C65555] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C65555]"></span>
            </span>
            <span className="text-[9px] font-mono text-[#C65555] font-extrabold tracking-wider uppercase">
              LIVE COMMAND STREAM
            </span>
          </div>
        </div>

        {/* Elegant Chips Filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4 pt-1">
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest mr-2 flex items-center gap-1.5 select-none">
            <SlidersHorizontal className="w-3.5 h-3.5" /> MATRIX FILTER:
          </span>
          {["All", "Critical", "High", "Medium", "Low", "Resolved"].map((filter) => {
            const isActive = selectedFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3.5 py-1.5 text-[10px] font-mono rounded-full font-extrabold uppercase border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-white border-[#3B8D72]/40 text-[#3B8D72] shadow-sm scale-102"
                    : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Workspace Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-stretch">
          
          {/* Left Column: List and Broadcast Form */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar text-left">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold pl-1">
                ANOMALOUS EVENTS ({filteredAlerts.length})
              </span>

              {filteredAlerts.length === 0 ? (
                <div className="p-8 rounded-[24px] border border-slate-200 bg-slate-50 text-center space-y-2 shadow-sm">
                  <CheckCircle2 className="w-8 h-8 text-[#3B8D72] mx-auto opacity-70" />
                  <p className="text-xs font-sans text-slate-500 font-bold">No outstanding intelligence events in this vector</p>
                  <p className="text-[10px] font-mono text-slate-400">ALL TARGET REGIONS OPERATING UNDER NORMAL THREAT PROFILE</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {filteredAlerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`p-4 rounded-[22px] bg-white border text-left ${
                          selectedAlertId === alert.id 
                            ? 'border-[#3B8D72]/40 shadow-md bg-slate-50/50' 
                            : 'border-slate-200 shadow-sm hover:border-slate-300'
                        } transition-all duration-205 space-y-3.5 cursor-pointer relative overflow-hidden group`}
                        onClick={() => setSelectedAlertId(alert.id)}
                      >
                        <div 
                          className="absolute top-0 left-0 bottom-0 w-[3.5px] transition-all duration-200" 
                          style={{ backgroundColor: getPriorityColor(alert.priority) }}
                        />

                        {/* Top layout */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span 
                              className="px-2.5 py-0.5 rounded-[8px] text-[8.5px] font-mono font-extrabold uppercase flex items-center gap-1 border shadow-sm"
                              style={badgeStyles[alert.priority]}
                            >
                              {getPriorityIcon(alert.priority)}
                              {alert.priority}
                            </span>
                            <span className="text-[9px] font-mono text-slate-450 font-bold">{alert.id}</span>
                          </div>

                          <div className="flex items-center gap-2 text-[9px] font-mono text-slate-400">
                            <span className="flex items-center gap-1 font-bold"><Clock className="w-3.5 h-3.5 text-slate-450" /> {alert.time}</span>
                            <span className="text-slate-300 select-none">•</span>
                            <span className="px-2 py-0.5 rounded-[6px] bg-slate-50 border border-slate-200 text-slate-500 font-bold text-[8px] shadow-sm">
                              AI CONFIDENCE: <span style={{ color: getPriorityColor(alert.priority) }}>{alert.confidenceScore}%</span>
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="text-[13px] font-sans font-bold text-slate-800 tracking-tight group-hover:text-[#3B8D72] transition-colors duration-150 pl-1">
                          {alert.title}
                        </h4>

                        {/* Explanation */}
                        <div className="p-3 rounded-[16px] bg-slate-50 border border-slate-200/60 space-y-1">
                          <p className="text-[11px] text-slate-600 font-medium leading-normal font-sans">
                            {alert.aiExplanation}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1 pt-1 text-[10px]">
                          <div className="flex items-center gap-1.5 text-slate-550 font-semibold">
                            <MapPin className="w-3.5 h-3.5 text-slate-450 flex-shrink-0" />
                            <span className="truncate">{alert.location}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-slate-550 font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#3B8D72] flex-shrink-0" />
                            <span className="truncate text-slate-600">Action: Deploy perimeter checkpoints</span>
                          </div>
                        </div>

                        {/* Card actions */}
                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAlertId(alert.id);
                            }}
                            className="px-3 py-1.5 text-[9.5px] font-sans font-extrabold text-[#3B8D72] hover:bg-[#3B8D72]/5 rounded-[10px] transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> Inspect Telemetry
                          </button>
                          
                          {alert.status === 'Active' ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStatus(alert.id);
                              }}
                              className="px-3 py-1.5 text-[9.5px] font-mono font-bold bg-[#3B8D72]/10 text-[#3B8D72] hover:bg-[#3B8D72]/20 border border-[#3B8D72]/20 rounded-[10px] transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" /> Dismiss & Resolve
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStatus(alert.id);
                              }}
                              className="px-3 py-1.5 text-[9.5px] font-mono font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 rounded-[10px] transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                            >
                              <RotateCcw className="w-3.5 h-3.5" /> Re-Evaluate Alert
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Incident dispatch trigger form */}
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 space-y-4 text-left shadow-sm">
              <div className="border-b border-slate-150 pb-3 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Telemetry Dispatch Module</span>
                  <h4 className="text-sm font-sans font-extrabold text-slate-800 tracking-tight">Manual Incident Broadcast Signal</h4>
                </div>
                <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-sm">
                  <Radio className="w-4 h-4 text-[#C65555] animate-pulse" />
                </div>
              </div>

              <form onSubmit={handleCreateIncident} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Incident Title / Signal</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Tactical Comm Intrusion Sweep" 
                      value={newIncidentTitle}
                      onChange={(e) => setNewIncidentTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 text-xs text-slate-850 placeholder-slate-400 rounded-[14px] focus:outline-none focus:border-[#3B8D72]/50 shadow-inner"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Target Sector / Region</label>
                    <select 
                      value={newIncidentSector}
                      onChange={(e) => setNewIncidentSector(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 text-xs text-slate-700 rounded-[14px] focus:outline-none focus:border-[#3B8D72]/50 cursor-pointer shadow-sm font-bold"
                    >
                      <option value="SEC_ALPHA">Sector Alpha (Port Authority)</option>
                      <option value="SEC_BETA">Sector Beta (Financial District)</option>
                      <option value="SEC_DELTA">Sector Delta (Commercial Zone)</option>
                      <option value="SEC_GAMMA">Sector Gamma (Industrial Center)</option>
                      <option value="SEC_OMEGA">Sector Omega (Border Crossing)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Threat Level</label>
                    <select 
                      value={newIncidentPriority}
                      onChange={(e) => setNewIncidentPriority(e.target.value as any)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 text-xs text-slate-700 rounded-[14px] focus:outline-none focus:border-[#3B8D72]/50 cursor-pointer shadow-sm font-bold"
                    >
                      <option value="Critical">🚨 Critical Response</option>
                      <option value="High">⚠️ High Priority</option>
                      <option value="Medium">⚡ Medium Priority</option>
                      <option value="Low">ℹ️ Low Priority</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Locus Coordinates</label>
                    <input 
                      type="text" 
                      placeholder="e.g., North Port Sector" 
                      value={newIncidentLocation}
                      onChange={(e) => setNewIncidentLocation(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 text-xs text-slate-850 placeholder-slate-400 rounded-[14px] focus:outline-none focus:border-[#3B8D72]/50 shadow-inner"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#3B8D72] hover:bg-[#3B8D72]/90 text-white font-sans font-bold text-xs py-3 rounded-[16px] flex items-center justify-center gap-2 shadow-md shadow-[#3B8D72]/20 transition-all duration-200 cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Broadcast AI-Assessed Telemetry Signal
                </button>
              </form>
            </div>

          </div>

          {/* Right Column: Active Intel Deep Dive & Chronological Timeline */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            
            {/* Active Telemetry Inspector HUD */}
            <div className="p-5 rounded-[24px] border border-slate-200 bg-white/80 text-left space-y-4 relative overflow-hidden flex-1 flex flex-col justify-between shadow-sm">
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#3B8D72]/40 to-transparent animate-pulse" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">TACTICAL INSPECTOR HUD</span>
                    <h4 className="text-xs font-mono font-extrabold text-slate-700 flex items-center gap-1.5">
                      ACTIVE NODE: <span className="text-[#3B8D72]">{activeAlert?.id || "N/A"}</span>
                    </h4>
                  </div>
                  {activeAlert && (
                    <span 
                      className="text-[8.5px] font-mono px-2 py-0.5 rounded border font-extrabold uppercase shadow-sm"
                      style={{ 
                        color: getPriorityColor(activeAlert.priority), 
                        borderColor: `${getPriorityColor(activeAlert.priority)}25`, 
                        backgroundColor: `${getPriorityColor(activeAlert.priority)}08` 
                      }}
                    >
                      {activeAlert.priority} Threat
                    </span>
                  )}
                </div>

                {/* Radar visualization */}
                <div className="relative w-full h-36 bg-slate-50 rounded-[20px] overflow-hidden border border-slate-200 flex items-center justify-center shadow-inner">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.005)_1px,transparent_1px)] bg-[size:12px_12px]" />
                  
                  <div className="absolute w-28 h-28 rounded-full border border-[#3B8D72]/20 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-dashed border-[#3B8D72]/10 animate-spin-slow" />
                    <div className="absolute w-24 h-24 rounded-full border border-[#3B8D72]/10 flex items-center justify-center" />
                    <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_40%,rgba(59,141,114,0.08))] animate-spin-slow" style={{ animationDuration: '4s' }} />
                    <div className="w-12 h-12 rounded-full border border-[#3B8D72]/25 flex items-center justify-center shadow-sm bg-white">
                      <div className="w-4 h-4 rounded-full bg-[#3B8D72]/5 border border-[#3B8D72]/40 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-[#3B8D72] animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {activeAlert?.priority === 'Critical' && (
                    <>
                      <div className="absolute top-8 left-12 w-2.5 h-2.5 rounded-full bg-[#C65555] shadow-[0_0_8px_rgba(198,85,85,0.4)] animate-ping" />
                      <div className="absolute top-8 left-12 w-1.5 h-1.5 rounded-full bg-[#C65555]" />
                    </>
                  )}

                  {activeAlert?.priority === 'High' && (
                    <>
                      <div className="absolute top-10 right-14 w-2.5 h-2.5 rounded-full bg-[#C0832F] shadow-[0_0_8px_rgba(192,131,47,0.4)] animate-ping" />
                      <div className="absolute top-10 right-14 w-1.5 h-1.5 rounded-full bg-[#C0832F]" />
                    </>
                  )}

                  <div className="absolute bottom-3 text-[8px] font-mono text-slate-400 tracking-wider font-extrabold">
                    RECON SECTOR: {activeAlert?.sector || "NONE"}
                  </div>
                </div>

                {activeAlert ? (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h4 className="text-xs font-sans font-bold text-slate-800">{activeAlert.title}</h4>
                      <p className="text-[11px] text-slate-500 font-medium font-sans">{activeAlert.location}</p>
                    </div>

                    <div className="p-3 rounded-[16px] bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Recommended Tactical Checkpoints</span>
                      <p className="text-[11px] text-slate-600 font-medium leading-normal font-sans">{activeAlert.recommendedAction}</p>
                    </div>

                    {/* Interactive Response Checklist */}
                    <div className="space-y-2">
                      <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Operational Checklist</span>
                      <div className="space-y-1.5 text-[10px] font-bold">
                        <button 
                          onClick={() => handleToggleChecklist(activeAlert.id, 'notify')}
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-[12px] flex items-center justify-between text-left hover:border-slate-300 transition-all cursor-pointer shadow-sm"
                        >
                          <span className="text-slate-600">Notify Incident watch commander</span>
                          {activeAlertChecklist.notify ? (
                            <span className="text-[#3B8D72] font-mono text-[9px] font-extrabold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> SENT</span>
                          ) : (
                            <span className="text-slate-400 font-mono text-[9px] font-extrabold">PENDING</span>
                          )}
                        </button>

                        <button 
                          onClick={() => handleToggleChecklist(activeAlert.id, 'patrol')}
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-[12px] flex items-center justify-between text-left hover:border-slate-300 transition-all cursor-pointer shadow-sm"
                        >
                          <span className="text-slate-600">Divert nearest patrol unit</span>
                          {activeAlertChecklist.patrol ? (
                            <span className="text-[#3B8D72] font-mono text-[9px] font-extrabold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> ROUTED</span>
                          ) : (
                            <span className="text-slate-400 font-mono text-[9px] font-extrabold">PENDING</span>
                          )}
                        </button>

                        <button 
                          onClick={() => handleToggleChecklist(activeAlert.id, 'comms')}
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-[12px] flex items-center justify-between text-left hover:border-slate-300 transition-all cursor-pointer shadow-sm"
                        >
                          <span className="text-slate-600">Establish radio coordination channel</span>
                          {activeAlertChecklist.comms ? (
                            <span className="text-[#3B8D72] font-mono text-[9px] font-extrabold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> ESTABLISHED</span>
                          ) : (
                            <span className="text-slate-400 font-mono text-[9px] font-extrabold">PENDING</span>
                          )}
                        </button>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 text-xs font-mono">
                    SELECT AN ANOMALY VECTOR TO VIEW TELEMETRY DETAILS
                  </div>
                )}
              </div>

              {activeAlert && (
                <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between items-center text-[8.5px] font-mono text-slate-400 uppercase font-bold">
                  <span>Recon Stamp: {activeAlert.timestamp}</span>
                  <span className="font-extrabold" style={{ color: getPriorityColor(activeAlert.priority) }}>
                    MATCH SCORE: {activeAlert.confidenceScore}%
                  </span>
                </div>
              )}
            </div>

            {/* Compact Live Signal Event Timeline */}
            <div className="p-5 rounded-[24px] bg-white border border-slate-200 space-y-4 text-left shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#3B8D72]" />
                  <h4 className="text-xs font-mono uppercase tracking-widest font-bold text-slate-700">
                    Live Signal Chronology
                  </h4>
                </div>
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-400 font-bold uppercase">
                  TEMPORAL VECTOR
                </span>
              </div>

              <div className="relative pl-5 space-y-4 max-h-[160px] overflow-y-auto custom-scrollbar">
                <div className="absolute top-1 bottom-1 left-[7px] w-[1px] bg-gradient-to-b from-[#4D7FA9]/50 via-[#C65555]/40 to-transparent" />

                {timelineEvents.map((ev, idx) => (
                  <div key={idx} className="relative flex items-start gap-3 group">
                    <div 
                      className="absolute left-[-22px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 flex items-center justify-center transition-all duration-205 group-hover:scale-125 shadow-sm"
                      style={{ 
                        borderColor: ev.type === 'Critical' ? '#C65555' : ev.type === 'High' ? '#C0832F' : ev.type === 'Medium' ? '#796B9A' : ev.type === 'Low' ? '#4D7FA9' : '#94A3B8' 
                      }}
                    >
                      {ev.type === 'Critical' && (
                        <span className="absolute inset-0 rounded-full bg-[#C65555]/30 animate-ping" />
                      )}
                    </div>

                    <div className="space-y-0.5 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400 font-bold">{ev.time}</span>
                        <span 
                          className="text-[8px] font-mono px-1.5 py-0.2 rounded border font-extrabold uppercase shadow-sm"
                          style={{
                            color: ev.type === 'Critical' ? '#C65555' : ev.type === 'High' ? '#C0832F' : ev.type === 'Medium' ? '#796B9A' : ev.type === 'Low' ? '#4D7FA9' : '#64748B',
                            borderColor: ev.type === 'Critical' ? 'rgba(198,85,85,0.2)' : ev.type === 'High' ? 'rgba(192,131,47,0.2)' : ev.type === 'Medium' ? 'rgba(121,107,154,0.2)' : ev.type === 'Low' ? 'rgba(77,127,169,0.2)' : 'rgba(100,116,139,0.2)',
                            backgroundColor: ev.type === 'Critical' ? 'rgba(198,85,85,0.05)' : ev.type === 'High' ? 'rgba(192,131,47,0.05)' : ev.type === 'Medium' ? 'rgba(121,107,154,0.05)' : ev.type === 'Low' ? 'rgba(77,127,169,0.05)' : 'rgba(100,116,139,0.05)',
                          }}
                        >
                          {ev.type}
                        </span>
                      </div>
                      <p className="text-[11px] font-sans text-slate-600 leading-tight font-semibold">
                        {ev.event}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400 font-bold">
          <span>AI SYSTEM CONFIDENCE LAYER: HIGHLY CORRELATED</span>
          <span>DISPATCH LINK STATUS: ENCRYPTED PORT-SECURE</span>
        </div>

      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------
 * 5. SYSTEM SETTINGS VIEW (AGENCY PARAMETERS & CLEARANCE MODULE)
 * ------------------------------------------------------------- */
interface SettingsViewProps {
  activeTab?: "security" | "appearance";
  onTabChange?: (tab: "security" | "appearance") => void;
  savedTheme?: "light" | "dark" | "system";
  onThemeSave?: (theme: "light" | "dark" | "system") => void;
}

export function SettingsView({
  activeTab = "security",
  onTabChange,
  savedTheme = "light",
  onThemeSave
}: SettingsViewProps) {
  const [telemetryFrequency, setTelemetryFrequency] = useState<number>(30);
  const [biometricPass, setBiometricPass] = useState("");
  const [isCredentialActive, setIsCredentialActive] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Backend API Connector states
  const [backendUrlInput, setBackendUrlInput] = useState<string>(() => getBackendUrl());
  const [healthStatus, setHealthStatus] = useState<BackendHealth | null>(null);
  const [isTestingBackend, setIsTestingBackend] = useState<boolean>(false);
  const [apiMsg, setApiMsg] = useState<string | null>(null);

  useEffect(() => {
    checkBackendHealth().then(status => setHealthStatus(status));
  }, []);

  const handleTestBackend = async () => {
    setIsTestingBackend(true);
    setBackendUrl(backendUrlInput);
    const result = await checkBackendHealth();
    setHealthStatus(result);
    setIsTestingBackend(false);
    if (result.connected) {
      setApiMsg(`Backend API connected successfully (${result.pingMs}ms)!`);
    } else {
      setApiMsg(`Backend ping notice: ${result.message}`);
    }
    setTimeout(() => setApiMsg(null), 4500);
  };

  const handleSaveBackendUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setBackendUrl(backendUrlInput);
    handleTestBackend();
  };

  // Theme selection state for the edit session
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark" | "system">(savedTheme);
  const [themeSuccessMsg, setThemeSuccessMsg] = useState<string | null>(null);

  // Sync selectedTheme if savedTheme props updates
  useEffect(() => {
    setSelectedTheme(savedTheme);
  }, [savedTheme]);

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
      <div className="premium-card p-6 min-h-[500px] flex flex-col justify-between shadow-sm">
        
        {/* Header Section with Tab Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-[14px] bg-white border border-slate-200/60 shadow-sm">
              {activeTab === "appearance" ? (
                <Palette className="w-5 h-5 text-[#3B8D72]" />
              ) : (
                <Settings className="w-5 h-5 text-[#3B8D72]" />
              )}
            </div>
            <div className="text-left">
              <h3 className="text-base font-sans font-bold text-slate-800 tracking-tight">
                {activeTab === "appearance" ? "Appearance" : "System Security & Access Controls"}
              </h3>
              <p className="text-xs text-slate-450 font-sans font-semibold">
                {activeTab === "appearance" 
                  ? "Choose how CrimeOps appears on your device." 
                  : "Manage Police Agency Integration Channels, Biometrics, and Sync Telemetry"}
              </p>
            </div>
          </div>

          {/* Premium Segmented Controls / Tab Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-[14px] border border-slate-200 shadow-inner">
            <button
              onClick={() => onTabChange?.("security")}
              className={`px-3.5 py-1.5 text-[10px] font-mono rounded-[10px] transition-all duration-200 font-bold cursor-pointer ${
                activeTab === "security" 
                  ? 'bg-white border border-slate-200 text-[#1E293B] shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              SECURITY & ACCESS
            </button>
            <button
              onClick={() => onTabChange?.("appearance")}
              className={`px-3.5 py-1.5 text-[10px] font-mono rounded-[10px] transition-all duration-200 font-bold cursor-pointer ${
                activeTab === "appearance" 
                  ? 'bg-white border border-slate-200 text-[#1E293B] shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              APPEARANCE
            </button>
          </div>
        </div>

        {activeTab === "security" ? (
          /* original security modules grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 flex-1 text-left">
            
            {/* Clearance Config Card */}
            <div className="p-5 soft-neumorphic rounded-[24px] flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-[#C0832F]" />
                  <h4 className="text-xs font-mono uppercase tracking-widest font-extrabold text-slate-800">Clearance Biometric Keys</h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-sans font-medium">
                  Establish secure encryption passkeys to query national databases. Security protocols automatically terminate inactive officer sessions.
                </p>

                {statusMsg && (
                  <div className="p-2.5 rounded-[14px] bg-[#3B8D72]/10 border border-[#3B8D72]/30 text-[#3B8D72] text-[10px] font-sans font-bold flex items-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{statusMsg}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateBiometric} className="space-y-2.5 pt-1">
                  <input 
                    type="password" 
                    placeholder="Enter cryptographic clearance key..." 
                    value={biometricPass}
                    onChange={(e) => setBiometricPass(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 rounded-[20px] focus:outline-none focus:border-[#3B8D72]/50 shadow-inner"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-white border border-slate-200 text-slate-700 font-sans font-bold text-xs py-2.5 rounded-[18px] hover:border-slate-350 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    Configure Cryptographic Key
                  </button>
                </form>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[9px] font-mono text-slate-400 font-bold">
                <span className="flex items-center gap-1"><UserCheck className="w-3.5 h-3.5 text-slate-400" /> POLICY ACCESS: STABLE</span>
                <span className="text-slate-500">ROLE: CMD_OFFICER</span>
              </div>
            </div>

            {/* Database Ingest Pipelines / Backend API Connector */}
            <div className="p-5 soft-neumorphic rounded-[24px] flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Key className="w-4 h-4 text-[#3B8D72]" />
                    <h4 className="text-xs font-mono uppercase tracking-widest font-extrabold text-slate-800">Backend API Node Connector</h4>
                  </div>
                  {healthStatus?.connected ? (
                    <span className="text-[8.5px] font-mono px-2 py-0.5 bg-[#3B8D72]/10 border border-[#3B8D72]/20 text-[#3B8D72] rounded-full font-extrabold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3B8D72] animate-pulse" /> LIVE CONNECTED
                    </span>
                  ) : (
                    <span className="text-[8.5px] font-mono px-2 py-0.5 bg-[#C0832F]/10 border border-[#C0832F]/20 text-[#C0832F] rounded-full font-extrabold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C0832F]" /> FALLBACK MODE
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed font-sans font-medium">
                  Connect CrimeOps directly to your hosted backend API (Vercel, Express, Fastify, etc.) to load live database streams instead of static placeholders.
                </p>

                {apiMsg && (
                  <div className={`p-2.5 rounded-[14px] text-[10px] font-sans font-bold flex items-center gap-1.5 shadow-sm ${
                    healthStatus?.connected 
                      ? 'bg-[#3B8D72]/10 border border-[#3B8D72]/30 text-[#3B8D72]' 
                      : 'bg-[#C0832F]/10 border border-[#C0832F]/30 text-[#C0832F]'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{apiMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSaveBackendUrl} className="space-y-2.5 pt-1">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Backend Base URL (or /api)</label>
                    <input 
                      type="url" 
                      placeholder="e.g. https://my-crimeops-backend.vercel.app" 
                      value={backendUrlInput}
                      onChange={(e) => setBackendUrlInput(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 rounded-[18px] focus:outline-none focus:border-[#3B8D72]/50 shadow-inner font-mono"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isTestingBackend}
                      className="flex-1 bg-[#3B8D72] hover:bg-[#3B8D72]/90 text-white font-sans font-bold text-xs py-2 rounded-[16px] transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {isTestingBackend ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Testing Ping...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Save & Connect
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleTestBackend}
                      disabled={isTestingBackend}
                      className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 font-sans font-bold text-xs rounded-[16px] hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
                    >
                      Test Ping
                    </button>
                  </div>
                </form>

                <div className="space-y-1.5 pt-1 text-[10px] font-mono text-slate-500">
                  <div className="flex justify-between items-center bg-white/70 p-2 rounded-[12px] border border-slate-200">
                    <span className="font-bold">HEALTH ENDPOINT:</span>
                    <span className="text-slate-700 font-semibold">{backendUrlInput ? `${backendUrlInput}/api/health` : '/api/health'}</span>
                  </div>
                  {healthStatus?.pingMs !== undefined && (
                    <div className="flex justify-between items-center px-1 text-[9px] text-slate-400 font-bold">
                      <span>LATENCY: {healthStatus.pingMs}ms</span>
                      <span>LAST CHECK: {healthStatus.lastChecked}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[9px] font-mono text-slate-400 font-bold">
                <span className="flex items-center gap-1"><Database className="w-3.5 h-3.5 text-slate-400" /> REST API PIPELINE</span>
                <span className="text-[#3B8D72]">CONFIGURED</span>
              </div>
            </div>

            {/* Telemetry settings */}
            <div className="p-5 soft-neumorphic rounded-[24px] flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-[#3B8D72]" />
                  <h4 className="text-xs font-mono uppercase tracking-widest font-extrabold text-slate-800">Telemetry Sync Rate</h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-sans font-medium">
                  Adjust precision and polling intervals for live geofencing maps and terminal query synchronizations. Lower intervals require wider channels.
                </p>

                <div className="p-3.5 bg-white border border-slate-200 rounded-[20px] space-y-2 shadow-inner">
                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                    <span>Replication Polling Frequency</span>
                    <span className="text-[#3B8D72] font-bold">{telemetryFrequency} Seconds</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="120" 
                    value={telemetryFrequency}
                    onChange={(e) => setTelemetryFrequency(parseInt(e.target.value))}
                    className="w-full accent-[#3B8D72] bg-slate-200 h-1 rounded-[20px] focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[9px] font-mono text-slate-400 font-bold">
                <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-slate-400" /> SECURE TUNING ACTIVE</span>
                <span className="text-[#3B8D72] hover:underline cursor-pointer">RE-CALIBRATE</span>
              </div>
            </div>

            {/* Cryptographic Audit Trail logs */}
            <div className="p-5 soft-neumorphic rounded-[24px] flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-slate-450" />
                  <h4 className="text-xs font-mono uppercase tracking-widest font-extrabold text-slate-800">Cryptographic Ledger Audits</h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-sans font-medium">
                  All incident broadcasts and clearance modifications are cryptographically sealed and written permanently into regional oversight files.
                </p>

                <div className="p-3 bg-white border border-slate-200 rounded-[18px] text-[10px] font-mono text-slate-400 font-bold space-y-1 shadow-inner">
                  <div className="truncate">LOG: CLEARANCE_KEY_ROTATED // AUTH: SMITH_RJ</div>
                  <div className="truncate">LOG: REGIONAL_CAD_POLLING // SUCCESSFUL_SYNC</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[9px] font-mono text-slate-400 font-bold">
                <span className="flex items-center gap-1"><FileCheck className="w-3.5 h-3.5 text-slate-400" /> TAMPER-EVIDENT ACTIVATED</span>
                <span className="text-[#3B8D72] hover:underline cursor-pointer">EXPORT COPIES</span>
              </div>
            </div>

          </div>
        ) : (
          /* beautiful Appearance Configuration page */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6 flex-1 text-left items-stretch">
            
            {/* Left side: options */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <h4 className="text-xs font-mono uppercase tracking-widest font-extrabold text-slate-800">
                    Application Theme
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans font-medium">
                    Configure the primary visual style for the dashboard. Light theme utilizes our signature high-contrast classic layout, while Dark theme provides an eye-safe charcoal-based command environment.
                  </p>
                </div>

                {themeSuccessMsg && (
                  <div className="p-3.5 rounded-[16px] bg-[#3B8D72]/10 border border-[#3B8D72]/30 text-[#3B8D72] text-xs font-sans font-bold flex items-center gap-2 shadow-sm">
                    <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0" />
                    <span>{themeSuccessMsg}</span>
                  </div>
                )}

                {/* Theme Selector segmented card options */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Light theme */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedTheme("light")}
                    className={`p-5 rounded-[22px] border cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3.5 text-center relative select-none shadow-sm ${
                      selectedTheme === "light"
                        ? "bg-white border-[#3B8D72] ring-1 ring-[#3B8D72]/20 shadow-[0_4px_12px_rgba(59,141,114,0.08)]"
                        : "bg-white/60 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {selectedTheme === "light" && (
                      <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#3B8D72] flex items-center justify-center text-white shadow-sm">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                    <div className={`p-3 rounded-full border transition-all duration-300 ${
                      selectedTheme === "light" ? "bg-[#3B8D72]/10 border-[#3B8D72]/20 text-[#3B8D72]" : "bg-slate-50 border-slate-200 text-slate-500"
                    }`}>
                      <Sun className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-sans font-bold text-slate-800">☀️ Light</div>
                      <div className="text-[9px] font-mono text-slate-400">Classic Crisp Theme</div>
                    </div>
                  </motion.div>

                  {/* Dark theme */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedTheme("dark")}
                    className={`p-5 rounded-[22px] border cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3.5 text-center relative select-none shadow-sm ${
                      selectedTheme === "dark"
                        ? "bg-white border-[#3B8D72] ring-1 ring-[#3B8D72]/20 shadow-[0_4px_12px_rgba(59,141,114,0.08)]"
                        : "bg-white/60 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {selectedTheme === "dark" && (
                      <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#3B8D72] flex items-center justify-center text-white shadow-sm">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                    <div className={`p-3 rounded-full border transition-all duration-300 ${
                      selectedTheme === "dark" ? "bg-[#3B8D72]/10 border-[#3B8D72]/20 text-[#3B8D72]" : "bg-slate-50 border-slate-200 text-slate-500"
                    }`}>
                      <Moon className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-sans font-bold text-slate-800">🌙 Dark</div>
                      <div className="text-[9px] font-mono text-slate-400">Tactical Charcoal</div>
                    </div>
                  </motion.div>

                  {/* System theme */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedTheme("system")}
                    className={`p-5 rounded-[22px] border cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3.5 text-center relative select-none shadow-sm ${
                      selectedTheme === "system"
                        ? "bg-white border-[#3B8D72] ring-1 ring-[#3B8D72]/20 shadow-[0_4px_12px_rgba(59,141,114,0.08)]"
                        : "bg-white/60 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {selectedTheme === "system" && (
                      <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#3B8D72] flex items-center justify-center text-white shadow-sm">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                    <div className={`p-3 rounded-full border transition-all duration-300 ${
                      selectedTheme === "system" ? "bg-[#3B8D72]/10 border-[#3B8D72]/20 text-[#3B8D72]" : "bg-slate-50 border-slate-200 text-slate-500"
                    }`}>
                      <Monitor className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-sans font-bold text-slate-800">💻 System</div>
                      <div className="text-[9px] font-mono text-slate-400">Match Device Settings</div>
                    </div>
                  </motion.div>

                </div>
              </div>

              {/* Bottom buttons inside Options Column */}
              <div className="flex gap-3 pt-6 border-t border-slate-100 justify-end w-full">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTheme(savedTheme);
                    onTabChange?.("security");
                  }}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-sans font-bold text-xs rounded-[16px] transition-all duration-200 cursor-pointer shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onThemeSave?.(selectedTheme);
                    setThemeSuccessMsg("Theme configuration successfully applied!");
                    setTimeout(() => setThemeSuccessMsg(null), 3500);
                  }}
                  className="px-6 py-2.5 bg-[#3B8D72] hover:bg-[#3B8D72]/90 text-white font-sans font-bold text-xs rounded-[16px] shadow-md shadow-[#3B8D72]/15 hover:shadow-[#3B8D72]/25 transition-all duration-250 flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            </div>

            {/* Right side: Live Preview */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full">
              <div className="p-5 soft-neumorphic rounded-[24px] flex flex-col justify-between relative overflow-hidden flex-1 shadow-sm border border-slate-200/80">
                <div className="space-y-4 text-left">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#3B8D72]" /> Theme Preview Card
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans font-medium">
                    This live preview card renders instantly using the selected colors to showcase your active appearance preference.
                  </p>

                  {/* Inner Miniature replica showing chosen style */}
                  <div className="p-1 rounded-[22px] bg-slate-100 border border-slate-200/40 relative overflow-hidden shadow-inner">
                    <div className={
                      selectedTheme === "dark" || (selectedTheme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches)
                        ? "dark text-white"
                        : "text-[#1E293B]"
                    }>
                      <div className="premium-card p-4 space-y-3 border border-slate-200 rounded-[20px] shadow-sm text-slate-800 bg-white select-none transition-all duration-300">
                        
                        {/* Miniature replicate Header */}
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3B8D72] animate-pulse" />
                            <span className="text-[8px] font-mono tracking-wider font-extrabold text-slate-400">GIS_MAPPING // PREVIEW</span>
                          </div>
                          <span className="text-[7.5px] font-mono text-slate-400 font-bold">10:37 AM</span>
                        </div>

                        {/* Miniature replicate KPI content */}
                        <div className="space-y-1 text-left">
                          <span className="text-[8px] font-mono tracking-wider text-slate-450 uppercase font-bold block">
                            ACTIVE CASE INCIDENTS
                          </span>
                          <div className="flex items-baseline justify-between">
                            <span className="text-xl font-extrabold text-slate-850 tracking-tight font-sans">
                              1,248
                            </span>
                            <span className="text-[9px] font-mono font-bold text-[#3B8D72] px-1.5 py-0.2 bg-[#3B8D72]/10 border border-[#3B8D72]/20 rounded-full">
                              -8.4%
                            </span>
                          </div>
                        </div>

                        {/* Miniature replicate sparkline */}
                        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-[8px] font-mono text-slate-450">
                          <span className="font-bold">STATUS: TRACKED</span>
                          <svg className="w-16 h-5 overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                            <path d="M 0,20 L 15,10 L 30,15 L 45,5 L 60,18 L 80,12 L 100,8" fill="none" stroke="#3B8D72" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[9px] font-mono text-slate-400 font-bold">
                  <span className="uppercase">PREVIEW_ENGINE // STANDBY</span>
                  <span>v1.0.0</span>
                </div>
              </div>
            </div>

          </div>
        )}

        <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400 font-bold">
          <span>{activeTab === "appearance" ? "THEME RESOLUTION: AUTOMATIC" : "SECURITY LEVEL ASSIGNMENT: FULL CLEARANCE"}</span>
          <span>{activeTab === "appearance" ? "PREVIEW MODE: GL_RENDER" : "BUILD VERSION: v1.12.4 SECURE_REPLICATED"}</span>
        </div>
      </div>
    </motion.div>
  );
}

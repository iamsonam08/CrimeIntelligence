/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Menu, BadgeCheck, Search, ShieldAlert, Fingerprint, Activity, Terminal, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onMenuToggle: () => void;
  title?: string;
  subtitle?: string;
}

export function Header({ 
  onMenuToggle, 
  title = "CrimeOps Dashboard" 
}: HeaderProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Live Date and Time Clock
  useEffect(() => {
    const updateDate = () => {
      const d = new Date();
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', year: 'numeric' };
      const dateStr = d.toLocaleDateString('en-US', options).toUpperCase();
      const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      setFormattedDate(`${dateStr} • ${timeStr}`);
    };
    updateDate();
    const timer = setInterval(updateDate, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdowns on outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      type: 'critical',
      title: 'Database Sync Completed',
      desc: 'National criminal index synchronized successfully.',
      time: '2m ago',
      icon: <Terminal className="w-3.5 h-3.5 text-[#3B8D72]" />
    },
    {
      id: 2,
      type: 'warning',
      title: 'Geospatial Grid Calibration',
      desc: 'Sector 4 probability values updated.',
      time: '14m ago',
      icon: <Activity className="w-3.5 h-3.5 text-[#C0832F]" />
    },
    {
      id: 3,
      type: 'info',
      title: 'Security Clearance Audit',
      desc: 'Officer Smith session authenticated.',
      time: '1h ago',
      icon: <Fingerprint className="w-3.5 h-3.5 text-[#3B8D72]" />
    }
  ];

  // Map title to active node for the breadcrumb indicator
  const getActiveNode = (titleStr: string) => {
    const t = titleStr.toLowerCase();
    if (t.includes('dashboard')) return 'DASHBOARD';
    if (t.includes('mapping') || t.includes('map')) return 'GIS_MAPPING';
    if (t.includes('network') || t.includes('criminal')) return 'LINK_ANALYSIS';
    if (t.includes('predictive') || t.includes('prediction')) return 'FORECAST_ENGINE';
    if (t.includes('incident') || t.includes('dispatch') || t.includes('alerts')) return 'CAD_DISPATCH';
    if (t.includes('security') || t.includes('settings')) return 'SYSTEM_SETTINGS';
    return 'SYSTEM_NODE';
  };
  const activeNode = getActiveNode(title);

  return (
    <header className="flex flex-col lg:flex-row lg:items-start justify-between border-b border-slate-200/60 pb-8 mb-8 gap-6 relative" id="app-header">
      {/* Page Info & Mobile Menu Toggle */}
      <div className="flex items-start gap-4 flex-1">
        {/* Mobile Menu Trigger */}
        <button
          onClick={onMenuToggle}
          className="md:hidden mt-1.5 p-2.5 rounded-[18px] bg-white border border-slate-200 text-[#64748B] hover:text-[#1E293B] hover:border-slate-300 transition-all duration-200"
          aria-label="Open sidebar"
          id="mobile-menu-toggle-btn"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="space-y-3.5 text-left flex-1">
          {/* Top Label */}
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#3B8D72] font-bold uppercase block leading-none">
            REAL-TIME CRIME INTELLIGENCE
          </span>
          
          {/* Main Heading & Breadcrumb Node */}
          <div className="flex items-center gap-3.5 flex-wrap">
            <h1 className="text-3xl md:text-4xl font-sans font-extrabold tracking-tight text-[#1E293B] leading-none select-none">
              Crime<span className="font-semibold text-[#3B8D72]">Ops</span>
            </h1>
            
            {/* Elegant active node indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-[12px] bg-white border border-slate-200/60 font-mono text-[9px] text-[#64748B] font-bold tracking-wider select-none shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B8D72] animate-pulse" />
              {activeNode}
            </div>
          </div>

          <div className="space-y-1.5">
            {/* Subtitle */}
            <p className="text-sm font-sans font-bold text-slate-800 tracking-wide leading-none">
              AI-Powered Crime Intelligence Platform
            </p>

            {/* Core platform description */}
            <p className="text-xs text-[#64748B] max-w-3xl leading-relaxed font-sans font-medium">
              Monitor crime trends, identify criminal networks, predict emerging threats, and support data-driven policing through one unified intelligence platform.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side Tools & Profile */}
      <div className="flex flex-wrap items-center gap-3.5 lg:self-start z-30">
        
        {/* Current Date & Time Pill */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-[22px] bg-white/60 border border-slate-200/80 font-mono text-[9.5px] text-[#64748B] tracking-wider select-none shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3B8D72] animate-pulse" />
          <span>{formattedDate}</span>
        </div>

        {/* Search Input Box with Liquid Glass & Soft Neumorphism */}
        <div className="relative hidden md:block">
          <div className={`flex items-center gap-2.5 rounded-[22px] px-4.5 py-2.5 w-72 text-[#64748B] transition-all duration-300 ${
            isSearchFocused 
              ? 'bg-white border-[#3B8D72]/50 ring-1 ring-[#3B8D72]/30 shadow-[0_0_25px_rgba(59,141,114,0.12)] backdrop-blur-md' 
              : 'bg-white/60 border border-slate-200 shadow-sm hover:border-slate-300'
          }`}>
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search crimes, suspects, locations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="bg-transparent text-xs text-[#1E293B] placeholder-slate-400 focus:outline-none w-full font-sans"
              id="search-intelligence-input"
            />
            <kbd className="text-[9px] font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 text-slate-400 select-none">⌘K</kbd>
          </div>

          {/* Quick suggestions on search focus */}
          <AnimatePresence>
            {isSearchFocused && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
                className="absolute top-12 left-0 w-full rounded-[24px] bg-white/95 backdrop-blur-md p-4 z-50 text-left space-y-2 border border-slate-200 shadow-2xl"
              >
                <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest pl-1">Suggested Nodes</div>
                <div className="space-y-1">
                  <div className="p-2 hover:bg-[#3B8D72]/10 rounded-[14px] text-xs text-[#1E293B] flex items-center gap-2 cursor-pointer transition-colors duration-150 group">
                    <Shield className="w-3.5 h-3.5 text-[#3B8D72] group-hover:scale-110 transition-transform" />
                    <span>Sector 4 Mapping Grid</span>
                  </div>
                  <div className="p-2 hover:bg-[#3B8D72]/10 rounded-[14px] text-xs text-[#1E293B] flex items-center gap-2 cursor-pointer transition-colors duration-150 group">
                    <Activity className="w-3.5 h-3.5 text-[#C0832F] group-hover:scale-110 transition-transform" />
                    <span>Algorithmic Forecast Node</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notification Icon Button with Liquid Glass dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2.5 rounded-[22px] bg-white border border-slate-200 hover:border-slate-300 text-[#64748B] hover:text-[#1E293B] transition-all duration-200 group shadow-sm"
            aria-label="System Notifications"
            id="header-notification-btn"
          >
            <Bell className="w-4.5 h-4.5 transition-transform duration-200 group-hover:scale-105" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C65555] border-2 border-white" />
          </button>

          {/* Dropdown Container using Liquid Glass */}
          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 mt-3 w-80 rounded-[24px] bg-white/95 backdrop-blur-md p-4 z-50 space-y-3 shadow-2xl border border-slate-200"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-xs font-sans font-bold text-[#1E293B]">Intelligence Feed</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 rounded">3 PENDING</span>
                </div>

                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className="p-2.5 rounded-[18px] bg-slate-50/50 border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all flex gap-3 items-start cursor-pointer group"
                    >
                      <div className="p-2 bg-white border border-slate-200 rounded-[12px] mt-0.5 shadow-sm">
                        {n.icon}
                      </div>
                      <div className="flex-1 space-y-0.5 text-left">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-sans font-bold text-[#1E293B] group-hover:text-[#3B8D72] transition-colors">{n.title}</p>
                          <span className="text-[9px] font-mono text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-[10px] text-[#64748B] leading-normal">{n.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span className="hover:text-slate-600 cursor-pointer">Clear Feed</span>
                  <span className="text-[#3B8D72] hover:underline cursor-pointer">View Dispatch Hub</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Badge with Liquid Glass dropdown */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 pr-4 bg-white/60 border border-slate-200 rounded-[22px] cursor-pointer hover:border-[#3B8D72]/30 transition-all duration-300 shadow-sm hover:bg-white select-none"
            id="header-profile-badge"
          >
            {/* Avatar frame */}
            <div className="relative w-8.5 h-8.5 rounded-[12px] bg-slate-100 border border-slate-200 flex items-center justify-center font-mono text-[11px] font-bold text-[#3B8D72] select-none shadow-inner">
              CI
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#3B8D72] border-2 border-white" />
            </div>

            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1 leading-none">
                <span className="text-xs font-sans font-bold text-[#1E293B]">Officer Smith</span>
                <BadgeCheck className="w-3.5 h-3.5 text-[#3B8D72] flex-shrink-0" />
              </div>
              <p className="text-[9px] font-mono tracking-wider text-slate-400 mt-0.5">Crime Analyst</p>
            </div>
          </div>

          {/* Profile Dropdown panel */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-56 rounded-[24px] bg-white/95 backdrop-blur-md p-3.5 z-50 text-left space-y-2 border border-slate-200 shadow-2xl"
              >
                <div className="p-2 border-b border-slate-100 text-xs text-slate-400">
                  <p className="font-semibold text-[#1E293B]">Smith, Robert J.</p>
                  <p className="text-[10px] font-mono mt-0.5 text-slate-400">Badge ID: #98321</p>
                </div>
                <div className="space-y-1">
                  <div className="p-2 hover:bg-[#3B8D72]/10 rounded-[14px] text-xs text-[#1E293B] cursor-pointer transition-colors flex items-center gap-2 group">
                    <Fingerprint className="w-4 h-4 text-slate-400 group-hover:text-[#3B8D72] transition-colors" />
                    <span>My Credentials</span>
                  </div>
                  <div className="p-2 hover:bg-red-500/10 rounded-[14px] text-xs text-[#C65555] cursor-pointer transition-colors flex items-center gap-2 group">
                    <ShieldAlert className="w-4 h-4 text-[#C65555]" />
                    <span>Lock Session</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}

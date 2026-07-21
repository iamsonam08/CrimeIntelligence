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
  title = "CrimeOps Dashboard", 
  subtitle = "AI-Powered Crime Intelligence Platform" 
}: HeaderProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

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
      icon: <Terminal className="w-3.5 h-3.5 text-[#2563EB]" />
    },
    {
      id: 2,
      type: 'warning',
      title: 'Geospatial Grid Calibration',
      desc: 'Sector 4 probability values updated.',
      time: '14m ago',
      icon: <Activity className="w-3.5 h-3.5 text-[#F59E0B]" />
    },
    {
      id: 3,
      type: 'info',
      title: 'Security Clearance Audit',
      desc: 'Officer Smith session authenticated.',
      time: '1h ago',
      icon: <Fingerprint className="w-3.5 h-3.5 text-[#22C55E]" />
    }
  ];

  return (
    <header className="flex items-center justify-between border-b border-slate-900/60 pb-6 mb-8 gap-4 relative" id="app-header">
      {/* Page Info & Mobile Menu Toggle */}
      <div className="flex items-center gap-4 md:gap-0">
        {/* Mobile Menu Trigger */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2.5 rounded-[18px] bg-[#141C2F] border border-slate-800 text-[#94A3B8] hover:text-[#F8FAFC] hover:border-slate-700 transition-all duration-200"
          aria-label="Open sidebar"
          id="mobile-menu-toggle-btn"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="space-y-1 text-left">
          <h2 className="text-xl md:text-2xl font-sans font-bold text-[#F8FAFC] tracking-tight leading-none bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-xs text-[#94A3B8] font-sans font-medium tracking-wide">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right Side Tools & Profile */}
      <div className="flex items-center gap-3 relative z-30">
        
        {/* Search Input Box with Soft Neumorphism */}
        <div className="relative hidden md:block">
          <div className={`flex items-center gap-2 rounded-[20px] px-4 py-2 w-64 text-[#94A3B8] transition-all duration-300 ${
            isSearchFocused 
              ? 'bg-[#0A0F1D] border-[#6366F1]/40 ring-1 ring-[#6366F1]/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
              : 'soft-neumorphic-input'
          }`}>
            <Search className="w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search Intelligence..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="bg-transparent text-xs text-[#F8FAFC] placeholder-slate-500 focus:outline-none w-full"
              id="search-intelligence-input"
            />
            <kbd className="text-[9px] font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-slate-500 select-none">⌘K</kbd>
          </div>

          {/* Quick suggestions on search focus */}
          <AnimatePresence>
            {isSearchFocused && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
                className="absolute top-11 left-0 w-full rounded-[24px] liquid-glass p-4 z-50 text-left space-y-2 border border-slate-800/80 shadow-2xl"
              >
                <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest pl-1">Suggested Nodes</div>
                <div className="space-y-1">
                  <div className="p-2 hover:bg-[#6366F1]/10 rounded-[14px] text-xs text-[#F8FAFC] flex items-center gap-2 cursor-pointer transition-colors duration-150 group">
                    <Shield className="w-3.5 h-3.5 text-[#6366F1] group-hover:scale-110 transition-transform" />
                    <span>Sector 4 Mapping Grid</span>
                  </div>
                  <div className="p-2 hover:bg-[#6366F1]/10 rounded-[14px] text-xs text-[#F8FAFC] flex items-center gap-2 cursor-pointer transition-colors duration-150 group">
                    <Activity className="w-3.5 h-3.5 text-[#F59E0B] group-hover:scale-110 transition-transform" />
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
            className="relative p-2.5 rounded-[18px] soft-neumorphic text-[#94A3B8] hover:text-[#F8FAFC] hover:border-slate-800 transition-all duration-200 group"
            aria-label="System Notifications"
            id="header-notification-btn"
          >
            <Bell className="w-4.5 h-4.5 transition-transform duration-200 group-hover:scale-105" />
            
            {/* Notification Indicator Dot (Coral Red) */}
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F43F5E] border border-[#0A0F1D]" />
          </button>

          {/* Dropdown Container using Liquid Glass */}
          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 mt-3 w-80 rounded-[24px] liquid-glass p-4 z-50 space-y-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-800/80"
              >
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-2.5">
                  <span className="text-xs font-sans font-bold text-[#F8FAFC]">Intelligence Feed</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-slate-950 border border-slate-800/60 text-slate-400 rounded">3 PENDING</span>
                </div>

                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className="p-2.5 rounded-[18px] bg-slate-950/40 border border-slate-800/50 hover:bg-slate-900/60 transition-colors flex gap-3 items-start cursor-pointer group"
                    >
                      <div className="p-2 bg-slate-950 border border-slate-800 rounded-[12px] mt-0.5">
                        {n.icon}
                      </div>
                      <div className="flex-1 space-y-0.5 text-left">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-sans font-semibold text-[#F8FAFC] group-hover:text-[#6366F1] transition-colors">{n.title}</p>
                          <span className="text-[9px] font-mono text-slate-500">{n.time}</span>
                        </div>
                        <p className="text-[10px] text-[#94A3B8] leading-normal">{n.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-800/60 pt-2 flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span className="hover:text-slate-300 cursor-pointer">Clear Feed</span>
                  <span className="text-[#6366F1] hover:underline cursor-pointer">View Dispatch Hub</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Placeholder Badge with Liquid Glass dropdown */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-4 bg-[#141C2F] border border-slate-800 rounded-[18px] cursor-pointer hover:border-slate-700 transition-colors duration-200"
            id="header-profile-badge"
          >
            {/* Avatar frame */}
            <div className="relative w-8 h-8 rounded-[12px] bg-slate-950 border border-slate-800 flex items-center justify-center font-mono text-xs font-bold text-[#F8FAFC] select-none shadow-sm">
              CI
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#10B981] border border-[#0A0F1D]" />
            </div>

            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1 leading-none">
                <span className="text-xs font-sans font-semibold text-[#F8FAFC] truncate">Officer Smith</span>
                <BadgeCheck className="w-3.5 h-3.5 text-[#6366F1] flex-shrink-0" />
              </div>
              <p className="text-[9px] font-mono tracking-wider text-slate-500 mt-0.5">UNIT_CMD_01</p>
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
                className="absolute right-0 mt-3 w-56 rounded-[24px] liquid-glass p-3.5 z-50 text-left space-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-800/80"
              >
                <div className="p-2 border-b border-slate-800/60 text-xs text-slate-400">
                  <p className="font-semibold text-[#F8FAFC]">Smith, Robert J.</p>
                  <p className="text-[10px] font-mono mt-0.5 text-slate-500">Badge ID: #98321</p>
                </div>
                <div className="space-y-1">
                  <div className="p-2 hover:bg-[#6366F1]/10 rounded-[14px] text-xs text-[#F8FAFC] cursor-pointer transition-colors flex items-center gap-2 group">
                    <Fingerprint className="w-4 h-4 text-slate-400 group-hover:text-[#6366F1] transition-colors" />
                    <span>My Credentials</span>
                  </div>
                  <div className="p-2 hover:bg-red-500/10 rounded-[14px] text-xs text-[#F43F5E] cursor-pointer transition-colors flex items-center gap-2 group">
                    <ShieldAlert className="w-4 h-4 text-[#F43F5E]" />
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

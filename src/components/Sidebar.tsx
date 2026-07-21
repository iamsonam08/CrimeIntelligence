/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  LayoutDashboard, 
  Map, 
  Network, 
  TrendingUp, 
  Bell, 
  Settings,
  X,
  Fingerprint
} from 'lucide-react';
import { ActivePage, NavigationItem } from '../types';

interface SidebarProps {
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ activePage, onPageChange, isOpen = false, onClose }: SidebarProps) {
  const navItems: NavigationItem[] = [
    { id: 'dashboard', label: 'Dashboard', iconName: 'LayoutDashboard' },
    { id: 'crime-map', label: 'Crime Map', iconName: 'Map' },
    { id: 'criminal-network', label: 'Criminal Network', iconName: 'Network' },
    { id: 'predictions', label: 'Predictions', iconName: 'TrendingUp' },
    { id: 'alerts', label: 'Alerts', iconName: 'Bell' },
    { id: 'settings', label: 'Settings', iconName: 'Settings' },
  ];

  const getIcon = (iconName: string, active: boolean) => {
    const props = {
      className: `w-4.5 h-4.5 transition-colors duration-150 ${
        active ? 'text-[#2563EB]' : 'text-[#94A3B8] group-hover:text-[#F8FAFC]'
      }`
    };

    switch (iconName) {
      case 'LayoutDashboard': return <LayoutDashboard {...props} />;
      case 'Map': return <Map {...props} />;
      case 'Network': return <Network {...props} />;
      case 'TrendingUp': return <TrendingUp {...props} />;
      case 'Bell': return <Bell {...props} />;
      case 'Settings': return <Settings {...props} />;
      default: return <LayoutDashboard {...props} />;
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0D1325] border-r border-slate-900/80 p-6">
      {/* Sidebar Header: Logo & Title */}
      <div className="flex items-center justify-between mb-8 pb-5 border-b border-slate-900/60">
        <div className="flex items-center gap-3">
          {/* Logo Container */}
          <div className="flex items-center justify-center w-9 h-9 rounded-[14px] bg-slate-950 border border-slate-800 shadow-inner select-none">
            <Shield className="w-5 h-5 text-[#6366F1]" />
          </div>
          <div className="text-left">
            <h1 className="text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase font-bold leading-none mb-1">CRIME</h1>
            <p className="text-sm font-sans font-bold text-[#F8FAFC] tracking-tight leading-none bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Intelligence</p>
          </div>
        </div>

        {/* Close Button on Mobile */}
        {onClose && (
          <button 
            onClick={onClose} 
            className="md:hidden p-2 rounded-[18px] bg-slate-950 border border-slate-800 text-[#94A3B8] hover:text-[#F8FAFC]"
            aria-label="Close sidebar"
            id="close-sidebar-btn"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Group */}
      <nav className="flex-1 space-y-1.5" aria-label="Main Navigation">
        <span className="block text-[10px] font-mono tracking-widest text-slate-500 uppercase px-3.5 mb-3.5 font-semibold">System Control</span>
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onPageChange(item.id);
                if (onClose) onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-[18px] text-xs font-sans font-medium transition-all duration-200 group text-left relative ${
                isActive 
                  ? 'bg-[#141C2F] border border-slate-800 text-[#F8FAFC] shadow-[0_4px_12px_rgba(0,0,0,0.3)]' 
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-slate-900/40 border border-transparent'
              }`}
              id={`nav-${item.id}`}
            >
              {/* Active Indicator Dot */}
              {isActive && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute left-0 w-[4px] h-5 bg-[#6366F1] rounded-r-[4px]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {getIcon(item.iconName, isActive)}
              <span className="flex-1">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Agency Identification Details footer */}
      <div className="mt-auto pt-6 border-t border-slate-900/60">
        <div className="p-3.5 rounded-[20px] bg-slate-950/40 border border-slate-900/80 flex items-center gap-3">
          <div className="p-2 rounded-[12px] bg-slate-950 border border-slate-900">
            <Fingerprint className="w-4 h-4 text-slate-400" />
          </div>
          <div className="overflow-hidden text-left">
            <p className="text-[9px] font-mono tracking-wider text-slate-500">FED_NODE // 0721</p>
            <p className="text-xs font-sans font-semibold text-slate-300 truncate">INTELLIGENCE_UNIT</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed left) */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 flex-shrink-0" id="desktop-sidebar">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Overlaying background) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex" id="mobile-sidebar-drawer">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-64 max-w-[80vw] h-full z-10"
          >
            {sidebarContent}
          </motion.div>
        </div>
      )}
    </>
  );
}

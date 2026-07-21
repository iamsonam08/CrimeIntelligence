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
        active ? 'text-[#3B8D72]' : 'text-[#829E95] group-hover:text-[#F8FAFC]'
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
    <div className="flex flex-col h-full bg-[#0D1C18] bg-gradient-to-b from-[#0D1C18] to-[#07110F] border-r border-[#142D26]/80 p-6 relative overflow-hidden">
      {/* Soft ambient lighting glow */}
      <div className="absolute top-[-80px] left-[-80px] w-52 h-52 bg-[#3B8D72]/15 rounded-full blur-3xl pointer-events-none select-none" />

      {/* Sidebar Header: Logo & Title */}
      <div className="flex items-center justify-between mb-8 pb-5 border-b border-[#142D26]/60 z-10">
        <div className="flex items-center gap-3">
          {/* Logo Container */}
          <div className="flex items-center justify-center w-9 h-9 rounded-[12px] bg-[#07110F] border border-[#1B3B31]/80 shadow-inner select-none">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-[#3B8D72]" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              {/* Outer hexagonal secure boundary */}
              <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" className="opacity-25" fill="currentColor" fillOpacity="0.04" />
              {/* Intersecting intelligence radar/nodes structure representing a 'C' and 'O' */}
              <path d="M12 6.5C9.24 6.5 7 8.74 7 11.5C7 14.26 9.24 16.5 12 16.5" strokeWidth="2" stroke="currentColor" />
              <circle cx="12" cy="11.5" r="3.5" strokeWidth="1.5" stroke="currentColor" />
              <circle cx="12" cy="11.5" r="1" fill="#3B8D72" stroke="none" />
              {/* Connected neural nodes */}
              <line x1="12" y1="2" x2="12" y2="6.5" strokeDasharray="1.5 1.5" />
              <line x1="12" y1="16.5" x2="12" y2="22" strokeDasharray="1.5 1.5" />
              <line x1="2" y1="11.5" x2="7" y2="11.5" strokeDasharray="1.5 1.5" />
              <line x1="17" y1="11.5" x2="22" y2="11.5" strokeDasharray="1.5 1.5" />
              <circle cx="12" cy="6.5" r="1.25" fill="#3B8D72" stroke="none" />
              <circle cx="12" cy="16.5" r="1.25" fill="#3B8D72" stroke="none" />
              <circle cx="7" cy="11.5" r="1.25" fill="#3B8D72" stroke="none" />
              <circle cx="17" cy="11.5" r="1.25" fill="#3B8D72" stroke="none" />
            </svg>
          </div>
          <div className="select-none flex items-center">
            <span className="text-lg font-sans font-extrabold tracking-tight text-[#F8FAFC]">
              Crime<span className="font-semibold text-[#3B8D72]">Ops</span>
            </span>
          </div>
        </div>

        {/* Close Button on Mobile */}
        {onClose && (
          <button 
            onClick={onClose} 
            className="md:hidden p-2 rounded-[18px] bg-[#07110F] border border-[#1B3B31]/80 text-[#829E95] hover:text-[#F8FAFC]"
            aria-label="Close sidebar"
            id="close-sidebar-btn"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Group */}
      <nav className="flex-1 space-y-1.5 z-10" aria-label="Main Navigation">
        <span className="block text-[10px] font-mono tracking-widest text-[#5C7F75] uppercase px-3.5 mb-3.5 font-semibold">System Control</span>
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
                  ? 'bg-[#18352F] border border-[#2D5E53] text-[#F8FAFC] shadow-[0_4px_12px_rgba(15,32,27,0.25)]' 
                  : 'text-[#829E95] hover:text-[#F8FAFC] hover:bg-[#112521]/60 border border-transparent'
              }`}
              id={`nav-${item.id}`}
            >
              {/* Active Indicator Dot */}
              {isActive && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute left-0 w-[4px] h-5 bg-[#3B8D72] rounded-r-[4px]"
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
      <div className="mt-auto pt-6 border-t border-[#142D26]/60 z-10">
        <div className="p-3.5 rounded-[20px] bg-[#07110F]/60 border border-[#1B3B31]/60 flex items-center gap-3">
          <div className="p-2 rounded-[12px] bg-[#07110F] border border-[#1B3B31]/80">
            <Fingerprint className="w-4 h-4 text-[#829E95]" />
          </div>
          <div className="overflow-hidden text-left">
            <p className="text-[9px] font-mono tracking-wider text-[#5C7F75]">FED_NODE // 0721</p>
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

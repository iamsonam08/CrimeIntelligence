/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus, Terminal, ShieldAlert, Activity, X, Compass, Key } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { 
  CrimeMapView, 
  CriminalNetworkView, 
  PredictionsView, 
  AlertsView, 
  SettingsView 
} from './components/OtherViews';
import { ActivePage } from './types';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  const quickActionRef = useRef<HTMLDivElement>(null);

  // Close floating menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (quickActionRef.current && !quickActionRef.current.contains(event.target as Node)) {
        setIsQuickActionOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine current page title and subtitle
  const getHeaderInfo = () => {
    switch (activePage) {
      case 'dashboard':
        return {
          title: "CrimeOps Dashboard",
          subtitle: "AI-Powered Crime Intelligence Platform"
        };
      case 'crime-map':
        return {
          title: "Geospatial Crime Mapping",
          subtitle: "Incidence Hot Spots & Temporal Patrol Allocation Layers"
        };
      case 'criminal-network':
        return {
          title: "Criminal Association Networks",
          subtitle: "Entity Coordination, Communication Matrices & Syndicate Webs"
        };
      case 'predictions':
        return {
          title: "Predictive Intelligence Modeling",
          subtitle: "Algorithmic Temporal Risk Forecasts & Machine Learning Probability Maps"
        };
      case 'alerts':
        return {
          title: "Priority Alert Dispatch",
          subtitle: "Live Telemetry Feeds, Critical Event Logs & Computer-Aided Dispatch Updates"
        };
      case 'settings':
        return {
          title: "Clearance & Access Settings",
          subtitle: "Biometric Policy Management, Agency Connectors & Cryptographic System Audit Logs"
        };
      default:
        return {
          title: "CrimeOps Dashboard",
          subtitle: "AI-Powered Crime Intelligence Platform"
        };
    }
  };

  const { title, subtitle } = getHeaderInfo();

  const renderActiveView = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardView />;
      case 'crime-map':
        return <CrimeMapView />;
      case 'criminal-network':
        return <CriminalNetworkView />;
      case 'predictions':
        return <PredictionsView />;
      case 'alerts':
        return <AlertsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5] text-[#1E293B] flex font-sans overflow-x-hidden relative selection:bg-[#3B8D72]/20 selection:text-[#1E293B]" id="crime-intel-app-root">
      
      {/* Subtle, premium, non-distracting background shade */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#3B8D72]/4 rounded-full blur-[120px] pointer-events-none select-none animate-pulse-slow" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#4D7FA9]/3 rounded-full blur-[120px] pointer-events-none select-none" />

      {/* Navigation Sidebar Drawer */}
      <Sidebar 
        activePage={activePage} 
        onPageChange={setActivePage}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Panel */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10" id="main-panel-container">
        
        {/* Scrollable Container with generous vertical padding */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-4">
          
          {/* Dashboard Top Header */}
          <Header 
            onMenuToggle={() => setIsMobileSidebarOpen(true)} 
            title={title}
            subtitle={subtitle}
          />

          {/* Active View Container with smooth crossfade animations */}
          <div className="relative pb-12" id="active-view-container">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                {renderActiveView()}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Liquid Glass Floating Quick Action Button */}
        <div className="fixed bottom-6 right-6 z-40" ref={quickActionRef}>
          <AnimatePresence>
            {isQuickActionOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-16 right-0 w-64 rounded-[24px] liquid-glass p-4 space-y-3 shadow-xl text-left border border-white/80"
              >
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-[10px] font-mono tracking-wider font-semibold text-slate-500 uppercase">Quick Command HUD</span>
                  <button 
                    onClick={() => setIsQuickActionOpen(false)}
                    className="p-1 hover:bg-slate-100 rounded-[10px] text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="p-2 hover:bg-[#3B8D72]/10 rounded-[14px] text-xs text-[#1E293B] flex items-center gap-2.5 cursor-pointer transition-colors group">
                    <Terminal className="w-4 h-4 text-slate-400 group-hover:text-[#3B8D72] transition-colors" />
                    <span>Run Cryptographic Audit</span>
                  </div>
                  <div className="p-2 hover:bg-[#3B8D72]/10 rounded-[14px] text-xs text-[#1E293B] flex items-center gap-2.5 cursor-pointer transition-colors group">
                    <Activity className="w-4 h-4 text-slate-400 group-hover:text-[#3B8D72] transition-colors" />
                    <span>Scan Active Patrol Nodes</span>
                  </div>
                  <div className="p-2 hover:bg-[#3B8D72]/10 rounded-[14px] text-xs text-[#1E293B] flex items-center gap-2.5 cursor-pointer transition-colors group">
                    <Key className="w-4 h-4 text-slate-400 group-hover:text-[#C0832F] transition-colors" />
                    <span>Request Level-5 Auth Token</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}
            className="w-12 h-12 rounded-full liquid-glass text-[#1E293B] hover:text-[#3B8D72] flex items-center justify-center shadow-lg border border-white/90 group"
            aria-label="Quick action launcher"
            id="floating-quick-action-btn"
          >
            <Plus className={`w-5 h-5 transition-transform duration-200 group-hover:text-[#3B8D72] ${isQuickActionOpen ? 'rotate-45 text-[#3B8D72]' : ''}`} />
          </motion.button>
        </div>

      </main>

    </div>
  );
}

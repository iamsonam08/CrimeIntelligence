/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlaceholderCard } from './PlaceholderCard';
import { useCrimeData } from '../hooks/useCrimeData';

export function DashboardView() {
  const { stats, alerts, risk, hotspots } = useCrimeData();

  return (
    <div className="space-y-8" id="dashboard-view-content">
      {/* Section 1: Four equal KPI placeholder cards */}
      <section className="space-y-3" id="section-kpis">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono tracking-wider text-slate-500 uppercase">Key Intelligence Metrics</h3>
          <div className="h-px flex-1 bg-slate-200 mx-4" />
          <span className="text-[10px] font-mono text-slate-400">LIVE FEED</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <PlaceholderCard label="KPI Card 1" id="kpi-card-1" realValue={stats?.total_crimes} />
          <PlaceholderCard label="KPI Card 2" id="kpi-card-2" realValue={stats?.total_offenders} />
          <PlaceholderCard label="KPI Card 3" id="kpi-card-3" realValue={hotspots?.length} />
          <PlaceholderCard label="KPI Card 4" id="kpi-card-4" realValue={alerts?.length} />
        </div>
      </section>

      {/* Grid of Major Intelligence Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 2: Large placeholder labeled: Crime Heatmap */}
        <section className="space-y-3" id="section-heatmap">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono tracking-wider text-slate-500 uppercase">Spatial Mapping</h3>
            <div className="h-px flex-1 bg-slate-200 mx-4" />
          </div>
          <PlaceholderCard label="Crime Heatmap" id="heatmap-placeholder" realHotspots={hotspots} />
        </section>

        {/* Section 3: Large placeholder labeled: Criminal Network */}
        <section className="space-y-3" id="section-network">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono tracking-wider text-slate-500 uppercase">Relational Intelligence</h3>
            <div className="h-px flex-1 bg-slate-200 mx-4" />
          </div>
          <PlaceholderCard label="Criminal Network" id="network-placeholder" />
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 4: Large placeholder labeled: Prediction Analytics */}
        <section className="space-y-3" id="section-predictions">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono tracking-wider text-slate-500 uppercase">Temporal Predictive Modeling</h3>
            <div className="h-px flex-1 bg-slate-200 mx-4" />
          </div>
         <PlaceholderCard label="Prediction Analytics" id="prediction-placeholder" realRisk={risk} />
        </section>

        {/* Section 5: Placeholder labeled: Recent Alerts */}
        <section className="space-y-3" id="section-alerts">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono tracking-wider text-slate-500 uppercase">Priority Event Stream</h3>
            <div className="h-px flex-1 bg-slate-200 mx-4" />
          </div>
          <PlaceholderCard label="Recent Alerts" id="alerts-placeholder" realAlerts={alerts} />
        </section>
      </div>
    </div>
  );
}
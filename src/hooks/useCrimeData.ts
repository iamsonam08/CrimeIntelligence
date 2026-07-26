import { useEffect, useState } from 'react';

const API_BASE = 'https://crime-analytics-api.onrender.com';

export function useCrimeData() {
  const [stats, setStats] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [risk, setRisk] = useState<any[]>([]);
  const [hotspots, setHotspots] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/stats`).then(r => r.json()),
      fetch(`${API_BASE}/alerts?z_threshold=0.3`).then(r => r.json()),
      fetch(`${API_BASE}/predict-risk`).then(r => r.json()),
      fetch(`${API_BASE}/hotspots`).then(r => r.json()),
    ]).then(([statsData, alertsData, riskData, hotspotsData]) => {
      setStats(statsData);
      setAlerts(alertsData.alerts || []);
      setRisk(riskData.district_risk_scores || []);
      setHotspots(hotspotsData.clusters || []);
    }).catch(err => console.error('Backend fetch failed:', err));
  }, []);

  return { stats, alerts, risk, hotspots };
}
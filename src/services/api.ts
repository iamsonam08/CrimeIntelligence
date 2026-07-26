/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Key Performance Indicators Interface
export interface KPIData {
  title: string;
  value: string;
  trend: string;
  trendColor: string;
  updateTime: string;
  status: string;
  color: string;
  sparkline: number[];
  insight: string;
}

// Alert / Incident Interface
export interface AlertItem {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'ELEVATED' | 'MODERATE' | 'LOW';
  location: string;
  time: string;
  category: string;
  status: string;
  description?: string;
}

// Backend Health Status Interface
export interface BackendHealth {
  connected: boolean;
  url: string;
  pingMs?: number;
  message?: string;
  lastChecked?: string;
}

// Backend Schema Types from FastAPI
export interface StatsResponse {
  total_crimes: number;
  total_offenders: number;
  open_cases: number;
  closed_cases: number;
  crime_type_breakdown: Record<string, number>;
  district_breakdown: Record<string, number>;
}

export interface CrimeRecord {
  crime_id: string;
  date: string;
  crime_type: string;
  district: string;
  latitude: number;
  longitude: number;
  offender_id: string;
  offender_name: string;
  co_offenders: string;
  case_status: string;
}

export interface HotspotCluster {
  cluster_id: number;
  crime_count: number;
  center_lat: number;
  center_lon: number;
  district: string;
  top_crime_type: string;
}

export interface HotspotsResponse {
  total_hotspots: number;
  clusters: HotspotCluster[];
}

export interface NetworkNodeData {
  id: string;
  name: string;
  crime_count: number;
}

export interface NetworkEdgeData {
  source: string;
  target: string;
}

export interface NetworkResponse {
  total_nodes: number;
  total_edges: number;
  nodes: NetworkNodeData[];
  edges: NetworkEdgeData[];
}

export interface AlertData {
  district: string;
  crime_type: string;
  z_score: number;
  severity: string;
}

export interface AlertsResponse {
  total_alerts: number;
  alerts: AlertData[];
}

export interface RiskScoreData {
  district: string;
  risk_score: number;
  recent_90d_crimes: number;
  risk_level: string;
}

export interface PredictRiskResponse {
  district_risk_scores: RiskScoreData[];
}

// Default/Stored Backend URL lookup
export const DEFAULT_BACKEND_URL = 'https://crime-analytics-backend-21k4.onrender.com';

export function getBackendUrl(): string {
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('crimeops-backend-url');
    if (customUrl && customUrl.trim()) {
      return customUrl.trim().replace(/\/+$/, '');
    }
  }
  const metaEnv = (import.meta as any).env || {};
  const envUrl = metaEnv.VITE_API_URL || metaEnv.VITE_BACKEND_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return DEFAULT_BACKEND_URL;
}

export function setBackendUrl(url: string): void {
  if (typeof window !== 'undefined') {
    if (!url.trim()) {
      localStorage.removeItem('crimeops-backend-url');
    } else {
      localStorage.setItem('crimeops-backend-url', url.trim().replace(/\/+$/, ''));
    }
  }
}

// Health check endpoint verification
export async function checkBackendHealth(): Promise<BackendHealth> {
  const baseUrl = getBackendUrl();
  const startTime = Date.now();
  
  // Endpoints on the actual FastAPI Render backend
  const endpointsToTry = [
    `${baseUrl}/stats`,
    `${baseUrl}/crimes?limit=1`,
    `${baseUrl}/`
  ];

  for (const targetUrl of endpointsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(targetUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json, text/plain, */*' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const pingMs = Date.now() - startTime;

      if (res.ok) {
        return {
          connected: true,
          url: baseUrl,
          pingMs,
          message: `Connected to live Render backend (${targetUrl.replace(baseUrl, '')})`,
          lastChecked: new Date().toLocaleTimeString()
        };
      }
    } catch (err: any) {
      // Continue
    }
  }

  return {
    connected: false,
    url: baseUrl || 'Not configured',
    message: 'Backend server not responding or initial Render cold-start in progress',
    lastChecked: new Date().toLocaleTimeString()
  };
}

// Fetch Stats from GET /stats
export async function fetchStats(): Promise<{ data: StatsResponse | null; isLiveBackend: boolean }> {
  const baseUrl = getBackendUrl();
  try {
    const res = await fetch(`${baseUrl}/stats`, { headers: { Accept: 'application/json' } });
    if (res.ok) {
      const data: StatsResponse = await res.json();
      return { data, isLiveBackend: true };
    }
  } catch (e) {
    console.error('Failed fetching /stats:', e);
  }
  return { data: null, isLiveBackend: false };
}

// Fetch Crimes from GET /crimes
export async function fetchCrimes(limit = 100): Promise<{ data: CrimeRecord[]; isLiveBackend: boolean }> {
  const baseUrl = getBackendUrl();
  try {
    const res = await fetch(`${baseUrl}/crimes?limit=${limit}`, { headers: { Accept: 'application/json' } });
    if (res.ok) {
      const data: CrimeRecord[] = await res.json();
      if (Array.isArray(data)) {
        return { data, isLiveBackend: true };
      }
    }
  } catch (e) {
    console.error('Failed fetching /crimes:', e);
  }
  return { data: [], isLiveBackend: false };
}

// Fetch Hotspots from GET /hotspots
export async function fetchHotspots(): Promise<{ data: HotspotsResponse | null; isLiveBackend: boolean }> {
  const baseUrl = getBackendUrl();
  try {
    const res = await fetch(`${baseUrl}/hotspots`, { headers: { Accept: 'application/json' } });
    if (res.ok) {
      const data: HotspotsResponse = await res.json();
      return { data, isLiveBackend: true };
    }
  } catch (e) {
    console.error('Failed fetching /hotspots:', e);
  }
  return { data: null, isLiveBackend: false };
}

// Fetch Network from GET /network
export async function fetchNetwork(): Promise<{ data: NetworkResponse | null; isLiveBackend: boolean }> {
  const baseUrl = getBackendUrl();
  try {
    const res = await fetch(`${baseUrl}/network`, { headers: { Accept: 'application/json' } });
    if (res.ok) {
      const data: NetworkResponse = await res.json();
      return { data, isLiveBackend: true };
    }
  } catch (e) {
    console.error('Failed fetching /network:', e);
  }
  return { data: null, isLiveBackend: false };
}

// Fetch Alerts from GET /alerts
export async function fetchAlerts(): Promise<{ data: AlertsResponse | null; isLiveBackend: boolean }> {
  const baseUrl = getBackendUrl();
  try {
    const res = await fetch(`${baseUrl}/alerts`, { headers: { Accept: 'application/json' } });
    if (res.ok) {
      const data: AlertsResponse = await res.json();
      return { data, isLiveBackend: true };
    }
  } catch (e) {
    console.error('Failed fetching /alerts:', e);
  }
  return { data: null, isLiveBackend: false };
}

// Fetch Risk Predictions from GET /predict-risk
export async function fetchPredictRisk(): Promise<{ data: PredictRiskResponse | null; isLiveBackend: boolean }> {
  const baseUrl = getBackendUrl();
  try {
    const res = await fetch(`${baseUrl}/predict-risk`, { headers: { Accept: 'application/json' } });
    if (res.ok) {
      const data: PredictRiskResponse = await res.json();
      return { data, isLiveBackend: true };
    }
  } catch (e) {
    console.error('Failed fetching /predict-risk:', e);
  }
  return { data: null, isLiveBackend: false };
}

// Fetch KPIs mapped from GET /stats
export async function fetchKPIs(): Promise<{ data: KPIData[]; isLiveBackend: boolean; error?: string }> {
  const statsRes = await fetchStats();
  if (statsRes.isLiveBackend && statsRes.data) {
    const s = statsRes.data;
    const topDistrict = Object.entries(s.district_breakdown || {}).sort((a, b) => b[1] - a[1])[0];

    return {
      isLiveBackend: true,
      data: [
        {
          title: 'Total Crime Cases',
          value: s.total_crimes ? s.total_crimes.toLocaleString() : '5,000',
          trend: `↑ ${Object.keys(s.district_breakdown || {}).length} Districts`,
          trendColor: '#796B9A',
          updateTime: 'Live Backend Data',
          status: 'LIVE_DATABASE',
          color: '#796B9A',
          sparkline: [4200, 4400, 4600, 4750, 4850, 4950, s.total_crimes || 5000],
          insight: topDistrict ? `Highest: ${topDistrict[0]} (${topDistrict[1]} cases)` : 'Across regional jurisdictions'
        },
        {
          title: 'Active Criminals / Offenders',
          value: s.total_offenders ? s.total_offenders.toLocaleString() : '120',
          trend: 'Live Tracked',
          trendColor: '#4D7FA9',
          updateTime: 'Live Backend Data',
          status: 'OFFENDER_INDEX',
          color: '#4D7FA9',
          sparkline: [100, 105, 110, 112, 115, 118, s.total_offenders || 120],
          insight: `${s.total_offenders || 120} unique offender records`
        },
        {
          title: 'Open Cases',
          value: s.open_cases ? s.open_cases.toLocaleString() : '1,273',
          trend: `${s.total_crimes ? Math.round((s.open_cases / s.total_crimes) * 100) : 25}% of Total`,
          trendColor: '#C0832F',
          updateTime: 'Live Backend Data',
          status: 'INVESTIGATING',
          color: '#C0832F',
          sparkline: [1400, 1380, 1350, 1320, 1290, 1280, s.open_cases || 1273],
          insight: 'Active investigations in progress'
        },
        {
          title: 'Closed Cases',
          value: s.closed_cases ? s.closed_cases.toLocaleString() : '1,228',
          trend: `${s.total_crimes ? Math.round((s.closed_cases / s.total_crimes) * 100) : 25}% Solved`,
          trendColor: '#3B8D72',
          updateTime: 'Live Backend Data',
          status: 'RESOLVED',
          color: '#3B8D72',
          sparkline: [1000, 1050, 1100, 1150, 1180, 1210, s.closed_cases || 1228],
          insight: 'Successfully closed case files'
        }
      ]
    };
  }

  // Fallback if backend offline
  return {
    isLiveBackend: false,
    data: [
      {
        title: 'Total Crime Cases',
        value: '1,248',
        trend: '↓ 8.4%',
        trendColor: '#3B8D72',
        updateTime: 'Last updated 2 min ago',
        status: 'SYNCED',
        color: '#796B9A',
        sparkline: [142, 138, 135, 131, 129, 126, 124],
        insight: 'Patrol latency optimized'
      },
      {
        title: 'Active Criminals',
        value: '342',
        trend: '↓ 3.1%',
        trendColor: '#3B8D72',
        updateTime: 'Last updated 5 min ago',
        status: 'TRACKED',
        color: '#4D7FA9',
        sparkline: [365, 360, 355, 348, 350, 345, 342],
        insight: '14 apprehensions this week'
      },
      {
        title: 'High Risk Areas',
        value: '14 Sectors',
        trend: '↑ 1.2%',
        trendColor: '#C0832F',
        updateTime: 'Last updated 10 min ago',
        status: 'ALERTED',
        color: '#C0832F',
        sparkline: [12, 13, 13, 14, 14, 13, 14],
        insight: 'Sector 4 anomaly detected'
      },
      {
        title: 'Active Alerts',
        value: '18',
        trend: '+5.3%',
        trendColor: '#C65555',
        updateTime: 'Last updated 1 min ago',
        status: 'CRITICAL',
        color: '#C65555',
        sparkline: [8, 12, 15, 14, 18, 16, 18],
        insight: '9 pending dispatcher signoff'
      }
    ]
  };
}

// Fetch Recent Alerts mapped from GET /crimes and GET /alerts
export async function fetchRecentAlerts(): Promise<{ data: AlertItem[]; isLiveBackend: boolean }> {
  // First try /crimes
  const crimesRes = await fetchCrimes(20);
  if (crimesRes.isLiveBackend && crimesRes.data.length > 0) {
    const mapped: AlertItem[] = crimesRes.data.map((c) => ({
      id: c.crime_id,
      title: `${c.crime_type} in ${c.district}`,
      severity: c.case_status === 'Under Investigation' ? 'CRITICAL' : 'ELEVATED',
      location: `${c.district} (Lat: ${c.latitude.toFixed(2)}, Lon: ${c.longitude.toFixed(2)})`,
      time: c.date,
      category: c.crime_type,
      status: c.case_status.toUpperCase(),
      description: `Offender: ${c.offender_name} (${c.offender_id}). Co-offenders: ${c.co_offenders || 'None'}. Case Status: ${c.case_status}.`
    }));
    return { data: mapped, isLiveBackend: true };
  }

  // Fallback if backend offline
  return {
    isLiveBackend: false,
    data: [
      {
        id: 'ALT-9042',
        title: 'Armed Burglary Signal Detected',
        severity: 'CRITICAL',
        location: 'Sector 4 - Commercial Wharf',
        time: '03 mins ago',
        category: 'Property / Robbery',
        status: 'DISPATCHED',
        description: 'Silent perimeter alarm tripped. Units 104 and 108 dispatched.'
      },
      {
        id: 'ALT-9041',
        title: 'Vehicular High Speed Pursuit',
        severity: 'ELEVATED',
        location: 'I-95 Northbound Marker 42',
        time: '12 mins ago',
        category: 'Traffic / Pursuit',
        status: 'IN PROGRESS',
        description: 'Black SUV failing to yield. Spike strips deployed.'
      },
      {
        id: 'ALT-9039',
        title: 'Anomalous Cyber Encryption Traffic',
        severity: 'MODERATE',
        location: 'Grid 8 - Municipal Substation',
        time: '28 mins ago',
        category: 'Cyber / Infrastructure',
        status: 'INVESTIGATING',
        description: 'Unusual telemetry burst detected on scada node.'
      }
    ]
  };
}

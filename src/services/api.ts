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
  
  // Try several candidate health endpoints
  const endpointsToTry = [
    `${baseUrl}/api/health`,
    `${baseUrl}/health`,
    `${baseUrl}/api/kpis`,
    `${baseUrl}/api/crimes`,
    `${baseUrl}/crimes`,
    `${baseUrl}/`
  ];

  for (const targetUrl of endpointsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(targetUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json, text/plain, */*' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const pingMs = Date.now() - startTime;

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        return {
          connected: true,
          url: baseUrl,
          pingMs,
          message: data.message || data.status || `Connected to backend endpoint (${targetUrl.replace(baseUrl, '')})`,
          lastChecked: new Date().toLocaleTimeString()
        };
      }
    } catch (err: any) {
      // Continue to next candidate endpoint
    }
  }

  return {
    connected: false,
    url: baseUrl || 'Not configured',
    message: 'Backend server not responding or initial Render cold-start in progress',
    lastChecked: new Date().toLocaleTimeString()
  };
}

// Fetch KPIs from backend or fallback
export async function fetchKPIs(): Promise<{ data: KPIData[]; isLiveBackend: boolean; error?: string }> {
  const baseUrl = getBackendUrl();
  const endpoints = [
    `${baseUrl}/api/kpis`,
    `${baseUrl}/api/analytics`,
    `${baseUrl}/api/crimes/stats`,
    `${baseUrl}/kpis`
  ];

  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(endpoint, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        const kpiArray = Array.isArray(json) ? json : (json.data || json.kpis || json.stats);
        if (Array.isArray(kpiArray) && kpiArray.length > 0) {
          return { data: kpiArray, isLiveBackend: true };
        }
      }
    } catch (e: any) {
      // Try next endpoint
    }
  }

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

// Fetch Recent Alerts from backend or fallback
export async function fetchRecentAlerts(): Promise<{ data: AlertItem[]; isLiveBackend: boolean }> {
  const baseUrl = getBackendUrl();
  const endpoints = [
    `${baseUrl}/api/alerts`,
    `${baseUrl}/api/crimes`,
    `${baseUrl}/crimes`,
    `${baseUrl}/alerts`
  ];

  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(endpoint, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        const alertsArray = Array.isArray(json) ? json : (json.data || json.crimes || json.alerts);
        if (Array.isArray(alertsArray) && alertsArray.length > 0) {
          // Normalize elements if they come from a general crimes endpoint
          const mappedAlerts: AlertItem[] = alertsArray.map((item: any, idx: number) => ({
            id: item.id || item._id || `ALT-${9000 + idx}`,
            title: item.title || item.crimeType || item.type || item.description || 'Crime Incident Reported',
            severity: item.severity || (item.priority === 'HIGH' ? 'CRITICAL' : item.priority === 'MEDIUM' ? 'ELEVATED' : 'MODERATE'),
            location: item.location || item.address || item.district || 'Sector Jurisdiction',
            time: item.time || item.createdAt || item.date || 'Recently reported',
            category: item.category || item.type || 'Crime Report',
            status: item.status || 'DISPATCHED',
            description: item.description || item.details || ''
          }));
          return { data: mappedAlerts, isLiveBackend: true };
        }
      }
    } catch (e: any) {
      // Try next
    }
  }

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


/**
 * Agrivault AI Backend API Service Client
 * Provides robust connection to FastAPI endpoints with transparent fallback
 * to edge/local simulation when running offline or standalone.
 */

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface HealthResponse {
  status: string;
  system: string;
  version: string;
  timestamp: string;
}

export interface BackendZoneResponse {
  zones: Array<{
    zone_id: string;
    name: string;
    depth_level: string;
    risk_level: string;
    risk_score: number;
    pest_probability: number;
    temperature: number;
    humidity: number;
    moisture: number;
    co2: number;
    acoustic_activity: number;
    temp_change_1h: number;
    temp_change_6h: number;
    temp_change_24h: number;
    humidity_change_1h: number;
    humidity_change_6h: number;
    humidity_change_24h: number;
    moisture_change_1h: number;
    moisture_change_6h: number;
    moisture_change_24h: number;
    co2_change_1h: number;
    co2_change_6h: number;
    co2_change_24h: number;
    last_updated: string;
  }>;
}

class ApiService {
  private isConnected: boolean = false;
  private checkPromise: Promise<boolean> | null = null;

  async checkHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${API_BASE_URL}/health`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      this.isConnected = res.ok;
      return res.ok;
    } catch {
      this.isConnected = false;
      return false;
    }
  }

  get backendAvailable(): boolean {
    return this.isConnected;
  }

  async getZones(): Promise<BackendZoneResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/zones`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async getLatestTelemetry(zoneId: string = 'ZONE-C') {
    try {
      const res = await fetch(`${API_BASE_URL}/telemetry/latest?zone_id=${zoneId}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async postTelemetry(payload: {
    zone_id: string;
    sensor_id: string;
    sensor_type: string;
    temperature?: number;
    humidity?: number;
    moisture?: number;
    co2?: number;
    acoustic_activity?: number;
  }) {
    try {
      const res = await fetch(`${API_BASE_URL}/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch {
      return null;
    }
  }

  async getForecast(zoneId: string = 'ZONE-C', horizons: number[] = [6, 12, 24, 48, 72]) {
    try {
      const horizonParams = horizons.map(h => `horizons=${h}`).join('&');
      const res = await fetch(`${API_BASE_URL}/forecast?zone_id=${zoneId}&${horizonParams}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async getExplainability(zoneId: string = 'ZONE-C') {
    try {
      const res = await fetch(`${API_BASE_URL}/explainability/shap?zone_id=${zoneId}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async postIntervention(payload: {
    zone_id: string;
    action_taken: string;
    operator_name: string;
    observation: string;
    risk_before?: number;
    risk_after?: number;
  }) {
    try {
      const res = await fetch(`${API_BASE_URL}/interventions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch {
      return null;
    }
  }

  async inferAudioFile(file: File) {
    try {
      const formData = new FormData();
      formData.append('audio_file', file);
      const res = await fetch(`${API_BASE_URL}/acoustic/infer`, {
        method: 'POST',
        body: formData
      });
      return await res.json();
    } catch {
      return null;
    }
  }
}

export const apiService = new ApiService();

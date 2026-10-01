import { useState, useEffect } from 'react';
import {
  ActiveTab, ViewMode, OfflineStatus, ZoneData,
  AlertItem, InterventionItem, GrainLotItem, RiskLevel
} from '../types';

export const INITIAL_ZONES: ZoneData[] = [
  {
    id: 'ZONE-A',
    name: 'Zone A - Upper Headspace',
    depthLevel: '0 - 3 meters (Surface)',
    riskLevel: 'NORMAL',
    riskScore: 18.4,
    pestProbability: 0.04,
    temperature: 23.8,
    humidity: 56.2,
    moisture: 11.9,
    co2: 520,
    acousticActivity: 0.06,
    tempChange1h: -0.1,
    tempChange6h: -0.4,
    tempChange24h: 0.2,
    humidityChange1h: 0.3,
    humidityChange6h: 1.1,
    humidityChange24h: -0.5,
    moistureChange1h: 0.0,
    moistureChange6h: 0.1,
    moistureChange24h: 0.1,
    co2Change1h: 10,
    co2Change6h: -20,
    co2Change24h: 30,
    lastUpdated: new Date().toLocaleTimeString()
  },
  {
    id: 'ZONE-B',
    name: 'Zone B - Mid-Upper Core',
    depthLevel: '3 - 7 meters',
    riskLevel: 'WATCH',
    riskScore: 42.1,
    pestProbability: 0.22,
    temperature: 26.4,
    humidity: 63.8,
    moisture: 13.1,
    co2: 690,
    acousticActivity: 0.24,
    tempChange1h: 0.4,
    tempChange6h: 1.2,
    tempChange24h: 1.9,
    humidityChange1h: 0.8,
    humidityChange6h: 2.4,
    humidityChange24h: 3.6,
    moistureChange1h: 0.1,
    moistureChange6h: 0.3,
    moistureChange24h: 0.5,
    co2Change1h: 25,
    co2Change6h: 80,
    co2Change24h: 140,
    lastUpdated: new Date().toLocaleTimeString()
  },
  {
    id: 'ZONE-C',
    name: 'Zone C - Central Biological Hotspot',
    depthLevel: '7 - 11 meters',
    riskLevel: 'CRITICAL',
    riskScore: 82.6,
    pestProbability: 0.86,
    temperature: 31.8,
    humidity: 72.4,
    moisture: 14.8,
    co2: 940,
    acousticActivity: 0.89,
    tempChange1h: 0.9,
    tempChange6h: 2.8,
    tempChange24h: 4.6,
    humidityChange1h: 1.9,
    humidityChange6h: 5.2,
    humidityChange24h: 8.1,
    moistureChange1h: 0.4,
    moistureChange6h: 1.1,
    moistureChange24h: 1.7,
    co2Change1h: 90,
    co2Change6h: 280,
    co2Change24h: 420,
    lastUpdated: new Date().toLocaleTimeString()
  },
  {
    id: 'ZONE-D',
    name: 'Zone D - Hopper Discharge & Base',
    depthLevel: '11 - 15 meters (Base)',
    riskLevel: 'NORMAL',
    riskScore: 21.0,
    pestProbability: 0.07,
    temperature: 22.9,
    humidity: 54.1,
    moisture: 11.6,
    co2: 510,
    acousticActivity: 0.08,
    tempChange1h: 0.1,
    tempChange6h: -0.2,
    tempChange24h: 0.0,
    humidityChange1h: -0.2,
    humidityChange6h: -0.5,
    humidityChange24h: 0.4,
    moistureChange1h: 0.0,
    moistureChange6h: 0.0,
    moistureChange24h: -0.1,
    co2Change1h: -5,
    co2Change6h: 15,
    co2Change24h: 20,
    lastUpdated: new Date().toLocaleTimeString()
  }
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'ALT-8091',
    zoneId: 'ZONE-C',
    timestamp: '14 min ago',
    severity: 'CRITICAL',
    title: 'Critical Acoustic & Moisture Infestation Signature',
    reason: 'Simultaneous spike in acoustic vibration energy (86% pest likelihood) and localized moisture migration (14.8%).',
    recommendedAction: 'Execute targeted physical probe inspection in Zone C. Prepare low-velocity aeration fans.',
    acknowledged: false
  },
  {
    id: 'ALT-8084',
    zoneId: 'ZONE-B',
    timestamp: '2 hours ago',
    severity: 'WATCH',
    title: 'Moisture Migration Gradient Detected',
    reason: 'Moisture trend increased by +0.3% over 6 hours towards upper core boundary.',
    recommendedAction: 'Check roof headspace ventilation dampers and verify solar radiant heating impact.',
    acknowledged: true,
    acknowledgedBy: 'Operator Miller'
  },
  {
    id: 'ALT-8072',
    zoneId: 'ZONE-C',
    timestamp: '5 hours ago',
    severity: 'WARNING',
    title: 'Biological Respiration CO2 Rise',
    reason: 'CO2 exceeded 800 ppm baseline, reaching 940 ppm.',
    recommendedAction: 'Verify insect activity via INMP441 audio recording stream.',
    acknowledged: false
  }
];

export const INITIAL_INTERVENTIONS: InterventionItem[] = [
  {
    id: 'INT-104',
    zoneId: 'ZONE-C',
    timestamp: 'Yesterday 10:35 AM',
    actionTaken: 'Targeted Core Probe Inspection & Aeration',
    operatorName: 'J. Miller (Silo Manager)',
    observation: 'Sitophilus oryzae cluster confirmed at 8.2m depth; initial grain temperature 33.1°C.',
    riskBefore: 88.5,
    riskAfter: 82.6,
    status: 'COMPLETED'
  }
];

export const INITIAL_LOTS: GrainLotItem[] = [
  {
    id: 'LOT-2026-WHT-04',
    grainType: 'Hard Red Winter Wheat (Grade #1)',
    quantityKg: 420000,
    storageDate: '2026-08-15',
    expectedDurationDays: 180,
    storageUnitId: 'SILO-01',
    zoneId: 'ZONE-C',
    initialMoisture: 12.1,
    currentRisk: 'CRITICAL',
    status: 'MONITORED_ACTIVE',
    origin: 'Columbia River Basin Grain Growers',
    proteinContent: 13.8
  },
  {
    id: 'LOT-2026-BAR-02',
    grainType: 'Malting Barley (Two-Row)',
    quantityKg: 280000,
    storageDate: '2026-09-01',
    expectedDurationDays: 240,
    storageUnitId: 'SILO-02',
    zoneId: 'ZONE-A',
    initialMoisture: 11.4,
    currentRisk: 'NORMAL',
    status: 'OPTIMAL_PRESERVATION',
    origin: 'Palouse Prairie Cooperative',
    proteinContent: 11.2
  }
];

// Lightweight singleton reactive store
class AppStore {
  activeTab: ActiveTab = 'overview';
  viewMode: ViewMode = 'normal';
  exploded: boolean = false;
  is3DModalOpen: boolean = false;
  isSystemStatusOpen: boolean = false;
  selectedZoneId: string = 'ZONE-C';
  selectedHardwareId: string | null = null;
  autoRotate: boolean = false;
  offlineMode: OfflineStatus = 'ONLINE';
  offlineBufferCount: number = 0;
  demoMode: boolean = true;
  samplingIntervals = { normal: 600, watch: 300, critical: 60 };
  zones: ZoneData[] = INITIAL_ZONES;
  alerts: AlertItem[] = INITIAL_ALERTS;
  interventions: InterventionItem[] = INITIAL_INTERVENTIONS;
  grainLots: GrainLotItem[] = INITIAL_LOTS;
  listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((cb) => cb());
  }

  setActiveTab(tab: ActiveTab) {
    this.activeTab = tab;
    this.notify();
  }

  setViewMode(mode: ViewMode) {
    this.viewMode = mode;
    if (mode === 'exploded') {
      this.exploded = true;
    } else {
      this.exploded = false;
    }
    this.notify();
  }

  toggleExploded() {
    this.exploded = !this.exploded;
    this.viewMode = this.exploded ? 'exploded' : 'normal';
    this.notify();
  }

  setSelectedZone(id: string) {
    this.selectedZoneId = id;
    this.notify();
  }

  setSelectedHardware(id: string | null) {
    this.selectedHardwareId = id;
    this.notify();
  }

  setAutoRotate(val: boolean) {
    this.autoRotate = val;
    this.notify();
  }

  set3DModalOpen(open: boolean) {
    this.is3DModalOpen = open;
    this.notify();
  }

  open3DModal() {
    this.is3DModalOpen = true;
    this.notify();
  }

  close3DModal() {
    this.is3DModalOpen = false;
    this.notify();
  }

  setSystemStatusOpen(open: boolean) {
    this.isSystemStatusOpen = open;
    this.notify();
  }

  openSystemStatus() {
    this.isSystemStatusOpen = true;
    this.notify();
  }

  closeSystemStatus() {
    this.isSystemStatusOpen = false;
    this.notify();
  }

  toggleOfflineMode() {
    if (this.offlineMode === 'ONLINE') {
      this.offlineMode = 'OFFLINE_LOCAL_AI';
      this.offlineBufferCount = 12;
    } else if (this.offlineMode === 'OFFLINE_LOCAL_AI') {
      this.offlineMode = 'SYNCING';
      this.notify();
      setTimeout(() => {
        this.offlineMode = 'ONLINE';
        this.offlineBufferCount = 0;
        this.notify();
      }, 1800);
    }
    this.notify();
  }

  syncOfflineData() {
    this.offlineMode = 'SYNCING';
    this.notify();
    setTimeout(() => {
      this.offlineMode = 'ONLINE';
      this.offlineBufferCount = 0;
      this.notify();
    }, 1800);
  }

  acknowledgeAlert(id: string) {
    this.alerts = this.alerts.map((a) =>
      a.id === id ? { ...a, acknowledged: true, acknowledgedBy: 'Operator (Current Session)', acknowledgedAt: new Date().toLocaleTimeString() } : a
    );
    this.notify();
  }

  addIntervention(item: Omit<InterventionItem, 'id'>) {
    const newInt: InterventionItem = {
      ...item,
      id: `INT-${this.interventions.length + 105}`
    };
    this.interventions = [newInt, ...this.interventions];
    // Also improve zone risk slightly to reflect observed change
    const zone = this.zones.find(z => z.id === item.zoneId);
    if (zone && item.riskAfter) {
      zone.riskScore = item.riskAfter;
      if (item.riskAfter < 75) zone.riskLevel = 'WARNING';
      if (item.riskAfter < 50) zone.riskLevel = 'WATCH';
    }
    this.notify();
  }

  updateSamplingInterval(tier: 'normal' | 'watch' | 'critical', sec: number) {
    this.samplingIntervals[tier] = sec;
    this.notify();
  }

  // Real-time telemetry simulation engine
  simulateTelemetryTick() {
    const drift = (base: number, range: number) =>
      +(base + (Math.random() - 0.5) * range).toFixed(1);
    const driftInt = (base: number, range: number) =>
      Math.round(base + (Math.random() - 0.5) * range);

    this.zones = this.zones.map((z) => {
      // Zone C has more volatile readings (active infestation)
      const volatility = z.id === 'ZONE-C' ? 1.6 : z.id === 'ZONE-B' ? 1.1 : 0.6;

      const temperature = drift(z.temperature, 0.4 * volatility);
      const humidity = drift(z.humidity, 0.6 * volatility);
      const moisture = drift(z.moisture, 0.15 * volatility);
      const co2 = driftInt(z.co2, 18 * volatility);
      const acousticActivity = Math.min(1, Math.max(0, +(z.acousticActivity + (Math.random() - 0.48) * 0.04 * volatility).toFixed(2)));

      // Recalculate risk score based on new readings
      let riskScore = z.riskScore + (Math.random() - 0.48) * 1.2 * volatility;
      riskScore = Math.max(0, Math.min(100, +riskScore.toFixed(1)));

      let riskLevel: RiskLevel = z.riskLevel;
      if (riskScore >= 75) riskLevel = 'CRITICAL';
      else if (riskScore >= 55) riskLevel = 'WARNING';
      else if (riskScore >= 35) riskLevel = 'WATCH';
      else riskLevel = 'NORMAL';

      return {
        ...z,
        temperature,
        humidity,
        moisture,
        co2,
        acousticActivity,
        riskScore,
        riskLevel,
        tempChange1h: drift(z.tempChange1h, 0.15),
        humidityChange1h: drift(z.humidityChange1h, 0.2),
        moistureChange1h: drift(z.moistureChange1h, 0.05),
        co2Change1h: driftInt(z.co2Change1h, 8),
        lastUpdated: new Date().toLocaleTimeString()
      };
    });
    this.notify();
  }
}

export const store = new AppStore();

export function useAgrivaultStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsub = store.subscribe(() => setTick((t) => t + 1));
    return () => {
      unsub();
    };
  }, []);

  return {
    activeTab: store.activeTab,
    viewMode: store.viewMode,
    exploded: store.exploded,
    selectedZoneId: store.selectedZoneId,
    selectedHardwareId: store.selectedHardwareId,
    autoRotate: store.autoRotate,
    is3DModalOpen: store.is3DModalOpen,
    isSystemStatusOpen: store.isSystemStatusOpen,
    offlineMode: store.offlineMode,
    offlineBufferCount: store.offlineBufferCount,
    demoMode: store.demoMode,
    samplingIntervals: store.samplingIntervals,
    zones: store.zones,
    alerts: store.alerts,
    interventions: store.interventions,
    grainLots: store.grainLots,
    selectedZone: store.zones.find((z) => z.id === store.selectedZoneId) || store.zones[2],
    setActiveTab: (t: ActiveTab) => store.setActiveTab(t),
    setViewMode: (m: ViewMode) => store.setViewMode(m),
    toggleExploded: () => store.toggleExploded(),
    setSelectedZone: (id: string) => store.setSelectedZone(id),
    setSelectedHardware: (id: string | null) => store.setSelectedHardware(id),
    setAutoRotate: (v: boolean) => store.setAutoRotate(v),
    set3DModalOpen: (open: boolean) => store.set3DModalOpen(open),
    open3DModal: () => store.open3DModal(),
    close3DModal: () => store.close3DModal(),
    setSystemStatusOpen: (open: boolean) => store.setSystemStatusOpen(open),
    openSystemStatus: () => store.openSystemStatus(),
    closeSystemStatus: () => store.closeSystemStatus(),
    toggleOfflineMode: () => store.toggleOfflineMode(),
    syncOfflineData: () => store.syncOfflineData(),
    acknowledgeAlert: (id: string) => store.acknowledgeAlert(id),
    addIntervention: (item: any) => store.addIntervention(item),
    updateSamplingInterval: (tier: 'normal' | 'watch' | 'critical', sec: number) =>
      store.updateSamplingInterval(tier, sec)
  };
}

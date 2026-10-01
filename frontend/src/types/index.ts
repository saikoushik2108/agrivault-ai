export type RiskLevel = 'NORMAL' | 'WATCH' | 'WARNING' | 'CRITICAL';

export type ViewMode = 'normal' | 'exploded' | 'risk' | 'sensor';

export type ActiveTab =
  | 'overview'
  | 'monitoring'
  | 'twin'
  | 'risk'
  | 'acoustic'
  | 'history'
  | 'alerts'
  | 'settings';

export type OfflineStatus = 'ONLINE' | 'OFFLINE_LOCAL_AI' | 'SYNCING';

export interface ZoneData {
  id: string; // 'ZONE-A' | 'ZONE-B' | 'ZONE-C' | 'ZONE-D'
  name: string;
  depthLevel: string;
  riskLevel: RiskLevel;
  riskScore: number;
  pestProbability: number;
  temperature: number;
  humidity: number;
  moisture: number;
  co2: number;
  acousticActivity: number;
  tempChange1h: number;
  tempChange6h: number;
  tempChange24h: number;
  humidityChange1h: number;
  humidityChange6h: number;
  humidityChange24h: number;
  moistureChange1h: number;
  moistureChange6h: number;
  moistureChange24h: number;
  co2Change1h: number;
  co2Change6h: number;
  co2Change24h: number;
  lastUpdated: string;
}

export interface HardwareSpec {
  id: string;
  name: string;
  type: string;
  purpose: string;
  usedFor: string;
  dataCaptured: string;
  aiModel: string;
  connection: string;
  protocol: string;
  input: string;
  output: string;
  power: string;
  samplingRate: string;
  status: 'Connected' | 'Warning' | 'Standby' | 'Offline';
  latestReading: string;
  confidence: number;
  zone: string;
  battery: number;
  rssi: number;
  lastSeen: string;
  description: string;
}

export interface RiskContributor {
  factor: string;
  contribution: number;
  direction: 'increase' | 'decrease' | 'neutral';
  measuredValue: string;
}

export interface RiskAssessment {
  zoneId: string;
  overallScore: number;
  riskLevel: RiskLevel;
  pestRisk: number;
  environmentalRisk: number;
  moistureRisk: number;
  temperatureRisk: number;
  co2Risk: number;
  contributors: RiskContributor[];
  explanation: string;
  demo: boolean;
}

export interface ForecastPoint {
  horizonHours: number;
  predictedRisk: number;
  uncertaintyLow: number;
  uncertaintyHigh: number;
  riskLevel: RiskLevel;
  demo: boolean;
}

export interface AlertItem {
  id: string;
  zoneId: string;
  timestamp: string;
  severity: RiskLevel;
  title: string;
  reason: string;
  recommendedAction: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface RecommendationItem {
  id: string;
  zoneId: string;
  title: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: string;
  protocolSteps: string[];
  safetyDisclaimer: string;
}

export interface InterventionItem {
  id: string;
  zoneId: string;
  timestamp: string;
  actionTaken: string;
  operatorName: string;
  observation: string;
  riskBefore: number;
  riskAfter?: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED';
}

export interface GrainLotItem {
  id: string;
  grainType: string;
  quantityKg: number;
  storageDate: string;
  expectedDurationDays: number;
  storageUnitId: string;
  zoneId: string;
  initialMoisture: number;
  currentRisk: RiskLevel;
  status: string;
  origin: string;
  proteinContent: number;
}

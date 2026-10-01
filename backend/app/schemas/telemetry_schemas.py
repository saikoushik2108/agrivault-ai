from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class TelemetryInput(BaseModel):
    device_id: str
    zone_id: str
    timestamp: Optional[datetime] = None
    temperature: float
    humidity: float
    moisture: float
    co2: float
    acoustic_rms: Optional[float] = 0.0

class TelemetryResponse(BaseModel):
    id: int
    zone_id: str
    device_id: str
    timestamp: datetime
    temperature: float
    humidity: float
    moisture: float
    co2: float
    acoustic_rms: float
    is_anomaly: bool
    anomaly_score: float

class ZoneStatus(BaseModel):
    zone_id: str
    name: str
    depth_level: str
    risk_level: str # NORMAL, WATCH, WARNING, CRITICAL
    risk_score: float
    pest_probability: float
    temperature: float
    humidity: float
    moisture: float
    co2: float
    acoustic_activity: float
    temp_change_1h: float
    temp_change_6h: float
    temp_change_24h: float
    humidity_change_1h: float
    humidity_change_6h: float
    humidity_change_24h: float
    moisture_change_1h: float
    moisture_change_6h: float
    moisture_change_24h: float
    co2_change_1h: float
    co2_change_6h: float
    co2_change_24h: float
    last_updated: datetime

class AudioAnalysisResponse(BaseModel):
    recording_id: str
    zone_id: str
    insect_probability: float
    predicted_species: str
    confidence: float
    acoustic_activity_level: str
    demo: bool = True
    spectrogram_data: Optional[List[List[float]]] = None
    features: Optional[Dict[str, float]] = None

class RiskContributor(BaseModel):
    factor: str
    contribution: float
    direction: str # "increase" or "decrease"
    measured_value: str

class RiskAssessment(BaseModel):
    zone_id: str
    overall_score: float
    risk_level: str
    pest_risk: float
    environmental_risk: float
    moisture_risk: float
    temperature_risk: float
    co2_risk: float
    contributors: List[RiskContributor]
    explanation: str
    demo: bool = True

class RiskForecastPoint(BaseModel):
    horizon_hours: int
    predicted_risk: float
    uncertainty_low: float
    uncertainty_high: float
    risk_level: str
    demo: bool = True

class AlertModel(BaseModel):
    id: str
    zone_id: str
    timestamp: datetime
    severity: str
    title: str
    reason: str
    recommended_action: str
    acknowledged: bool

class InterventionCreate(BaseModel):
    zone_id: str
    action_taken: str
    operator_name: str
    observation: str
    risk_before: float
    risk_after: Optional[float] = None

class GrainLotModel(BaseModel):
    id: str
    grain_type: str
    quantity_kg: float
    storage_date: datetime
    expected_duration_days: int
    storage_unit_id: str
    zone_id: str
    initial_moisture: float
    current_risk: str
    status: str
    origin: str
    protein_content: float

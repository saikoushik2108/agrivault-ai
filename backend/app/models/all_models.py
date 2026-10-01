from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship
from ..database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    role = Column(String(20), default="operator")  # admin, operator, inspector
    created_at = Column(DateTime, default=datetime.utcnow)

class Warehouse(Base):
    __tablename__ = "warehouses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    location = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    storage_units = relationship("StorageUnit", back_populates="warehouse")

class StorageUnit(Base):
    __tablename__ = "storage_units"
    id = Column(String(50), primary_key=True, index=True) # e.g. "SILO-01"
    name = Column(String(100), nullable=False)
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"), nullable=True)
    capacity_tonnes = Column(Float, default=500.0)
    grain_type = Column(String(50), default="Hard Red Winter Wheat")
    fill_percentage = Column(Float, default=78.5)
    status = Column(String(20), default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)

    warehouse = relationship("Warehouse", back_populates="storage_units")
    zones = relationship("Zone", back_populates="storage_unit")

class Zone(Base):
    __tablename__ = "zones"
    id = Column(String(50), primary_key=True, index=True) # e.g. "ZONE-A", "ZONE-B", "ZONE-C", "ZONE-D"
    storage_unit_id = Column(String(50), ForeignKey("storage_units.id"), nullable=False)
    name = Column(String(50), nullable=False)
    depth_level = Column(String(50), default="Upper Surface") # e.g. Upper, Mid-Upper, Mid-Lower, Core/Base
    risk_level = Column(String(20), default="NORMAL") # NORMAL, WATCH, WARNING, CRITICAL
    risk_score = Column(Float, default=15.0)
    pest_probability = Column(Float, default=0.05)
    last_updated = Column(DateTime, default=datetime.utcnow)

    storage_unit = relationship("StorageUnit", back_populates="zones")
    sensors = relationship("Sensor", back_populates="zone")
    readings = relationship("SensorReading", back_populates="zone")

class Sensor(Base):
    __tablename__ = "sensors"
    id = Column(String(50), primary_key=True, index=True) # e.g. "INMP441-A", "SHT31-C"
    zone_id = Column(String(50), ForeignKey("zones.id"), nullable=False)
    sensor_type = Column(String(50), nullable=False) # acoustic, temp_humidity, moisture, co2
    hardware_model = Column(String(50), nullable=False) # INMP441, SHT31, Capacitive Probe, NDIR CO2
    protocol = Column(String(30), default="I2C/I2S/MQTT")
    sampling_interval_sec = Column(Integer, default=60)
    battery_level = Column(Float, default=98.0)
    signal_rssi = Column(Integer, default=-58)
    status = Column(String(20), default="ONLINE") # ONLINE, WARNING, OFFLINE
    last_seen = Column(DateTime, default=datetime.utcnow)

    zone = relationship("Zone", back_populates="sensors")

class SensorReading(Base):
    __tablename__ = "sensor_readings"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    zone_id = Column(String(50), ForeignKey("zones.id"), nullable=False)
    device_id = Column(String(50), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    moisture = Column(Float, nullable=False)
    co2 = Column(Float, nullable=False)
    acoustic_rms = Column(Float, default=0.0)
    is_anomaly = Column(Boolean, default=False)
    anomaly_score = Column(Float, default=0.0)

    zone = relationship("Zone", back_populates="readings")

class AudioRecording(Base):
    __tablename__ = "audio_recordings"
    id = Column(String(50), primary_key=True, index=True)
    zone_id = Column(String(50), ForeignKey("zones.id"), nullable=False)
    file_path = Column(String(255), nullable=True)
    duration_seconds = Column(Float, default=5.0)
    sample_rate = Column(Integer, default=16000)
    channels = Column(Integer, default=1)
    timestamp = Column(DateTime, default=datetime.utcnow)
    processed = Column(Boolean, default=False)

    predictions = relationship("AudioPrediction", back_populates="recording")

class AudioPrediction(Base):
    __tablename__ = "audio_predictions"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    recording_id = Column(String(50), ForeignKey("audio_recordings.id"), nullable=False)
    insect_probability = Column(Float, nullable=False)
    predicted_species = Column(String(100), default="Sitophilus oryzae") # Rice/Granary Weevil
    confidence = Column(Float, default=0.88)
    is_demo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    recording = relationship("AudioRecording", back_populates="predictions")

class RiskScore(Base):
    __tablename__ = "risk_scores"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    zone_id = Column(String(50), ForeignKey("zones.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    overall_score = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)
    pest_risk = Column(Float, nullable=False)
    environmental_risk = Column(Float, nullable=False)
    moisture_risk = Column(Float, nullable=False)
    temperature_risk = Column(Float, nullable=False)
    co2_risk = Column(Float, nullable=False)
    feature_contributions = Column(JSON, nullable=True) # SHAP or contributor weights
    is_demo = Column(Boolean, default=True)

class RiskForecast(Base):
    __tablename__ = "risk_forecasts"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    zone_id = Column(String(50), ForeignKey("zones.id"), nullable=False)
    generated_at = Column(DateTime, default=datetime.utcnow)
    horizon_hours = Column(Integer, nullable=False) # 24, 48, 72
    predicted_risk = Column(Float, nullable=False)
    uncertainty_low = Column(Float, nullable=False)
    uncertainty_high = Column(Float, nullable=False)
    is_demo = Column(Boolean, default=True)

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(String(50), primary_key=True, index=True)
    zone_id = Column(String(50), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    severity = Column(String(20), nullable=False) # NORMAL, WATCH, WARNING, CRITICAL
    title = Column(String(150), nullable=False)
    reason = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    acknowledged = Column(Boolean, default=False)
    acknowledged_by = Column(String(50), nullable=True)
    acknowledged_at = Column(DateTime, nullable=True)

class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(String(50), primary_key=True, index=True)
    zone_id = Column(String(50), nullable=False)
    title = Column(String(150), nullable=False)
    urgency = Column(String(20), default="MEDIUM") # LOW, MEDIUM, HIGH, URGENT
    category = Column(String(50), default="Aeration") # Aeration, Physical Inspection, Moisture Control, Pest Protocol
    protocol_steps = Column(JSON, nullable=False)
    safety_disclaimer = Column(Text, default="Decision support only. Do not engage fumigation or hazardous systems without certified personnel.")
    created_at = Column(DateTime, default=datetime.utcnow)

class Intervention(Base):
    __tablename__ = "interventions"
    id = Column(String(50), primary_key=True, index=True)
    zone_id = Column(String(50), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    action_taken = Column(String(100), nullable=False)
    operator_name = Column(String(50), default="J. Miller (Silo Manager)")
    observation = Column(Text, nullable=False)
    risk_before = Column(Float, nullable=False)
    risk_after = Column(Float, nullable=True)
    status = Column(String(20), default="COMPLETED")

class GrainLot(Base):
    __tablename__ = "grain_lots"
    id = Column(String(50), primary_key=True, index=True) # e.g. "LOT-2026-WHT-04"
    grain_type = Column(String(50), nullable=False)
    quantity_kg = Column(Float, nullable=False)
    storage_date = Column(DateTime, default=datetime.utcnow)
    expected_duration_days = Column(Integer, default=180)
    storage_unit_id = Column(String(50), default="SILO-01")
    zone_id = Column(String(50), default="ZONE-C")
    initial_moisture = Column(Float, default=12.2)
    current_risk = Column(String(20), default="WATCH")
    status = Column(String(20), default="STORED")
    origin = Column(String(100), default="Prairie Valley Cooperative")
    protein_content = Column(Float, default=13.4)

class MaintenanceLog(Base):
    __tablename__ = "maintenance_logs"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    device_id = Column(String(50), nullable=False)
    maintenance_type = Column(String(50), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)

class ModelVersion(Base):
    __tablename__ = "model_versions"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    model_name = Column(String(50), nullable=False) # e.g. "Acoustic CNN", "Isolation Forest Anomaly", "XGBoost Fusion Risk"
    version = Column(String(20), nullable=False)
    training_date = Column(DateTime, nullable=True)
    dataset_version = Column(String(50), nullable=True)
    metrics = Column(JSON, nullable=True) # F1, Precision, Recall, AUC
    status = Column(String(30), default="NOT_TRAINED") # NOT_TRAINED, DEMO_MODE, TRAINED_PRODUCTION

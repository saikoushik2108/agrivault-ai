"""
Agrivault AI - Telemetry Service
Handles incoming sensor frames, computes derived rate of changes (1h, 6h, 24h),
triggers anomaly detection, and updates Zone risk.
"""

from datetime import datetime, timedelta
from typing import Dict, Any, List
from ..schemas.telemetry_schemas import ZoneStatus, TelemetryInput

# Seed initial zone states with realistic grain storage data
ZONE_DATABASE: Dict[str, Dict[str, Any]] = {
    "ZONE-A": {
        "zone_id": "ZONE-A",
        "name": "Zone A - Upper Headspace",
        "depth_level": "0 - 3 meters (Surface)",
        "risk_level": "NORMAL",
        "risk_score": 18.4,
        "pest_probability": 0.04,
        "temperature": 23.8,
        "humidity": 56.2,
        "moisture": 11.9,
        "co2": 520.0,
        "acoustic_activity": 0.06,
        "temp_change_1h": -0.1,
        "temp_change_6h": -0.4,
        "temp_change_24h": +0.2,
        "humidity_change_1h": +0.3,
        "humidity_change_6h": +1.1,
        "humidity_change_24h": -0.5,
        "moisture_change_1h": 0.0,
        "moisture_change_6h": +0.1,
        "moisture_change_24h": +0.1,
        "co2_change_1h": +10.0,
        "co2_change_6h": -20.0,
        "co2_change_24h": +30.0,
        "last_updated": datetime.utcnow().isoformat()
    },
    "ZONE-B": {
        "zone_id": "ZONE-B",
        "name": "Zone B - Mid-Upper Core",
        "depth_level": "3 - 7 meters",
        "risk_level": "WATCH",
        "risk_score": 42.1,
        "pest_probability": 0.22,
        "temperature": 26.4,
        "humidity": 63.8,
        "moisture": 13.1,
        "co2": 690.0,
        "acoustic_activity": 0.24,
        "temp_change_1h": +0.4,
        "temp_change_6h": +1.2,
        "temp_change_24h": +1.9,
        "humidity_change_1h": +0.8,
        "humidity_change_6h": +2.4,
        "humidity_change_24h": +3.6,
        "moisture_change_1h": +0.1,
        "moisture_change_6h": +0.3,
        "moisture_change_24h": +0.5,
        "co2_change_1h": +25.0,
        "co2_change_6h": +80.0,
        "co2_change_24h": +140.0,
        "last_updated": datetime.utcnow().isoformat()
    },
    "ZONE-C": {
        "zone_id": "ZONE-C",
        "name": "Zone C - Central Biological Hotspot",
        "depth_level": "7 - 11 meters",
        "risk_level": "CRITICAL",
        "risk_score": 82.6,
        "pest_probability": 0.86,
        "temperature": 31.8,
        "humidity": 72.4,
        "moisture": 14.8,
        "co2": 940.0,
        "acoustic_activity": 0.89,
        "temp_change_1h": +0.9,
        "temp_change_6h": +2.8,
        "temp_change_24h": +4.6,
        "humidity_change_1h": +1.9,
        "humidity_change_6h": +5.2,
        "humidity_change_24h": +8.1,
        "moisture_change_1h": +0.4,
        "moisture_change_6h": +1.1,
        "moisture_change_24h": +1.7,
        "co2_change_1h": +90.0,
        "co2_change_6h": +280.0,
        "co2_change_24h": +420.0,
        "last_updated": datetime.utcnow().isoformat()
    },
    "ZONE-D": {
        "zone_id": "ZONE-D",
        "name": "Zone D - Hopper Discharge & Base",
        "depth_level": "11 - 15 meters (Base)",
        "risk_level": "NORMAL",
        "risk_score": 21.0,
        "pest_probability": 0.07,
        "temperature": 22.9,
        "humidity": 54.1,
        "moisture": 11.6,
        "co2": 510.0,
        "acoustic_activity": 0.08,
        "temp_change_1h": +0.1,
        "temp_change_6h": -0.2,
        "temp_change_24h": 0.0,
        "humidity_change_1h": -0.2,
        "humidity_change_6h": -0.5,
        "humidity_change_24h": +0.4,
        "moisture_change_1h": 0.0,
        "moisture_change_6h": 0.0,
        "moisture_change_24h": -0.1,
        "co2_change_1h": -5.0,
        "co2_change_6h": +15.0,
        "co2_change_24h": +20.0,
        "last_updated": datetime.utcnow().isoformat()
    }
}

TELEMETRY_LOGS: List[Dict[str, Any]] = []

def get_all_zones() -> List[Dict[str, Any]]:
    return list(ZONE_DATABASE.values())

def get_zone_by_id(zone_id: str) -> Dict[str, Any]:
    norm_id = zone_id.upper()
    return ZONE_DATABASE.get(norm_id, ZONE_DATABASE["ZONE-A"])

def record_telemetry(payload: TelemetryInput) -> Dict[str, Any]:
    zone_id = payload.zone_id.upper()
    timestamp = payload.timestamp or datetime.utcnow()

    entry = {
        "id": len(TELEMETRY_LOGS) + 1,
        "device_id": payload.device_id,
        "zone_id": zone_id,
        "timestamp": timestamp.isoformat(),
        "temperature": payload.temperature,
        "humidity": payload.humidity,
        "moisture": payload.moisture,
        "co2": payload.co2,
        "acoustic_rms": payload.acoustic_rms or 0.0,
        "is_anomaly": payload.moisture > 14.5 or payload.temperature > 30.0 or payload.co2 > 900,
        "anomaly_score": round(min(1.0, (payload.moisture / 15.0) * 0.5 + (payload.co2 / 1000.0) * 0.5), 2)
    }
    TELEMETRY_LOGS.append(entry)

    # Update zone cache
    if zone_id in ZONE_DATABASE:
        ZONE_DATABASE[zone_id]["temperature"] = payload.temperature
        ZONE_DATABASE[zone_id]["humidity"] = payload.humidity
        ZONE_DATABASE[zone_id]["moisture"] = payload.moisture
        ZONE_DATABASE[zone_id]["co2"] = payload.co2
        ZONE_DATABASE[zone_id]["last_updated"] = timestamp.isoformat()

    return entry

from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, HTTPException, UploadFile, File, Query
from ..schemas.telemetry_schemas import (
    TelemetryInput, TelemetryResponse, ZoneStatus, AudioAnalysisResponse,
    RiskAssessment, RiskForecastPoint, AlertModel, InterventionCreate, GrainLotModel
)
from ..services.telemetry_service import (
    get_all_zones, get_zone_by_id, record_telemetry, TELEMETRY_LOGS
)
from ml.audio.inference import run_audio_inference, SUPPORTED_SPECIES
from ml.fusion.risk import compute_multimodal_risk
from ml.forecasting.inference import forecast_storage_risk
from ml.explainability.shap_explainer import compute_shap_waterfall

router = APIRouter()

# In-memory storage for active alerts
ACTIVE_ALERTS = [
    {
        "id": "ALT-8091",
        "zone_id": "ZONE-C",
        "timestamp": (datetime.utcnow() - timedelta(minutes=14)).isoformat(),
        "severity": "CRITICAL",
        "title": "Critical Acoustic & Moisture Infestation Signature",
        "reason": "Simultaneous spike in acoustic vibration energy (86% pest likelihood) and localized moisture migration (14.8%).",
        "recommended_action": "Execute targeted physical probe inspection in Zone C. Prepare low-velocity aeration fans.",
        "acknowledged": False
    },
    {
        "id": "ALT-8084",
        "zone_id": "ZONE-B",
        "timestamp": (datetime.utcnow() - timedelta(hours=2)).isoformat(),
        "severity": "WATCH",
        "title": "Moisture Migration Gradient Detected",
        "reason": "Moisture trend increased by +0.3% over 6 hours towards upper core boundary.",
        "recommended_action": "Check roof headspace ventilation dampers and verify solar radiant heating impact.",
        "acknowledged": True
    },
    {
        "id": "ALT-8072",
        "zone_id": "ZONE-C",
        "timestamp": (datetime.utcnow() - timedelta(hours=5)).isoformat(),
        "severity": "WARNING",
        "title": "Respiration CO2 Rise",
        "reason": "CO2 exceeded 800 ppm baseline, reaching 940 ppm.",
        "recommended_action": "Verify insect activity via INMP441 audio recording stream.",
        "acknowledged": False
    }
]

# In-memory recommendations database
RECOMMENDATIONS = [
    {
        "id": "REC-01",
        "zone_id": "ZONE-C",
        "title": "Targeted Core Inspection & Temperature De-stratification",
        "urgency": "HIGH",
        "category": "Physical Inspection",
        "protocol_steps": [
            "Verify deep-bin acoustic activity using manual probe check at 8m depth.",
            "Inspect grain core for localized hotspot or crusting.",
            "Initiate downward suction aeration if ambient humidity is < 65% RH.",
            "Log findings into Agrivault Intervention ledger."
        ],
        "safety_disclaimer": "Decision support only. Do not operate mechanical augers or fumigation without certified safety protocol."
    },
    {
        "id": "REC-02",
        "zone_id": "ZONE-B",
        "title": "Headspace Condensation Prevention",
        "urgency": "MEDIUM",
        "category": "Aeration",
        "protocol_steps": [
            "Open upper plenum exhaust vents to release trapped warm air.",
            "Run cross-ventilation exhaust fan for 30 minutes during evening low-humidity window.",
            "Re-assess moisture sensor telemetry after 4 hours."
        ],
        "safety_disclaimer": "Decision support only."
    }
]

INTERVENTIONS = [
    {
        "id": "INT-104",
        "zone_id": "ZONE-C",
        "timestamp": (datetime.utcnow() - timedelta(hours=28)).isoformat(),
        "action_taken": "Physical core probe sampling and headspace fan run",
        "operator_name": "J. Miller (Silo Manager)",
        "observation": "Localized Sitophilus cluster confirmed at 8.2m depth; initial grain temperature 33.1°C.",
        "risk_before": 88.5,
        "risk_after": 82.6,
        "status": "COMPLETED"
    }
]

GRAIN_LOTS = [
    {
        "id": "LOT-2026-WHT-04",
        "grain_type": "Hard Red Winter Wheat (Grade #1)",
        "quantity_kg": 420000.0,
        "storage_date": "2026-08-15T08:00:00Z",
        "expected_duration_days": 180,
        "storage_unit_id": "SILO-01",
        "zone_id": "ZONE-C",
        "initial_moisture": 12.1,
        "current_risk": "CRITICAL",
        "status": "MONITORED_ACTIVE",
        "origin": "Columbia River Basin Grain Growers",
        "protein_content": 13.8
    },
    {
        "id": "LOT-2026-BAR-02",
        "grain_type": "Malting Barley (Two-Row)",
        "quantity_kg": 280000.0,
        "storage_date": "2026-09-01T10:00:00Z",
        "expected_duration_days": 240,
        "storage_unit_id": "SILO-02",
        "zone_id": "ZONE-A",
        "initial_moisture": 11.4,
        "current_risk": "NORMAL",
        "status": "OPTIMAL_PRESERVATION",
        "origin": "Palouse Prairie Cooperative",
        "protein_content": 11.2
    }
]

@router.get("/health")
def healthcheck():
    return {"status": "ok", "system": "Agrivault AI", "version": "1.0.0", "timestamp": datetime.utcnow().isoformat()}

# Telemetry
@router.post("/telemetry")
def post_telemetry(payload: TelemetryInput):
    res = record_telemetry(payload)
    return {"status": "success", "data": res}

@router.get("/telemetry/latest")
def get_latest_telemetry(zone_id: Optional[str] = "ZONE-C"):
    zone = get_zone_by_id(zone_id)
    return {
        "zone_id": zone["zone_id"],
        "temperature": zone["temperature"],
        "humidity": zone["humidity"],
        "moisture": zone["moisture"],
        "co2": zone["co2"],
        "acoustic_activity": zone["acoustic_activity"],
        "timestamp": zone["last_updated"],
        "status": zone["risk_level"]
    }

@router.get("/telemetry/history")
def get_telemetry_history(zone_id: Optional[str] = "ZONE-C", hours: int = 24):
    zone = get_zone_by_id(zone_id)
    # Generate deterministic historical time points for charts
    history = []
    base_time = datetime.utcnow()
    points = 24 if hours <= 24 else (48 if hours <= 168 else 60)
    step_minutes = (hours * 60) // points

    is_c = "C" in zone_id.upper()
    for i in range(points, 0, -1):
        t = base_time - timedelta(minutes=i * step_minutes)
        progress = (points - i) / points
        # If Zone C, show gradual rise in risk over the window
        temp_delta = progress * (2.8 if is_c else 0.4)
        moist_delta = progress * (1.2 if is_c else 0.1)
        co2_delta = progress * (280.0 if is_c else 30.0)
        acoust_delta = progress * (0.65 if is_c else 0.02)
        risk_delta = progress * (35.0 if is_c else 3.0)

        history.append({
            "timestamp": t.isoformat(),
            "temperature": round(zone["temperature"] - (2.8 - temp_delta if is_c else 0.4 - temp_delta), 1),
            "humidity": round(zone["humidity"] - (5.0 - progress * 5.0 if is_c else 1.0), 1),
            "moisture": round(zone["moisture"] - (1.2 - moist_delta if is_c else 0.1 - moist_delta), 1),
            "co2": round(zone["co2"] - (280.0 - co2_delta if is_c else 30.0 - co2_delta), 0),
            "acoustic_activity": round(max(0.02, zone["acoustic_activity"] - (0.65 - acoust_delta if is_c else 0.02)), 2),
            "risk_score": round(max(10.0, zone["risk_score"] - (35.0 - risk_delta if is_c else 3.0)), 1)
        })
    return {"zone_id": zone_id, "hours": hours, "records": history}

# Zones
@router.get("/zones")
def list_zones():
    return {"zones": get_all_zones()}

@router.get("/zones/{zone_id}/status")
def get_zone_status(zone_id: str):
    return get_zone_by_id(zone_id)

# Audio
@router.post("/audio/upload")
async def upload_audio(file: UploadFile = File(...), zone_id: str = "ZONE-C"):
    contents = await file.read()
    res = run_audio_inference(zone_id=zone_id, raw_audio_bytes=contents)
    return res

@router.post("/audio/analyze")
def analyze_audio(zone_id: str = "ZONE-C"):
    return run_audio_inference(zone_id=zone_id)

@router.get("/audio/{id}")
def get_audio_info(id: str):
    return {
        "id": id,
        "format": "WAV 16-bit PCM 16kHz",
        "duration": "5.0s",
        "status": "PROCESSED",
        "species_classes": SUPPORTED_SPECIES,
        "demo": True
    }

# Risk Intelligence
@router.get("/risk")
def get_risk_assessment(zone_id: str = "ZONE-C"):
    z = get_zone_by_id(zone_id)
    return compute_multimodal_risk(
        zone_id=zone_id,
        temperature=z["temperature"],
        humidity=z["humidity"],
        moisture=z["moisture"],
        co2=z["co2"],
        pest_probability=z["pest_probability"],
        temp_change_1h=z["temp_change_1h"],
        moisture_change_1h=z["moisture_change_1h"],
        co2_change_1h=z["co2_change_1h"]
    )

@router.get("/risk/forecast")
def get_risk_forecast(zone_id: str = "ZONE-C"):
    z = get_zone_by_id(zone_id)
    return {"zone_id": zone_id, "forecast": forecast_storage_risk(zone_id, z["risk_score"])}

@router.get("/risk/explain")
def get_risk_explainability(zone_id: str = "ZONE-C"):
    z = get_zone_by_id(zone_id)
    return compute_shap_waterfall(z)

# Alerts
@router.get("/alerts")
def get_alerts():
    return {"alerts": ACTIVE_ALERTS}

@router.post("/alerts/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: str):
    for a in ACTIVE_ALERTS:
        if a["id"] == alert_id:
            a["acknowledged"] = True
            a["acknowledged_by"] = "Operator (Demo Session)"
            a["acknowledged_at"] = datetime.utcnow().isoformat()
            return {"status": "success", "alert": a}
    raise HTTPException(status_code=404, detail="Alert not found")

# Recommendations
@router.get("/recommendations")
def get_recommendations(zone_id: Optional[str] = None):
    if zone_id:
        filtered = [r for r in RECOMMENDATIONS if r["zone_id"] == zone_id.upper()]
        return {"recommendations": filtered}
    return {"recommendations": RECOMMENDATIONS}

# Interventions
@router.get("/interventions")
def get_interventions():
    return {"interventions": INTERVENTIONS}

@router.post("/interventions")
def create_intervention(payload: InterventionCreate):
    new_int = {
        "id": f"INT-{len(INTERVENTIONS) + 105}",
        "zone_id": payload.zone_id.upper(),
        "timestamp": datetime.utcnow().isoformat(),
        "action_taken": payload.action_taken,
        "operator_name": payload.operator_name,
        "observation": payload.observation,
        "risk_before": payload.risk_before,
        "risk_after": payload.risk_after,
        "status": "COMPLETED"
    }
    INTERVENTIONS.insert(0, new_int)
    return {"status": "success", "intervention": new_int}

# Grain Lots & QR Passport
@router.get("/grain_lots")
def get_grain_lots():
    return {"grain_lots": GRAIN_LOTS}

@router.get("/grain_lots/{lot_id}")
def get_grain_lot_detail(lot_id: str):
    for lot in GRAIN_LOTS:
        if lot["id"] == lot_id:
            return lot
    raise HTTPException(status_code=404, detail="Grain lot not found")

# Reports
@router.get("/reports/summary")
def get_reports_summary():
    return {
        "facility": "Agrivault Grain Storage Terminal #4",
        "storage_unit": "SILO-01 (Vertical Cylindrical Steel)",
        "capacity_tonnes": 500.0,
        "stored_tonnes": 392.5,
        "grain_type": "Hard Red Winter Wheat",
        "reporting_period": "Past 30 Days",
        "average_temperature": 26.2,
        "average_humidity": 61.6,
        "average_moisture": 12.8,
        "average_co2": 665.0,
        "acoustic_events_total": 412,
        "anomalies_detected": 14,
        "active_critical_zones": ["ZONE-C"],
        "interventions_logged": len(INTERVENTIONS),
        "overall_health_rating": "FAIR (Requires Zone C Hotspot Aeration)",
        "generated_at": datetime.utcnow().isoformat()
    }

# Model Registry
@router.get("/models")
def get_model_registry():
    return {
        "models": [
            {
                "model_name": "Acoustic Pest Classifier (CNN)",
                "target": "Insect stridulation / feeding vibrations",
                "version": "v0.9 (Pre-Training Interface)",
                "status": "NOT_TRAINED",
                "metrics": {"f1_score": None, "precision": None, "roc_auc": None},
                "demo_mode": True,
                "note": "Awaiting real audio dataset. Inference returns simulated demo predictions."
            },
            {
                "model_name": "Sensor Anomaly Detector (IsolationForest)",
                "target": "Microclimate & sensor failure anomalies",
                "version": "v1.0 (Rule + Statistical Baseline)",
                "status": "SIMULATED_BASELINE",
                "metrics": {"contamination_rate": 0.05},
                "demo_mode": True,
                "note": "Awaiting empirical multivariable sensor time series."
            },
            {
                "model_name": "Multimodal Storage Risk Fusion (XGBoost)",
                "target": "Composite 0-100 storage risk index",
                "version": "v0.8 (Architecture Ready)",
                "status": "NOT_TRAINED",
                "metrics": {"rmse": None, "accuracy": None},
                "demo_mode": True,
                "note": "Fusion features ready: audio, temp, humidity, moisture, CO2, trends."
            },
            {
                "model_name": "Temporal Risk Forecaster (BiLSTM / TFT)",
                "target": "24h, 48h, 72h risk trajectory",
                "version": "v0.5 (Demo Forecast Prototype)",
                "status": "NOT_TRAINED",
                "metrics": {"mape": None},
                "demo_mode": True,
                "note": "Temporal forecasting interface ready for historical grain lot sequences."
            }
        ]
    }

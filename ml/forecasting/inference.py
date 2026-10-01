"""
Agrivault AI - Temporal Risk Forecasting Pipeline
Forecasts storage risk trajectories for 24h, 48h, and 72h horizons.
Architecture prepared for LSTM / Temporal Fusion Transformer (TFT).
NOTE: Labeled explicitly as Demo Forecast until historical time-series model is trained.
"""

from typing import List, Dict, Any

def forecast_storage_risk(zone_id: str, current_risk: float, trend_direction: float = 1.0) -> List[Dict[str, Any]]:
    """
    Generates deterministic simulated forecast trajectory with upper and lower uncertainty bounds.
    """
    is_critical_zone = "C" in zone_id.upper()

    horizons = [24, 48, 72]
    forecast = []

    for h in horizons:
        # If critical zone C, risk climbs if unchecked
        if is_critical_zone:
            rate = 0.28 * (h / 24.0)
            pred = min(round(current_risk + 14.0 * (h / 24.0), 1), 94.0)
            unc_range = 3.5 * (h / 24.0)
        else:
            pred = max(round(current_risk + 1.5 * (h / 24.0), 1), 12.0)
            unc_range = 2.0 * (h / 24.0)

        level = "NORMAL"
        if pred >= 75.0:
            level = "CRITICAL"
        elif pred >= 50.0:
            level = "WARNING"
        elif pred >= 30.0:
            level = "WATCH"

        forecast.append({
            "horizon_hours": h,
            "predicted_risk": pred,
            "uncertainty_low": max(round(pred - unc_range, 1), 0.0),
            "uncertainty_high": min(round(pred + unc_range, 1), 100.0),
            "risk_level": level,
            "demo": True,
            "model_architecture": "BiLSTM + Temporal Attention (Demo Interface)"
        })

    return forecast

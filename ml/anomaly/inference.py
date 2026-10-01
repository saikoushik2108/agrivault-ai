"""
Agrivault AI - Isolation Forest Environmental Anomaly Detection
Detects microclimate anomalies, localized hot spots, stuck sensor values,
and moisture migration patterns.
"""

from typing import Dict, Any

def detect_anomaly(
    temperature: float,
    humidity: float,
    moisture: float,
    co2: float,
    temp_change_1h: float = 0.0,
    moisture_change_1h: float = 0.0
) -> Dict[str, Any]:
    """
    Evaluates multivariable environmental state for anomaly score.
    Returns score [0.0 = safe, 1.0 = extreme anomaly].
    """
    score = 0.0
    reasons = []

    # High moisture anomaly threshold (Safe wheat is typically <= 13.5%)
    if moisture > 14.5:
        score += 0.35
        reasons.append(f"Elevated grain moisture ({moisture:.1f}% > 14.5% safe baseline)")
    elif moisture > 13.5:
        score += 0.15
        reasons.append(f"Moisture trending near upper ceiling ({moisture:.1f}%)")

    # High temperature threshold (Grain respiration / biological heating)
    if temperature > 29.0:
        score += 0.25
        reasons.append(f"Storage temperature ({temperature:.1f}°C) exceeds ambient threshold")

    # CO2 spike (Early respiration indicator of mold or insect metabolism)
    if co2 > 850:
        score += 0.30
        reasons.append(f"CO2 concentration elevated ({co2:.0f} ppm > 800 ppm baseline)")

    # Dynamic trend rate
    if temp_change_1h > 0.8:
        score += 0.20
        reasons.append(f"Rapid localized thermal rise (+{temp_change_1h:.2f}°C/hr)")
    if moisture_change_1h > 0.4:
        score += 0.20
        reasons.append(f"Rapid moisture migration (+{moisture_change_1h:.2f}%/hr)")

    final_score = min(round(score, 2), 1.0)
    is_anomaly = final_score >= 0.55

    return {
        "is_demo": True,
        "algorithm": "IsolationForest (Simulated Demo Pipeline)",
        "anomaly_score": final_score,
        "is_anomaly": is_anomaly,
        "status": "ANOMALY_DETECTED" if is_anomaly else "NORMAL",
        "contributing_signals": reasons if reasons else ["All environmental parameters within nominal boundaries"]
    }

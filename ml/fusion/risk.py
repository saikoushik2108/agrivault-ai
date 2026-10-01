"""
Agrivault AI - Multimodal Risk Fusion Engine
Integrates:
- Acoustic model insect probability
- Environmental telemetry (temperature, humidity, moisture, CO2)
- Anomaly scores & rolling delta rates (1h, 6h, 24h)
- Storage metadata & lot history
Into a composite 0-100 storage risk index and categorical classification:
NORMAL (0-30), WATCH (31-50), WARNING (51-75), CRITICAL (76-100).
"""

from typing import Dict, Any, List

def compute_multimodal_risk(
    zone_id: str,
    temperature: float,
    humidity: float,
    moisture: float,
    co2: float,
    pest_probability: float,
    temp_change_1h: float = 0.0,
    moisture_change_1h: float = 0.0,
    co2_change_1h: float = 0.0
) -> Dict[str, Any]:
    """
    Computes storage risk score and feature importance / contributors.
    Marked as Demo Explanation until model weights are trained on supplied dataset.
    """
    # Acoustic sub-score (0 - 35 points)
    pest_risk_points = pest_probability * 35.0

    # Moisture sub-score (0 - 30 points)
    # Safe moisture is ~11.5% - 13.0%. Above 14% risk accelerates.
    if moisture <= 12.0:
        moisture_risk_points = 4.0
    elif moisture <= 13.5:
        moisture_risk_points = 12.0 + (moisture - 12.0) * 8.0
    else:
        moisture_risk_points = 24.0 + min((moisture - 13.5) * 12.0, 6.0)

    # Temperature sub-score (0 - 20 points)
    # Ideal storage 15-22C. Respiration increases 25C+
    if temperature <= 22.0:
        temp_risk_points = 3.0
    elif temperature <= 28.0:
        temp_risk_points = 8.0 + (temperature - 22.0) * 1.5
    else:
        temp_risk_points = 17.0 + min((temperature - 28.0) * 1.5, 3.0)

    # CO2 sub-score (0 - 15 points)
    # 400-600 ppm normal; 700-1000 elevated
    if co2 <= 650:
        co2_risk_points = 2.0
    elif co2 <= 850:
        co2_risk_points = 7.0
    else:
        co2_risk_points = 14.0

    # Trend multipliers
    trend_penalty = 0.0
    if moisture_change_1h > 0.2:
        trend_penalty += 4.0
    if temp_change_1h > 0.5:
        trend_penalty += 4.0
    if co2_change_1h > 50:
        trend_penalty += 3.0

    total_score = min(round(pest_risk_points + moisture_risk_points + temp_risk_points + co2_risk_points + trend_penalty, 1), 100.0)

    if total_score < 30.0:
        level = "NORMAL"
    elif total_score < 50.0:
        level = "WATCH"
    elif total_score < 75.0:
        level = "WARNING"
    else:
        level = "CRITICAL"

    # Explicit contributors (SHAP-compatible interface)
    contributors = [
        {
            "factor": "Acoustic Activity (Insect Probability)",
            "contribution": round(pest_risk_points, 1),
            "direction": "increase" if pest_risk_points > 10 else "neutral",
            "measured_value": f"{int(pest_probability * 100)}% prob"
        },
        {
            "factor": "Grain Moisture & Migration Trend",
            "contribution": round(moisture_risk_points, 1),
            "direction": "increase" if moisture > 13.5 else "neutral",
            "measured_value": f"{moisture:.1f}% ({'+' if moisture_change_1h>=0 else ''}{moisture_change_1h:.1f}%/h)"
        },
        {
            "factor": "Temperature Respiration Gradient",
            "contribution": round(temp_risk_points, 1),
            "direction": "increase" if temperature > 27 else "neutral",
            "measured_value": f"{temperature:.1f}°C"
        },
        {
            "factor": "CO2 Accumulation Rate",
            "contribution": round(co2_risk_points, 1),
            "direction": "increase" if co2 > 750 else "neutral",
            "measured_value": f"{co2:.0f} ppm"
        }
    ]

    # Non-hallucinatory explanation based directly on dominant contributors
    reasons = []
    if pest_probability > 0.4:
        reasons.append(f"Elevated acoustic activity detected ({int(pest_probability * 100)}% pest likelihood)")
    if moisture > 13.5:
        reasons.append(f"Grain moisture level ({moisture:.1f}%) exceeds the 13.0% safe preservation boundary")
    if temperature > 28.0:
        reasons.append(f"Storage temperature ({temperature:.1f}°C) is generating biological respiration hotspots")
    if co2 > 800:
        reasons.append(f"High CO2 concentration ({co2:.0f} ppm) signals metabolic activity from grain respiration or insect clusters")

    explanation_text = " • ".join(reasons) if reasons else "All environmental and acoustic signals are within optimal long-term preservation parameters."

    return {
        "zone_id": zone_id,
        "overall_score": total_score,
        "risk_level": level,
        "pest_risk": round(pest_risk_points, 1),
        "environmental_risk": round(temp_risk_points + moisture_risk_points + co2_risk_points, 1),
        "moisture_risk": round(moisture_risk_points, 1),
        "temperature_risk": round(temp_risk_points, 1),
        "co2_risk": round(co2_risk_points, 1),
        "contributors": contributors,
        "explanation": explanation_text,
        "is_demo": True
    }

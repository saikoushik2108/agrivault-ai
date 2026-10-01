"""
Agrivault AI - Acoustic Inference Service
Processes audio recordings and provides insect probability and species classification.
NOTE: Marked as Demo / Simulated Prediction until trained dataset weights are loaded.
"""

from typing import Dict, Any
from .features import compute_mock_spectrogram

SUPPORTED_SPECIES = [
    "Sitophilus oryzae (Rice Weevil)",
    "Rhyzopertha dominica (Lesser Grain Borer)",
    "Tribolium castaneum (Red Flour Beetle)",
    "Cryptolestes ferrugineus (Rusty Grain Beetle)",
    "None (Background Grain Acoustics)"
]

def run_audio_inference(zone_id: str = "ZONE-C", raw_audio_bytes: bytes = None) -> Dict[str, Any]:
    """
    Returns audio classification result.
    Explicitly tags prediction with is_demo=True to maintain integrity.
    """
    # Zone C is simulated with higher insect activity in demo mode
    is_zone_c = "C" in zone_id.upper()
    pest_prob = 0.84 if is_zone_c else 0.08
    species = "Sitophilus oryzae (Rice Weevil)" if is_zone_c else "None (Background Grain Acoustics)"
    confidence = 0.91 if is_zone_c else 0.95
    activity_level = "High Stridulation / Movement" if is_zone_c else "Low / Ambient Grain Settling"

    spectrogram = compute_mock_spectrogram(
        time_steps=64,
        mel_bins=28,
        insect_activity=0.85 if is_zone_c else 0.12
    )

    return {
        "is_demo": True,
        "model_name": "Agrivault Acoustic CNN v0.9 (Pre-Training Baseline)",
        "status": "Demo / Simulated Prediction",
        "zone_id": zone_id,
        "insect_probability": pest_prob,
        "predicted_species": species,
        "confidence": confidence,
        "acoustic_activity_level": activity_level,
        "supported_species": SUPPORTED_SPECIES,
        "spectrogram_data": spectrogram,
        "features": {
            "peak_frequency_hz": 2450.0 if is_zone_c else 420.0,
            "spectral_centroid_hz": 3120.0 if is_zone_c else 880.0,
            "zero_crossing_rate": 0.18 if is_zone_c else 0.04,
            "rms_db": -28.4 if is_zone_c else -52.1
        }
    }

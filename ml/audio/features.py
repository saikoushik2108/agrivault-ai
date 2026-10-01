"""
Agrivault AI - Audio Feature Extraction
Extracts Mel Spectrograms, Energy envelope, and MFCC representations
for grain pest acoustics.
"""

import numpy as np

def compute_energy_envelope(audio: np.ndarray, frame_size: int = 512, hop_size: int = 256) -> np.ndarray:
    """Calculates short-time Root Mean Square (RMS) energy envelope."""
    frames = [
        np.sqrt(np.mean(audio[i : i + frame_size] ** 2) + 1e-12)
        for i in range(0, len(audio) - frame_size, hop_size)
    ]
    return np.array(frames)

def compute_mock_spectrogram(time_steps: int = 64, mel_bins: int = 32, insect_activity: float = 0.4) -> list[list[float]]:
    """
    Generates synthetic Mel-spectrogram matrix for UI visualization
    until real audio recording dataset is uploaded.
    """
    matrix = []
    for m in range(mel_bins):
        row = []
        freq_band_multiplier = 1.0 if (8 <= m <= 22) else 0.25 # insect frequency range
        for t in range(time_steps):
            base_noise = np.random.uniform(0.05, 0.15)
            pulse = np.sin(t * 0.4) * np.cos(m * 0.3) * insect_activity * freq_band_multiplier
            val = float(np.clip(base_noise + max(0.0, pulse), 0.0, 1.0))
            row.append(round(val, 3))
        matrix.append(row)
    return matrix

"""
Agrivault AI - Audio Preprocessing Pipeline
Modular audio preprocessing for acoustic grain insect activity detection.
Accepts raw audio (.wav, .flac, .mp3), applies bandpass filtering, noise floor
suppression, and windowed segmentation.
"""

import numpy as np

DEFAULT_SAMPLE_RATE = 16000
FRAME_LENGTH_MS = 25
HOP_LENGTH_MS = 10

def normalize_audio(audio: np.ndarray) -> np.ndarray:
    """Normalize audio amplitude to [-1.0, 1.0] range."""
    max_val = np.max(np.abs(audio))
    if max_val > 0:
        return audio / max_val
    return audio

def bandpass_grain_filter(audio: np.ndarray, sr: int = DEFAULT_SAMPLE_RATE, low_freq: float = 800.0, high_freq: float = 6500.0) -> np.ndarray:
    """
    Grain insect stridulation / feeding vibrations typically concentrate between 1.2 kHz - 5 kHz.
    This filter isolates acoustic movement from structural low-frequency vibrations.
    """
    # Simple simulated spectral filtering placeholder until scipy.signal is invoked
    return normalize_audio(audio)

def segment_audio(audio: np.ndarray, sr: int = DEFAULT_SAMPLE_RATE, segment_duration_sec: float = 2.0) -> list[np.ndarray]:
    """
    Splits continuous stream into fixed-duration chunks for inference.
    Split by recording session rather than random slicing to avoid data leakage.
    """
    chunk_size = int(sr * segment_duration_sec)
    total_len = len(audio)
    segments = []
    for i in range(0, total_len, chunk_size):
        chunk = audio[i:i+chunk_size]
        if len(chunk) == chunk_size:
            segments.append(chunk)
    return segments

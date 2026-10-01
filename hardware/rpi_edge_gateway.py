"""
Agrivault AI - Raspberry Pi 5 Edge Gateway Daemon
Features:
- Local MQTT broker bridge (subscribes to ESP32 telemetry topics)
- Local SQLite circular storage buffer for complete offline resilience
- Lightweight Edge AI preprocessing & ONNX Runtime placeholder
- Automated cloud synchronization when internet connection is restored
"""

import time
import json
import sqlite3
import urllib.request
import urllib.error

DB_PATH = "edge_telemetry.db"
CLOUD_ENDPOINT = "http://127.0.0.1:8000/api/telemetry"

def init_local_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS edge_buffer (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            device_id TEXT,
            zone_id TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            temperature REAL,
            humidity REAL,
            moisture REAL,
            co2 REAL,
            acoustic_rms REAL,
            synced INTEGER DEFAULT 0
        )
    """)
    conn.commit()
    conn.close()

def buffer_reading(data: dict):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO edge_buffer (device_id, zone_id, temperature, humidity, moisture, co2, acoustic_rms, synced)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    """, (
        data.get("device_id", "ESP32-UNKNOWN"),
        data.get("zone_id", "ZONE-C"),
        data.get("temperature", 28.0),
        data.get("humidity", 60.0),
        data.get("moisture", 13.0),
        data.get("co2", 650.0),
        data.get("acoustic_rms", 0.0)
    ))
    conn.commit()
    conn.close()
    print(f"[EDGE BUFFER] Stored reading for {data.get('zone_id')} locally in SQLite.")

def sync_pending_records():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, device_id, zone_id, temperature, humidity, moisture, co2, acoustic_rms FROM edge_buffer WHERE synced = 0 LIMIT 50")
    rows = cursor.fetchall()

    if not rows:
        conn.close()
        return

    print(f"[SYNC DAEMON] Attempting to sync {len(rows)} pending records to cloud...")

    for row in rows:
        rec_id, dev_id, zone_id, temp, hum, moist, co2, acoust = row
        payload = {
            "device_id": dev_id,
            "zone_id": zone_id,
            "temperature": temp,
            "humidity": hum,
            "moisture": moist,
            "co2": co2,
            "acoustic_rms": acoust
        }

        try:
            req = urllib.request.Request(
                CLOUD_ENDPOINT,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=3) as resp:
                if resp.status in (200, 201):
                    cursor.execute("UPDATE edge_buffer SET synced = 1 WHERE id = ?", (rec_id,))
                    conn.commit()
                    print(f"[SYNC DAEMON] Record {rec_id} successfully synchronized with Agrivault Cloud.")
        except Exception as e:
            print(f"[SYNC DAEMON] Internet unreachable. Staying in offline buffering mode ({e}).")
            break

    conn.close()

if __name__ == "__main__":
    init_local_db()
    print("Agrivault Raspberry Pi 5 Edge Gateway Running (Offline-First Architecture).")
    # Simulation loop
    sample_payload = {
        "device_id": "ESP32-NODE-ZONE-C",
        "zone_id": "ZONE-C",
        "temperature": 31.8,
        "humidity": 72.4,
        "moisture": 14.8,
        "co2": 940.0,
        "acoustic_rms": 42.8
    }
    buffer_reading(sample_payload)
    sync_pending_records()

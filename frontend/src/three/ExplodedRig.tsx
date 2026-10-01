import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useAgrivaultStore } from '../store/storageStore';
import { SiloStructure } from './SiloStructure';
import { GrainCore } from './GrainCore';
import { SensorCabling } from './SensorCabling';
import {
  INMP441Model, SHT31Model, MoistureSensorModel,
  CO2SensorModel, ESP32NodeModel, RaspberryPiModel
} from './HardwareModels';

export const ExplodedRig: React.FC = () => {
  const { exploded, viewMode, toggleExploded } = useAgrivaultStore();
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  // Smooth lerp for explosion animation
  useFrame((_, delta) => {
    const target = exploded ? 1.0 : 0.0;
    const speed = 4.2;
    progressRef.current = THREE.MathUtils.lerp(progressRef.current, target, delta * speed);

    // Update state only if changed meaningfully to avoid excess renders
    if (Math.abs(progressRef.current - progress) > 0.005) {
      setProgress(progressRef.current);
    }
  });

  const p = progress;

  // Sensor normal positions (attached to silo ports) vs exploded positions (separated for inspection)
  // 1. INMP441 Acoustic Mic
  const inmpPos: [number, number, number] = [
    THREE.MathUtils.lerp(-3.05, -4.6, p),
    THREE.MathUtils.lerp(-0.4, 0.4, p),
    THREE.MathUtils.lerp(0.9, 2.2, p)
  ];

  // 2. SHT31 Temp & Humidity Sensor
  const shtPos: [number, number, number] = [
    THREE.MathUtils.lerp(-2.95, -3.2, p),
    THREE.MathUtils.lerp(1.2, 2.6, p),
    THREE.MathUtils.lerp(1.1, 2.8, p)
  ];

  // 3. Capacitive Moisture Sensor
  const moistPos: [number, number, number] = [
    THREE.MathUtils.lerp(2.95, 3.4, p),
    THREE.MathUtils.lerp(-0.6, -0.6, p),
    THREE.MathUtils.lerp(1.1, 2.8, p)
  ];

  // 4. Optical NDIR CO2 Sensor
  const co2Pos: [number, number, number] = [
    THREE.MathUtils.lerp(3.05, 4.8, p),
    THREE.MathUtils.lerp(1.0, 1.4, p),
    THREE.MathUtils.lerp(0.8, 2.0, p)
  ];

  // 5. ESP32 Wireless Sensor Node
  const esp32Pos: [number, number, number] = [
    THREE.MathUtils.lerp(-3.25, -4.5, p),
    THREE.MathUtils.lerp(-2.2, -2.4, p),
    THREE.MathUtils.lerp(0.9, 1.8, p)
  ];

  // 6. Raspberry Pi 5 Edge Gateway
  const rpiPos: [number, number, number] = [
    THREE.MathUtils.lerp(3.25, 4.5, p),
    THREE.MathUtils.lerp(-2.2, -2.4, p),
    THREE.MathUtils.lerp(0.9, 1.8, p)
  ];

  return (
    <group>
      {/* Structural Silo (Outer Shell, Roof, Base) */}
      <SiloStructure
        explodedProgress={p}
        shellOpacity={viewMode === 'sensor' ? 0.3 : 0.88}
        onSiloClick={toggleExploded}
      />

      {/* Internal Grain Mass with Monitored Zones */}
      <GrainCore explodedProgress={p} viewMode={viewMode} />

      {/* Sensor Cabling and Industrial Conduit Layer */}
      <SensorCabling explodedProgress={p} />

      {/* Hardware Components */}
      <INMP441Model position={inmpPos} scale={p > 0.1 ? 1.15 : 0.85} />
      <SHT31Model position={shtPos} scale={p > 0.1 ? 1.15 : 0.85} />
      <MoistureSensorModel position={moistPos} scale={p > 0.1 ? 1.15 : 0.85} />
      <CO2SensorModel position={co2Pos} scale={p > 0.1 ? 1.15 : 0.85} />
      <ESP32NodeModel position={esp32Pos} scale={p > 0.1 ? 1.15 : 0.85} />
      <RaspberryPiModel position={rpiPos} scale={p > 0.1 ? 1.15 : 0.85} />

      {/* Exploded Leader Lines (showing connectivity back to silo ports when separated) */}
      {p > 0.1 && (
        <group>
          {/* Line for INMP441 */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array([
                  inmpPos[0], inmpPos[1], inmpPos[2],
                  -3.0, -0.4, 0.9
                ]), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#38bdf8" transparent opacity={p * 0.6} />
          </line>

          {/* Line for SHT31 */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array([
                  shtPos[0], shtPos[1], shtPos[2],
                  -2.9, 1.2, 1.1
                ]), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#f59e0b" transparent opacity={p * 0.6} />
          </line>

          {/* Line for Moisture */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array([
                  moistPos[0], moistPos[1], moistPos[2],
                  2.9, -0.6, 1.1
                ]), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#0284c7" transparent opacity={p * 0.6} />
          </line>

          {/* Line for CO2 */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array([
                  co2Pos[0], co2Pos[1], co2Pos[2],
                  3.0, 1.0, 0.8
                ]), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#10b981" transparent opacity={p * 0.6} />
          </line>
        </group>
      )}
    </group>
  );
};

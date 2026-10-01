import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useAgrivaultStore } from '../store/storageStore';

interface HardwareProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

// 1. INMP441 Digital MEMS Microphone
export const INMP441Model: React.FC<HardwareProps> = ({ position, rotation = [0, 0, 0], scale = 1 }) => {
  const { setSelectedHardware } = useAgrivaultStore();
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale * (hovered ? 1.15 : 1)}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedHardware('inmp441');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* PCB Base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.08, 0.7]} />
        <meshStandardMaterial color="#1e3a2b" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Gold Edge Connector Pads */}
      <mesh position={[0, 0.045, 0.28]}>
        <boxGeometry args={[0.42, 0.02, 0.1]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* MEMS Microphone Metallic Shield Can */}
      <mesh position={[0, 0.12, -0.08]} castShadow>
        <boxGeometry args={[0.3, 0.15, 0.32]} />
        <meshStandardMaterial color="#c0c0c8" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Acoustic Acoustic Port Hole */}
      <mesh position={[0, 0.2, -0.08]}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
        <meshBasicMaterial color="#111111" />
      </mesh>
      {/* Soundwave Pulse Indicator if Hovered */}
      {hovered && (
        <mesh position={[0, 0.26, -0.08]}>
          <ringGeometry args={[0.1, 0.14, 24]} />
          <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      )}
      <Html position={[0, 0.35, 0]} center distanceFactor={10}>
        <div className={`px-2 py-0.5 rounded text-[11px] font-mono tracking-tight pointer-events-none transition-all shadow-md ${
          hovered ? 'bg-sky-600 text-white scale-110 font-bold' : 'bg-slate-900/90 text-sky-300 border border-sky-500/40'
        }`}>
          INMP441 Acoustic
        </div>
      </Html>
    </group>
  );
};

// 2. SHT31 Temperature & Humidity Sensor
export const SHT31Model: React.FC<HardwareProps> = ({ position, rotation = [0, 0, 0], scale = 1 }) => {
  const { setSelectedHardware } = useAgrivaultStore();
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale * (hovered ? 1.15 : 1)}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedHardware('sht31');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Sintered Stainless Steel Mesh Filter Probe Body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.14, 0.14, 0.55, 24]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.5} metalness={0.7} />
      </mesh>
      {/* Brass Threaded Bushing Mount */}
      <mesh position={[0, -0.32, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.12, 6]} />
        <meshStandardMaterial color="#ca8a04" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Cable Gland */}
      <mesh position={[0, -0.44, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.14, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
      {/* Signal Cable */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 12]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>
      <Html position={[0, 0.38, 0]} center distanceFactor={10}>
        <div className={`px-2 py-0.5 rounded text-[11px] font-mono tracking-tight pointer-events-none transition-all shadow-md ${
          hovered ? 'bg-amber-600 text-white scale-110 font-bold' : 'bg-slate-900/90 text-amber-300 border border-amber-500/40'
        }`}>
          SHT31 Temp/RH
        </div>
      </Html>
    </group>
  );
};

// 3. Capacitive Grain Moisture Sensor Probe
export const MoistureSensorModel: React.FC<HardwareProps> = ({ position, rotation = [0, 0, 0], scale = 1 }) => {
  const { setSelectedHardware } = useAgrivaultStore();
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale * (hovered ? 1.15 : 1)}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedHardware('moisture-sensor');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Probe Head Enclosure (Epoxy sealed) */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.2, 0.35, 18]} />
        <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Dual Heavy-Duty Stainless Steel Moisture Rods */}
      <mesh position={[-0.08, -0.35, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.85, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0.08, -0.35, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.85, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Gold tip calibration bands */}
      <mesh position={[-0.08, -0.72, 0]}>
        <cylinderGeometry args={[0.027, 0.027, 0.08, 16]} />
        <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.08, -0.72, 0]}>
        <cylinderGeometry args={[0.027, 0.027, 0.08, 16]} />
        <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.2} />
      </mesh>
      <Html position={[0, 0.48, 0]} center distanceFactor={10}>
        <div className={`px-2 py-0.5 rounded text-[11px] font-mono tracking-tight pointer-events-none transition-all shadow-md ${
          hovered ? 'bg-blue-600 text-white scale-110 font-bold' : 'bg-slate-900/90 text-blue-300 border border-blue-500/40'
        }`}>
          Moisture Probe
        </div>
      </Html>
    </group>
  );
};

// 4. Optical NDIR CO2 Sensor
export const CO2SensorModel: React.FC<HardwareProps> = ({ position, rotation = [0, 0, 0], scale = 1 }) => {
  const { setSelectedHardware } = useAgrivaultStore();
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale * (hovered ? 1.15 : 1)}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedHardware('co2-sensor');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Golden Optical Chamber Housing */}
      <mesh castShadow>
        <boxGeometry args={[0.55, 0.22, 0.45]} />
        <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* White Gas Permeable Diffusion Filter Membrane */}
      <mesh position={[0, 0.115, 0]}>
        <boxGeometry args={[0.35, 0.02, 0.28]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} />
      </mesh>
      {/* 5-Pin Header */}
      <mesh position={[0, -0.13, 0.16]}>
        <boxGeometry args={[0.38, 0.06, 0.08]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>
      <Html position={[0, 0.32, 0]} center distanceFactor={10}>
        <div className={`px-2 py-0.5 rounded text-[11px] font-mono tracking-tight pointer-events-none transition-all shadow-md ${
          hovered ? 'bg-emerald-600 text-white scale-110 font-bold' : 'bg-slate-900/90 text-emerald-300 border border-emerald-500/40'
        }`}>
          NDIR CO2
        </div>
      </Html>
    </group>
  );
};

// 5. ESP32 Wireless Sensor Node
export const ESP32NodeModel: React.FC<HardwareProps> = ({ position, rotation = [0, 0, 0], scale = 1 }) => {
  const { setSelectedHardware } = useAgrivaultStore();
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale * (hovered ? 1.12 : 1)}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedHardware('esp32');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* IP67 Weatherproof Junction Box Base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.4, 0.9]} />
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </mesh>
      {/* Polycarbonate Clear/Frosted Lid */}
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.88, 0.05, 0.88]} />
        <meshPhysicalMaterial
          color="#e2e8f0"
          transmission={0.8}
          opacity={0.85}
          transparent
          roughness={0.15}
          ior={1.4}
        />
      </mesh>
      {/* Internal PCB (Deep Green) */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.72, 0.04, 0.72]} />
        <meshStandardMaterial color="#064e3b" roughness={0.3} />
      </mesh>
      {/* ESP32-WROOM RF Shield Metal Can */}
      <mesh position={[-0.14, 0.14, 0.05]} castShadow>
        <boxGeometry args={[0.3, 0.08, 0.35]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Status LED (Flashing Pulse Green) */}
      <mesh position={[0.24, 0.13, 0.24]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshBasicMaterial color="#22c55e" />
      </mesh>
      {/* Waterproof PG9 Cable Glands */}
      <mesh position={[0, -0.12, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.18, 12]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
      </mesh>
      {/* External Dipole Rubber Duck Antenna */}
      <group position={[0.42, 0.1, -0.3]}>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.03, 0.04, 0.55, 12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.08, 12]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} />
        </mesh>
      </group>
      <Html position={[0, 0.55, 0]} center distanceFactor={10}>
        <div className={`px-2 py-0.5 rounded text-[11px] font-mono tracking-tight pointer-events-none transition-all shadow-md ${
          hovered ? 'bg-indigo-600 text-white scale-110 font-bold' : 'bg-slate-900/90 text-indigo-300 border border-indigo-500/40'
        }`}>
          ESP32 Sensor Node
        </div>
      </Html>
    </group>
  );
};

// 6. Raspberry Pi 5 Edge Gateway
export const RaspberryPiModel: React.FC<HardwareProps> = ({ position, rotation = [0, 0, 0], scale = 1 }) => {
  const { setSelectedHardware } = useAgrivaultStore();
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale * (hovered ? 1.12 : 1)}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedHardware('rpi5');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Industrial DIN-Rail Gateway Enclosure */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.45, 0.9]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Aluminum Anodized Active Cooler / Heatsink Fins */}
      <mesh position={[-0.15, 0.26, 0]} castShadow>
        <boxGeometry args={[0.55, 0.12, 0.5]} />
        <meshStandardMaterial color="#38bdf8" metalness={0.8} roughness={0.25} />
      </mesh>
      {/* Shielded Gigabit Ethernet RJ45 Jack */}
      <mesh position={[0.55, 0.12, -0.22]}>
        <boxGeometry args={[0.18, 0.22, 0.24]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Stacked Dual USB 3.0 Ports (Blue inserts) */}
      <mesh position={[0.55, 0.12, 0.18]}>
        <boxGeometry args={[0.18, 0.22, 0.22]} />
        <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Activity / Power LEDs */}
      <mesh position={[-0.5, 0.24, 0.35]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[-0.42, 0.24, 0.35]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color="#22c55e" />
      </mesh>
      <Html position={[0, 0.58, 0]} center distanceFactor={10}>
        <div className={`px-2 py-0.5 rounded text-[11px] font-mono tracking-tight pointer-events-none transition-all shadow-md ${
          hovered ? 'bg-rose-600 text-white scale-110 font-bold' : 'bg-slate-900/90 text-rose-300 border border-rose-500/40'
        }`}>
          Raspberry Pi 5 Gateway
        </div>
      </Html>
    </group>
  );
};

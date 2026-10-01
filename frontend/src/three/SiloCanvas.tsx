import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';
import { useAgrivaultStore } from '../store/storageStore';
import { ExplodedRig } from './ExplodedRig';

interface SiloCanvasProps {
  className?: string;
  resetSignal?: number;
}

const ZoneFloatingBadges: React.FC = () => {
  const { zones, selectedZoneId, setSelectedZone } = useAgrivaultStore();

  const badgePositions: Record<string, [number, number, number]> = {
    'ZONE-A': [3.6, 2.5, 0],
    'ZONE-B': [3.6, 1.1, 0],
    'ZONE-C': [3.6, -0.3, 0],
    'ZONE-D': [3.6, -1.7, 0]
  };

  return (
    <group>
      {zones.map((z) => {
        const pos = badgePositions[z.id] || [3.6, 0, 0];
        const isSelected = selectedZoneId === z.id;

        const getBadgeStyle = () => {
          if (z.riskLevel === 'CRITICAL') return 'bg-red-50 text-red-700 border-red-200 shadow-sm';
          if (z.riskLevel === 'WARNING') return 'bg-orange-50 text-orange-700 border-orange-200 shadow-sm';
          if (z.riskLevel === 'WATCH') return 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm';
          return 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm';
        };

        const getDotStyle = () => {
          if (z.riskLevel === 'CRITICAL') return 'bg-red-500 animate-pulse';
          if (z.riskLevel === 'WARNING') return 'bg-orange-500';
          if (z.riskLevel === 'WATCH') return 'bg-amber-500';
          return 'bg-emerald-500';
        };

        return (
          <group key={z.id} position={pos}>
            <Html center distanceFactor={14}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedZone(z.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer whitespace-nowrap bg-white/95 backdrop-blur-xs ${getBadgeStyle()} ${
                  isSelected ? 'ring-2 ring-slate-900 ring-offset-2 scale-105 font-bold shadow-md' : 'hover:scale-102 hover:border-slate-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${getDotStyle()}`} />
                <span className="font-semibold">{z.name.split(' - ')[0]}</span>
                <span className="text-[11px] opacity-75 font-mono">({z.riskScore})</span>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
};

export const SiloCanvas: React.FC<SiloCanvasProps> = ({ className = 'w-full h-full', resetSignal = 0 }) => {
  const { autoRotate, selectedZoneId } = useAgrivaultStore();
  const controlsRef = useRef<OrbitControlsType>(null);

  // Smoothly adjust OrbitControls target when a zone is selected
  useEffect(() => {
    if (!controlsRef.current) return;
    const targetY = selectedZoneId === 'ZONE-A' ? 2.5 :
                    selectedZoneId === 'ZONE-B' ? 1.1 :
                    selectedZoneId === 'ZONE-C' ? -0.3 : -1.7;
    controlsRef.current.target.set(0, targetY * 0.4, 0);
  }, [selectedZoneId]);

  // Handle reset camera trigger
  useEffect(() => {
    if (resetSignal > 0 && controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, 0, 0);
    }
  }, [resetSignal]);

  return (
    <div className={`relative ${className} select-none bg-white`}>
      <Canvas
        shadows
        camera={{ position: [11, 4.5, 12], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        {/* Pure White Background */}
        <color attach="background" args={['#ffffff']} />

        {/* Studio Lighting for High-End Industrial Clarity */}
        <ambientLight intensity={1.1} />

        {/* Primary Key Sun Light casting soft shadows */}
        <directionalLight
          position={[12, 18, 10]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={40}
          shadow-camera-left={-8}
          shadow-camera-right={8}
          shadow-camera-top={8}
          shadow-camera-bottom={-8}
          shadow-bias={-0.0001}
        />

        {/* Fill Lights */}
        <directionalLight position={[-10, 8, -10]} intensity={0.8} color="#f8fafc" />
        <directionalLight position={[0, -6, 6]} intensity={0.4} color="#ffffff" />

        {/* 3D Silo & Hardware Model Rig */}
        <ExplodedRig />

        {/* Interactive Floating Zone Badges */}
        <ZoneFloatingBadges />

        {/* Clean Ground Shadow Receiver Plane */}
        <mesh position={[0, -4.55, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[60, 60]} />
          <shadowMaterial opacity={0.12} />
        </mesh>

        {/* Light Architectural Floor Grid */}
        <gridHelper args={[40, 40, '#E2E8F0', '#F8FAFC']} position={[0, -4.54, 0]} />

        {/* Camera Controls */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.06}
          minDistance={6}
          maxDistance={28}
          maxPolarAngle={Math.PI / 2 - 0.02} // Don't clip underneath floor
          autoRotate={autoRotate}
          autoRotateSpeed={1.0}
        />
      </Canvas>
    </div>
  );
};

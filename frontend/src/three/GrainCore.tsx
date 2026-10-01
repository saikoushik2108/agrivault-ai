import React, { useState } from 'react';
import * as THREE from 'three';
import { useAgrivaultStore } from '../store/storageStore';

interface GrainCoreProps {
  explodedProgress: number;
  viewMode: 'normal' | 'exploded' | 'risk' | 'sensor';
}

export const GrainCore: React.FC<GrainCoreProps> = ({ explodedProgress, viewMode }) => {
  const { selectedZoneId, setSelectedZone } = useAgrivaultStore();
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  // Slight vertical separation in exploded view
  const separation = explodedProgress * 0.45;

  const getZoneColor = (zoneId: string, baseWheat: string, riskLevel: string) => {
    if (viewMode === 'risk') {
      switch (riskLevel) {
        case 'CRITICAL': return '#ef4444'; // Soft red
        case 'WARNING': return '#f97316';  // Soft orange
        case 'WATCH': return '#eab308';    // Soft yellow
        default: return '#22c55e';        // Soft green
      }
    }
    // Normal view: warm wheat tones with subtle risk tints
    if (zoneId === 'ZONE-C') return '#cf7153'; // Warm reddish grain hotspot
    if (zoneId === 'ZONE-B') return '#d4a359'; // Warm golden wheat
    if (zoneId === 'ZONE-A') return '#e5be7a'; // Light surface wheat
    return '#c28e42'; // Dense base wheat
  };

  const zonesConfig = [
    {
      id: 'ZONE-A',
      name: 'Zone A - Headspace (0-3m)',
      y: 2.5 + separation * 1.5,
      height: 1.4,
      radiusTop: 2.65,
      radiusBottom: 2.82,
      risk: 'NORMAL',
      baseColor: '#e5be7a'
    },
    {
      id: 'ZONE-B',
      name: 'Zone B - Upper Core (3-7m)',
      y: 1.1 + separation * 0.5,
      height: 1.4,
      radiusTop: 2.82,
      radiusBottom: 2.82,
      risk: 'WATCH',
      baseColor: '#d4a359'
    },
    {
      id: 'ZONE-C',
      name: 'Zone C - Hotspot Core (7-11m)',
      y: -0.3 - separation * 0.5,
      height: 1.4,
      radiusTop: 2.82,
      radiusBottom: 2.82,
      risk: 'CRITICAL',
      baseColor: '#cf7153'
    },
    {
      id: 'ZONE-D',
      name: 'Zone D - Hopper Base (11-15m)',
      y: -1.7 - separation * 1.5,
      height: 1.4,
      radiusTop: 2.82,
      radiusBottom: 1.8,
      risk: 'NORMAL',
      baseColor: '#c28e42'
    }
  ];

  return (
    <group>
      {zonesConfig.map((z) => {
        const isSelected = selectedZoneId === z.id;
        const isHovered = hoveredZone === z.id;
        const color = getZoneColor(z.id, z.baseColor, z.risk);

        return (
          <group key={z.id} position={[0, z.y, 0]}>
            {/* Grain Volume Cylinder / Frustum */}
            <mesh
              castShadow
              receiveShadow
              onClick={(e) => {
                e.stopPropagation();
                setSelectedZone(z.id);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredZone(z.id);
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                setHoveredZone(null);
                document.body.style.cursor = 'auto';
              }}
            >
              <cylinderGeometry args={[z.radiusTop, z.radiusBottom, z.height, 32]} />
              <meshStandardMaterial
                color={color}
                roughness={0.7}
                metalness={0.08}
                transparent={explodedProgress > 0.05}
                opacity={explodedProgress > 0.05 ? 0.95 : 0.85}
                emissive={
                  isSelected ? (z.risk === 'CRITICAL' ? '#7f1d1d' : '#854d0e') : (isHovered ? '#451a03' : '#000000')
                }
                emissiveIntensity={isSelected ? 0.35 : (isHovered ? 0.2 : 0)}
              />
            </mesh>

            {/* Selection / Risk Highlight Ring */}
            {(isSelected || isHovered || viewMode === 'risk') && (
              <mesh position={[0, z.height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[z.radiusTop - 0.06, z.radiusTop + 0.04, 32]} />
                <meshBasicMaterial
                  color={z.risk === 'CRITICAL' ? '#ef4444' : (z.risk === 'WATCH' ? '#eab308' : '#22c55e')}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};

import React from 'react';
import * as THREE from 'three';

interface SiloProps {
  explodedProgress: number; // 0.0 (normal) to 1.0 (fully exploded)
  shellOpacity?: number;
  onSiloClick?: () => void;
}

export const SiloStructure: React.FC<SiloProps> = ({
  explodedProgress,
  shellOpacity = 0.88,
  onSiloClick
}) => {
  // Displacements calculated from explodedProgress
  // Roof moves UP
  const roofPosY = 4.3 + explodedProgress * 3.8;

  // Outer shell splits into left and right halves
  const leftShellPosX = -explodedProgress * 3.2;
  const rightShellPosX = explodedProgress * 3.2;

  // Base stays rooted
  const basePosY = -3.2;

  return (
    <group
      onClick={onSiloClick}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      {/* 1. TOP ROOF CONE & AUGER HEAD (Moves Upward on explode) */}
      <group position={[0, roofPosY, 0]}>
        {/* Conical Roof */}
        <mesh castShadow receiveShadow>
          <coneGeometry args={[3.2, 1.4, 32, 1, true]} />
          <meshStandardMaterial
            color="#cbd5e1"
            metalness={0.75}
            roughness={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Top Intake Auger Cap */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.6, 0.4, 24]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Roof Inspection Hatch */}
        <mesh position={[1.4, 0.35, 1.0]} rotation={[-0.4, 0.6, 0]} castShadow>
          <boxGeometry args={[0.6, 0.1, 0.6]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>
        {/* Roof Safety Railing */}
        <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.1, 3.25, 32]} />
          <meshStandardMaterial color="#64748b" metalness={0.6} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 2. LEFT SILO CYLINDER HALF (Splits along X-) */}
      <group position={[leftShellPosX, 0.8, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry
            args={[3.0, 3.0, 6.4, 32, 8, true, Math.PI / 2, Math.PI]}
          />
          <meshStandardMaterial
            color="#cbd5e1"
            metalness={0.8}
            roughness={0.35}
            transparent={explodedProgress > 0.05}
            opacity={explodedProgress > 0.05 ? 0.45 : shellOpacity}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Horizontal Galvanized Ring Stiffeners */}
        {[-2.4, -1.2, 0, 1.2, 2.4].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, Math.PI / 2, 0]}>
            <torusGeometry args={[3.04, 0.04, 8, 32, Math.PI]} />
            <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* 3. RIGHT SILO CYLINDER HALF (Splits along X+) */}
      <group position={[rightShellPosX, 0.8, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry
            args={[3.0, 3.0, 6.4, 32, 8, true, -Math.PI / 2, Math.PI]}
          />
          <meshStandardMaterial
            color="#cbd5e1"
            metalness={0.8}
            roughness={0.35}
            transparent={explodedProgress > 0.05}
            opacity={explodedProgress > 0.05 ? 0.45 : shellOpacity}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Horizontal Galvanized Ring Stiffeners */}
        {[-2.4, -1.2, 0, 1.2, 2.4].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, -Math.PI / 2, 0]}>
            <torusGeometry args={[3.04, 0.04, 8, 32, Math.PI]} />
            <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.3} />
          </mesh>
        ))}
        {/* External Inspection Ladder */}
        <group position={[3.12, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh position={[-0.2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 6.2, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.7} />
          </mesh>
          <mesh position={[0.2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 6.2, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.7} />
          </mesh>
          {/* Ladder Rungs */}
          {Array.from({ length: 14 }).map((_, idx) => (
            <mesh key={idx} position={[0, -2.8 + idx * 0.44, 0]}>
              <boxGeometry args={[0.4, 0.025, 0.025]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
          ))}
        </group>
      </group>

      {/* 4. BASE CONICAL DISCHARGE HOPPER & SUPPORT LEGS (Rooted) */}
      <group position={[0, basePosY, 0]}>
        {/* Inverted Conical Discharge Hopper */}
        <mesh position={[0, 0.6, 0]} rotation={[Math.PI, 0, 0]} castShadow receiveShadow>
          <coneGeometry args={[2.98, 1.8, 32, 1, false]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.75} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
        {/* Slide Gate Discharge Valve */}
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.3, 24]} />
          <meshStandardMaterial color="#334155" metalness={0.85} />
        </mesh>
        {/* 6 Heavy Structural Steel I-Beam Support Legs */}
        {Array.from({ length: 6 }).map((_, idx) => {
          const angle = (idx / 6) * Math.PI * 2;
          const px = Math.cos(angle) * 2.85;
          const pz = Math.sin(angle) * 2.85;
          return (
            <group key={idx} position={[px, 0.1, pz]}>
              <mesh castShadow>
                <boxGeometry args={[0.22, 2.4, 0.22]} />
                <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.35} />
              </mesh>
              {/* Foundation Bolt Base Plate */}
              <mesh position={[0, -1.2, 0]}>
                <boxGeometry args={[0.45, 0.06, 0.45]} />
                <meshStandardMaterial color="#334155" metalness={0.9} />
              </mesh>
            </group>
          );
        })}
        {/* Aeration Blower Inlet Duct */}
        <group position={[0, 0.4, -2.4]} rotation={[0.2, 0, 0]}>
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.35, 1.2, 16]} />
            <meshStandardMaterial color="#0284c7" metalness={0.5} roughness={0.3} />
          </mesh>
        </group>
        {/* Circular Concrete Foundation Pad */}
        <mesh position={[0, -1.3, 0]} receiveShadow>
          <cylinderGeometry args={[4.2, 4.4, 0.35, 32]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.85} metalness={0.05} />
        </mesh>
      </group>
    </group>
  );
};

import React from 'react';

interface CablingProps {
  explodedProgress: number;
}

export const SensorCabling: React.FC<CablingProps> = ({ explodedProgress }) => {
  // Conduit moves out slightly with shell or floats between node and probes
  const conduitOffsetX = explodedProgress * 1.8;

  return (
    <group position={[conduitOffsetX, 0, 0]}>
      {/* Vertical Metal Cable Conduit Tube running along side of silo */}
      <mesh position={[-3.06, 0.4, 0.8]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 6.2, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Junction Box T-Fittings at each zone drop */}
      {[2.2, 0.8, -0.6, -1.8].map((y, idx) => (
        <group key={idx} position={[-3.06, y, 0.8]}>
          <mesh castShadow>
            <boxGeometry args={[0.12, 0.12, 0.12]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
          {/* Flexible Lead into Silo Wall */}
          <mesh position={[0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.24, 8]} />
            <meshStandardMaterial color="#0f172a" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Lower Main Feed into ESP32 & Edge Gateway */}
      <mesh position={[-3.06, -2.2, 0.8]}>
        <cylinderGeometry args={[0.04, 0.04, 1.4, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
    </group>
  );
};

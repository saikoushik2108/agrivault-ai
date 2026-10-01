import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useAgrivaultStore } from '../store/storageStore';

export const AtmosphericEffects: React.FC = () => {
  const { selectedZoneId, viewMode, exploded } = useAgrivaultStore();
  const particlesRef = useRef<THREE.Points>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Generate lightweight grain dust particles
  const particleCount = 120;
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Cylinder distribution inside silo radius (~2.4m) and height (-2.5 to 3.2m)
      const radius = Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      pos[i * 3] = radius * Math.cos(theta);
      pos[i * 3 + 1] = (Math.random() - 0.4) * 6.0;
      pos[i * 3 + 2] = radius * Math.sin(theta);

      // Upward drift velocities (thermal rising air)
      vel[i * 3] = (Math.random() - 0.5) * 0.004;
      vel[i * 3 + 1] = 0.006 + Math.random() * 0.008;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.004;
    }
    return [pos, vel];
  }, [particleCount]);

  useFrame((state, delta) => {
    // Animate dust particles floating upwards
    if (particlesRef.current) {
      const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        array[i * 3 + 1] += velocities[i * 3 + 1];
        array[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.002;

        // Reset if drifted past top of silo
        if (array[i * 3 + 1] > 3.6) {
          array[i * 3 + 1] = -2.6;
        }
      }
      posAttr.needsUpdate = true;
    }

    // Animate hotspot thermal pulse on Zone C
    if (pulseRef.current) {
      const time = state.clock.getElapsedTime();
      const scale = 1 + Math.sin(time * 3.2) * 0.08;
      pulseRef.current.scale.set(scale, scale, scale);
    }

    if (ringRef.current) {
      const time = state.clock.getElapsedTime();
      ringRef.current.rotation.z += delta * 0.4;
      const opacity = 0.4 + Math.sin(time * 4) * 0.3;
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
    }
  });

  return (
    <group>
      {/* Micro-particulate Grain Dust Field */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#fef08a"
          transparent
          opacity={exploded ? 0.6 : 0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Critical Zone C Biological Infestation Hotspot Beacon */}
      <group position={[0, -0.3, 0]}>
        {/* Pulsing Thermal Flare */}
        <mesh ref={pulseRef}>
          <sphereGeometry args={[1.2, 16, 16]} />
          <meshBasicMaterial
            color="#ef4444"
            transparent
            opacity={viewMode === 'risk' || selectedZoneId === 'ZONE-C' ? 0.22 : 0.09}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Dynamic Acoustic/Thermal Radiation Ring */}
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.84, 2.96, 32]} />
          <meshBasicMaterial
            color="#f87171"
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
};

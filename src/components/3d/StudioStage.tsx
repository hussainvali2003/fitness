"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface StudioStageProps {
  color?: string;
  enableParticles?: boolean;
}

export const StudioStage: React.FC<StudioStageProps> = ({
  color = "#ee4d00", // GYM X Signature Fiery Orange
  enableParticles = true,
}) => {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Procedural spatial floating gym embers
  const { particlePositions, particleColors } = useMemo(() => {
    const count = 130;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const baseColor = new THREE.Color(color);
    const secondaryColor = new THREE.Color("#ff7700"); // Warm flame ember

    for (let i = 0; i < count; i++) {
      // Cylinder distribution around body
      const theta = Math.random() * Math.PI * 2;
      const radius = 0.4 + Math.random() * 1.9;
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = -0.85 + Math.random() * 3.3; // height from feet to above head
      positions[i * 3 + 2] = Math.sin(theta) * radius;

      // Color variation between Fiery Orange and Warm Ember
      const lerpedColor = baseColor.clone().lerp(secondaryColor, Math.random() * 0.85);
      colors[i * 3] = lerpedColor.r;
      colors[i * 3 + 1] = lerpedColor.g;
      colors[i * 3 + 2] = lerpedColor.b;
    }

    return { particlePositions: positions, particleColors: colors };
  }, [color]);

  // Animated rotation and floating particles
  useFrame((state, delta) => {
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.22;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= delta * 0.38;
    }

    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 130; i++) {
        const yIndex = i * 3 + 1;
        positions[yIndex] += delta * (0.16 + (i % 6) * 0.04);
        if (positions[yIndex] > 2.65) {
          positions[yIndex] = -0.85; // recycle back to floor
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, -0.9, 0]}>
      {/* Dark Reflective Circular Pedestal Platform - GYM X Obsidian Void */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[1.65, 64]} />
        <meshStandardMaterial
          color="#08080a"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Cybernetic Glowing Outer Ring - GYM X Fiery Orange */}
      <mesh
        ref={outerRingRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.005, 0]}
      >
        <ringGeometry args={[1.5, 1.54, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>

      {/* Segmented Inner Tech Ring - Flame Orange */}
      <mesh
        ref={innerRingRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.008, 0]}
      >
        <ringGeometry args={[1.15, 1.18, 48]} />
        <meshBasicMaterial color="#ff5500" transparent opacity={0.6} />
      </mesh>

      {/* Center Holographic Target Marker */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.35, 0.37, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.45} />
      </mesh>

      {/* Radial Cardinal Ticks */}
      {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2, (7 * Math.PI) / 4].map((rad, idx) => (
        <mesh
          key={idx}
          position={[Math.cos(rad) * 1.35, 0.012, Math.sin(rad) * 1.35]}
          rotation={[-Math.PI / 2, 0, -rad]}
        >
          <planeGeometry args={[0.08, 0.02]} />
          <meshBasicMaterial color={idx % 2 === 0 ? color : "#ff5500"} transparent opacity={0.7} />
        </mesh>
      ))}

      {/* Soft Contact Shadow Disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <circleGeometry args={[0.65, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.75} />
      </mesh>

      {/* Floating Spatial Particles */}
      {enableParticles && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={130}
              array={particlePositions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={130}
              array={particleColors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.038}
            vertexColors
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}
    </group>
  );
};

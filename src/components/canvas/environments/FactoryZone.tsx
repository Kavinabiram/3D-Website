import React from 'react';
import LiquidChocolate from '../shared/LiquidChocolate';

interface ZoneProps {
  visible: boolean;
}

export const FactoryZone: React.FC<ZoneProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <group position={[3, 4, -8]}>
      {/* Factory spotlights */}
      <spotLight
        position={[-5, 8, 2]}
        angle={0.7}
        intensity={3}
        color="#F7B955"
        castShadow
      />
      <spotLight
        position={[5, 8, -2]}
        angle={0.5}
        intensity={2}
        color="#D6A85F"
        castShadow
      />

      {/* Melter Tank Cylinder */}
      <mesh position={[-4, 1, -4]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 4, 32]} />
        <meshPhysicalMaterial
          color="#2D140F"
          roughness={0.15}
          metalness={0.8}
          clearcoat={1.0}
        />
      </mesh>

      {/* Piping structure */}
      <mesh position={[0, 2, -5]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 8, 16]} />
        <meshStandardMaterial color="#B97A3D" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[2, 0, -5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 4, 16]} />
        <meshStandardMaterial color="#B97A3D" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Conveyor base structures */}
      <mesh position={[0, -1.8, -2]} castShadow receiveShadow>
        <boxGeometry args={[6, 0.4, 2]} />
        <meshStandardMaterial color="#1A0E0A" roughness={0.5} metalness={0.7} />
      </mesh>

      {/* Flowing liquid river */}
      <LiquidChocolate />
    </group>
  );
};

export default FactoryZone;

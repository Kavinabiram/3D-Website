import React from 'react';
import ChocolateBar from '../shared/ChocolateBar';
import CocoaParticles from '../shared/CocoaParticles';
import GoldTrails from '../shared/GoldTrails';

interface ZoneProps {
  visible: boolean;
}

export const CosmosZone: React.FC<ZoneProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <group position={[0, 0, 0]}>
      {/* Dynamic spotlight tracking the hero scene */}
      <spotLight
        position={[2, 5, 4]}
        angle={0.6}
        penumbra={1}
        intensity={2.5}
        color="#D6A85F"
        castShadow
        shadow-bias={-0.0001}
      />
      <spotLight
        position={[-2, -3, 3]}
        angle={0.8}
        penumbra={1}
        intensity={0.8}
        color="#F7B955"
      />
      
      {/* Central Chocolate Bar */}
      <group scale={1.2}>
        <ChocolateBar />
      </group>

      {/* Atmospheric Particles */}
      <CocoaParticles count={150} />

      {/* Gold Energy Orbits */}
      <GoldTrails />
    </group>
  );
};

export default CosmosZone;

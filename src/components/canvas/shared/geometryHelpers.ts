import * as THREE from 'three';

/**
 * Creates a procedurally deformed cocoa pod geometry.
 * Displaces a standard sphere to have tapered ends and 10 prominent vertical ridges.
 */
export const createCocoaPodGeometry = (): THREE.BufferGeometry => {
  const geom = new THREE.SphereGeometry(1, 64, 64);
  const pos = geom.attributes.position;
  
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);
    
    // Calculate angle around Y axis
    const theta = Math.atan2(z, x);
    
    // Taper at the top and bottom (making it football-shaped)
    // As y goes from -1 to 1, the radius tapers
    const taper = 1.0 - Math.pow(y / 1.0, 4) * 0.45;
    
    // Add 10 prominent vertical ridges
    const ridgePattern = 1.0 + Math.sin(theta * 10.0) * 0.08 * (1.0 - Math.abs(y) * 0.6);
    
    x *= taper * ridgePattern;
    z *= taper * ridgePattern;
    
    pos.setXYZ(i, x, y, z);
  }
  
  geom.computeVertexNormals();
  return geom;
};

/**
 * Creates a procedurally crumpled gold foil box geometry.
 * Displaces box vertices with high-frequency noise to simulate folded luxury foil.
 */
export const createGoldFoilGeometry = (
  width = 1.9,
  height = 2.8,
  depth = 0.05
): THREE.BufferGeometry => {
  const geom = new THREE.BoxGeometry(width, height, depth, 32, 32, 2);
  const pos = geom.attributes.position;
  
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);
    
    // Add small high-frequency noise to simulate crumpled foil
    // We apply noise in the Z-axis (depth) for the front/back faces
    const noise = Math.sin(x * 12.0) * Math.cos(y * 12.0) * 0.015 +
                  Math.sin(x * 35.0) * Math.sin(y * 35.0) * 0.005;
                  
    // Displace vertices on front/back faces
    if (Math.abs(z) > 0.01) {
      z += noise;
    } else {
      x += noise * 0.5;
      y += noise * 0.5;
    }
    
    pos.setXYZ(i, x, y, z);
  }
  
  geom.computeVertexNormals();
  return geom;
};

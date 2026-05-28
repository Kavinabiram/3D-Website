uniform float uTime;
uniform float uSpeed;
varying vec2 vUv;
varying float vGlow;

void main() {
  vUv = uv;
  
  // Create a dynamic displacement for the gold trails
  vec3 pos = position;
  pos.x += sin(pos.y * 3.0 + uTime * uSpeed) * 0.15;
  pos.z += cos(pos.y * 2.0 + uTime * uSpeed) * 0.15;
  
  // Calculate relative glow based on height/position
  vGlow = sin(uv.y * 3.14159) * 0.5 + 0.5;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}

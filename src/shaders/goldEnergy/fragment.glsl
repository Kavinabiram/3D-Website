uniform float uTime;
uniform vec3 uGoldColor;
varying vec2 vUv;
varying float vGlow;

void main() {
  // Glow fades out towards the edges of the trail
  float alpha = pow(vGlow, 2.0);
  
  // Add time-based shimmer effect
  float shimmer = sin(vUv.x * 20.0 - uTime * 5.0) * 0.15 + 0.85;
  
  vec3 finalColor = uGoldColor * shimmer;
  
  gl_FragColor = vec4(finalColor, alpha);
}

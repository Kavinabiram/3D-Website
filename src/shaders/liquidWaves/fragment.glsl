uniform float uTime;
uniform vec3 uChocolateColor;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);

  // Lighting calculations
  vec3 lightDir = normalize(vec3(-2.0, 6.0, 4.0));
  float diff = max(dot(normal, lightDir), 0.0);

  // High gloss highlight
  vec3 halfDir = normalize(lightDir + viewDir);
  float spec = pow(max(dot(normal, halfDir), 0.0), 128.0); // Extreme sheen

  // Depth approximation using rim light
  float rim = 1.0 - max(dot(normal, viewDir), 0.0);
  vec3 rimLight = pow(rim, 3.0) * vec3(0.2, 0.08, 0.03);

  // Add subtle color variation across waves based on coordinates
  vec3 baseColor = mix(uChocolateColor, uChocolateColor * 0.75, sin(vUv.x * 10.0 + uTime) * 0.1 + 0.1);

  vec3 finalColor = baseColor * diff + vec3(spec * 0.9) + rimLight;
  
  gl_FragColor = vec4(finalColor, 0.95); // High opacity fluid
}

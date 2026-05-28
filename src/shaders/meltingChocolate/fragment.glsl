uniform float uTime;
uniform float uMeltingProgress; // 0.0 (Solid) to 1.0 (Liquid)
uniform vec3 uChocolateColor;
uniform vec3 uGoldColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

// Description : Array and textureless GLSL 2D/3D/4D simplex noise functions.
//      Author : Ian McEwan, Ashima Arts.
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 a0 = x - floor(x + 0.5);
  vec3 g = sin(a0*6.2831) * h;
  vec3 sampleColor = 1.85 * (g.x*m.x + g.y*m.y + g.z*m.z);
  return sampleColor.x;
}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);

  // Viscosity Flow Simulation using Simplex Noise
  vec2 flowOffset = vec2(0.0, uTime * 0.4);
  float noise = snoise((vUv + flowOffset) * 4.0);

  // Displace normals dynamically based on melt amount
  vec3 modifiedNormal = normalize(normal + vec3(noise * 0.15 * uMeltingProgress));

  // Diffuse Lighting Calculation
  vec3 lightDir = normalize(vec3(5.0, 8.0, 3.0));
  float diff = max(dot(modifiedNormal, lightDir), 0.0);

  // High gloss Specular reflections (Chocolate Sheen)
  vec3 halfDir = normalize(lightDir + viewDir);
  float spec = pow(max(dot(modifiedNormal, halfDir), 0.0), 64.0); // High gloss factor

  // Subsurface scattering color approximation (warm rim light)
  float rim = 1.0 - max(dot(modifiedNormal, viewDir), 0.0);
  vec3 rimLight = pow(rim, 4.0) * vec3(0.3, 0.1, 0.05);

  // Mix solid base with flowing gold energy streaks
  vec3 baseColor = mix(uChocolateColor, uChocolateColor * 0.7, noise);
  vec3 finalMaterialColor = mix(baseColor, uGoldColor, step(0.8, fract(noise * 3.0 - uTime)) * uMeltingProgress);

  vec3 finalOutput = finalMaterialColor * diff + vec3(spec * 0.8) + rimLight;
  gl_FragColor = vec4(finalOutput, 1.0);
}

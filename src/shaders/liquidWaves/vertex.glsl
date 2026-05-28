uniform float uTime;
uniform float uSpeed;
uniform float uWaveHeight;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

// Gerstner Wave Formula
vec3 gerstnerWave(vec4 wave, vec3 position, inout vec3 tangent, inout vec3 binormal) {
  float steepness = wave.z;
  float wavelength = wave.w;
  float k = 2.0 * 3.14159265359 / wavelength;
  float c = sqrt(9.8 / k);
  vec2 d = normalize(wave.xy);
  float f = k * (dot(d, position.xz) - c * uTime * uSpeed);
  float a = steepness / k * uWaveHeight;

  tangent += vec3(
    -d.x * d.x * (steepness * sin(f)),
    d.x * (steepness * cos(f)),
    -d.x * d.y * (steepness * sin(f))
  );
  binormal += vec3(
    -d.x * d.y * (steepness * sin(f)),
    d.y * (steepness * cos(f)),
    -d.y * d.y * (steepness * sin(f))
  );

  return vec3(
    d.x * (a * cos(f)),
    a * sin(f),
    d.y * (a * cos(f))
  );
}

void main() {
  vUv = uv;
  vec3 gridPoint = position;
  vec3 tangent = vec3(1.0, 0.0, 0.0);
  vec3 binormal = vec3(0.0, 0.0, 1.0);

  // Apply three layered waves to simulate viscous interference
  vec4 wave1 = vec4(1.0, 0.0, 0.15, 6.0); // dirX, dirZ, steepness, wavelength
  vec4 wave2 = vec4(0.0, 1.0, 0.10, 4.0);
  vec4 wave3 = vec4(0.7, 0.7, 0.08, 3.0);

  vec3 displaced = gridPoint;
  displaced += gerstnerWave(wave1, gridPoint, tangent, binormal);
  displaced += gerstnerWave(wave2, gridPoint, tangent, binormal);
  displaced += gerstnerWave(wave3, gridPoint, tangent, binormal);

  // Compute precise normals based on displaced vertex structures
  vNormal = normalize(normalMatrix * cross(binormal, tangent));
  
  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  vViewPosition = -mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;
}

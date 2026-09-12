export interface AtmosphereShaderDef {
  vertexShader: string;
  fragmentShader: string;
}

export const AtmosphereShader: AtmosphereShaderDef = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      // Compute normal in camera eye space
      vNormal = normalize(normalMatrix * normal);
      // Eye-space position of vertex
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform vec3 uSunDirection;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec3 viewDir = normalize(-vPosition);
      vec3 normal = normalize(vNormal);

      // Rayleigh limb glow: strongest along planetary edges
      float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
      float intensity = pow(fresnel, 3.5) * 1.8;

      // Modulate intensity based on sun lighting angle
      float sunFactor = max(dot(normal, normalize(uSunDirection)), 0.0);
      intensity *= (sunFactor * 0.7 + 0.3);

      gl_FragColor = vec4(uColor, intensity);
    }
  `,
};

export default AtmosphereShader;
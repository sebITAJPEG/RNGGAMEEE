import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'

// 1. Define the Shader Material
const LiquidShaderMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(1.0, 0.8, 0.0), // Golden yellow base
    rimColor: new THREE.Color(1.0, 1.0, 0.8), // Brighter rim
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment Shader
  `
    uniform float time;
    uniform vec3 color;
    uniform vec3 rimColor;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    // Simple noise function
    float random (in vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    // 2D Noise based on Morgan McGuire @morgan3d
    float noise (in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(a, b, u.x) +
                (c - a)* u.y * (1.0 - u.x) +
                (d - b) * u.x * u.y;
    }

    void main() {
      // Distort UVs over time to create "swirl"
      vec2 distortedUv = vUv + vec2(
          noise(vUv * 3.0 + time * 0.5),
          noise(vUv * 3.0 - time * 0.3)
      ) * 0.1;

      // Create a liquid-like pattern
      float n = noise(distortedUv * 5.0 + time);
      
      // Fresnel effect for rim lighting (makes it look contained/glassy)
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - dot(viewDir, vNormal), 3.0);

      // Combine color, noise pattern, and rim light
      vec3 finalColor = mix(color, color * 1.2, n); // Mix base color with brighter version based on noise
      finalColor = mix(finalColor, rimColor, fresnel); // Add rim light

      gl_FragColor = vec4(finalColor, 0.9); // Slightly transparent
    }
  `
)

// 2. Register it so R3F knows about it
extend({ LiquidShaderMaterial })

// 3. TypeScript definitions (optional but recommended)
declare global {
  namespace JSX {
    interface IntrinsicElements {
      liquidShaderMaterial: any
    }
  }
}

export { LiquidShaderMaterial }
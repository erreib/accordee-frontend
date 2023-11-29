import { useRef } from 'react';

import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox,OrbitControls } from '@react-three/drei';

// Component representing a moving widget on the dashboard
const DashboardWidget = ({ initialPos, color, movementFactor }) => {
  const mesh = useRef();

  useFrame(({ clock }) => {
    if (mesh.current) {
      const time = clock.getElapsedTime();
      mesh.current.position.y = initialPos[1] + Math.sin(time * movementFactor) * 0.2;
      mesh.current.position.x = initialPos[0] + Math.sin(time * 0.5 * movementFactor) * 0.2;
      mesh.current.rotation.z = Math.sin(time * 0.2 * movementFactor);
      mesh.current.scale.x = 1 + Math.sin(time * 0.5 * movementFactor) * 0.1;
      mesh.current.scale.y = 1 + Math.cos(time * 0.5 * movementFactor) * 0.1;
    }
  });

  return (
    <RoundedBox ref={mesh} position={initialPos} args={[0.4, 0.4, 0.05]} radius={0.05} smoothness={4}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
      />
    </RoundedBox>
  );
};

// Component for the main dashboard
const DashboardPlane = () => {

  const fragmentShader = `
    varying vec2 vUv;

    void main() {
      vec3 color = mix(vec3(0.5, 0.0, 0.5), vec3(1.0, 0.0, 0.5), vUv.y);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const vertexShader = `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  return (
    <RoundedBox args={[3, 2, 0.1]} radius={0.1} smoothness={4}>
      <shaderMaterial
        attach="material"
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </RoundedBox>
  );
};


// Updated ThreeFiberScene component
const ThreeFiberScene = () => {
  return (
    <div className="three-fiber-container">
      <Canvas camera={{ position: [1, 1, 3], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[1, 2, 3]} intensity={1} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.2} /> {/* Use it directly here */}
        <group rotation={[-0.2, 0, 0]}>  {/* Tilting the dashboard back */}
          <DashboardPlane />
          <DashboardWidget initialPos={[-0.8, 0.6, 0.1]} color="#FF5733" movementFactor={1} />
          <DashboardWidget initialPos={[0.8, -0.6, 0.1]} color="#33FF57" movementFactor={1.2} />
          <DashboardWidget initialPos={[-0.8, -0.6, 0.1]} color="#3357FF" movementFactor={0.8} />
          <DashboardWidget initialPos={[0.8, 0.6, 0.1]} color="#FFFF33" movementFactor={1.1} />
        </group>
      </Canvas>
    </div>
  );
};

export default ThreeFiberScene;

// DynamicWave.js
import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function Wave() {
  // A simple rotating cube as a placeholder
  const meshRef = React.useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={'royalblue'} />
    </mesh>
  );
}

export default function DynamicWave() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Wave />
    </Canvas>
  );
}

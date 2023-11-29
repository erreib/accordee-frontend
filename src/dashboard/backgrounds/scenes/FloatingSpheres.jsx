import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

function Sphere({ position, color, amplitude }) {
  const meshRef = useRef();
  const initialPosition = useMemo(() => new Vector3(...position), [position]);

  useFrame(({ clock }) => {
    // Smooth transition logic
    const time = clock.getElapsedTime();
    meshRef.current.position.y = initialPosition.y + Math.sin(time) * amplitude;
    // Add more transitions here if needed, e.g., for x and z positions or rotation
  });

  return (
    <mesh ref={meshRef} position={initialPosition}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export default function FloatingSpheres() {
  // Create an array of sphere properties
  const spheres = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    position: [Math.random() * 5 - 2.5, Math.random() * 5 - 2.5, Math.random() * 5 - 2.5],
    color: `hsl(${Math.random() * 360}, 50%, 50%)`,
    amplitude: Math.random() * 1.5,
  })), []);

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {spheres.map((props, i) => <Sphere key={i} {...props} />)}
    </Canvas>
  );
}

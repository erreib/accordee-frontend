import React, { useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Particles = ({ count }) => {
  const mesh = useMemo(() => {
    const tempMesh = new THREE.Points();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 10; // x position
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10; // y position
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z position
    }

    tempMesh.geometry = new THREE.BufferGeometry();
    tempMesh.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    tempMesh.material = new THREE.PointsMaterial({ color: 'white', size: 0.1 });

    return tempMesh;
  }, [count]);

  useFrame(() => {
    mesh.rotation.x += 0.001;
    mesh.rotation.y += 0.001;
  });

  return <primitive object={mesh} />;
};

const ParticleAnimation = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.3} />
      <Particles count={5000} />
    </Canvas>
  );
};

export default ParticleAnimation;

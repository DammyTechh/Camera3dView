import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber/native';
import * as THREE from 'three';
import { useGestureHandler } from '@/hooks/useGestureHandler';

interface Image3DViewerProps {
  images: string[];
  onLoadComplete?: () => void;
}

export function Image3DViewer({ images, onLoadComplete }: Image3DViewerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [textures, setTextures] = useState<THREE.Texture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rotation, setRotation] = useState(new THREE.Vector3(0, 0, 0));
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState(new THREE.Vector3(0, 0, 0));

  const { panHandler, pinchHandler } = useGestureHandler({
    onRotate: (x, y) => setRotation(new THREE.Vector3(x, y, 0)),
    onScale: (newScale) => setScale(newScale),
    onTranslate: (x, y) => setPosition(new THREE.Vector3(x, y, 0)),
  });

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    Promise.all(images.map(img => loader.loadAsync(img)))
      .then(loadedTextures => {
        setTextures(loadedTextures);
        setIsLoading(false);
        onLoadComplete?.();
      })
      .catch(error => {
        console.error('Failed to load textures:', error);
        setIsLoading(false);
      });
  }, [images, onLoadComplete]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = rotation.x;
      meshRef.current.rotation.y = rotation.y;
      meshRef.current.scale.setScalar(scale);
      meshRef.current.position.set(position.x, position.y, 0);
    }
  });

  if (isLoading || textures.length === 0) {
    return null;
  }

  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <spotLight position={[-10, -10, -10]} intensity={0.5} />
      <mesh ref={meshRef} {...panHandler} {...pinchHandler}>
        <boxGeometry args={[1, 1, 1]} />
        {textures.map((texture, index) => (
          <meshStandardMaterial
            key={index}
            map={texture}
            roughness={0.3}
            metalness={0.2}
            attach={`material-${index}`}
          />
        ))}
      </mesh>
    </>
  );
}
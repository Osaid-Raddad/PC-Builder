import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import colors from '../../../config/colors';
import { FiUploadCloud, FiBox } from 'react-icons/fi';

function Model({ modelPath, rotation, scale, position }) {
  const { scene } = useGLTF(modelPath);
  const meshRef = useRef();
  
  // Auto-rotate only on Y axis
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });
  
  return (
    <group ref={meshRef} rotation={rotation} scale={scale} position={position}>
      <primitive object={scene} />
    </group>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={colors.mainYellow} wireframe />
    </mesh>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D Model Error:', error);
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

function ModelViewer({ 
  modelPath, 
  title, 
  description, 
  componentName,
  cameraPosition = [0, 0, 5],
  modelRotation = [0, 0, 0],
  modelScale = 1,
  modelPosition = [0, 0, 0],
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [modelPath]);

  return (
    <div 
      className="relative overflow-hidden rounded-2xl p-4 shadow-2xl h-full"
      style={{ backgroundColor: colors.mainBlack }}
    >
      {/* 3D Canvas */}
      <div 
        className="relative mb-4 rounded-xl overflow-hidden"
        style={{ height: '250px', backgroundColor: colors.mainBeige }}
      >
        {!hasError ? (
          <ErrorBoundary onError={handleError}>
            <Canvas shadows>
              <PerspectiveCamera makeDefault position={cameraPosition} />
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
              <spotLight position={[-10, 10, 5]} angle={0.3} intensity={0.5} />
              
              <Suspense fallback={<LoadingFallback />}>
                <Model 
                  modelPath={modelPath} 
                  rotation={modelRotation} 
                  scale={modelScale}
                  position={modelPosition}
                />
                <Environment preset="studio" />
              </Suspense>
              
              <OrbitControls 
                enablePan={true}
                enableZoom={true}
                autoRotate={false}
                target={modelPosition}
              />
            </Canvas>
          </ErrorBoundary>
        ) : (
          // Error/Missing Model Placeholder
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ 
              backgroundColor: 'rgba(0,0,0,0.8)',
            }}
          >
            <FiUploadCloud size={64} style={{ color: colors.mainYellow, marginBottom: '1rem' }} />
            <div className="text-white text-xl font-semibold mb-2">3D Model Not Available</div>
            <div className="text-gray-400 text-center px-4">
              Place <span style={{ color: colors.mainYellow }}>{modelPath.split('/').pop()}</span> in public/models/ folder
            </div>
          </div>
        )}
      </div>
      
      {/* Component Info */}
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2" style={{ color: colors.mainYellow }}>
          {title}
        </h3>
        <p className="text-sm mb-3" style={{ color: 'white', opacity: 0.9 }}>
          {description}
        </p>
        <div 
          className="inline-block px-4 py-1 rounded-full text-sm font-semibold"
          style={{ 
            backgroundColor: colors.mainYellow, 
            color: colors.mainBlack 
          }}
        >
          {componentName}
        </div>
      </div>
    </div>
  );
}

export default ModelViewer;

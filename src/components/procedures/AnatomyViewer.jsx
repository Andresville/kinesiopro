import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Center, Html } from '@react-three/drei';

function Model({ path }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} scale={1.5} />;
}

function Loader() {
  return (
    <Html center>
      <div className="viewer-loader">Cargando modelo...</div>
    </Html>
  );
}

const MODELS = [
  { id: 'anatomy', name: 'Cuerpo Completo (Masc)', path: '/anatomy.glb' },
  { id: 'muscles', name: 'Cuerpo Completo (Fem)', path: '/muscles.glb' },
  { id: 'hand', name: 'Anatomía de Brazo/Mano', path: '/hand_anatomy.glb' },
  { id: 'legs', name: 'Variaciones Musculares (Piernas)', path: '/legs_muscles.glb' }
];

export default function AnatomyViewer() {

  const [currentModel, setCurrentModel] = useState(MODELS[0].path);

  return (
    <div className="stack">

      <div className="viewer-toolbar">
        {MODELS.map((model) => (
          <button
            key={model.id}
            onClick={() => setCurrentModel(model.path)}
            className={`model-btn ${currentModel === model.path ? 'active' : ''}`}
          >
            {model.name}
          </button>
        ))}
      </div>

      <div className="viewer-canvas-wrap">
        <Canvas camera={{ position: [0, 1, 4], fov: 50 }}>
          
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
          <Environment preset="city" />

          <OrbitControls minDistance={1} maxDistance={8} />

          <Suspense fallback={<Loader />}>
            <Center>
              <Model key={currentModel} path={currentModel} />
            </Center>
          </Suspense>
          
        </Canvas>
      </div>
    </div>
  );
}
import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Center, Html } from '@react-three/drei';

// 1. Componente dinámico: ahora recibe la ruta exacta del archivo a cargar
function Model({ path }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} scale={1.5} />;
}

// 2. Pantalla de carga mejorada
function Loader() {
  return (
    <Html center>
      <div style={{ 
        color: '#85B7EB', 
        fontWeight: 'bold', 
        whiteSpace: 'nowrap', 
        background: 'rgba(16, 24, 40, 0.8)', 
        padding: '12px 24px', 
        borderRadius: '8px',
        border: '1px solid #185FA5'
      }}>
        Cargando modelo...
      </div>
    </Html>
  );
}

// 3. El lienzo principal y la botonera
export default function AnatomyViewer() {
  // Estado para controlar qué modelo estamos viendo (arranca con el esqueleto base)
  const [currentModel, setCurrentModel] = useState('/anatomy.glb');

  // Nuestra "base de datos" de modelos locales
  const models = [
    { id: 'anatomy', name: 'Cuerpo Completo (Masc)', path: '/anatomy.glb' },
    { id: 'muscles', name: 'Cuerpo Completo (Fem)', path: '/muscles.glb' },
    { id: 'hand', name: 'Anatomía de Brazo/Mano', path: '/hand_anatomy.glb' },
    { id: 'legs', name: 'Variaciones Musculares (Piernas)', path: '/legs_muscles.glb' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Botonera de selección de modelos */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => setCurrentModel(model.path)}
            style={{
              padding: '8px 16px',
              background: currentModel === model.path ? '#185FA5' : '#eaecf0',
              color: currentModel === model.path ? 'white' : '#475467',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              transition: 'all 0.2s ease',
              boxShadow: currentModel === model.path ? '0 2px 4px rgba(24, 95, 165, 0.3)' : 'none'
            }}
          >
            {model.name}
          </button>
        ))}
      </div>

      {/* Contenedor del visor 3D */}
      <div style={{ 
        width: '100%', 
        height: '65vh', 
        minHeight: '450px', 
        borderRadius: 'var(--border-radius-lg)', 
        overflow: 'hidden', 
        border: '1px solid var(--color-border-tertiary)', 
        background: '#101828' 
      }}>
        <Canvas camera={{ position: [0, 1, 4], fov: 50 }}>
          
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
          <Environment preset="city" />

          {/* minDistance evita que te metas adentro del modelo, maxDistance evita que te vayas muy lejos */}
          <OrbitControls minDistance={1} maxDistance={8} />

          <Suspense fallback={<Loader />}>
            <Center>
              {/* Al pasarle un 'key' distinto, React destruye y vuelve a crear el componente limpiamente */}
              <Model key={currentModel} path={currentModel} />
            </Center>
          </Suspense>
          
        </Canvas>
      </div>
    </div>
  );
}
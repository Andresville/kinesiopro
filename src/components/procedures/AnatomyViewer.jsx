import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Center, Html } from '@react-three/drei';
import { EdgesGeometry, LineBasicMaterial, LineSegments } from 'three';
import { IconX } from '@tabler/icons-react';

const HIGHLIGHT_COLOR = '#facc15';
const MODEL_PATH = '/upper-limb-anatomy.glb';

function InteractiveModel({ selectedMeshName, onSelect }) {
  const { scene } = useGLTF(MODEL_PATH);
  const outlineRef = useRef(null);

  // Este modelo usa extensiones PBR (clearcoat/specular/ior) que, con el
  // Environment de la escena a intensidad normal, renderizan casi negro.
  // Se atenúa el aporte del mapa de entorno mutando los materiales
  // originales directamente (sin clonarlos: clonarlos rompe estas
  // extensiones y también renderiza negro).
  useEffect(() => {
    const seen = new Set();
    scene.traverse((obj) => {
      if (obj.isMesh && obj.material && !seen.has(obj.material)) {
        seen.add(obj.material);
        if ('envMapIntensity' in obj.material) {
          obj.material.envMapIntensity = 0.3;
        }
      }
    });
  }, [scene]);

  // Resalta la malla seleccionada dibujando un contorno (EdgesGeometry) por
  // encima, sin tocar el material original.
  useEffect(() => {
    if (outlineRef.current) {
      outlineRef.current.parent?.remove(outlineRef.current);
      outlineRef.current.geometry.dispose();
      outlineRef.current.material.dispose();
      outlineRef.current = null;
    }

    if (!selectedMeshName) return undefined;

    let target = null;
    scene.traverse((obj) => {
      if (obj.isMesh && obj.name === selectedMeshName) target = obj;
    });
    if (!target) return undefined;

    const edges = new EdgesGeometry(target.geometry, 30);
    const outline = new LineSegments(
      edges,
      new LineBasicMaterial({ color: HIGHLIGHT_COLOR, depthTest: false })
    );
    outline.renderOrder = 999;
    target.add(outline);
    outlineRef.current = outline;

    return () => {
      target.remove(outline);
      edges.dispose();
    };
  }, [scene, selectedMeshName]);

  const handleClick = (event) => {
    if (!event.object.isMesh) return;
    event.stopPropagation();
    onSelect(event.object.name);
  };

  return <primitive object={scene} scale={2.8} onClick={handleClick} />;
}

function Loader() {
  return (
    <Html center>
      <div className="viewer-loader">Cargando modelo...</div>
    </Html>
  );
}

// Replica PropertyBinding.sanitizeNodeName() de three.js: al cargar el GLB,
// three.js reemplaza espacios por "_" y elimina (no reemplaza) [ ] . : /
// de mesh.name. Los nombres guardados en Supabase son los originales del
// archivo (legibles), así que hay que sanitizarlos igual para poder
// compararlos contra los nombres reales en tiempo de ejecución.
function sanitizeNodeName(name) {
  return name.replace(/\s/g, '_').replace(/[[\].:/]/g, '');
}

function prettifyMeshName(name) {
  // Revierte el patrón de este dataset: los nombres originales terminan en
  // ".r" (lado derecho); tras sanitizar, esa "r" queda pegada a la palabra
  // anterior (ej. "muscle.r" -> "muscler"). Se quita esa "r" final como
  // mejor esfuerzo para estructuras que todavía no tienen ficha en español.
  const spaced = name.replace(/_/g, ' ');
  const base = spaced.endsWith('r') ? spaced.slice(0, -1) : spaced;
  return base.charAt(0).toUpperCase() + base.slice(1);
}

export default function AnatomyViewer({ structures = [] }) {
  const [selectedMeshName, setSelectedMeshName] = useState(null);

  const structureByMeshName = useMemo(() => {
    const map = new Map();
    structures.forEach((structure) => {
      (structure.mesh_names ?? []).forEach((meshName) =>
        map.set(sanitizeNodeName(meshName), structure)
      );
    });
    return map;
  }, [structures]);

  const selectedStructure = selectedMeshName ? structureByMeshName.get(selectedMeshName) : null;

  return (
    <div className="stack">

      <div className="viewer-canvas-wrap">
        <Canvas camera={{ position: [0, 1, 4], fov: 50 }}>

          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
          <Environment preset="city" />

          <OrbitControls minDistance={0.3} maxDistance={8} />

          <Suspense fallback={<Loader />}>
            <Center>
              <InteractiveModel
                selectedMeshName={selectedMeshName}
                onSelect={setSelectedMeshName}
              />
            </Center>
          </Suspense>

        </Canvas>

        {selectedMeshName && (
          <div className="anatomy-info-panel">
            <button
              className="modal-close"
              onClick={() => setSelectedMeshName(null)}
              aria-label="Cerrar"
            >
              <IconX size={18} />
            </button>

            {selectedStructure ? (
              <>
                <span className={`tag ${selectedStructure.type === 'Hueso' ? 'tag-blue' : 'tag-teal'}`}>
                  {selectedStructure.type}
                </span>
                <div className="proc-name" style={{ marginTop: '8px' }}>
                  {selectedStructure.display_name}
                </div>
                <p className="card-text">{selectedStructure.description}</p>
                {selectedStructure.sources?.length > 0 && (
                  <ul className="source-list">
                    {selectedStructure.sources.map((source, index) => (
                      <li key={index}>{source}</li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <>
                <div className="proc-name" style={{ marginTop: '8px' }}>
                  {prettifyMeshName(selectedMeshName)}
                </div>
                <p className="card-text">Descripción no disponible todavía para esta estructura.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

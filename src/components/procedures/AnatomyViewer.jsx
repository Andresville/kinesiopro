import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Center, Html } from '@react-three/drei';
import { EdgesGeometry, LineBasicMaterial, LineSegments } from 'three';
import { IconX } from '@tabler/icons-react';

const HIGHLIGHT_COLOR = '#facc15';
const MODEL_PATH = '/upper-limb-anatomy.glb';

const TYPE_TAG_CLASS = {
  Hueso: 'tag-blue',
  Musculo: 'tag-teal',
  Ligamento: 'tag-purple',
  Nervio: 'tag-amber',
  Vaso: 'tag-amber',
  Cartilago: 'tag-purple',
};

// El modelo agrupa sus mallas en nodos padre "<Región> - <sistema>" (ej.
// "Arm - muscles", "Forearm - bones"). Cada sistema se repite en las 7
// regiones cubiertas (Arm, Forearm, Hand and wrist, Pectoral girdle, Back,
// Thorax, Head and neck). Se arma un toggle de visibilidad por sistema,
// aplicado a todas las regiones a la vez.
const LAYERS = [
  { key: 'bones', label: 'Huesos', suffix: '_-_bones', defaultOn: true },
  { key: 'muscles', label: 'Músculos', suffix: '_-_muscles', defaultOn: false },
  { key: 'joints', label: 'Articulaciones', suffix: '_-_capsules,_ligaments,_fasciae', defaultOn: false },
  { key: 'nerves', label: 'Nervios', suffix: '_-_nerves', defaultOn: false },
  { key: 'arteries', label: 'Arterias', suffix: '_-_arteries', defaultOn: false },
  { key: 'veins', label: 'Venas', suffix: '_-_veins', defaultOn: false },
  { key: 'cartilages', label: 'Cartílagos', suffix: '_-_cartilages', defaultOn: false },
  { key: 'synovia', label: 'Bursas y sinovial', suffix: '_-_synovia,_bursae', defaultOn: false },
];

const DEFAULT_VISIBLE_LAYERS = new Set(
  LAYERS.filter((layer) => layer.defaultOn).map((layer) => layer.key)
);

function InteractiveModel({ selectedMeshName, onSelect, visibleLayers }) {
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

  // Agrupa los nodos padre de cada región por sistema (huesos, músculos,
  // etc.) una sola vez, para poder togglear su visibilidad después.
  const groupNodesByLayer = useMemo(() => {
    const map = new Map(LAYERS.map((layer) => [layer.key, []]));
    scene.traverse((obj) => {
      const layer = LAYERS.find((l) => obj.name.endsWith(l.suffix));
      if (layer) map.get(layer.key).push(obj);
    });
    return map;
  }, [scene]);

  useEffect(() => {
    groupNodesByLayer.forEach((nodes, key) => {
      const visible = visibleLayers.has(key);
      nodes.forEach((node) => {
        node.visible = visible;
      });
    });
  }, [groupNodesByLayer, visibleLayers]);

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

  // El raycaster de three.js no respeta `.visible`: una malla oculta por un
  // toggle de capa sigue siendo detectable si está más cerca de la cámara
  // que la malla visible debajo. Se recorre event.intersections (todos los
  // impactos del rayo, ordenados por distancia) y se toma el primero que
  // esté realmente visible, subiendo por toda la cadena de padres.
  const isEffectivelyVisible = (object) => {
    let node = object;
    while (node) {
      if (!node.visible) return false;
      node = node.parent;
    }
    return true;
  };

  const handleClick = (event) => {
    event.stopPropagation();
    const hit = event.intersections.find(
      (intersection) => intersection.object.isMesh && isEffectivelyVisible(intersection.object)
    );
    if (!hit) return;
    onSelect(hit.object.name);
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
  const [visibleLayers, setVisibleLayers] = useState(DEFAULT_VISIBLE_LAYERS);

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

  const toggleLayer = (key) => {
    setVisibleLayers((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="stack">

      <div className="viewer-toolbar">
        {LAYERS.map((layer) => (
          <button
            key={layer.key}
            onClick={() => toggleLayer(layer.key)}
            className={`layer-toggle ${visibleLayers.has(layer.key) ? 'active' : ''}`}
          >
            {layer.label}
          </button>
        ))}
      </div>

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
                visibleLayers={visibleLayers}
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
                <span className={`tag ${TYPE_TAG_CLASS[selectedStructure.type] ?? 'tag-teal'}`}>
                  {selectedStructure.type}
                </span>
                <div className="proc-name" style={{ marginTop: '8px' }}>
                  {selectedStructure.display_name}
                </div>
                <p className="card-text">{selectedStructure.description}</p>
                {selectedStructure.clinical_relevance?.length > 0 && (
                  <>
                    <div className="detail-card-title detail-card-title--danger" style={{ marginTop: '12px', fontSize: '13px' }}>
                      Relevancia clínica
                    </div>
                    <ul className="step-list">
                      {selectedStructure.clinical_relevance.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </>
                )}
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

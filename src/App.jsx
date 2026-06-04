import { useEffect, useState } from "react";
import { supabase } from "./services/supabase";
import MainLayout from "./components/layout/MainLayout";
import ProcedureCard from "./components/procedures/ProcedureCard";
import DetailPanel from "./components/procedures/DetailPanel";
import AnatomyViewer from "./components/procedures/AnatomyViewer";
import ProtocolsView from "./components/protocols/ProtocolsView";
import VideoGuidesView from "./components/videos/VideoGuidesView";

function App() {
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProcedure, setSelectedProcedure] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);

  const [activeView, setActiveView] = useState("procedures");
  const [crossLinkedVideo, setCrossLinkedVideo] = useState(null);

  useEffect(() => {
    async function fetchProcedures() {
      const { data, error } = await supabase.from("procedures").select("*");
      if (!error) {
        setProcedures(data);
      }
      setLoading(false);
    }
    fetchProcedures();
  }, []);

  const handleCardClick = (procedure) => {
    setSelectedProcedure(procedure);
  };

  const filteredProcedures = procedures.filter((proc) => {
    const matchesSearch =
      proc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.category.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (selectedFilter === "Columna")
      matchesFilter = proc.region.includes("Columna");
    if (selectedFilter === "Hombro")
      matchesFilter = proc.region.includes("Hombro");
    if (selectedFilter === "Rodilla")
      matchesFilter = proc.region.includes("Rodilla");
    if (selectedFilter === "Neurológico")
      matchesFilter =
        proc.region.includes("Sistema Nervioso") ||
        proc.category.includes("Neuro");

    return matchesSearch && matchesFilter;
  });

  const handleGoToVideo = (procedure) => {
    setSelectedProcedure(null); 
    setCrossLinkedVideo(procedure); 
    setActiveView("videos"); 
  };

  return (
    <MainLayout
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      selectedFilter={selectedFilter}
      setSelectedFilter={setSelectedFilter}
      activeView={activeView} 
      setActiveView={setActiveView} 
    >
      {activeView === "procedures" && (
        <>
          <div className="section-title">Biblioteca de Procedimientos</div>
          {loading ? (
            <p style={{ color: "var(--color-text-secondary)" }}>
              Cargando base clínica...
            </p>
          ) : (
            <div className="card-grid">
              {filteredProcedures.length > 0 ? (
                filteredProcedures.map((proc) => (
                  <ProcedureCard
                    key={proc.id}
                    procedure={proc}
                    onClick={handleCardClick}
                  />
                ))
              ) : (
                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    gridColumn: "1 / -1",
                  }}
                >
                  No se encontraron procedimientos con esos filtros.
                </p>
              )}
            </div>
          )}
          <DetailPanel
            procedure={selectedProcedure}
            onClose={() => setSelectedProcedure(null)}
            onGoToVideo={handleGoToVideo}
          />
        </>
      )}

      {activeView === "anatomy" && (
        <>
          <div className="section-title">Visor Anatómico Interactivo</div>
          <p
            style={{
              fontSize: "13px",
              color: "var(--color-text-secondary)",
              marginBottom: "16px",
            }}
          >
            Interactúa con el modelo usando el mouse o gestos táctiles para
            rotar y hacer zoom.
          </p>
          <AnatomyViewer />
        </>
      )}

      {activeView === "protocols" && (
        <ProtocolsView 
          searchTerm={searchTerm} 
          selectedFilter={selectedFilter} 
        />
      )}
      
      {activeView === "videos" && (
        <VideoGuidesView
          externalSelectedVideo={crossLinkedVideo}
          setExternalSelectedVideo={setCrossLinkedVideo}
          searchTerm={searchTerm} 
          selectedFilter={selectedFilter}
        />
      )}
    </MainLayout>
  );
}

export default App;

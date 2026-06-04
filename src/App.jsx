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
    const term = searchTerm.toLowerCase();

    return (
      (proc.title && proc.title.toLowerCase().includes(term)) ||
      (proc.region && proc.region.toLowerCase().includes(term)) ||
      (proc.category && proc.category.toLowerCase().includes(term))
    );
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
                  No se encontraron procedimientos con esos parámetros.
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
        <ProtocolsView searchTerm={searchTerm} />
      )}
      
      {activeView === "videos" && (
        <VideoGuidesView
          externalSelectedVideo={crossLinkedVideo}
          setExternalSelectedVideo={setCrossLinkedVideo}
          searchTerm={searchTerm} 
        />
      )}
    </MainLayout>
  );
}

export default App;


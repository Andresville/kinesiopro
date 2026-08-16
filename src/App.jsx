import { useMemo, useState } from "react";
import { useSupabaseTable } from "./hooks/useSupabaseTable";
import { filterBySearch } from "./lib/search";
import MainLayout from "./components/layout/MainLayout";
import ProcedureCard from "./components/procedures/ProcedureCard";
import DetailPanel from "./components/procedures/DetailPanel";
import AnatomyViewer from "./components/procedures/AnatomyViewer";
import ProtocolsView from "./components/protocols/ProtocolsView";
import VideoGuidesView from "./components/videos/VideoGuidesView";
import BibliographyView from "./components/bibliography/BibliographyView";

const PROCEDURE_SEARCH_FIELDS = ["title", "region", "category"];

function App() {
  const { data: procedures, loading, error } = useSupabaseTable("procedures");
  const {
    data: protocols,
    loading: protocolsLoading,
    error: protocolsError,
  } = useSupabaseTable("protocols");
  const {
    data: bibliographyTopics,
    loading: bibliographyLoading,
    error: bibliographyError,
  } = useSupabaseTable("bibliography_topics");
  const { data: anatomyStructures } = useSupabaseTable("anatomy_structures");
  const [selectedProcedure, setSelectedProcedure] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [activeView, setActiveView] = useState("procedures");
  const [crossLinkedVideo, setCrossLinkedVideo] = useState(null);

  const handleCardClick = (procedure) => {
    setSelectedProcedure(procedure);
  };

  const filteredProcedures = useMemo(
    () => filterBySearch(procedures, searchTerm, PROCEDURE_SEARCH_FIELDS),
    [procedures, searchTerm]
  );

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
            <p className="loading-text">Cargando base clínica...</p>
          ) : error ? (
            <p className="error-state">
              No se pudo cargar la base clínica. Intentá de nuevo más tarde.
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
                <p className="empty-state">
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
          <p className="section-subtitle section-subtitle--tight">
            Rotá y hacé zoom con el mouse o gestos táctiles. Hacé clic sobre
            un músculo o hueso para ver su nombre y descripción.
          </p>
          <AnatomyViewer structures={anatomyStructures} />
        </>
      )}

      {activeView === "protocols" && (
        <ProtocolsView
          protocols={protocols}
          loading={protocolsLoading}
          error={protocolsError}
          searchTerm={searchTerm}
        />
      )}

      {activeView === "videos" && (
        <VideoGuidesView
          procedures={procedures}
          loading={loading}
          error={error}
          externalSelectedVideo={crossLinkedVideo}
          setExternalSelectedVideo={setCrossLinkedVideo}
          searchTerm={searchTerm}
        />
      )}

      {activeView === "bibliography" && (
        <BibliographyView
          topics={bibliographyTopics}
          loading={bibliographyLoading}
          error={bibliographyError}
          searchTerm={searchTerm}
        />
      )}
    </MainLayout>
  );
}

export default App;


import { useEffect, useState } from 'react';
import { supabase } from './services/supabase';
import MainLayout from './components/layout/MainLayout';
import ProcedureCard from './components/procedures/ProcedureCard';
import DetailPanel from './components/procedures/DetailPanel';

function App() {
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  
  // Nuevos estados para los filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(null);

  useEffect(() => {
    async function fetchProcedures() {
      const { data, error } = await supabase.from('procedures').select('*');
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

  // Lógica de filtrado
  const filteredProcedures = procedures.filter((proc) => {
    // Filtro por texto (busca en título, región o categoría)
    const matchesSearch = 
      proc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.category.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por etiquetas
    let matchesFilter = true;
    if (selectedFilter === 'Columna') matchesFilter = proc.region.includes('Columna');
    if (selectedFilter === 'Hombro') matchesFilter = proc.region.includes('Hombro');
    if (selectedFilter === 'Rodilla') matchesFilter = proc.region.includes('Rodilla');
    if (selectedFilter === 'Neurológico') matchesFilter = proc.region.includes('Sistema Nervioso') || proc.category.includes('Neuro');

    return matchesSearch && matchesFilter;
  });

  return (
    // Pasamos los estados y funciones hacia abajo
    <MainLayout 
      searchTerm={searchTerm} 
      setSearchTerm={setSearchTerm}
      selectedFilter={selectedFilter}
      setSelectedFilter={setSelectedFilter}
    >
      <div className="section-title">Biblioteca de Procedimientos</div>
      
      {loading ? (
        <p style={{ color: 'var(--color-text-secondary)' }}>Cargando base clínica...</p>
      ) : (
        <div className="card-grid">
          {/* Mapeamos el array filtrado en lugar del original */}
          {filteredProcedures.length > 0 ? (
            filteredProcedures.map((proc) => (
              <ProcedureCard 
                key={proc.id} 
                procedure={proc} 
                onClick={handleCardClick} 
              />
            ))
          ) : (
            <p style={{ color: 'var(--color-text-secondary)', gridColumn: '1 / -1' }}>
              No se encontraron procedimientos con esos filtros.
            </p>
          )}
        </div>
      )}

      <DetailPanel 
        procedure={selectedProcedure} 
        onClose={() => setSelectedProcedure(null)} 
      />
    </MainLayout>
  );
}

export default App;
import { useEffect, useState } from 'react';
import { supabase } from './services/supabase';
import MainLayout from './components/layout/MainLayout';
import ProcedureCard from './components/procedures/ProcedureCard';
import DetailPanel from './components/procedures/DetailPanel';

function App() {
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProcedure, setSelectedProcedure] = useState(null); // Nuevo estado para la selección

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
    // Para probar que funciona:
    console.log("Procedimiento seleccionado:", procedure.title);
  };

  return (
    <MainLayout>
      <div className="section-title">Biblioteca de Procedimientos</div>
      
      {loading ? (
        <p style={{ color: 'var(--color-text-secondary)' }}>Cargando base clínica...</p>
      ) : (
        <div className="card-grid">
          {procedures.map((proc) => (
            <ProcedureCard 
              key={proc.id} 
              procedure={proc} 
              onClick={handleCardClick} 
            />
          ))}
        </div>
      )}

      {selectedProcedure && (
        <DetailPanel 
        procedure={selectedProcedure} 
        onClose={() => setSelectedProcedure(null)} 
      />
      )}
    </MainLayout>
  );
}

export default App;

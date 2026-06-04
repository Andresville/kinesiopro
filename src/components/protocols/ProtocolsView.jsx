import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { IconClock, IconStretching, IconX, IconClipboardList } from '@tabler/icons-react';

export default function ProtocolsView({ searchTerm = "", selectedFilter = null }) {
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProtocol, setSelectedProtocol] = useState(null);

  // Traer los datos de Supabase
  useEffect(() => {
    async function fetchProtocols() {
      const { data, error } = await supabase.from('protocols').select('*');
      
      if (error) {
        console.error("Error de Supabase:", error);
      } else {
        console.log("Datos recibidos:", data);
        setProtocols(data);
      }
      
      setLoading(false);
    }
    fetchProtocols();
  }, []);

  // LÓGICA DE FILTRADO
  const filteredProtocols = protocols.filter((protocol) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (protocol.title && protocol.title.toLowerCase().includes(term)) ||
      (protocol.category && protocol.category.toLowerCase().includes(term));
    
    let matchesFilter = true;
    if (selectedFilter) {
      // Buscamos en categoría o título para que coincida con las pastillas
      const filterLower = selectedFilter.toLowerCase();
      matchesFilter = 
        (protocol.category && protocol.category.toLowerCase().includes(filterLower)) ||
        (protocol.title && protocol.title.toLowerCase().includes(filterLower));
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="section-title">Protocolos Clínicos Estándar</div>
      <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
        Planes de tratamiento estructurados por fases para patologías frecuentes.
      </p>

      {loading ? (
        <p style={{ color: 'var(--color-text-secondary)' }}>Cargando protocolos...</p>
      ) : (
        <div className="card-grid">
          {filteredProtocols.length > 0 ? (
            filteredProtocols.map((protocol) => (
              <div 
                key={protocol.id} 
                className="proc-card" 
                onClick={() => setSelectedProtocol(protocol)}
              >
                <div className="proc-img" style={{ background: '#EEEDFE', color: '#3C3489' }}>
                  <IconClipboardList size={40} />
                </div>
                <div className="proc-name">{protocol.title}</div>
                <div className="proc-meta" style={{ marginBottom: '8px' }}>
                  {protocol.author}
                </div>
                <span className="tag tag-purple">
                  <IconClock size={12} style={{ marginRight: '4px', display: 'inline' }}/> 
                  {protocol.estimated_time}
                </span>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--color-text-secondary)', gridColumn: '1 / -1' }}>No se encontraron protocolos con esos filtros.</p>
          )}
        </div>
      )}

      {selectedProtocol && (
        <div className="modal-overlay" onClick={() => setSelectedProtocol(null)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ backgroundColor: '#e0e2dd' }}
          >
            
            <button className="modal-close" onClick={() => setSelectedProtocol(null)}>
              <IconX size={24} />
            </button>

            <div className="section-title" style={{ marginTop: '0', fontSize: '18px' }}>
              {selectedProtocol.title}
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px', marginTop: '12px' }}>
              <span className="tag tag-blue">{selectedProtocol.category}</span>
              <span className="tag" style={{ background: '#f8f9fa', color: '#475467', border: '1px solid #eaecf0' }}>
                <IconStretching size={14} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }}/> 
                {selectedProtocol.author}
              </span>
              <span className="tag" style={{ background: '#f8f9fa', color: '#475467', border: '1px solid #eaecf0' }}>
                <IconClock size={14} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }}/> 
                {selectedProtocol.estimated_time}
              </span>
            </div>

            <div className="detail-card">
              <div className="detail-card-title">
                <IconClipboardList color="#185FA5" size={20} /> 
                Fases de Rehabilitación
              </div>
              
              <div className="timeline" style={{ marginTop: '16px' }}>
                {selectedProtocol.phases.map((phase, index) => (
                  <div key={index} className="phase-item">
                    <div className="phase-dot" style={{ top: '2px' }}></div>
                    <div className="phase-title" style={{ fontSize: '15px' }}>{phase.name}</div>
                    <div className="phase-duration" style={{ color: '#475467', marginBottom: '8px' }}>
                      {phase.duration}
                    </div>

                    <div className="phase-content" style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-border-tertiary)' }}>
                      <strong>Objetivos y acciones:</strong> <br/>
                      <span style={{ color: 'var(--color-text-secondary)', marginTop: '4px', display: 'block' }}>
                        {phase.goals}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

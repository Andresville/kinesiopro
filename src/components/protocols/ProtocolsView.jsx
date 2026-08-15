import { useMemo, useState } from 'react';
import { filterBySearch } from '../../lib/search';
import { IconClock, IconStretching, IconX, IconClipboardList } from '@tabler/icons-react';

const PROTOCOL_SEARCH_FIELDS = ['title', 'category'];

export default function ProtocolsView({ protocols, loading, error, searchTerm = "" }) {
  const [selectedProtocol, setSelectedProtocol] = useState(null);

  const filteredProtocols = useMemo(
    () => filterBySearch(protocols, searchTerm, PROTOCOL_SEARCH_FIELDS),
    [protocols, searchTerm]
  );

  return (
    <div>
      <div className="section-title">Protocolos Clínicos Estándar</div>
      <p className="section-subtitle">
        Planes de tratamiento estructurados por fases para patologías frecuentes.
      </p>

      {loading ? (
        <p className="loading-text">Cargando protocolos...</p>
      ) : error ? (
        <p className="error-state">No se pudieron cargar los protocolos. Intentá de nuevo más tarde.</p>
      ) : (
        <div className="card-grid">
          {filteredProtocols.length > 0 ? (
            filteredProtocols.map((protocol) => (
              <div
                key={protocol.id}
                className="proc-card"
                onClick={() => setSelectedProtocol(protocol)}
              >
                <div className="proc-img purple">
                  <IconClipboardList size={40} />
                </div>
                <div className="proc-name">{protocol.title}</div>
                <div className="proc-meta">
                  {protocol.author}
                </div>
                <span className="tag tag-purple">
                  <IconClock size={12} className="tag-icon"/>
                  {protocol.estimated_time}
                </span>
              </div>
            ))
          ) : (
            <p className="empty-state">No se encontraron protocolos con esos filtros.</p>
          )}
        </div>
      )}

      {selectedProtocol && (
        <div className="modal-overlay" onClick={() => setSelectedProtocol(null)}>
          <div className="modal-content modal-content--muted" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProtocol(null)}>
              <IconX size={24} />
            </button>

            <div className="section-title modal-title">
              {selectedProtocol.title}
            </div>

            <div className="protocol-tags">
              <span className="tag tag-blue">{selectedProtocol.category}</span>
              <span className="tag tag-neutral">
                <IconStretching size={14} className="tag-icon"/>
                {selectedProtocol.author}
              </span>
              <span className="tag tag-neutral">
                <IconClock size={14} className="tag-icon"/>
                {selectedProtocol.estimated_time}
              </span>
            </div>

            <div className="detail-card">
              <div className="detail-card-title detail-card-title--accent">
                <IconClipboardList color="#185FA5" size={20} />
                Fases de Rehabilitación
              </div>

              <div className="timeline">
                {(selectedProtocol.phases ?? []).map((phase, index) => (
                  <div key={index} className="phase-item">
                    <div className="phase-dot"></div>
                    <div className="phase-title">{phase.name}</div>
                    <div className="phase-duration">
                      {phase.duration}
                    </div>
                    <div className="phase-content">
                      <strong>Objetivos y acciones:</strong> <br/>
                      <span className="phase-goals">
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


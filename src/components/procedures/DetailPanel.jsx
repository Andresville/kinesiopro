import { IconListNumbers, IconAlertTriangle, IconExternalLink, IconBook, IconX } from '@tabler/icons-react';

export default function DetailPanel({ procedure, onClose }) {
  if (!procedure) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* e.stopPropagation() evita que al hacer clic dentro de la tarjeta se cierre el modal */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#e0e2dd' }}>
        
        {/* Botón de Cerrar */}
        <button className="modal-close" onClick={onClose} aria-label="Cerrar modal">
          <IconX size={24} />
        </button>

        <div className="section-title" style={{ marginTop: '0' }}>
          Detalle del procedimiento: {procedure.title}
        </div>
        
        <div className="detail-panel" style={{ marginTop: '24px' }}>
          
          {/* Columna Izquierda: Pasos del procedimiento */}
          <div className="detail-card">
            <div className="detail-card-title">
              <IconListNumbers color="#185FA5" size={20} /> 
              Pasos del protocolo
            </div>
            <ul className="step-list">
              {procedure.steps.map((step, index) => (
                <li key={index}>
                  <span className="step-num">{index + 1}</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          {/* Columna Derecha: Contraindicaciones y Evidencia */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Tarjeta de Seguridad (Roja) */}
            <div className="detail-card" style={{ borderColor: '#FECDCA', background: '#FEF3F2' }}>
              <div className="detail-card-title" style={{ color: '#B42318' }}>
                <IconAlertTriangle color="#B42318" size={20} /> 
                Contraindicaciones
              </div>
              <ul className="contra-list">
                {procedure.contraindications.map((item, index) => (
                  <li key={index}>
                    <span style={{ fontSize: '18px', lineHeight: '0.8' }}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tarjeta de Bibliografía */}
            <div className="detail-card">
              <div className="detail-card-title">
                <IconBook color="#475467" size={20} />
                Bibliografía de respaldo
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '8px 0' }}>
                Nivel de evidencia clínica: <strong>{procedure.evidence_level}</strong>
              </p>
              <a 
                href={procedure.source_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="source-link"
              >
                <IconExternalLink size={16} />
                Consultar fuente original
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
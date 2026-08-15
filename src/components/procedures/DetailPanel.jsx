import {
  IconListNumbers,
  IconAlertTriangle,
  IconExternalLink,
  IconBook,
  IconX,
  IconPlayerPlayFilled,
} from "@tabler/icons-react";

export default function DetailPanel({ procedure, onClose, onGoToVideo }) {
  if (!procedure) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-content--muted"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          <IconX size={24} />
        </button>

        <div className="section-title modal-title">
          DETALLE DEL PROCEDIMIENTO: {procedure.title.toUpperCase()}
        </div>

        <div className="detail-panel">

          <div className="detail-card">
            <div className="detail-card-title">
              <IconListNumbers color="#185FA5" size={20} />
              Pasos del protocolo
            </div>
            <ul className="step-list">
              {(procedure.steps ?? []).map((step, index) => (
                <li key={index}>
                  <span className="step-num">{index + 1}</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <div className="stack">
            <div className="detail-card detail-card--danger">
              <div className="detail-card-title detail-card-title--danger">
                <IconAlertTriangle color="#B42318" size={20} />
                Contraindicaciones
              </div>
              <ul className="contra-list">
                {(procedure.contraindications ?? []).map((item, index) => (
                  <li key={index}>
                    <span className="contra-bullet">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="detail-card">
              <div className="detail-card-title">
                <IconBook color="#475467" size={20} />
                Bibliografía de respaldo
              </div>
              <p className="evidence-text">
                Nivel de evidencia clínica:{" "}
                <strong>{procedure.evidence_level}</strong>
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
              {procedure.video_url && (
                <button
                  onClick={() => onGoToVideo(procedure)}
                  className="btn-primary"
                >
                  <IconPlayerPlayFilled size={18} />
                  Ver video explicativo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

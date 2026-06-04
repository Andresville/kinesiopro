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
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: "#e0e2dd" }}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          <IconX size={24} />
        </button>

        <div
          className="section-title"
          style={{ marginTop: "0", fontSize: "18px", marginBottom: "16px" }}
        >
          DETALLE DEL PROCEDIMIENTO: {procedure.title.toUpperCase()}
        </div>

        <div className="detail-panel" style={{ marginTop: "24px" }}>

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

          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div
              className="detail-card"
              style={{ borderColor: "#FECDCA", background: "#FEF3F2" }}
            >
              <div className="detail-card-title" style={{ color: "#B42318" }}>
                <IconAlertTriangle color="#B42318" size={20} />
                Contraindicaciones
              </div>
              <ul className="contra-list">
                {procedure.contraindications.map((item, index) => (
                  <li key={index}>
                    <span style={{ fontSize: "18px", lineHeight: "0.8" }}>
                      •
                    </span>
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
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--color-text-secondary)",
                  margin: "8px 0",
                }}
              >
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
              <button
                onClick={() => onGoToVideo(procedure)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#185FA5",
                  color: "white",
                  border: "none",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginBottom: "24px",
                  marginTop: "10px",
                }}
              >
                <IconPlayerPlayFilled size={18} />
                Ver video explicativo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

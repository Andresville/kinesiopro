import {
  IconActivityHeartbeat,
  IconLayoutGrid,
  IconBodyScan,
  IconClipboardList,
  IconVideo,
  IconUsers,
  IconBook,
  IconSettings,
} from "@tabler/icons-react";

export default function Sidebar({ activeView, setActiveView }) {
  return (
    <div className="sidebar">
      <div className="logo">
        <div className="logo-title">
          <IconActivityHeartbeat color="#185FA5" size={24} stroke={2} />
          KinesioPro
        </div>
        <div className="logo-sub">Plataforma clínica</div>
      </div>

      {/* Botón Procedimientos */}
      <div
        className={`nav-item ${activeView === "procedures" ? "active" : ""}`}
        onClick={() => setActiveView("procedures")}
      >
        <IconLayoutGrid size={20} /> Procedimientos
      </div>

      {/* Botón Anatomía 3D */}
      <div
        className={`nav-item ${activeView === "anatomy" ? "active" : ""}`}
        onClick={() => setActiveView("anatomy")}
      >
        <IconBodyScan size={20} /> Anatomía 3D
      </div>

      {/* Botón Protocolos */}
      <div
        className={`nav-item ${activeView === "protocols" ? "active" : ""}`}
        onClick={() => setActiveView("protocols")}
      >
        <IconClipboardList size={20} /> Protocolos
      </div>

      <div
        className={`nav-item ${activeView === "videos" ? "active" : ""}`}
        onClick={() => setActiveView("videos")}
      >
        <IconVideo size={20} /> Video guías
      </div>

      {/* Los siguientes módulos los dejamos inactivos por ahora */}
      <div className="nav-item">
        <IconUsers size={20} /> Pacientes
      </div>
      <div className="nav-item">
        <IconBook size={20} /> Bibliografía
      </div>
      <div className="nav-item">
        <IconSettings size={20} /> Configuración
      </div>
    </div>
  );
}

import { 
  IconActivityHeartbeat, 
  IconLayoutGrid, 
  IconBodyScan, 
  IconClipboardList, 
  IconVideo, 
  IconUsers, 
  IconBook, 
  IconSettings 
} from '@tabler/icons-react';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">
        <div className="logo-title">
          <IconActivityHeartbeat color="#185FA5" size={24} stroke={2} />
          KinesioPro
        </div>
        <div className="logo-sub">Plataforma clínica</div>
      </div>
      
      <div className="nav-item active">
        <IconLayoutGrid size={20} /> Procedimientos
      </div>
      <div className="nav-item">
        <IconBodyScan size={20} /> Anatomía 3D
      </div>
      <div className="nav-item">
        <IconClipboardList size={20} /> Protocolos
      </div>
      <div className="nav-item">
        <IconVideo size={20} /> Video guías
      </div>
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
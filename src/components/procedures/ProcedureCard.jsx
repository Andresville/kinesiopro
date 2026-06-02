import { IconStethoscope, IconBone, IconMassage, IconActivity } from '@tabler/icons-react';

export default function ProcedureCard({ procedure, onClick }) {
  // Función para determinar el color e ícono según la categoría clínica
  const getTheme = (category) => {
    if (category.includes('Terapia Manual')) return { color: 'blue', icon: <IconBone size={40} /> };
    if (category.includes('Ejercicio')) return { color: 'teal', icon: <IconActivity size={40} /> };
    if (category.includes('Neurodinamia')) return { color: 'purple', icon: <IconStethoscope size={40} /> };
    return { color: 'amber', icon: <IconMassage size={40} /> };
  };

  const theme = getTheme(procedure.category);

  return (
    <div className="proc-card" onClick={() => onClick(procedure)}>
      <div className={`proc-img ${theme.color}`}>
        {theme.icon}
      </div>
      <div className="proc-name">{procedure.title}</div>
      <div className="proc-meta" style={{ marginBottom: '8px' }}>
        {procedure.region} · {procedure.category}
      </div>
      {/* Usamos el nivel de evidencia como etiqueta */}
      <span className={`tag tag-${theme.color}`}>
        Evidencia: {procedure.evidence_level.split(' ')[0]}
      </span>
    </div>
  );
}
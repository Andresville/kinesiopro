import { IconSearch } from '@tabler/icons-react';

export default function Topbar({ searchTerm, setSearchTerm, selectedFilter, setSelectedFilter }) {
  
  // Función para activar/desactivar etiquetas
  const toggleFilter = (filter) => {
    if (selectedFilter === filter) {
      setSelectedFilter(null); // Si ya estaba activo, lo desactiva
    } else {
      setSelectedFilter(filter);
    }
  };

  // Estilo dinámico para opacar las etiquetas no seleccionadas
  const getTagOpacity = (tagName) => {
    if (!selectedFilter) return 1; // Si no hay filtro, todas brillan
    return selectedFilter === tagName ? 1 : 0.4;
  };

  return (
    <div className="topbar">
      <div className="search-box">
        <IconSearch size={18} color="#475467" />
        <input 
          type="text" 
          placeholder="Buscar técnica, músculo, patología..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <span 
        className="tag tag-blue" 
        style={{ cursor: 'pointer', opacity: getTagOpacity('Columna') }}
        onClick={() => toggleFilter('Columna')}
      >
        Columna
      </span>
      
      <span 
        className="tag tag-teal" 
        style={{ cursor: 'pointer', opacity: getTagOpacity('Hombro') }}
        onClick={() => toggleFilter('Hombro')}
      >
        Hombro
      </span>
      
      <span 
        className="tag tag-amber" 
        style={{ cursor: 'pointer', opacity: getTagOpacity('Rodilla') }}
        onClick={() => toggleFilter('Rodilla')}
      >
        Rodilla
      </span>
      
      <span 
        className="tag tag-purple" 
        style={{ cursor: 'pointer', opacity: getTagOpacity('Neurológico') }}
        onClick={() => toggleFilter('Neurológico')}
      >
        Neurológico
      </span>
    </div>
  );
}
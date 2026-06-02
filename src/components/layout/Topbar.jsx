import { IconSearch } from '@tabler/icons-react';

export default function Topbar() {
  return (
    <div className="topbar">
      <div className="search-box">
        <IconSearch size={18} color="#475467" />
        <input type="text" placeholder="Buscar técnica, músculo, patología..." />
      </div>
      <span className="tag tag-blue">Columna</span>
      <span className="tag tag-teal">Hombro</span>
      <span className="tag tag-amber">Rodilla</span>
      <span className="tag tag-purple">Neurológico</span>
    </div>
  );
}
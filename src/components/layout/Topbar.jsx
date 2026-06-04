import { IconSearch } from '@tabler/icons-react';

export default function Topbar({ searchTerm, setSearchTerm, selectedFilter, setSelectedFilter }) {
  
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
      
    </div>
  );
}
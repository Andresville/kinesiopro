import Sidebar from './Sidebar';
import Topbar from './Topbar';

// Recibimos las props destructuradas
export default function MainLayout({ children, searchTerm, setSearchTerm, selectedFilter, setSelectedFilter }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        {/* Le pasamos las props al Topbar */}
        <Topbar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
}
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function MainLayout({ 
  children, 
  searchTerm, 
  setSearchTerm, 
  activeView,      
  setActiveView   
}) {
  return (
    <div className="app-shell">

      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div className="main">
        <Topbar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
        />
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { IconPlayerPlayFilled, IconAlertTriangle, IconVolume, IconX } from '@tabler/icons-react';

export default function VideoGuidesView({ 
  externalSelectedVideo, 
  setExternalSelectedVideo,
  searchTerm = "", 
  selectedFilter = null 
}) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null); 

  useEffect(() => {
    if (externalSelectedVideo) {
      setSelectedVideo(externalSelectedVideo);
    }
  }, [externalSelectedVideo]);

  useEffect(() => {
    async function fetchVideos() {
      const { data, error } = await supabase.from('procedures').select('*').not('video_url', 'is', null);
      if (!error) setVideos(data);
      setLoading(false);
    }
    fetchVideos();
  }, []);

  const handleClose = () => {
    setSelectedVideo(null);
    if (setExternalSelectedVideo) setExternalSelectedVideo(null);
  };

  const filteredVideos = videos.filter((vid) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (vid.title && vid.title.toLowerCase().includes(term)) || 
      (vid.region && vid.region.toLowerCase().includes(term)) ||
      (vid.category && vid.category.toLowerCase().includes(term));
    
    let matchesFilter = true;
    if (selectedFilter === "Columna")
      matchesFilter = vid.region && vid.region.includes("Columna");
    if (selectedFilter === "Hombro")
      matchesFilter = vid.region && vid.region.includes("Hombro");
    if (selectedFilter === "Rodilla")
      matchesFilter = vid.region && vid.region.includes("Rodilla");
    if (selectedFilter === "Neurológico")
      matchesFilter =
        (vid.region && vid.region.includes("Sistema Nervioso")) ||
        (vid.category && vid.category.includes("Neuro"));

    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="section-title">Video Guías Clínicas</div>
      <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
        Demostraciones prácticas y consignas de ejecución para procedimientos técnicos.
      </p>

      {loading ? (
        <p style={{ color: 'var(--color-text-secondary)' }}>Cargando galería...</p>
      ) : (
        <div className="card-grid">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((vid) => (
              <div key={vid.id} className="proc-card" onClick={() => setSelectedVideo(vid)} style={{ padding: '0', overflow: 'hidden' }}>
                
                <div style={{ height: '140px', background: '#101828', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconPlayerPlayFilled size={40} color="rgba(255,255,255,0.8)" />
                  <span style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '11px', padding: '2px 6px', borderRadius: '4px' }}>
                    {vid.video_duration}
                  </span>
                </div>
                
                <div style={{ padding: '16px' }}>
                  <div className="proc-name" style={{ fontSize: '14px', marginBottom: '4px' }}>{vid.title}</div>
                  <span className="tag tag-blue">{vid.category}</span>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--color-text-secondary)', gridColumn: '1 / -1' }}>No se encontraron videos con esos filtros.</p>
          )}
        </div>
      )}

      {selectedVideo && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#ffffff', maxWidth: '800px', padding: '0', overflow: 'hidden' }}>
            
            <button className="modal-close" onClick={handleClose} style={{ zIndex: 10, background: 'white', borderRadius: '50%' }}>
              <IconX size={24} />
            </button>

            <div style={{ width: '100%', height: '400px', background: 'black' }}>
              <iframe 
                width="100%" 
                height="100%" 
                src={selectedVideo.video_url} 
                title={selectedVideo.title}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>

            <div style={{ padding: '24px' }}>
              <div className="section-title" style={{ marginTop: '0', fontSize: '20px' }}>
                {selectedVideo.title}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                <div className="detail-card" style={{ background: '#F8F9FA' }}>
                  <div className="detail-card-title" style={{ color: '#185FA5' }}>
                    <IconVolume size={18} style={{ marginRight: '6px' }}/> Consignas verbales
                  </div>
                  <p style={{ fontSize: '13px', color: '#475467', lineHeight: '1.6' }}>{selectedVideo.verbal_cues}</p>
                </div>

                <div className="detail-card" style={{ background: '#FEF3F2' }}>
                  <div className="detail-card-title" style={{ color: '#D92D20' }}>
                    <IconAlertTriangle size={18} style={{ marginRight: '6px' }}/> Errores comunes
                  </div>
                  <p style={{ fontSize: '13px', color: '#475467', lineHeight: '1.6' }}>{selectedVideo.common_errors}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

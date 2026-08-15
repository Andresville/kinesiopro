import { useMemo, useState } from 'react';
import { filterBySearch } from '../../lib/search';
import { IconPlayerPlayFilled, IconAlertTriangle, IconVolume, IconX } from '@tabler/icons-react';

const VIDEO_SEARCH_FIELDS = ['title', 'region', 'category'];

export default function VideoGuidesView({
  procedures,
  loading,
  error,
  externalSelectedVideo,
  setExternalSelectedVideo,
  searchTerm = ""
}) {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const displayedVideo = selectedVideo || externalSelectedVideo;

  const handleClose = () => {
    setSelectedVideo(null);
    if (setExternalSelectedVideo) setExternalSelectedVideo(null);
  };

  const videos = useMemo(
    () => procedures.filter((proc) => proc.video_url),
    [procedures]
  );

  const filteredVideos = useMemo(
    () => filterBySearch(videos, searchTerm, VIDEO_SEARCH_FIELDS),
    [videos, searchTerm]
  );

  return (
    <div>
      <div className="section-title">Video Guías Clínicas</div>
      <p className="section-subtitle">
        Demostraciones prácticas y consignas de ejecución para procedimientos técnicos.
      </p>

      {loading ? (
        <p className="loading-text">Cargando galería...</p>
      ) : error ? (
        <p className="error-state">No se pudo cargar la galería. Intentá de nuevo más tarde.</p>
      ) : (
        <div className="card-grid">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((vid) => (
              <div key={vid.id} className="proc-card video-card" onClick={() => setSelectedVideo(vid)}>

                <div className="video-thumb">
                  <IconPlayerPlayFilled size={40} color="rgba(255,255,255,0.8)" />
                  <span className="video-duration-badge">
                    {vid.video_duration}
                  </span>
                </div>

                <div className="video-card-body">
                  <div className="proc-name">{vid.title}</div>
                  <span className="tag tag-blue">{vid.category}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-state">No se encontraron videos con esos filtros.</p>
          )}
        </div>
      )}

      {displayedVideo && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-content modal-content--flush" onClick={(e) => e.stopPropagation()}>

            <button className="modal-close modal-close--floating" onClick={handleClose}>
              <IconX size={24} />
            </button>

            <div className="video-frame">
              <iframe
                width="100%"
                height="100%"
                src={displayedVideo.video_url}
                title={displayedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="video-info-panel">
              <div className="section-title modal-title modal-title--lg">
                {displayedVideo.title}
              </div>

              <div className="video-info-grid">
                <div className="detail-card">
                  <div className="detail-card-title detail-card-title--accent">
                    <IconVolume size={18} /> Consignas verbales
                  </div>
                  <p className="card-text">{displayedVideo.verbal_cues}</p>
                </div>

                <div className="detail-card detail-card--danger">
                  <div className="detail-card-title detail-card-title--danger">
                    <IconAlertTriangle size={18} /> Errores comunes
                  </div>
                  <p className="card-text">{displayedVideo.common_errors}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

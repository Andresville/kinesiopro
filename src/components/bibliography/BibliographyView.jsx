import { useMemo, useState } from 'react';
import { filterBySearch } from '../../lib/search';
import {
  IconBone,
  IconStretching,
  IconActivity,
  IconBolt,
  IconDroplet,
  IconArrowsMaximize,
  IconAlertTriangle,
  IconBooks,
  IconX,
  IconBook,
} from '@tabler/icons-react';

const BIBLIOGRAPHY_SEARCH_FIELDS = ['title', 'region'];

const SECTIONS = [
  { key: 'bones', title: 'Huesos', icon: IconBone, accent: true },
  { key: 'ligaments', title: 'Ligamentos', icon: IconStretching, accent: true },
  { key: 'muscles', title: 'Músculos', icon: IconActivity, accent: true },
  { key: 'nerves', title: 'Nervios', icon: IconBolt, accent: true },
  { key: 'vessels', title: 'Vasos sanguíneos', icon: IconDroplet, accent: true },
  { key: 'movements', title: 'Rango de movimiento', icon: IconArrowsMaximize, accent: true },
  { key: 'clinical_relevance', title: 'Relevancia clínica', icon: IconAlertTriangle, danger: true },
];

export default function BibliographyView({ topics, loading, error, searchTerm = "" }) {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const filteredTopics = useMemo(
    () => filterBySearch(topics, searchTerm, BIBLIOGRAPHY_SEARCH_FIELDS),
    [topics, searchTerm]
  );

  return (
    <div>
      <div className="section-title">Bibliografía Anatómica</div>
      <p className="section-subtitle">
        Resúmenes anatómicos por región, con referencias a los textos clásicos de la carrera.
      </p>

      {loading ? (
        <p className="loading-text">Cargando bibliografía...</p>
      ) : error ? (
        <p className="error-state">No se pudo cargar la bibliografía. Intentá de nuevo más tarde.</p>
      ) : (
        <div className="card-grid">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic) => (
              <div
                key={topic.id}
                className="proc-card"
                onClick={() => setSelectedTopic(topic)}
              >
                <div className="proc-img teal">
                  <IconBook size={40} />
                </div>
                <div className="proc-name">{topic.title}</div>
                <div className="proc-meta">{topic.region}</div>
                {topic.summary && <p className="card-text">{topic.summary}</p>}
              </div>
            ))
          ) : (
            <p className="empty-state">No se encontraron temas con esos filtros.</p>
          )}
        </div>
      )}

      {selectedTopic && (
        <div className="modal-overlay" onClick={() => setSelectedTopic(null)}>
          <div className="modal-content modal-content--muted" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedTopic(null)}>
              <IconX size={24} />
            </button>

            <div className="section-title modal-title">{selectedTopic.title}</div>
            <div className="protocol-tags">
              <span className="tag tag-teal">{selectedTopic.region}</span>
            </div>

            {selectedTopic.summary && (
              <p className="evidence-text">{selectedTopic.summary}</p>
            )}

            <div className="stack">
              {SECTIONS.map(({ key, title, icon: Icon, accent, danger }) => {
                const items = selectedTopic[key];
                if (!items || items.length === 0) return null;

                return (
                  <div
                    key={key}
                    className={`detail-card ${danger ? 'detail-card--danger' : ''}`}
                  >
                    <div
                      className={`detail-card-title ${
                        accent ? 'detail-card-title--accent' : ''
                      } ${danger ? 'detail-card-title--danger' : ''}`}
                    >
                      <Icon size={20} />
                      {title}
                    </div>
                    <ul className="step-list">
                      {items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {selectedTopic.sources && selectedTopic.sources.length > 0 && (
              <div className="detail-card">
                <div className="detail-card-title">
                  <IconBooks color="#475467" size={20} />
                  Fuentes
                </div>
                <ul className="source-list">
                  {selectedTopic.sources.map((source, index) => (
                    <li key={index}>{source}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

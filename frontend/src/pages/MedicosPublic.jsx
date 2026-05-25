import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppWidget from '../components/WhatsAppWidget'
import './MedicosPublic.css'

export default function MedicosPublic() {
  const [medicos, setMedicos]               = useState([])
  const [especialidades, setEspecialidades] = useState([])
  const [filtro, setFiltro]                 = useState('')
  const [busqueda, setBusqueda]             = useState('')
  const [loading, setLoading]               = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get('/public/medicos'),
      axios.get('/public/especialidades'),
    ]).then(([m, e]) => {
      setMedicos(m.data)
      setEspecialidades(e.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = medicos.filter(m => {
    const matchEspec = !filtro || m.especialidad_id == filtro
    const matchBusq  = !busqueda ||
      m.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (m.especialidad?.nombre || '').toLowerCase().includes(busqueda.toLowerCase())
    return matchEspec && matchBusq
  })

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="medicos-hero">
        <div className="container">
          <span className="badge badge-blue">Nuestro Equipo</span>
          <h1 className="section-title">Directorio de Médicos</h1>
          <p className="section-subtitle">Especialistas certificados comprometidos con tu bienestar</p>

          {/* Búsqueda */}
          <div className="medicos-search">
            <input
              className="form-input medicos-input"
              type="text"
              placeholder="🔍  Buscar médico o especialidad..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>

          {/* Filtros especialidad */}
          <div className="medicos-filtros">
            <button
              className={`filtro-btn ${filtro === '' ? 'filtro-btn--active' : ''}`}
              onClick={() => setFiltro('')}
            >
              Todos
            </button>
            {especialidades.map(e => (
              <button
                key={e.id}
                className={`filtro-btn ${filtro == e.id ? 'filtro-btn--active' : ''}`}
                onClick={() => setFiltro(filtro == e.id ? '' : e.id)}
              >
                {e.nombre}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid de médicos */}
      <section className="section">
        <div className="container">
          {loading && <div className="spinner" />}

          {!loading && filtered.length === 0 && (
            <div className="medicos-empty">
              <div style={{ fontSize: '3rem' }}>🔍</div>
              <h3>No se encontraron médicos</h3>
              <p>Intenta con otro término de búsqueda o especialidad.</p>
              <button className="btn btn-outline" onClick={() => { setBusqueda(''); setFiltro('') }}>
                Ver todos los médicos
              </button>
            </div>
          )}

          <div className="medicos-grid">
            {filtered.map(m => (
              <div key={m.id} className="medico-card card">
                <div className="medico-photo">
                  {m.foto_url
                    ? <img src={m.foto_url} alt={m.nombre} />
                    : <div className="medico-avatar-lg">{m.nombre[0]}</div>
                  }
                  <div className="medico-overlay">
                    <a href="/#agendar" className="btn btn-primary btn-sm">Agendar Cita</a>
                  </div>
                </div>
                <div className="medico-body">
                  <span className="badge badge-blue">{m.especialidad?.nombre}</span>
                  <h3 className="medico-nombre">{m.nombre}</h3>
                  {m.titulo_academico && <p className="medico-titulo">{m.titulo_academico}</p>}
                  {m.biografia && <p className="medico-bio">{m.biografia.slice(0, 120)}{m.biografia.length > 120 ? '...' : ''}</p>}

                  <div className="medico-contacto">
                    {m.telefono_contacto && (
                      <a href={`tel:${m.telefono_contacto}`} className="medico-contact-link">
                        📞 {m.telefono_contacto}
                      </a>
                    )}
                    {m.email_contacto && (
                      <a href={`mailto:${m.email_contacto}`} className="medico-contact-link">
                        ✉️ {m.email_contacto}
                      </a>
                    )}
                  </div>

                  {m.horario_consulta && (
                    <div className="medico-horario">
                      <strong>Horarios:</strong>
                      {Object.entries(m.horario_consulta).map(([dia, hora]) => (
                        <span key={dia} className="horario-item">
                          <span className="horario-dia">{dia}</span>
                          <span>{hora}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {m.redes_sociales && (
                    <div className="medico-redes">
                      {m.redes_sociales.instagram && (
                        <a href={`https://instagram.com/${m.redes_sociales.instagram.replace('@','')}`} target="_blank" rel="noopener noreferrer" className="red-link">📸 Instagram</a>
                      )}
                      {m.redes_sociales.linkedin && (
                        <a href={m.redes_sociales.linkedin} target="_blank" rel="noopener noreferrer" className="red-link">💼 LinkedIn</a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA agendar */}
      <section className="medicos-cta">
        <div className="container medicos-cta-inner">
          <div>
            <h2>¿No encontraste tu especialidad?</h2>
            <p>Contáctanos y te orientamos con el especialista adecuado para tu caso.</p>
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/contacto" className="btn btn-outline" style={{ borderColor:'#fff', color:'#fff' }}>Contáctanos</Link>
            <Link to="/#agendar" className="btn btn-primary" style={{ background:'#fff', color:'var(--primary-blue)' }}>Agendar Cita</Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppWidget />
    </>
  )
}

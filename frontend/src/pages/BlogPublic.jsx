import { useState, useEffect } from 'react'
import axios from 'axios'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppWidget from '../components/WhatsAppWidget'
import './BlogPublic.css'

export default function BlogPublic() {
  const [posts, setPosts]         = useState([])
  const [categorias, setCats]     = useState([])
  const [filtro, setFiltro]       = useState('')
  const [busqueda, setBusqueda]   = useState('')
  const [loading, setLoading]     = useState(true)
  const [selected, setSelected]   = useState(null)

  useEffect(() => {
    Promise.all([
      axios.get('/public/blog?limit=50'),
      axios.get('/public/categorias-blog'),
    ]).then(([p, c]) => {
      setPosts(p.data)
      setCats(c.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = posts.filter(p => {
    const matchCat  = !filtro || p.categoria?.slug === filtro
    const matchBusq = !busqueda ||
      p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.resumen || '').toLowerCase().includes(busqueda.toLowerCase())
    return matchCat && matchBusq
  })

  const formatDate = iso => iso
    ? new Date(iso).toLocaleDateString('es-VE', { year:'numeric', month:'long', day:'numeric' })
    : ''

  if (selected) return (
    <>
      <Header />
      <section className="blog-detail">
        <div className="container blog-detail-inner">
          <button className="btn btn-outline btn-sm blog-back" onClick={() => setSelected(null)}>
            ← Volver al Blog
          </button>
          <div className="blog-detail-meta">
            <span className="badge badge-blue">{selected.categoria?.nombre}</span>
            <span className="blog-date">{formatDate(selected.publicado_en)}</span>
            <span className="blog-views">👁 {selected.vistas} vistas</span>
          </div>
          <h1 className="blog-detail-title">{selected.titulo}</h1>
          {selected.resumen && <p className="blog-detail-resumen">{selected.resumen}</p>}
          {selected.imagen_portada && (
            <img src={selected.imagen_portada} alt={selected.titulo} className="blog-detail-img" />
          )}
          <div
            className="blog-detail-content"
            dangerouslySetInnerHTML={{ __html: selected.contenido }}
          />
          <div className="blog-detail-autor">
            <div className="autor-avatar">{selected.autor?.nombre?.[0]}</div>
            <div>
              <strong>{selected.autor?.nombre}</strong>
              <span>Equipo Médico Real Méndez</span>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <WhatsAppWidget />
    </>
  )

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="blog-hero">
        <div className="container">
          <span className="badge badge-blue">Blog Educativo</span>
          <h1 className="section-title">Salud e Información</h1>
          <p className="section-subtitle">Artículos y guías escritas por nuestros especialistas para tu bienestar</p>
          <div className="blog-search">
            <input
              className="form-input blog-input"
              placeholder="🔍  Buscar artículos de salud..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>
          <div className="blog-cats">
            <button className={`cat-btn ${filtro === '' ? 'cat-btn--active' : ''}`} onClick={() => setFiltro('')}>Todos</button>
            {categorias.map(c => (
              <button
                key={c.id}
                className={`cat-btn ${filtro === c.slug ? 'cat-btn--active' : ''}`}
                onClick={() => setFiltro(filtro === c.slug ? '' : c.slug)}
              >
                {c.nombre}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="section">
        <div className="container">
          {loading && <div className="spinner" />}
          {!loading && filtered.length === 0 && (
            <div style={{ textAlign:'center', padding:'60px 0', color:'var(--gray-mid)' }}>
              <p style={{ fontSize:'3rem' }}>📭</p>
              <h3 style={{ margin:'12px 0 8px', color:'var(--charcoal)' }}>No hay artículos aún</h3>
              <p>Pronto publicaremos contenido de valor para tu salud.</p>
            </div>
          )}
          <div className="blog-grid">
            {filtered.map(p => (
              <article key={p.id} className="blog-card card" onClick={() => setSelected(p)}>
                <div className="blog-card-img">
                  {p.imagen_portada
                    ? <img src={p.imagen_portada} alt={p.titulo} />
                    : <div className="blog-card-placeholder">📰</div>
                  }
                  <span className="badge badge-blue blog-cat-badge">{p.categoria?.nombre}</span>
                </div>
                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    <span>{formatDate(p.publicado_en)}</span>
                    <span>👁 {p.vistas}</span>
                  </div>
                  <h2 className="blog-card-title">{p.titulo}</h2>
                  {p.resumen && <p className="blog-card-resumen">{p.resumen}</p>}
                  <div className="blog-card-footer">
                    <div className="blog-autor">
                      <div className="blog-autor-av">{p.autor?.nombre?.[0]}</div>
                      <span>{p.autor?.nombre}</span>
                    </div>
                    <span className="blog-read">Leer →</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppWidget />
    </>
  )
}

import { useState, useEffect } from 'react'
import axios from 'axios'

export default function BlogAdmin() {
  const [posts, setPosts]         = useState([])
  const [categorias, setCats]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState({ titulo:'', slug:'', resumen:'', contenido:'', categoria_id:'', meta_titulo:'', meta_desc:'', estado:'borrador' })

  const fetch = () => {
    setLoading(true)
    Promise.all([axios.get('/api/blog'), axios.get('/api/categorias')])
      .then(([p, c]) => { setPosts(p.data); setCats(c.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(() => { fetch() }, [])

  const autoSlug = t => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')

  const openNew = () => { setEditTarget(null); setForm({ titulo:'', slug:'', resumen:'', contenido:'', categoria_id:'', meta_titulo:'', meta_desc:'', estado:'borrador' }); setShowForm(true) }
  const openEdit = p => { setEditTarget(p); setForm({ titulo:p.titulo, slug:p.slug, resumen:p.resumen||'', contenido:p.contenido||'', categoria_id:p.categoria?.id||'', meta_titulo:p.meta_titulo||'', meta_desc:p.meta_desc||'', estado:p.estado }); setShowForm(true) }

  const handleSubmit = async () => {
    try {
      const payload = { ...form, categoria_id: parseInt(form.categoria_id) }
      if (editTarget) await axios.put(`/api/blog/${editTarget.id}`, payload)
      else await axios.post('/api/blog', payload)
      setShowForm(false); fetch()
    } catch (e) { alert(e.response?.data?.detail || 'Error') }
  }

  const eliminar = async id => {
    if (!confirm('¿Eliminar este artículo?')) return
    await axios.delete(`/api/blog/${id}`); fetch()
  }

  const ESTADO_BADGE = { borrador:'badge-gray', publicado:'badge-green', archivado:'badge-yellow' }

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24}}>
        <h1 className="admin-page-title" style={{marginBottom:0}}>Blog Educativo</h1>
        <button className="btn btn-primary" onClick={openNew}>+ Nuevo Artículo</button>
      </div>
      <div className="card">
        {loading ? <div className="spinner" /> : (
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Título</th><th>Categoría</th><th>Autor</th><th>Vistas</th><th>Estado</th><th>Acciones</th></tr></thead>
              <tbody>
                {posts.length === 0 && <tr><td colSpan={6} style={{textAlign:'center', padding:32, color:'var(--gray-mid)'}}>No hay artículos aún.</td></tr>}
                {posts.map(p => (
                  <tr key={p.id}>
                    <td><strong style={{display:'block', maxWidth:260}}>{p.titulo}</strong><small style={{color:'var(--gray-mid)'}}>/blog/{p.slug}</small></td>
                    <td>{p.categoria?.nombre}</td>
                    <td>{p.autor?.nombre}</td>
                    <td>{p.vistas}</td>
                    <td><span className={`badge ${ESTADO_BADGE[p.estado]||'badge-gray'}`}>{p.estado}</span></td>
                    <td style={{display:'flex', gap:8}}>
                      <button className="btn btn-sm btn-outline" onClick={() => openEdit(p)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => eliminar(p.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal modal--xl" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editTarget ? 'Editar Artículo' : 'Nuevo Artículo'}</h3>
              <button onClick={() => setShowForm(false)} style={{fontSize:'1.4rem', color:'var(--gray-mid)'}}>×</button>
            </div>
            <div style={{padding:'0 24px 24px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, overflowY:'auto', maxHeight:'70vh'}}>
              <div className="form-group" style={{gridColumn:'1/-1'}}>
                <label className="form-label">Título del Artículo *</label>
                <input className="form-input" value={form.titulo} onChange={e => setForm(f=>({...f, titulo:e.target.value, slug:autoSlug(e.target.value)}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Slug</label>
                <input className="form-input" value={form.slug} onChange={e => setForm(f=>({...f, slug:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Categoría *</label>
                <select className="form-input" value={form.categoria_id} onChange={e => setForm(f=>({...f, categoria_id:e.target.value}))}>
                  <option value="">Seleccionar...</option>
                  {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              <div className="form-group" style={{gridColumn:'1/-1'}}>
                <label className="form-label">Resumen</label>
                <textarea className="form-input" rows={2} value={form.resumen} onChange={e => setForm(f=>({...f, resumen:e.target.value}))} placeholder="Extracto breve del artículo..." />
              </div>
              <div className="form-group" style={{gridColumn:'1/-1'}}>
                <label className="form-label">Contenido (HTML) *</label>
                <textarea className="form-input" rows={8} value={form.contenido} onChange={e => setForm(f=>({...f, contenido:e.target.value}))} placeholder="<p>Contenido del artículo...</p>" />
              </div>
              <div className="form-group">
                <label className="form-label">Estado</label>
                <select className="form-input" value={form.estado} onChange={e => setForm(f=>({...f, estado:e.target.value}))}>
                  <option value="borrador">Borrador</option>
                  <option value="publicado">Publicado</option>
                  <option value="archivado">Archivado</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Meta Título (SEO)</label>
                <input className="form-input" value={form.meta_titulo} onChange={e => setForm(f=>({...f, meta_titulo:e.target.value}))} placeholder="Máx. 70 caracteres" />
              </div>
              <div style={{gridColumn:'1/-1', display:'flex', justifyContent:'flex-end', gap:12}}>
                <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={!form.titulo || !form.contenido || !form.categoria_id}>{editTarget ? 'Guardar Cambios' : 'Crear Artículo'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

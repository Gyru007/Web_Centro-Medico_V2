import { useState, useEffect } from 'react'
import axios from 'axios'

export default function MedicosAdmin() {
  const [medicos, setMedicos]         = useState([])
  const [especialidades, setEspec]    = useState([])
  const [loading, setLoading]         = useState(true)
  const [showForm, setShowForm]       = useState(false)
  const [editTarget, setEditTarget]   = useState(null)
  const [form, setForm] = useState({ nombre:'', slug:'', especialidad_id:'', titulo_academico:'', biografia:'', foto_url:'', telefono_contacto:'', email_contacto:'', orden:0 })

  const fetch = () => {
    setLoading(true)
    Promise.all([
      axios.get('/api/medicos'),
      axios.get('/api/especialidades'),
    ]).then(([m, e]) => { setMedicos(m.data); setEspec(e.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(() => { fetch() }, [])

  const openNew = () => { setEditTarget(null); setForm({ nombre:'', slug:'', especialidad_id:'', titulo_academico:'', biografia:'', foto_url:'', telefono_contacto:'', email_contacto:'', orden:0 }); setShowForm(true) }
  const openEdit = m => { setEditTarget(m); setForm({ nombre:m.nombre, slug:m.slug, especialidad_id:m.especialidad_id, titulo_academico:m.titulo_academico||'', biografia:m.biografia||'', foto_url:m.foto_url||'', telefono_contacto:m.telefono_contacto||'', email_contacto:m.email_contacto||'', orden:m.orden||0 }); setShowForm(true) }

  const autoSlug = nombre => nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')

  const handleSubmit = async () => {
    try {
      if (editTarget) await axios.put(`/api/medicos/${editTarget.id}`, form)
      else await axios.post('/api/medicos', form)
      setShowForm(false); fetch()
    } catch (e) { alert(e.response?.data?.detail || 'Error al guardar') }
  }

  const desactivar = async id => {
    if (!confirm('¿Desactivar este médico?')) return
    await axios.delete(`/api/medicos/${id}`); fetch()
  }

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24}}>
        <h1 className="admin-page-title" style={{marginBottom:0}}>Médicos</h1>
        <button className="btn btn-primary" onClick={openNew}>+ Nuevo Médico</button>
      </div>

      <div className="card">
        {loading ? <div className="spinner" /> : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr><th>Médico</th><th>Especialidad</th><th>Teléfono</th><th>Estado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {medicos.map(m => (
                  <tr key={m.id}>
                    <td>
                      <strong style={{display:'block'}}>{m.nombre}</strong>
                      <small style={{color:'var(--gray-mid)'}}>{m.titulo_academico}</small>
                    </td>
                    <td>{m.especialidad?.nombre}</td>
                    <td>{m.telefono_contacto || '—'}</td>
                    <td><span className={`badge ${m.activo ? 'badge-green' : 'badge-red'}`}>{m.activo ? 'Activo' : 'Inactivo'}</span></td>
                    <td style={{display:'flex', gap:8}}>
                      <button className="btn btn-sm btn-outline" onClick={() => openEdit(m)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => desactivar(m.id)}>Desactivar</button>
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
          <div className="modal modal--lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editTarget ? 'Editar Médico' : 'Nuevo Médico'}</h3>
              <button onClick={() => setShowForm(false)} style={{fontSize:'1.4rem', color:'var(--gray-mid)'}}>×</button>
            </div>
            <div style={{padding:'0 24px 24px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
              <div className="form-group">
                <label className="form-label">Nombre Completo *</label>
                <input className="form-input" value={form.nombre} onChange={e => { setForm(f=>({...f, nombre:e.target.value, slug:autoSlug(e.target.value)})) }} />
              </div>
              <div className="form-group">
                <label className="form-label">Slug (URL)</label>
                <input className="form-input" value={form.slug} onChange={e => setForm(f=>({...f, slug:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Especialidad *</label>
                <select className="form-input" value={form.especialidad_id} onChange={e => setForm(f=>({...f, especialidad_id:e.target.value}))}>
                  <option value="">Seleccionar...</option>
                  {especialidades.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Título Académico</label>
                <input className="form-input" value={form.titulo_academico} onChange={e => setForm(f=>({...f, titulo_academico:e.target.value}))} placeholder="Médico Cirujano" />
              </div>
              <div className="form-group">
                <label className="form-label">Teléfono de Contacto</label>
                <input className="form-input" value={form.telefono_contacto} onChange={e => setForm(f=>({...f, telefono_contacto:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Email de Contacto</label>
                <input className="form-input" type="email" value={form.email_contacto} onChange={e => setForm(f=>({...f, email_contacto:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">URL Foto</label>
                <input className="form-input" value={form.foto_url} onChange={e => setForm(f=>({...f, foto_url:e.target.value}))} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label className="form-label">Orden</label>
                <input className="form-input" type="number" value={form.orden} onChange={e => setForm(f=>({...f, orden:parseInt(e.target.value)||0}))} />
              </div>
              <div className="form-group" style={{gridColumn:'1/-1'}}>
                <label className="form-label">Biografía</label>
                <textarea className="form-input" rows={4} value={form.biografia} onChange={e => setForm(f=>({...f, biografia:e.target.value}))} placeholder="Descripción del médico..." />
              </div>
              <div style={{gridColumn:'1/-1', display:'flex', justifyContent:'flex-end', gap:12}}>
                <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleSubmit}>
                  {editTarget ? 'Guardar Cambios' : 'Crear Médico'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import axios from 'axios'

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nombre:'', email:'', password:'', rol_id:'' })

  const fetch = () => {
    setLoading(true)
    Promise.all([axios.get('/api/usuarios'), axios.get('/api/roles')])
      .then(([u, r]) => { setUsuarios(u.data); setRoles(r.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(() => { fetch() }, [])

  const crearUsuario = async () => {
    try {
      await axios.post('/api/usuarios', { ...form, rol_id: parseInt(form.rol_id) })
      setShowForm(false)
      setForm({ nombre:'', email:'', password:'', rol_id:'' })
      fetch()
    } catch (e) { alert(e.response?.data?.detail || 'Error al crear usuario') }
  }

  const toggleActivo = async (u) => {
    await axios.put(`/api/usuarios/${u.id}`, { activo: !u.activo }); fetch()
  }

  const ROL_BADGE = { admin:'badge-blue', editor:'badge-green', recepcionista:'badge-gray' }

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24}}>
        <h1 className="admin-page-title" style={{marginBottom:0}}>Gestión de Usuarios</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Nuevo Usuario</button>
      </div>

      <div className="card">
        {loading ? <div className="spinner" /> : (
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Usuario</th><th>Email</th><th>Rol</th><th>Estado</th><th>Creado</th><th>Acciones</th></tr></thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{display:'flex', alignItems:'center', gap:10}}>
                        <div style={{width:34, height:34, borderRadius:'50%', background:'var(--blue-light)', color:'var(--primary-blue)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700}}>{u.nombre[0]}</div>
                        <strong>{u.nombre}</strong>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td><span className={`badge ${ROL_BADGE[u.rol?.nombre] || 'badge-gray'}`}>{u.rol?.nombre}</span></td>
                    <td><span className={`badge ${u.activo ? 'badge-green' : 'badge-red'}`}>{u.activo ? 'Activo' : 'Inactivo'}</span></td>
                    <td style={{color:'var(--gray-mid)', fontSize:'0.85rem'}}>{u.creado_en?.slice(0,10)}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${u.activo ? 'btn-danger' : 'btn-outline'}`}
                        onClick={() => toggleActivo(u)}
                      >
                        {u.activo ? 'Desactivar' : 'Activar'}
                      </button>
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
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Crear Nuevo Usuario</h3>
              <button onClick={() => setShowForm(false)} style={{fontSize:'1.4rem', color:'var(--gray-mid)'}}>×</button>
            </div>
            <div style={{padding:'0 24px 24px', display:'flex', flexDirection:'column', gap:16}}>
              <div className="form-group">
                <label className="form-label">Nombre Completo *</label>
                <input className="form-input" value={form.nombre} onChange={e => setForm(f=>({...f, nombre:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" value={form.email} onChange={e => setForm(f=>({...f, email:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Contraseña *</label>
                <input className="form-input" type="password" value={form.password} onChange={e => setForm(f=>({...f, password:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Rol *</label>
                <select className="form-input" value={form.rol_id} onChange={e => setForm(f=>({...f, rol_id:e.target.value}))}>
                  <option value="">Seleccionar rol...</option>
                  {roles.map(r => <option key={r.id} value={r.id}>{r.nombre} — {r.descripcion}</option>)}
                </select>
              </div>
              <div style={{display:'flex', justifyContent:'flex-end', gap:12}}>
                <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={crearUsuario} disabled={!form.nombre || !form.email || !form.password || !form.rol_id}>Crear Usuario</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

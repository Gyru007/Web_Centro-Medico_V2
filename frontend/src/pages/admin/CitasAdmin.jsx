import { useState, useEffect } from 'react'
import axios from 'axios'

const ESTADO_BADGE = {
  pendiente:    'badge-yellow',
  confirmada:   'badge-green',
  cancelada:    'badge-red',
  completada:   'badge-gray',
  reprogramada: 'badge-blue',
}

export default function CitasAdmin() {
  const [citas, setCitas]     = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro]   = useState('')
  const [selected, setSelected] = useState(null)
  const [nota, setNota]       = useState('')

  const fetchCitas = () => {
    setLoading(true)
    const q = filtro ? `?estado=${filtro}` : ''
    axios.get(`/api/citas${q}`)
      .then(r => setCitas(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCitas() }, [filtro])

  const cambiarEstado = async (id, estado) => {
    await axios.put(`/api/citas/${id}/estado`, { estado, notas_recepcion: nota })
    setSelected(null)
    setNota('')
    fetchCitas()
  }

  return (
    <div>
      <h1 className="admin-page-title">Gestión de Citas</h1>

      {/* Filtros */}
      <div style={{display:'flex', gap:8, marginBottom:20, flexWrap:'wrap'}}>
        {['', 'pendiente', 'confirmada', 'reprogramada', 'cancelada', 'completada'].map(e => (
          <button
            key={e}
            className={`btn btn-sm ${filtro === e ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFiltro(e)}
          >
            {e || 'Todas'}
          </button>
        ))}
      </div>

      <div className="card">
        {loading
          ? <div className="spinner" />
          : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Paciente</th>
                    <th>Médico</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Canal</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {citas.length === 0
                    ? <tr><td colSpan={8} style={{textAlign:'center', color:'var(--gray-mid)', padding:32}}>No hay citas con este filtro.</td></tr>
                    : citas.map(c => (
                      <tr key={c.id}>
                        <td style={{color:'var(--gray-mid)', fontSize:'0.8rem'}}>#{c.id}</td>
                        <td>
                          <strong style={{display:'block'}}>{c.nombre_paciente}</strong>
                          <small style={{color:'var(--gray-mid)'}}>{c.cedula_paciente} · {c.telefono_paciente}</small>
                        </td>
                        <td>
                          <span style={{display:'block', fontWeight:500}}>{c.medico?.nombre}</span>
                          <small style={{color:'var(--gray-mid)'}}>{c.especialidad?.nombre}</small>
                        </td>
                        <td>{c.fecha_cita}</td>
                        <td>{c.hora_cita?.slice(0,5)}</td>
                        <td><span className="badge badge-gray">{c.canal_origen}</span></td>
                        <td><span className={`badge ${ESTADO_BADGE[c.estado] || 'badge-gray'}`}>{c.estado}</span></td>
                        <td>
                          <button className="btn btn-sm btn-outline" onClick={() => { setSelected(c); setNota(c.notas_recepcion || '') }}>
                            Gestionar
                          </button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          )
        }
      </div>

      {/* Modal gestión */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Gestionar Cita #{selected.id}</h3>
              <button onClick={() => setSelected(null)} style={{fontSize:'1.4rem', color:'var(--gray-mid)'}}>×</button>
            </div>
            <div style={{padding:'0 24px 24px'}}>
              <div style={{background:'var(--gray-light)', borderRadius:'var(--radius-sm)', padding:16, marginBottom:16, fontSize:'0.9rem'}}>
                <p><strong>Paciente:</strong> {selected.nombre_paciente}</p>
                <p><strong>Médico:</strong> {selected.medico?.nombre}</p>
                <p><strong>Fecha:</strong> {selected.fecha_cita} a las {selected.hora_cita?.slice(0,5)}</p>
                {selected.motivo_consulta && <p><strong>Motivo:</strong> {selected.motivo_consulta}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Notas de Recepción</label>
                <textarea className="form-input" rows={3} value={nota} onChange={e => setNota(e.target.value)} placeholder="Observaciones internas..." />
              </div>
              <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:8}}>
                <button className="btn btn-sm" style={{background:'#D1FAE5', color:'#059669'}} onClick={() => cambiarEstado(selected.id, 'confirmada')}>✓ Confirmar</button>
                <button className="btn btn-sm" style={{background:'#FEF3C7', color:'#92400E'}} onClick={() => cambiarEstado(selected.id, 'reprogramada')}>↺ Reprogramar</button>
                <button className="btn btn-sm btn-danger" onClick={() => cambiarEstado(selected.id, 'cancelada')}>✕ Cancelar</button>
                <button className="btn btn-sm" style={{background:'var(--gray-light)', color:'var(--gray-mid)'}} onClick={() => cambiarEstado(selected.id, 'completada')}>✓✓ Completada</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

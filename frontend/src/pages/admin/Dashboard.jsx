import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import './Dashboard.css'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ citas: 0, medicos: 0, posts: 0 })
  const [citas, setCitas] = useState([])

  useEffect(() => {
    axios.get('/api/citas?estado=pendiente').then(r => {
      setCitas(r.data.slice(0, 5))
      setStats(s => ({ ...s, citas: r.data.length }))
    }).catch(() => {})
    axios.get('/api/medicos').then(r => setStats(s => ({ ...s, medicos: r.data.length }))).catch(() => {})
    axios.get('/api/blog').then(r  => setStats(s => ({ ...s, posts: r.data.length }))).catch(() => {})
  }, [])

  const CARDS = [
    { icon: '📅', label: 'Citas Pendientes', value: stats.citas,  color: '#FEF3C7', accent: '#F59E0B' },
    { icon: '👨‍⚕️', label: 'Médicos Activos',  value: stats.medicos, color: '#D1FAE5', accent: '#10B981' },
    { icon: '📝', label: 'Artículos Blog',   value: stats.posts,  color: '#EBF2FF', accent: '#0056D2' },
  ]

  const estadoBadge = {
    pendiente:    'badge-yellow',
    confirmada:   'badge-green',
    cancelada:    'badge-red',
    completada:   'badge-gray',
    reprogramada: 'badge-blue',
  }

  return (
    <div>
      <div className="dash-welcome">
        <div>
          <h1 className="admin-page-title" style={{marginBottom:4}}>
            Buenos días, {user?.nombre?.split(' ')[0]} 👋
          </h1>
          <p style={{color:'var(--gray-mid)'}}>Aquí está el resumen del día en el Centro Médico Real Méndez.</p>
        </div>
        <div className="dash-date">
          {new Date().toLocaleDateString('es-VE', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="dash-cards">
        {CARDS.map(c => (
          <div key={c.label} className="dash-card" style={{ background: c.color }}>
            <div className="dash-card-icon">{c.icon}</div>
            <div>
              <div className="dash-card-value" style={{ color: c.accent }}>{c.value}</div>
              <div className="dash-card-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Últimas citas */}
      <div className="card" style={{padding: '24px', marginTop: 24}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
          <h2 style={{fontSize:'1.1rem', fontWeight:700}}>Citas Pendientes Recientes</h2>
          <a href="/admin/citas" style={{color:'var(--primary-blue)', fontSize:'0.88rem', fontWeight:600}}>Ver todas →</a>
        </div>
        {citas.length === 0
          ? <p style={{color:'var(--gray-mid)', textAlign:'center', padding:'24px'}}>No hay citas pendientes.</p>
          : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Paciente</th>
                    <th>Especialidad</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {citas.map(c => (
                    <tr key={c.id}>
                      <td>
                        <strong style={{display:'block'}}>{c.nombre_paciente}</strong>
                        <small style={{color:'var(--gray-mid)'}}>{c.cedula_paciente}</small>
                      </td>
                      <td>{c.especialidad?.nombre}</td>
                      <td>{c.fecha_cita}</td>
                      <td>{c.hora_cita}</td>
                      <td><span className={`badge ${estadoBadge[c.estado] || 'badge-gray'}`}>{c.estado}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </div>
  )
}

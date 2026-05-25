import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppWidget from '../components/WhatsAppWidget'
import './Servicios.css'

const ICONOS = ['❤️','👶','🧠','🌸','🦴','🌿','👁','🦷','🫁','💉']

export default function Servicios() {
  const [especialidades, setEsp] = useState([])
  const [loading, setLoading]    = useState(true)

  useEffect(() => {
    axios.get('/public/especialidades')
      .then(r => setEsp(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="servicios-hero">
        <div className="container">
          <span className="badge badge-blue">Especialidades</span>
          <h1 className="section-title">Nuestros Servicios Médicos</h1>
          <p className="section-subtitle">
            Atención médica integral con especialistas certificados en más de 6 áreas de la salud
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="section">
        <div className="container">
          {loading && <div className="spinner" />}
          <div className="servicios-grid">
            {especialidades.map((e, i) => (
              <div key={e.id} className="servicio-item card">
                <div className="servicio-icon-wrap">
                  <span className="servicio-icon">{ICONOS[i % ICONOS.length]}</span>
                </div>
                <div className="servicio-body">
                  <h2 className="servicio-nombre">{e.nombre}</h2>
                  {e.descripcion && <p className="servicio-desc">{e.descripcion}</p>}
                  {e.meta_desc && (
                    <p className="servicio-extra">{e.meta_desc}</p>
                  )}
                  <a href="/#agendar" className="btn btn-primary btn-sm servicio-btn">
                    Agendar Cita en {e.nombre}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="section section--gray">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">¿Por qué atenderte con nosotros?</h2>
          </div>
          <div className="servicios-beneficios">
            {[
              { icon:'🏆', t:'Especialistas Certificados',  d:'Todo nuestro personal médico cuenta con título universitario y registro MPPS vigente.' },
              { icon:'🕐', t:'Horarios Flexibles',           d:'Consultas de lunes a sábado con turnos matutinos y vespertinos para tu comodidad.' },
              { icon:'📍', t:'Ubicación Accesible',          d:'Nos encontramos en una zona de fácil acceso con estacionamiento disponible.' },
              { icon:'💊', t:'Seguimiento Continuo',         d:'Tu médico te acompaña en todo el proceso de tratamiento y recuperación.' },
              { icon:'🔬', t:'Equipos de Última Generación', d:'Laboratorio y equipos de diagnóstico de alta tecnología en nuestras instalaciones.' },
              { icon:'💳', t:'Convenios y Seguros',          d:'Trabajamos con las principales aseguradoras y pólizas de salud del país.' },
            ].map(b => (
              <div key={b.t} className="beneficio-card card">
                <div className="beneficio-icon">{b.icon}</div>
                <h3>{b.t}</h3>
                <p>{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="servicios-cta">
        <div className="container servicios-cta-inner">
          <div>
            <h2>¿Listo para agendar tu consulta?</h2>
            <p>Proceso 100% en línea, sin llamadas, sin filas. Recibirás confirmación en minutos.</p>
          </div>
          <Link to="/#agendar" className="btn btn-primary btn-lg" style={{ background:'#fff', color:'var(--primary-blue)' }}>
            Agendar Cita Ahora →
          </Link>
        </div>
      </section>

      <Footer />
      <WhatsAppWidget />
    </>
  )
}

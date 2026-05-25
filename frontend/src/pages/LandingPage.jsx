import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppWidget from '../components/WhatsAppWidget'
import FormularioCita from '../components/FormularioCita'
import './LandingPage.css'

const HERO_SLIDES = [
  {
    title: 'Tu salud es nuestra prioridad',
    sub: 'Más de 20 especialidades médicas con los mejores profesionales del país.',
    cta: 'Agendar Cita Ahora',
    bg: 'linear-gradient(135deg, #0056D2 0%, #003F9E 60%, #001F6B 100%)',
  },
  {
    title: 'Médicos especialistas a tu alcance',
    sub: 'Atención personalizada, diagnósticos precisos y tecnología de punta.',
    cta: 'Conocer Médicos',
    bg: 'linear-gradient(135deg, #005CAD 0%, #0047A0 60%, #001F6B 100%)',
  },
  {
    title: 'Agendamiento en línea 24/7',
    sub: 'Selecciona tu especialidad, médico y horario desde la comodidad de tu hogar.',
    cta: 'Reservar Mi Cita',
    bg: 'linear-gradient(135deg, #004FA0 0%, #003080 60%, #001550 100%)',
  },
]

const STATS = [
  { n: '20+', label: 'Especialidades' },
  { n: '50+', label: 'Médicos Expertos' },
  { n: '15k+', label: 'Pacientes Atendidos' },
  { n: '12',  label: 'Años de Experiencia' },
]

export default function LandingPage() {
  const [slide, setSlide]               = useState(0)
  const [especialidades, setEspecialidades] = useState([])
  const [medicos, setMedicos]           = useState([])

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    axios.get('/public/especialidades').then(r => setEspecialidades(r.data)).catch(() => {})
    axios.get('/public/medicos').then(r => setMedicos(r.data.slice(0,4))).catch(() => {})
  }, [])

  const current = HERO_SLIDES[slide]

  return (
    <>
      <Header />

      {/* ── HERO ─────────────────────────────────── */}
      <section className="hero" style={{ background: current.bg }}>
        <div className="hero-overlay" />
        <div className="container hero-content">
          <div className="hero-text">
            <span className="badge badge-blue hero-badge">Centro Médico Certificado ✓</span>
            <h1 className="hero-title">{current.title}</h1>
            <p className="hero-sub">{current.sub}</p>
            <div className="hero-actions">
              <a href="#agendar" className="btn btn-primary btn-lg">{current.cta}</a>
              <Link to="/medicos" className="btn hero-btn-ghost btn-lg">Ver Médicos →</Link>
            </div>
          </div>
          <div className="hero-card">
            <div className="hero-card-inner">
              <div className="hero-icon">🏥</div>
              <div>
                <strong>Consulta Online</strong>
                <span>Disponible 24/7</span>
              </div>
            </div>
            <hr className="hero-divider" />
            <div className="hero-card-inner">
              <div className="hero-icon">📋</div>
              <div>
                <strong>Citas Express</strong>
                <span>Sin esperas largas</span>
              </div>
            </div>
            <hr className="hero-divider" />
            <div className="hero-card-inner">
              <div className="hero-icon">❤️</div>
              <div>
                <strong>Atención Integral</strong>
                <span>Cuerpo y mente</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-dots">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === slide ? 'hero-dot--active' : ''}`}
              onClick={() => setSlide(i)}
            />
          ))}
        </div>
      </section>

      {/* ── STATS ────────────────────────────────── */}
      <section className="stats-bar">
        <div className="container stats-grid">
          {STATS.map(s => (
            <div key={s.label} className="stat">
              <strong>{s.n}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── ESPECIALIDADES ───────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="badge badge-blue">Nuestros Servicios</span>
            <h2 className="section-title">Especialidades Médicas</h2>
            <p className="section-subtitle">Contamos con un equipo multidisciplinario para tu salud integral</p>
          </div>
          <div className="services-grid">
            {(especialidades.length > 0 ? especialidades : [
              { id:1, nombre:'Cardiología',   descripcion:'Corazón y sistema cardiovascular' },
              { id:2, nombre:'Pediatría',     descripcion:'Salud infantil y adolescente' },
              { id:3, nombre:'Neurología',    descripcion:'Sistema nervioso central' },
              { id:4, nombre:'Ginecología',   descripcion:'Salud femenina integral' },
              { id:5, nombre:'Traumatología', descripcion:'Sistema musculoesquelético' },
              { id:6, nombre:'Dermatología',  descripcion:'Enfermedades de la piel' },
            ]).map((e, i) => (
              <Link to="/servicios" key={e.id} className="service-card card">
                <div className="service-icon">{['❤️','👶','🧠','🌸','🦴','🌿'][i % 6]}</div>
                <h3>{e.nombre}</h3>
                <p>{e.descripcion}</p>
                <span className="service-arrow">→</span>
              </Link>
            ))}
          </div>
          <div className="section-cta">
            <Link to="/servicios" className="btn btn-outline">Ver Todos los Servicios</Link>
          </div>
        </div>
      </section>

      {/* ── MÉDICOS ──────────────────────────────── */}
      <section className="section section--gray">
        <div className="container">
          <div className="section-head">
            <span className="badge badge-blue">Nuestro Equipo</span>
            <h2 className="section-title">Médicos Especialistas</h2>
            <p className="section-subtitle">Profesionales certificados comprometidos con tu bienestar</p>
          </div>
          <div className="doctors-grid">
            {(medicos.length > 0 ? medicos : [
              { id:1, nombre:'Dra. María González', titulo_academico:'Cardióloga', especialidad:{ nombre:'Cardiología' } },
              { id:2, nombre:'Dr. Carlos Ruiz',     titulo_academico:'Pediatra',   especialidad:{ nombre:'Pediatría' } },
              { id:3, nombre:'Dra. Ana Martínez',   titulo_academico:'Neuróloga',  especialidad:{ nombre:'Neurología' } },
              { id:4, nombre:'Dr. Luis Torres',     titulo_academico:'Ginecólogo', especialidad:{ nombre:'Ginecología' } },
            ]).map(m => (
              <div key={m.id} className="doctor-card card">
                <div className="doctor-photo">
                  {m.foto_url
                    ? <img src={m.foto_url} alt={m.nombre} />
                    : <div className="doctor-avatar">{m.nombre[0]}</div>
                  }
                </div>
                <div className="doctor-info">
                  <h3>{m.nombre}</h3>
                  <p className="doctor-title">{m.titulo_academico || m.especialidad?.nombre}</p>
                  <span className="badge badge-blue">{m.especialidad?.nombre}</span>
                  <a href="#agendar" className="btn btn-primary btn-sm doctor-btn">
                    Agendar Cita
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="section-cta">
            <Link to="/medicos" className="btn btn-outline">Ver Todos los Médicos</Link>
          </div>
        </div>
      </section>

      {/* ── FORMULARIO CITA ──────────────────────── */}
      <section className="section" id="agendar">
        <div className="container">
          <div className="section-head">
            <span className="badge badge-blue">Agendamiento en Línea</span>
            <h2 className="section-title">Reserve su Cita</h2>
            <p className="section-subtitle">Proceso rápido y sencillo. Confirmación inmediata.</p>
          </div>
          <FormularioCita especialidades={especialidades} />
        </div>
      </section>

      {/* ── POR QUÉ ELEGIRNOS ─────────────────────── */}
      <section className="section section--blue">
        <div className="container">
          <div className="section-head section-head--white">
            <h2 className="section-title" style={{color:'#fff'}}>¿Por qué elegirnos?</h2>
          </div>
          <div className="why-grid">
            {[
              { icon:'🏆', t:'Excelencia Médica',     d:'Especialistas con formación internacional y años de experiencia' },
              { icon:'🔬', t:'Tecnología Avanzada',   d:'Equipos de diagnóstico de última generación para resultados precisos' },
              { icon:'⚡', t:'Atención Oportuna',     d:'Citas rápidas sin largas esperas, respetando tu tiempo' },
              { icon:'🤝', t:'Trato Humanizado',      d:'Atención personalizada donde eres más que un número de expediente' },
            ].map(w => (
              <div key={w.t} className="why-card">
                <div className="why-icon">{w.icon}</div>
                <h3>{w.t}</h3>
                <p>{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppWidget />
    </>
  )
}

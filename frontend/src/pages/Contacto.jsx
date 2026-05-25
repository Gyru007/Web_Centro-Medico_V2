import { useState } from 'react'
import axios from 'axios'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppWidget from '../components/WhatsAppWidget'
import './Contacto.css'

export default function Contacto() {
  const [form, setForm] = useState({ nombre:'', email:'', telefono:'', asunto:'', mensaje:'' })
  const [loading, setLoading] = useState(false)
  const [ok, setOk] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await axios.post('/public/contacto', form)
      setOk(true)
    } catch {
      setError('Ocurrió un error. Por favor intente de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="contacto-hero">
        <div className="container">
          <span className="badge badge-blue">Contáctenos</span>
          <h1 className="section-title">Estamos para Atenderle</h1>
          <p className="section-subtitle">Escribanos, llámenos o visítenos. Responderemos a la brevedad posible.</p>
        </div>
      </section>

      <section className="section">
        <div className="container contacto-grid">

          {/* Info */}
          <div className="contacto-info">
            <h2 className="contacto-info-title">Información de Contacto</h2>
            <div className="info-items">
              {[
                { icon:'📍', label:'Dirección',        value:'Av. Caracas, El Limon, Venezuela' },
                { icon:'📞', label:'Teléfono',         value:'+58 412 295 2460' },
                { icon:'✉️', label:'Correo',           value:'info@realmendez.com' },
                { icon:'🕐', label:'Horario de Atención', value:'Lun – Vie: 8:00 AM – 6:00 PM\nSáb: 8:00 AM – 1:00 PM' },
              ].map(i => (
                <div key={i.label} className="info-item">
                  <div className="info-icon">{i.icon}</div>
                  <div>
                    <strong>{i.label}</strong>
                    <span style={{whiteSpace:'pre-line'}}>{i.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="contacto-social">
              <h3>Síguenos</h3>
              <div className="social-links">
                <a href="#" className="social-link">📘 Facebook</a>
                <a href="#" className="social-link">📸 Instagram</a>
                <a href="#" className="social-link">🐦 Twitter / X</a>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="contacto-form-wrap">
            {ok ? (
              <div className="contacto-success">
                <div style={{fontSize:'3rem'}}>✅</div>
                <h3>¡Mensaje Enviado!</h3>
                <p>Gracias por contactarnos. Nuestro equipo le responderá en un plazo máximo de 24 horas hábiles.</p>
                <button className="btn btn-primary" onClick={() => { setOk(false); setForm({ nombre:'', email:'', telefono:'', asunto:'', mensaje:'' }) }}>
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contacto-form">
                <h2>Envíenos un Mensaje</h2>
                <div className="contacto-row">
                  <div className="form-group">
                    <label className="form-label">Nombre Completo *</label>
                    <input className="form-input" value={form.nombre} onChange={e=>set('nombre',e.target.value)} required placeholder="Juan Pérez" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Correo Electrónico *</label>
                    <input className="form-input" type="email" value={form.email} onChange={e=>set('email',e.target.value)} required placeholder="juan@email.com" />
                  </div>
                </div>
                <div className="contacto-row">
                  <div className="form-group">
                    <label className="form-label">Teléfono</label>
                    <input className="form-input" value={form.telefono} onChange={e=>set('telefono',e.target.value)} placeholder="+58 412 000 0000" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Asunto</label>
                    <select className="form-input" value={form.asunto} onChange={e=>set('asunto',e.target.value)}>
                      <option value="">Seleccionar...</option>
                      <option>Consulta general</option>
                      <option>Solicitud de presupuesto</option>
                      <option>Información de convenios</option>
                      <option>Reclamos o sugerencias</option>
                      <option>Otro</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Mensaje *</label>
                  <textarea className="form-input" rows={5} value={form.mensaje} onChange={e=>set('mensaje',e.target.value)} required placeholder="Escriba aquí su consulta o mensaje..." />
                </div>
                {error && <p style={{color:'var(--danger)', fontSize:'0.87rem'}}>{error}</p>}
                <button type="submit" className="btn btn-primary" style={{width:'100%', justifyContent:'center', padding:'14px'}} disabled={loading}>
                  {loading ? 'Enviando...' : '✉️  Enviar Mensaje'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppWidget />
    </>
  )
}

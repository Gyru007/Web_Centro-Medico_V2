import { useState, useEffect } from 'react'
import axios from 'axios'
import './FormularioCita.css'

const PASOS = ['Especialidad', 'Médico', 'Fecha y Hora', 'Datos', 'Confirmación']

export default function FormularioCita({ especialidades = [] }) {
  const [paso, setPaso]       = useState(0)
  const [medicos, setMedicos] = useState([])
  const [loading, setLoading] = useState(false)
  const [ok, setOk]           = useState(false)
  const [error, setError]     = useState('')

  const [form, setForm] = useState({
    especialidad_id: '',
    medico_id: '',
    fecha_cita: '',
    hora_cita: '',
    nombre_paciente: '',
    cedula_paciente: '',
    email_paciente: '',
    telefono_paciente: '',
    motivo_consulta: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    if (form.especialidad_id) {
      axios.get('/public/medicos')
        .then(r => setMedicos(r.data.filter(m => m.especialidad_id == form.especialidad_id)))
        .catch(() => {})
    }
  }, [form.especialidad_id])

  const verificarCedula = async () => {
    if (!form.cedula_paciente) return
    try {
      const { data } = await axios.get(`/public/verificar-paciente/${form.cedula_paciente}`)
      if (data.encontrado) {
        const parts = (data.nombre || '').split(' ')
        set('nombre_paciente', data.nombre)
        if (data.email)    set('email_paciente', data.email)
        if (data.telefono) set('telefono_paciente', data.telefono)
      }
    } catch {}
  }

  const submit = async () => {
    setLoading(true)
    setError('')
    try {
      await axios.post('/public/agendar-cita', {
        ...form,
        especialidad_id: parseInt(form.especialidad_id),
        medico_id:       parseInt(form.medico_id),
      })
      setOk(true)
    } catch (e) {
      setError(e.response?.data?.detail || 'Error al enviar la solicitud. Intente de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (ok) return (
    <div className="cita-success">
      <div className="success-icon">✅</div>
      <h3>¡Cita Solicitada con Éxito!</h3>
      <p>Nuestro equipo confirmará su cita a la brevedad a través de los datos de contacto proporcionados.</p>
      <button className="btn btn-primary" onClick={() => { setOk(false); setPaso(0); setForm(f=>({...f, fecha_cita:'', hora_cita:'', motivo_consulta:''})) }}>
        Agendar Otra Cita
      </button>
    </div>
  )

  return (
    <div className="cita-form-wrapper">
      {/* Stepper */}
      <div className="cita-stepper">
        {PASOS.map((p, i) => (
          <div key={p} className={`step ${i === paso ? 'step--active' : ''} ${i < paso ? 'step--done' : ''}`}>
            <div className="step-circle">{i < paso ? '✓' : i + 1}</div>
            <span className="step-label">{p}</span>
            {i < PASOS.length - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>

      <div className="cita-body">
        {/* Paso 0: Especialidad */}
        {paso === 0 && (
          <div className="cita-step">
            <h3>Seleccione la Especialidad</h3>
            <div className="espec-grid">
              {especialidades.map(e => (
                <button
                  key={e.id}
                  className={`espec-btn ${form.especialidad_id == e.id ? 'espec-btn--active' : ''}`}
                  onClick={() => set('especialidad_id', e.id)}
                >
                  {e.nombre}
                </button>
              ))}
            </div>
            <div className="cita-actions">
              <button className="btn btn-primary" disabled={!form.especialidad_id} onClick={() => setPaso(1)}>
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* Paso 1: Médico */}
        {paso === 1 && (
          <div className="cita-step">
            <h3>Seleccione su Médico</h3>
            {medicos.length === 0
              ? <p className="cita-empty">No hay médicos disponibles para esta especialidad aún.</p>
              : (
                <div className="medico-list">
                  {medicos.map(m => (
                    <button
                      key={m.id}
                      className={`medico-opt ${form.medico_id == m.id ? 'medico-opt--active' : ''}`}
                      onClick={() => set('medico_id', m.id)}
                    >
                      <div className="medico-opt-avatar">{m.nombre[0]}</div>
                      <div>
                        <strong>{m.nombre}</strong>
                        <span>{m.titulo_academico}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )
            }
            <div className="cita-actions">
              <button className="btn btn-outline" onClick={() => setPaso(0)}>← Atrás</button>
              <button className="btn btn-primary" disabled={!form.medico_id && medicos.length > 0} onClick={() => setPaso(2)}>
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* Paso 2: Fecha y hora */}
        {paso === 2 && (
          <div className="cita-step">
            <h3>Seleccione Fecha y Hora</h3>
            <div className="cita-row">
              <div className="form-group">
                <label className="form-label">Fecha de la Cita *</label>
                <input
                  type="date"
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                  value={form.fecha_cita}
                  onChange={e => set('fecha_cita', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Hora Preferida *</label>
                <input
                  type="time"
                  className="form-input"
                  value={form.hora_cita}
                  onChange={e => set('hora_cita', e.target.value)}
                />
              </div>
            </div>
            <div className="cita-actions">
              <button className="btn btn-outline" onClick={() => setPaso(1)}>← Atrás</button>
              <button className="btn btn-primary" disabled={!form.fecha_cita || !form.hora_cita} onClick={() => setPaso(3)}>
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* Paso 3: Datos personales */}
        {paso === 3 && (
          <div className="cita-step">
            <h3>Sus Datos de Contacto</h3>
            <div className="cita-row">
              <div className="form-group">
                <label className="form-label">Cédula / Pasaporte *</label>
                <input
                  className="form-input"
                  placeholder="V-12345678"
                  value={form.cedula_paciente}
                  onChange={e => set('cedula_paciente', e.target.value)}
                  onBlur={verificarCedula}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nombre Completo *</label>
                <input
                  className="form-input"
                  placeholder="Juan Pérez"
                  value={form.nombre_paciente}
                  onChange={e => set('nombre_paciente', e.target.value)}
                />
              </div>
            </div>
            <div className="cita-row">
              <div className="form-group">
                <label className="form-label">Teléfono *</label>
                <input
                  className="form-input"
                  placeholder="+58 412 000 0000"
                  value={form.telefono_paciente}
                  onChange={e => set('telefono_paciente', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Correo Electrónico</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="juan@email.com"
                  value={form.email_paciente}
                  onChange={e => set('email_paciente', e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Motivo de Consulta</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Describa brevemente el motivo de su consulta..."
                value={form.motivo_consulta}
                onChange={e => set('motivo_consulta', e.target.value)}
              />
            </div>
            <div className="cita-actions">
              <button className="btn btn-outline" onClick={() => setPaso(2)}>← Atrás</button>
              <button
                className="btn btn-primary"
                disabled={!form.cedula_paciente || !form.nombre_paciente || !form.telefono_paciente}
                onClick={() => setPaso(4)}
              >
                Revisar Cita →
              </button>
            </div>
          </div>
        )}

        {/* Paso 4: Confirmación */}
        {paso === 4 && (
          <div className="cita-step">
            <h3>Confirmar Solicitud de Cita</h3>
            <div className="cita-resumen">
              <div className="resumen-row"><span>Especialidad</span><strong>{especialidades.find(e=>e.id==form.especialidad_id)?.nombre}</strong></div>
              <div className="resumen-row"><span>Médico</span><strong>{medicos.find(m=>m.id==form.medico_id)?.nombre || 'Por asignar'}</strong></div>
              <div className="resumen-row"><span>Fecha</span><strong>{form.fecha_cita}</strong></div>
              <div className="resumen-row"><span>Hora</span><strong>{form.hora_cita}</strong></div>
              <div className="resumen-row"><span>Paciente</span><strong>{form.nombre_paciente}</strong></div>
              <div className="resumen-row"><span>Cédula</span><strong>{form.cedula_paciente}</strong></div>
              <div className="resumen-row"><span>Teléfono</span><strong>{form.telefono_paciente}</strong></div>
            </div>
            {error && <p className="cita-error">{error}</p>}
            <div className="cita-actions">
              <button className="btn btn-outline" onClick={() => setPaso(3)}>← Editar</button>
              <button className="btn btn-primary btn-lg" onClick={submit} disabled={loading}>
                {loading ? 'Enviando...' : '✓ Confirmar Cita'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

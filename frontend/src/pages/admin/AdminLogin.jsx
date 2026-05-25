import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './AdminLogin.css'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate('/admin')
    } catch {
      setError('Credenciales incorrectas. Verifique su email y contraseña.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <span className="login-logo-icon">⚕</span>
          <div>
            <strong>Real Méndez</strong>
            <small>Centro Médico</small>
          </div>
        </div>
        <h1>Portal de Administración</h1>
        <p>Gestione citas, médicos, contenido y más desde un solo panel centralizado.</p>
        <div className="login-features">
          {['📅 Gestión de Citas', '👨‍⚕️ Directorio de Médicos', '📝 CMS del Blog', '👤 Control de Usuarios'].map(f => (
            <div key={f} className="login-feature">{f}</div>
          ))}
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Iniciar Sesión</h2>
          <p className="login-desc">Acceso exclusivo para personal autorizado del centro médico.</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <input
                type="email"
                className="form-input"
                placeholder="usuario@realmendez.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="btn btn-primary" style={{width:'100%', justifyContent:'center', padding:'14px'}} disabled={loading}>
              {loading ? 'Verificando...' : 'Ingresar al Panel →'}
            </button>
          </form>

          <div className="login-hint">
            <strong>Demo:</strong> admin@realmendez.com / admin123
          </div>
        </div>
      </div>
    </div>
  )
}

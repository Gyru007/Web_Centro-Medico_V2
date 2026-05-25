import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <span>⚕</span>
            <div>
              <strong>Real Méndez</strong>
              <small>Centro Médico</small>
            </div>
          </div>
          <p>Tu salud es nuestra prioridad. Atención médica especializada con tecnología de vanguardia y trato humano.</p>
        </div>

        <div className="footer-col">
          <h4>Servicios</h4>
          <Link to="/servicios">Cardiología</Link>
          <Link to="/servicios">Pediatría</Link>
          <Link to="/servicios">Neurología</Link>
          <Link to="/servicios">Ginecología</Link>
          <Link to="/servicios">Ver todos</Link>
        </div>

        <div className="footer-col">
          <h4>Información</h4>
          <Link to="/medicos">Nuestros Médicos</Link>
          <Link to="/blog">Blog de Salud</Link>
          <Link to="/contacto">Contacto</Link>
          <Link to="/admin/login">Portal Staff</Link>
        </div>

        <div className="footer-col">
          <h4>Contacto</h4>
          <p>📍 Av. Caracas, El Limon, Venezuela</p>
          <p>📞 +58 412 295 2460</p>
          <p>✉️ info@realmendez.com</p>
          <p>🕐 Lun–Vie: 8:00 – 18:00</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Centro Médico Real Méndez. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  const links = [
    { to: '/',          label: 'Inicio' },
    { to: '/servicios', label: 'Servicios' },
    { to: '/medicos',   label: 'Médicos' },
    { to: '/blog',      label: 'Blog' },
    { to: '/contacto',  label: 'Contacto' },
  ]

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">⚕</span>
          <span>
            <strong>Real Méndez</strong>
            <small>Centro Médico</small>
          </span>
        </Link>

        <nav className={`nav ${open ? 'nav--open' : ''}`}>
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-link ${pathname === l.to ? 'nav-link--active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link to="/#agendar" className="btn btn-primary btn-sm header-cta">
          Agendar Cita
        </Link>

        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menú">
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}

import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AdminLayout.css'

const NAV = [
  { to: '/admin',          icon: '📊', label: 'Dashboard',   exact: true },
  { to: '/admin/citas',    icon: '📅', label: 'Citas' },
  { to: '/admin/medicos',  icon: '👨‍⚕️', label: 'Médicos' },
  { to: '/admin/blog',     icon: '📝', label: 'Blog' },
  { to: '/admin/usuarios', icon: '👤', label: 'Usuarios',    roles: ['admin'] },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => { logout(); navigate('/admin/login') }

  const visibleNav = NAV.filter(n => !n.roles || n.roles.includes(user?.rol))

  return (
    <div className={`admin-layout ${collapsed ? 'admin-layout--collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="sidebar-logo">⚕</span>
          {!collapsed && (
            <div>
              <strong>Real Méndez</strong>
              <small>Panel Admin</small>
            </div>
          )}
          <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {visibleNav.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.exact}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`}
            >
              <span className="sidebar-icon">{n.icon}</span>
              {!collapsed && <span>{n.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{user?.nombre?.[0]?.toUpperCase()}</div>
            {!collapsed && (
              <div>
                <strong>{user?.nombre}</strong>
                <small className={`badge badge-${user?.rol === 'admin' ? 'blue' : 'gray'}`}>
                  {user?.rol}
                </small>
              </div>
            )}
          </div>
          <button className="sidebar-logout" onClick={handleLogout} title="Cerrar sesión">
            🚪{!collapsed && ' Salir'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

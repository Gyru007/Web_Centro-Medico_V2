import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Páginas públicas
import LandingPage    from './pages/LandingPage'
import MedicosPublic  from './pages/MedicosPublic'
import BlogPublic     from './pages/BlogPublic'
import Servicios      from './pages/Servicios'
import Contacto       from './pages/Contacto'

// Panel admin
import AdminLogin     from './pages/admin/AdminLogin'
import AdminLayout    from './components/AdminLayout'
import Dashboard      from './pages/admin/Dashboard'
import CitasAdmin     from './pages/admin/CitasAdmin'
import MedicosAdmin   from './pages/admin/MedicosAdmin'
import BlogAdmin      from './pages/admin/BlogAdmin'
import UsuariosAdmin  from './pages/admin/UsuariosAdmin'

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="spinner" />
  if (!user) return <Navigate to="/admin/login" replace />
  if (roles && !roles.includes(user.rol)) return <Navigate to="/admin" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Público ── */}
          <Route path="/"          element={<LandingPage />} />
          <Route path="/medicos"   element={<MedicosPublic />} />
          <Route path="/blog"      element={<BlogPublic />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/contacto"  element={<Contacto />} />

          {/* ── Admin ── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="citas"    element={<CitasAdmin />} />
            <Route path="medicos"  element={<MedicosAdmin />} />
            <Route path="blog"     element={<BlogAdmin />} />
            <Route path="usuarios" element={
              <ProtectedRoute roles={['admin']}>
                <UsuariosAdmin />
              </ProtectedRoute>
            } />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

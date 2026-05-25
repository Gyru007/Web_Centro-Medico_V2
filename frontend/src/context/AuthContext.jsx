import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token  = localStorage.getItem('token')
    const nombre = localStorage.getItem('nombre')
    const rol    = localStorage.getItem('rol')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser({ token, nombre, rol })
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const form = new URLSearchParams()
    form.append('username', email)
    form.append('password', password)
    const { data } = await axios.post('/login', form)
    localStorage.setItem('token',  data.access_token)
    localStorage.setItem('nombre', data.nombre)
    localStorage.setItem('rol',    data.rol)
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`
    setUser({ token: data.access_token, nombre: data.nombre, rol: data.rol })
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('nombre')
    localStorage.removeItem('rol')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

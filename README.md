# 🏥 Plataforma Web — Centro Médico Real Méndez

Sistema web completo para marketing digital y gestión interna de citas médicas.  
**Stack:** React (Vite) · FastAPI (Python) · MySQL 8.0

---

## 📁 Estructura del Proyecto

```
WEB Centro Medico/
├── database/
│   └── schema.sql          ← Script SQL completo (ejecutar primero)
├── backend/
│   ├── main.py             ← Punto de entrada FastAPI
│   ├── database.py         ← Conexión SQLAlchemy
│   ├── models.py           ← Modelos ORM (todas las tablas)
│   ├── schemas.py          ← Validación Pydantic
│   ├── auth.py             ← JWT + RBAC
│   ├── crear_admin.py      ← Script de inicialización (ejecutar 1 vez)
│   ├── requirements.txt    ← Dependencias Python
│   ├── .env.example        ← Variables de entorno (copiar a .env)
│   └── routers/
│       ├── public.py       ← Rutas públicas
│       ├── citas.py        ← Gestión de citas
│       ├── medicos.py      ← CRUD médicos
│       ├── blog.py         ← CRUD blog
│       ├── usuarios.py     ← Gestión usuarios
│       └── seo.py          ← sitemap.xml y Schema.org
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── App.jsx          ← Enrutador principal
        ├── context/         ← AuthContext (estado global JWT)
        ├── components/      ← Header, Footer, FormularioCita, etc.
        └── pages/           ← Páginas públicas y panel admin
```

---

## ⚙️ Instalación Paso a Paso

### 1. Base de Datos (MySQL)

```bash
# Asegúrate de tener MySQL 8.0+ corriendo
mysql -u root -p < database/schema.sql
```

Esto creará la base de datos `realmendez_tg` con todas las tablas, índices,
vistas y datos semilla (especialidades, categorías de blog, configuración SEO).

---

### 2. Backend (FastAPI)

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de MySQL y una SECRET_KEY segura

# Inicializar usuario admin y datos base
python crear_admin.py

# Iniciar el servidor de desarrollo
uvicorn main:app --reload --port 8000
```

El backend estará disponible en:
- API:  http://localhost:8000
- Docs: http://localhost:8000/api/docs

**Credenciales iniciales:**
- Email: `admin@realmendez.com`
- Contraseña: `admin123`
- ⚠️ **Cambiar inmediatamente en producción**

---

### 3. Frontend (React + Vite)

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en: http://localhost:5173

---

## 🌐 Rutas de la Aplicación

### Públicas (Landing Page)
| Ruta | Descripción |
|------|-------------|
| `/` | Landing page con hero, médicos, especialidades y formulario de citas |
| `/servicios` | Catálogo completo de especialidades médicas |
| `/medicos` | Directorio de médicos con búsqueda y filtros |
| `/blog` | Blog educativo con artículos por categoría |
| `/contacto` | Formulario de contacto |

### Panel Administrativo
| Ruta | Descripción | Roles |
|------|-------------|-------|
| `/admin/login` | Acceso seguro al panel | — |
| `/admin` | Dashboard con métricas | Todos |
| `/admin/citas` | Gestión de solicitudes de citas | Admin, Recepcionista |
| `/admin/medicos` | CRUD de médicos y especialidades | Admin |
| `/admin/blog` | Redacción y publicación de artículos | Admin, Editor |
| `/admin/usuarios` | Gestión del personal del sistema | Admin |

---

## 🔌 API REST — Endpoints Principales

### Públicos (sin autenticación)
```
GET  /public/especialidades         → Catálogo de especialidades activas
GET  /public/medicos                → Directorio de médicos activos
GET  /public/medicos/{slug}         → Perfil individual de médico
GET  /public/blog                   → Artículos publicados
GET  /public/blog/{slug}            → Artículo individual
POST /public/agendar-cita           → Solicitud de cita
GET  /public/verificar-paciente/{cedula} → Autorrelleno del formulario
POST /public/contacto               → Formulario de contacto
```

### Autenticación
```
POST /login                         → JWT token (OAuth2PasswordRequestForm)
```

### SEO (sin autenticación)
```
GET  /sitemap.xml                   → Mapa del sitio dinámico para Google
GET  /schema/clinica                → JSON-LD de la organización médica
GET  /schema/medico/{id}            → JSON-LD del perfil de médico
```

### Admin (requiere JWT)
```
GET  /api/citas                     → Todas las citas (filtrable por estado)
PUT  /api/citas/{id}/estado         → Confirmar / cancelar / reprogramar
GET  /api/medicos                   → Lista de médicos (admin)
POST /api/medicos                   → Crear médico
PUT  /api/medicos/{id}              → Editar médico
GET  /api/blog                      → Lista de posts (admin)
POST /api/blog                      → Crear artículo
PUT  /api/blog/{id}                 → Editar artículo
GET  /api/usuarios                  → Lista de usuarios (solo admin)
POST /api/usuarios                  → Crear usuario (solo admin)
```

---

## 🔐 Roles del Sistema (RBAC)

| Rol | Permisos |
|-----|----------|
| **admin** | Acceso total: usuarios, médicos, citas, blog, configuración |
| **editor** | Redacción y publicación de artículos en el blog |
| **recepcionista** | Visualización y gestión de la agenda de citas |

---

## 🎨 Paleta de Colores Corporativa

| Variable | Color | Uso |
|----------|-------|-----|
| `--primary-blue` | `#0056D2` | Botones, CTAs, acentos |
| `--pure-white`   | `#FFFFFF` | Fondos principales |
| `--charcoal`     | `#1A1A2E` | Tipografía, sidebar |
| `--blue-light`   | `#EBF2FF` | Fondos secundarios, badges |

---

## 🔧 Variables de Entorno (.env)

```env
DATABASE_URL=mysql+pymysql://root:PASSWORD@localhost:3306/realmendez_tg
SECRET_KEY=tu_clave_secreta_muy_larga_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480
FRONTEND_URL=http://localhost:5173
```

---

## 📦 Build para Producción

```bash
# Frontend
cd frontend
npm run build                   # Genera dist/

# Backend
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## 📝 Créditos

Desarrollado como **Trabajo de Grado** basado en el proyecto de pasantías  
del Centro Médico Real Méndez. Arquitectura desacoplada API REST.

**Tecnologías:** React 18 · Vite · FastAPI · SQLAlchemy · MySQL · JWT

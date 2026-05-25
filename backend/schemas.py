from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
from datetime import date, time, datetime


# ── AUTH ─────────────────────────────────────────────────────

class Token(BaseModel):
    access_token: str
    token_type: str
    rol: str
    nombre: str

class RolOut(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None
    class Config:
        from_attributes = True

class UsuarioOut(BaseModel):
    id: int
    nombre: str
    email: str
    rol: RolOut
    activo: bool
    creado_en: Optional[datetime]
    class Config:
        from_attributes = True

class UsuarioCreate(BaseModel):
    nombre: str
    email: EmailStr
    password: str
    rol_id: int

class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    activo: Optional[bool] = None
    rol_id: Optional[int] = None


# ── ESPECIALIDADES ───────────────────────────────────────────

class EspecialidadOut(BaseModel):
    id: int
    nombre: str
    slug: str
    descripcion: Optional[str]
    icono_url: Optional[str]
    banner_url: Optional[str]
    meta_titulo: Optional[str]
    meta_desc: Optional[str]
    activo: bool
    orden: int
    class Config:
        from_attributes = True

class EspecialidadCreate(BaseModel):
    nombre: str
    slug: str
    descripcion: Optional[str] = None
    icono_url: Optional[str] = None
    banner_url: Optional[str] = None
    meta_titulo: Optional[str] = None
    meta_desc: Optional[str] = None
    orden: int = 0


# ── MÉDICOS ──────────────────────────────────────────────────

class MedicoOut(BaseModel):
    id: int
    nombre: str
    slug: str
    especialidad_id: int
    titulo_academico: Optional[str]
    biografia: Optional[str]
    foto_url: Optional[str]
    numero_mpps: Optional[str]
    horario_consulta: Optional[Any]
    email_contacto: Optional[str]
    telefono_contacto: Optional[str]
    redes_sociales: Optional[Any]
    meta_titulo: Optional[str]
    meta_desc: Optional[str]
    activo: bool
    orden: int
    especialidad: Optional[EspecialidadOut]
    class Config:
        from_attributes = True

class MedicoCreate(BaseModel):
    nombre: str
    slug: str
    especialidad_id: int
    titulo_academico: Optional[str] = None
    biografia: Optional[str] = None
    foto_url: Optional[str] = None
    numero_mpps: Optional[str] = None
    horario_consulta: Optional[Any] = None
    email_contacto: Optional[str] = None
    telefono_contacto: Optional[str] = None
    redes_sociales: Optional[Any] = None
    meta_titulo: Optional[str] = None
    meta_desc: Optional[str] = None
    orden: int = 0

class MedicoUpdate(BaseModel):
    nombre: Optional[str] = None
    titulo_academico: Optional[str] = None
    biografia: Optional[str] = None
    foto_url: Optional[str] = None
    horario_consulta: Optional[Any] = None
    email_contacto: Optional[str] = None
    telefono_contacto: Optional[str] = None
    redes_sociales: Optional[Any] = None
    activo: Optional[bool] = None
    orden: Optional[int] = None


# ── BLOG ─────────────────────────────────────────────────────

class CategoriaOut(BaseModel):
    id: int
    nombre: str
    slug: str
    class Config:
        from_attributes = True

class PostOut(BaseModel):
    id: int
    titulo: str
    slug: str
    resumen: Optional[str]
    contenido: str
    imagen_portada: Optional[str]
    autor: Optional[UsuarioOut]
    categoria: Optional[CategoriaOut]
    meta_titulo: Optional[str]
    meta_desc: Optional[str]
    tags: Optional[Any]
    estado: str
    vistas: int
    publicado_en: Optional[datetime]
    creado_en: Optional[datetime]
    class Config:
        from_attributes = True

class PostCreate(BaseModel):
    titulo: str
    slug: str
    resumen: Optional[str] = None
    contenido: str
    imagen_portada: Optional[str] = None
    categoria_id: int
    especialidad_id: Optional[int] = None
    meta_titulo: Optional[str] = None
    meta_desc: Optional[str] = None
    tags: Optional[List[str]] = None
    estado: str = "borrador"

class PostUpdate(BaseModel):
    titulo: Optional[str] = None
    resumen: Optional[str] = None
    contenido: Optional[str] = None
    imagen_portada: Optional[str] = None
    categoria_id: Optional[int] = None
    tags: Optional[List[str]] = None
    estado: Optional[str] = None
    meta_titulo: Optional[str] = None
    meta_desc: Optional[str] = None


# ── CITAS ────────────────────────────────────────────────────

class CitaCreate(BaseModel):
    nombre_paciente: str
    cedula_paciente: str
    email_paciente: Optional[EmailStr] = None
    telefono_paciente: str
    medico_id: int
    especialidad_id: int
    fecha_cita: date
    hora_cita: time
    motivo_consulta: Optional[str] = None

class CitaOut(BaseModel):
    id: int
    nombre_paciente: str
    cedula_paciente: str
    email_paciente: Optional[str]
    telefono_paciente: str
    medico: Optional[MedicoOut]
    especialidad: Optional[EspecialidadOut]
    fecha_cita: date
    hora_cita: time
    motivo_consulta: Optional[str]
    estado: str
    notas_recepcion: Optional[str]
    canal_origen: str
    creado_en: Optional[datetime]
    class Config:
        from_attributes = True

class ActualizarEstadoCita(BaseModel):
    estado: str
    notas_recepcion: Optional[str] = None


# ── CONTACTO ─────────────────────────────────────────────────

class ContactoCreate(BaseModel):
    nombre: str
    email: EmailStr
    telefono: Optional[str] = None
    asunto: Optional[str] = None
    mensaje: str

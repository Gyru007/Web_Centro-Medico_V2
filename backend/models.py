import enum
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, DateTime,
    Enum, ForeignKey, JSON, Date, Time, BigInteger, func
)
from sqlalchemy.orm import relationship
from database import Base


# ── Enums ────────────────────────────────────────────────────

class EstadoCita(str, enum.Enum):
    pendiente    = "pendiente"
    confirmada   = "confirmada"
    reprogramada = "reprogramada"
    cancelada    = "cancelada"
    completada   = "completada"

class EstadoPost(str, enum.Enum):
    borrador  = "borrador"
    publicado = "publicado"
    archivado = "archivado"

class CanalCita(str, enum.Enum):
    web        = "web"
    whatsapp   = "whatsapp"
    telefono   = "telefono"
    presencial = "presencial"

class GeneroEnum(str, enum.Enum):
    masculino      = "masculino"
    femenino       = "femenino"
    otro           = "otro"
    no_especificado = "no_especificado"


# ── Modelos ──────────────────────────────────────────────────

class Rol(Base):
    __tablename__ = "roles"
    id          = Column(Integer, primary_key=True, index=True)
    nombre      = Column(String(50), unique=True, nullable=False)
    descripcion = Column(Text)
    creado_en   = Column(DateTime, server_default=func.now())
    usuarios    = relationship("Usuario", back_populates="rol")


class Usuario(Base):
    __tablename__ = "usuarios"
    id              = Column(Integer, primary_key=True, index=True)
    nombre          = Column(String(100), nullable=False)
    email           = Column(String(150), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    rol_id          = Column(Integer, ForeignKey("roles.id"), nullable=False)
    activo          = Column(Boolean, default=True)
    avatar_url      = Column(String(500))
    creado_en       = Column(DateTime, server_default=func.now())
    actualizado_en  = Column(DateTime, server_default=func.now(), onupdate=func.now())
    rol             = relationship("Rol", back_populates="usuarios")
    posts           = relationship("PostBlog", back_populates="autor")
    citas_gestionadas = relationship("Cita", back_populates="recepcionista",
                                     foreign_keys="Cita.atendida_por")


class Especialidad(Base):
    __tablename__ = "especialidades"
    id          = Column(Integer, primary_key=True, index=True)
    nombre      = Column(String(100), unique=True, nullable=False)
    slug        = Column(String(120), unique=True, nullable=False, index=True)
    descripcion = Column(Text)
    icono_url   = Column(String(500))
    banner_url  = Column(String(500))
    meta_titulo = Column(String(70))
    meta_desc   = Column(String(165))
    activo      = Column(Boolean, default=True)
    orden       = Column(Integer, default=0)
    creado_en   = Column(DateTime, server_default=func.now())
    medicos     = relationship("Medico", back_populates="especialidad")
    citas       = relationship("Cita", back_populates="especialidad")


class Medico(Base):
    __tablename__ = "medicos"
    id                = Column(Integer, primary_key=True, index=True)
    nombre            = Column(String(150), nullable=False)
    slug              = Column(String(170), unique=True, nullable=False, index=True)
    especialidad_id   = Column(Integer, ForeignKey("especialidades.id"), nullable=False)
    titulo_academico  = Column(String(100))
    biografia         = Column(Text)
    foto_url          = Column(String(500))
    numero_mpps       = Column(String(50))
    horario_consulta  = Column(JSON)
    email_contacto    = Column(String(150))
    telefono_contacto = Column(String(30))
    redes_sociales    = Column(JSON)
    meta_titulo       = Column(String(70))
    meta_desc         = Column(String(165))
    activo            = Column(Boolean, default=True)
    orden             = Column(Integer, default=0)
    creado_en         = Column(DateTime, server_default=func.now())
    actualizado_en    = Column(DateTime, server_default=func.now(), onupdate=func.now())
    especialidad      = relationship("Especialidad", back_populates="medicos")
    citas             = relationship("Cita", back_populates="medico")
    horarios          = relationship("HorarioDisponible", back_populates="medico")


class CategoriaBlog(Base):
    __tablename__ = "categorias_blog"
    id          = Column(Integer, primary_key=True, index=True)
    nombre      = Column(String(100), unique=True, nullable=False)
    slug        = Column(String(120), unique=True, nullable=False)
    descripcion = Column(Text)
    creado_en   = Column(DateTime, server_default=func.now())
    posts       = relationship("PostBlog", back_populates="categoria")


class PostBlog(Base):
    __tablename__ = "posts_blog"
    id              = Column(Integer, primary_key=True, index=True)
    titulo          = Column(String(200), nullable=False)
    slug            = Column(String(220), unique=True, nullable=False, index=True)
    resumen         = Column(String(500))
    contenido       = Column(Text, nullable=False)
    imagen_portada  = Column(String(500))
    autor_id        = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    categoria_id    = Column(Integer, ForeignKey("categorias_blog.id"), nullable=False)
    especialidad_id = Column(Integer, ForeignKey("especialidades.id"))
    meta_titulo     = Column(String(70))
    meta_desc       = Column(String(165))
    tags            = Column(JSON)
    estado          = Column(Enum(EstadoPost), default=EstadoPost.borrador)
    vistas          = Column(Integer, default=0)
    publicado_en    = Column(DateTime)
    creado_en       = Column(DateTime, server_default=func.now())
    actualizado_en  = Column(DateTime, server_default=func.now(), onupdate=func.now())
    autor           = relationship("Usuario", back_populates="posts")
    categoria       = relationship("CategoriaBlog", back_populates="posts")
    especialidad    = relationship("Especialidad", back_populates=None)


class Paciente(Base):
    __tablename__ = "pacientes"
    id               = Column(Integer, primary_key=True, index=True)
    cedula           = Column(String(20), unique=True, nullable=False, index=True)
    nombre           = Column(String(150), nullable=False)
    apellido         = Column(String(150), nullable=False)
    email            = Column(String(150))
    telefono         = Column(String(30))
    fecha_nacimiento = Column(Date)
    genero           = Column(Enum(GeneroEnum), default=GeneroEnum.no_especificado)
    creado_en        = Column(DateTime, server_default=func.now())
    actualizado_en   = Column(DateTime, server_default=func.now(), onupdate=func.now())
    citas            = relationship("Cita", back_populates="paciente")


class HorarioDisponible(Base):
    __tablename__ = "horarios_disponibles"
    id           = Column(Integer, primary_key=True, index=True)
    medico_id    = Column(Integer, ForeignKey("medicos.id"), nullable=False)
    dia_semana   = Column(Integer, nullable=False)
    hora_inicio  = Column(Time, nullable=False)
    hora_fin     = Column(Time, nullable=False)
    duracion_min = Column(Integer, default=30)
    activo       = Column(Boolean, default=True)
    medico       = relationship("Medico", back_populates="horarios")


class Cita(Base):
    __tablename__ = "citas"
    id                = Column(Integer, primary_key=True, index=True)
    paciente_id       = Column(Integer, ForeignKey("pacientes.id"))
    nombre_paciente   = Column(String(150), nullable=False)
    cedula_paciente   = Column(String(20), nullable=False, index=True)
    email_paciente    = Column(String(150))
    telefono_paciente = Column(String(30), nullable=False)
    medico_id         = Column(Integer, ForeignKey("medicos.id"), nullable=False)
    especialidad_id   = Column(Integer, ForeignKey("especialidades.id"), nullable=False)
    fecha_cita        = Column(Date, nullable=False, index=True)
    hora_cita         = Column(Time, nullable=False)
    motivo_consulta   = Column(Text)
    estado            = Column(Enum(EstadoCita), default=EstadoCita.pendiente, index=True)
    notas_recepcion   = Column(Text)
    atendida_por      = Column(Integer, ForeignKey("usuarios.id"))
    canal_origen      = Column(Enum(CanalCita), default=CanalCita.web)
    creado_en         = Column(DateTime, server_default=func.now())
    actualizado_en    = Column(DateTime, server_default=func.now(), onupdate=func.now())
    paciente          = relationship("Paciente", back_populates="citas")
    medico            = relationship("Medico", back_populates="citas")
    especialidad      = relationship("Especialidad", back_populates="citas")
    recepcionista     = relationship("Usuario", back_populates="citas_gestionadas",
                                     foreign_keys=[atendida_por])


class ContactoWeb(Base):
    __tablename__ = "contactos_web"
    id        = Column(Integer, primary_key=True, index=True)
    nombre    = Column(String(150), nullable=False)
    email     = Column(String(150), nullable=False)
    telefono  = Column(String(30))
    asunto    = Column(String(200))
    mensaje   = Column(Text, nullable=False)
    leido     = Column(Boolean, default=False)
    creado_en = Column(DateTime, server_default=func.now())


class ConfiguracionSEO(Base):
    __tablename__ = "configuracion_seo"
    id          = Column(Integer, primary_key=True, index=True)
    clave       = Column(String(100), unique=True, nullable=False)
    valor       = Column(Text)
    descripcion = Column(Text)


class LogActividad(Base):
    __tablename__ = "log_actividad"
    id         = Column(BigInteger, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    accion     = Column(String(100), nullable=False, index=True)
    entidad    = Column(String(50))
    entidad_id = Column(Integer)
    detalle    = Column(JSON)
    ip_origen  = Column(String(45))
    creado_en  = Column(DateTime, server_default=func.now(), index=True)


class BackupRegistro(Base):
    __tablename__ = "backups_registro"
    id             = Column(Integer, primary_key=True, index=True)
    nombre_archivo = Column(String(255), nullable=False)
    tamanio_kb     = Column(Integer)
    estado         = Column(String(20), default="exitoso")
    generado_por   = Column(String(100), default="scheduler")
    creado_en      = Column(DateTime, server_default=func.now())

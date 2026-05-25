-- ============================================================
--  BASE DE DATOS: Centro Médico Real Méndez
--  Motor: MySQL 8.0+
--  Ejecutar: mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS realmendez_tg
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE realmendez_tg;

-- ── ROLES Y USUARIOS ─────────────────────────────────────────
CREATE TABLE roles (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(50) NOT NULL UNIQUE COMMENT 'admin | editor | recepcionista',
    descripcion TEXT,
    creado_en   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios (
    id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre           VARCHAR(100) NOT NULL,
    email            VARCHAR(150) NOT NULL UNIQUE,
    hashed_password  VARCHAR(255) NOT NULL,
    rol_id           INT UNSIGNED NOT NULL,
    activo           BOOLEAN DEFAULT TRUE,
    avatar_url       VARCHAR(500),
    creado_en        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_rol FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- ── CONTENIDO MÉDICO ─────────────────────────────────────────
CREATE TABLE especialidades (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL UNIQUE,
    slug        VARCHAR(120) NOT NULL UNIQUE,
    descripcion TEXT,
    icono_url   VARCHAR(500),
    banner_url  VARCHAR(500),
    meta_titulo VARCHAR(70),
    meta_desc   VARCHAR(165),
    activo      BOOLEAN DEFAULT TRUE,
    orden       INT UNSIGNED DEFAULT 0,
    creado_en   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medicos (
    id                 INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre             VARCHAR(150) NOT NULL,
    slug               VARCHAR(170) NOT NULL UNIQUE,
    especialidad_id    INT UNSIGNED NOT NULL,
    titulo_academico   VARCHAR(100),
    biografia          TEXT,
    foto_url           VARCHAR(500),
    numero_mpps        VARCHAR(50),
    horario_consulta   JSON COMMENT '{"lunes":"08:00-12:00","miercoles":"14:00-18:00"}',
    email_contacto     VARCHAR(150),
    telefono_contacto  VARCHAR(30),
    redes_sociales     JSON COMMENT '{"instagram":"@dr.juan","linkedin":"url"}',
    meta_titulo        VARCHAR(70),
    meta_desc          VARCHAR(165),
    activo             BOOLEAN DEFAULT TRUE,
    orden              INT UNSIGNED DEFAULT 0,
    creado_en          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_medico_especialidad FOREIGN KEY (especialidad_id) REFERENCES especialidades(id)
);

-- ── BLOG EDUCATIVO ───────────────────────────────────────────
CREATE TABLE categorias_blog (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL UNIQUE,
    slug        VARCHAR(120) NOT NULL UNIQUE,
    descripcion TEXT,
    creado_en   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts_blog (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    titulo          VARCHAR(200) NOT NULL,
    slug            VARCHAR(220) NOT NULL UNIQUE,
    resumen         VARCHAR(500),
    contenido       LONGTEXT NOT NULL,
    imagen_portada  VARCHAR(500),
    autor_id        INT UNSIGNED NOT NULL,
    categoria_id    INT UNSIGNED NOT NULL,
    especialidad_id INT UNSIGNED,
    meta_titulo     VARCHAR(70),
    meta_desc       VARCHAR(165),
    tags            JSON,
    estado          ENUM('borrador','publicado','archivado') DEFAULT 'borrador',
    vistas          INT UNSIGNED DEFAULT 0,
    publicado_en    TIMESTAMP NULL,
    creado_en       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_post_autor     FOREIGN KEY (autor_id)        REFERENCES usuarios(id),
    CONSTRAINT fk_post_categoria FOREIGN KEY (categoria_id)    REFERENCES categorias_blog(id),
    CONSTRAINT fk_post_espec     FOREIGN KEY (especialidad_id) REFERENCES especialidades(id)
);

-- ── AGENDAMIENTO DE CITAS ────────────────────────────────────
CREATE TABLE pacientes (
    id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cedula           VARCHAR(20) NOT NULL UNIQUE,
    nombre           VARCHAR(150) NOT NULL,
    apellido         VARCHAR(150) NOT NULL,
    email            VARCHAR(150),
    telefono         VARCHAR(30),
    fecha_nacimiento DATE,
    genero           ENUM('masculino','femenino','otro','no_especificado') DEFAULT 'no_especificado',
    creado_en        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE horarios_disponibles (
    id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    medico_id    INT UNSIGNED NOT NULL,
    dia_semana   TINYINT UNSIGNED NOT NULL COMMENT '1=Lunes, 7=Domingo',
    hora_inicio  TIME NOT NULL,
    hora_fin     TIME NOT NULL,
    duracion_min INT UNSIGNED DEFAULT 30,
    activo       BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_horario_medico FOREIGN KEY (medico_id) REFERENCES medicos(id),
    UNIQUE KEY uk_horario (medico_id, dia_semana, hora_inicio)
);

CREATE TABLE citas (
    id                 INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    paciente_id        INT UNSIGNED,
    nombre_paciente    VARCHAR(150) NOT NULL,
    cedula_paciente    VARCHAR(20)  NOT NULL,
    email_paciente     VARCHAR(150),
    telefono_paciente  VARCHAR(30)  NOT NULL,
    medico_id          INT UNSIGNED NOT NULL,
    especialidad_id    INT UNSIGNED NOT NULL,
    fecha_cita         DATE         NOT NULL,
    hora_cita          TIME         NOT NULL,
    motivo_consulta    TEXT,
    estado             ENUM('pendiente','confirmada','reprogramada','cancelada','completada') DEFAULT 'pendiente',
    notas_recepcion    TEXT,
    atendida_por       INT UNSIGNED,
    canal_origen       ENUM('web','whatsapp','telefono','presencial') DEFAULT 'web',
    creado_en          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cita_paciente     FOREIGN KEY (paciente_id)    REFERENCES pacientes(id) ON DELETE SET NULL,
    CONSTRAINT fk_cita_medico       FOREIGN KEY (medico_id)       REFERENCES medicos(id),
    CONSTRAINT fk_cita_especialidad FOREIGN KEY (especialidad_id) REFERENCES especialidades(id),
    CONSTRAINT fk_cita_recepcion    FOREIGN KEY (atendida_por)    REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE contactos_web (
    id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre    VARCHAR(150) NOT NULL,
    email     VARCHAR(150) NOT NULL,
    telefono  VARCHAR(30),
    asunto    VARCHAR(200),
    mensaje   TEXT NOT NULL,
    leido     BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── SEO Y CONFIGURACIÓN ──────────────────────────────────────
CREATE TABLE configuracion_seo (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    clave       VARCHAR(100) NOT NULL UNIQUE,
    valor       TEXT,
    descripcion TEXT,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE log_actividad (
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED,
    accion     VARCHAR(100) NOT NULL,
    entidad    VARCHAR(50),
    entidad_id INT UNSIGNED,
    detalle    JSON,
    ip_origen  VARCHAR(45),
    creado_en  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_log_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_log_accion (accion),
    INDEX idx_log_fecha  (creado_en)
);

CREATE TABLE backups_registro (
    id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre_archivo VARCHAR(255) NOT NULL,
    tamanio_kb     INT UNSIGNED,
    estado         ENUM('exitoso','fallido') DEFAULT 'exitoso',
    generado_por   VARCHAR(100) DEFAULT 'scheduler',
    creado_en      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── ÍNDICES ──────────────────────────────────────────────────
ALTER TABLE posts_blog    ADD FULLTEXT INDEX ft_blog (titulo, resumen, contenido);
ALTER TABLE medicos        ADD INDEX idx_medico_slug  (slug);
ALTER TABLE especialidades ADD INDEX idx_espec_slug   (slug);
ALTER TABLE citas          ADD INDEX idx_cita_estado  (estado);
ALTER TABLE citas          ADD INDEX idx_cita_fecha   (fecha_cita);
ALTER TABLE citas          ADD INDEX idx_cita_cedula  (cedula_paciente);
ALTER TABLE pacientes      ADD INDEX idx_pac_cedula   (cedula);

-- ── VISTAS ───────────────────────────────────────────────────
CREATE VIEW vista_citas_pendientes AS
SELECT
    c.id,
    c.nombre_paciente,
    c.cedula_paciente,
    c.telefono_paciente,
    c.email_paciente,
    m.nombre        AS medico,
    e.nombre        AS especialidad,
    c.fecha_cita,
    c.hora_cita,
    c.motivo_consulta,
    c.estado,
    c.canal_origen,
    c.creado_en     AS solicitada_en
FROM citas c
JOIN medicos       m ON c.medico_id       = m.id
JOIN especialidades e ON c.especialidad_id = e.id
WHERE c.estado = 'pendiente'
ORDER BY c.fecha_cita ASC, c.hora_cita ASC;

CREATE VIEW vista_posts_publicados AS
SELECT
    p.id, p.titulo, p.slug, p.resumen, p.imagen_portada,
    u.nombre  AS autor,
    cb.nombre AS categoria,
    p.tags, p.vistas, p.publicado_en
FROM posts_blog p
JOIN usuarios        u  ON p.autor_id     = u.id
JOIN categorias_blog cb ON p.categoria_id = cb.id
WHERE p.estado = 'publicado'
ORDER BY p.publicado_en DESC;

-- ── SEED DATA ────────────────────────────────────────────────
INSERT INTO roles (nombre, descripcion) VALUES
    ('admin',         'Acceso total al sistema'),
    ('editor',        'Gestión de blog y contenido CMS'),
    ('recepcionista', 'Gestión de agenda de citas');

INSERT INTO configuracion_seo (clave, valor, descripcion) VALUES
    ('sitio_nombre',      'Centro Médico Real Méndez',                    'Nombre del sitio'),
    ('sitio_descripcion', 'Centro médico especializado en salud integral', 'Meta description global'),
    ('ga4_id',            'G-XXXXXXXXXX',                                  'Google Analytics 4 ID'),
    ('whatsapp_numero',   '+58XXXXXXXXXX',                                 'Widget WhatsApp Business'),
    ('color_primario',    '#0056D2',                                       'Azul médico corporativo');

INSERT INTO especialidades (nombre, slug, descripcion, meta_titulo, meta_desc, orden) VALUES
    ('Cardiología',    'cardiologia',    'Diagnóstico y tratamiento del corazón y sistema cardiovascular.',      'Cardiología | Real Méndez',    'Especialistas cardiovasculares. Agende su consulta hoy.',             1),
    ('Pediatría',      'pediatria',      'Atención médica integral para niños y adolescentes.',                  'Pediatría | Real Méndez',      'Atención pediátrica especializada para sus hijos.',                   2),
    ('Neurología',     'neurologia',     'Diagnóstico y tratamiento del sistema nervioso.',                      'Neurología | Real Méndez',     'Neurología de alta especialidad. Reserve su cita.',                   3),
    ('Ginecología',    'ginecologia',    'Salud femenina, ginecología y obstetricia especializada.',             'Ginecología | Real Méndez',    'Atención ginecológica integral. Especialistas en salud femenina.',    4),
    ('Traumatología',  'traumatologia',  'Lesiones del sistema musculoesquelético, huesos y articulaciones.',   'Traumatología | Real Méndez',  'Especialistas en huesos, articulaciones y rehabilitación.',           5),
    ('Dermatología',   'dermatologia',   'Diagnóstico y tratamiento de enfermedades de la piel.',               'Dermatología | Real Méndez',   'Dermatólogos certificados. Cuide su piel con expertos.',             6);

INSERT INTO categorias_blog (nombre, slug, descripcion) VALUES
    ('Prevención y Salud',  'prevencion',  'Consejos para mantener un estilo de vida saludable'),
    ('Nutrición',           'nutricion',   'Guías de alimentación y dieta balanceada'),
    ('Salud Mental',        'salud-mental','Bienestar emocional y psicológico'),
    ('Noticias Médicas',    'noticias',    'Últimas novedades del centro médico');

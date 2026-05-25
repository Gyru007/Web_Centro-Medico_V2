"""
Script de inicialización — Ejecutar UNA SOLA VEZ después de configurar .env
    python crear_admin.py
"""
from database import engine, SessionLocal
from models import Base, Rol, Usuario, Especialidad, CategoriaBlog
from auth import hash_password


def inicializar():
    print("🚀 Inicializando base de datos...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Roles
        if db.query(Rol).count() == 0:
            for nombre, desc in [
                ("admin",         "Acceso total al sistema"),
                ("editor",        "Gestión de blog y contenido CMS"),
                ("recepcionista", "Gestión de agenda de citas"),
            ]:
                db.add(Rol(nombre=nombre, descripcion=desc))
            db.commit()
            print("✅ Roles creados")

        # Superusuario admin
        if db.query(Usuario).count() == 0:
            rol_admin = db.query(Rol).filter(Rol.nombre == "admin").first()
            db.add(Usuario(
                nombre="Administrador",
                email="admin@realmendez.com",
                hashed_password=hash_password("admin123"),
                rol_id=rol_admin.id,
            ))
            db.commit()
            print("✅ Usuario admin creado")
            print("   Email:      admin@realmendez.com")
            print("   Contraseña: admin123")
            print("   ⚠️  CAMBIA LA CONTRASEÑA EN PRODUCCIÓN")

        # Especialidades de ejemplo
        if db.query(Especialidad).count() == 0:
            especialidades = [
                ("Cardiología",   "cardiologia",   "Diagnóstico y tratamiento del corazón.", 1),
                ("Pediatría",     "pediatria",     "Atención médica para niños y adolescentes.", 2),
                ("Neurología",    "neurologia",    "Enfermedades del sistema nervioso.", 3),
                ("Ginecología",   "ginecologia",   "Salud femenina integral.", 4),
                ("Traumatología", "traumatologia", "Lesiones musculoesqueléticas.", 5),
                ("Dermatología",  "dermatologia",  "Enfermedades de la piel.", 6),
            ]
            for nombre, slug, desc, orden in especialidades:
                db.add(Especialidad(
                    nombre=nombre, slug=slug,
                    descripcion=desc, orden=orden,
                    meta_titulo=f"{nombre} | Centro Médico Real Méndez",
                    meta_desc=f"Especialistas en {nombre.lower()}. Agende su consulta hoy.",
                ))
            db.commit()
            print("✅ Especialidades creadas")

        # Categorías blog
        if db.query(CategoriaBlog).count() == 0:
            for nombre, slug in [
                ("Prevención y Salud", "prevencion"),
                ("Nutrición",          "nutricion"),
                ("Salud Mental",       "salud-mental"),
                ("Noticias Médicas",   "noticias"),
            ]:
                db.add(CategoriaBlog(nombre=nombre, slug=slug))
            db.commit()
            print("✅ Categorías de blog creadas")

        print("\n🎉 Inicialización completada exitosamente")
    finally:
        db.close()


if __name__ == "__main__":
    inicializar()

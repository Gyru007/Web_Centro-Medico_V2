from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os

from database import engine, Base, get_db
import models
import auth
from routers import public, citas, medicos, blog, usuarios, seo

load_dotenv()

# Crear todas las tablas al iniciar
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API Centro Médico Real Méndez",
    description="API REST para la plataforma web de marketing y gestión de citas médicas",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# ── CORS ──────────────────────────────────────────────────────
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────
app.include_router(public.router,   prefix="/public",    tags=["🌐 Público"])
app.include_router(citas.router,    prefix="/api",       tags=["📅 Citas"])
app.include_router(medicos.router,  prefix="/api",       tags=["👨‍⚕️ Médicos (Admin)"])
app.include_router(blog.router,     prefix="/api",       tags=["📝 Blog (Admin)"])
app.include_router(usuarios.router, prefix="/api",       tags=["👤 Usuarios (Admin)"])
app.include_router(seo.router,      prefix="",           tags=["🔍 SEO"])


# ── Auth ──────────────────────────────────────────────────────
@app.post("/login", tags=["🔐 Autenticación"])
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = (
        db.query(models.Usuario)
        .filter(models.Usuario.email == form_data.username)
        .first()
    )
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    if not user.activo:
        raise HTTPException(status_code=403, detail="Usuario desactivado")

    token = auth.create_access_token(
        data={"sub": user.email, "rol": user.rol.nombre}
    )
    return {
        "access_token": token,
        "token_type": "bearer",
        "rol": user.rol.nombre,
        "nombre": user.nombre,
    }


@app.get("/", tags=["Estado"])
def root():
    return {
        "status": "online",
        "app": "Centro Médico Real Méndez API",
        "version": "2.0.0",
        "docs": "/api/docs",
    }

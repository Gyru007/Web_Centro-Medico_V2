from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter()


@router.get("/especialidades", response_model=list[schemas.EspecialidadOut])
def get_especialidades(db: Session = Depends(get_db)):
    return (
        db.query(models.Especialidad)
        .filter(models.Especialidad.activo == True)
        .order_by(models.Especialidad.orden)
        .all()
    )


@router.get("/medicos", response_model=list[schemas.MedicoOut])
def get_medicos(db: Session = Depends(get_db)):
    return (
        db.query(models.Medico)
        .filter(models.Medico.activo == True)
        .order_by(models.Medico.orden)
        .all()
    )


@router.get("/medicos/{slug}", response_model=schemas.MedicoOut)
def get_perfil_medico(slug: str, db: Session = Depends(get_db)):
    medico = (
        db.query(models.Medico)
        .filter(models.Medico.slug == slug, models.Medico.activo == True)
        .first()
    )
    if not medico:
        raise HTTPException(status_code=404, detail="Médico no encontrado")
    return medico


@router.get("/blog", response_model=list[schemas.PostOut])
def get_blog_posts(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return (
        db.query(models.PostBlog)
        .filter(models.PostBlog.estado == "publicado")
        .order_by(models.PostBlog.publicado_en.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/blog/{slug}", response_model=schemas.PostOut)
def get_post(slug: str, db: Session = Depends(get_db)):
    post = (
        db.query(models.PostBlog)
        .filter(models.PostBlog.slug == slug, models.PostBlog.estado == "publicado")
        .first()
    )
    if not post:
        raise HTTPException(status_code=404, detail="Artículo no encontrado")
    post.vistas += 1
    db.commit()
    db.refresh(post)
    return post


@router.post("/agendar-cita", status_code=201)
def agendar_cita(cita_data: schemas.CitaCreate, db: Session = Depends(get_db)):
    nueva_cita = models.Cita(
        **cita_data.model_dump(),
        estado="pendiente",
        canal_origen="web"
    )
    db.add(nueva_cita)
    db.commit()
    db.refresh(nueva_cita)
    return {"mensaje": "Cita solicitada con éxito", "id": nueva_cita.id}


@router.get("/verificar-paciente/{cedula}")
def verificar_paciente(cedula: str, db: Session = Depends(get_db)):
    paciente = db.query(models.Paciente).filter(models.Paciente.cedula == cedula).first()
    if paciente:
        return {
            "encontrado": True,
            "nombre": f"{paciente.nombre} {paciente.apellido}",
            "email": paciente.email,
            "telefono": paciente.telefono,
        }
    return {"encontrado": False}


@router.get("/consultar-cita/{cedula}")
def consultar_cita(cedula: str, db: Session = Depends(get_db)):
    return (
        db.query(models.Cita)
        .filter(models.Cita.cedula_paciente.like(f"%{cedula}%"))
        .order_by(models.Cita.fecha_cita.desc())
        .all()
    )


@router.post("/contacto", status_code=201)
def enviar_contacto(contacto: schemas.ContactoCreate, db: Session = Depends(get_db)):
    nuevo = models.ContactoWeb(**contacto.model_dump())
    db.add(nuevo)
    db.commit()
    return {"mensaje": "Mensaje recibido. Nos pondremos en contacto pronto."}


@router.get("/categorias-blog", response_model=list[schemas.CategoriaOut])
def get_categorias(db: Session = Depends(get_db)):
    return db.query(models.CategoriaBlog).all()

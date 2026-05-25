from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth import require_admin, get_current_user
import models, schemas

router = APIRouter()


@router.get("/medicos", response_model=list[schemas.MedicoOut])
def get_medicos_admin(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(models.Medico).order_by(models.Medico.orden).all()


@router.post("/medicos", response_model=schemas.MedicoOut, status_code=201)
def crear_medico(
    data: schemas.MedicoCreate,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    existing = db.query(models.Medico).filter(models.Medico.slug == data.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug ya existe")
    medico = models.Medico(**data.model_dump())
    db.add(medico)
    db.commit()
    db.refresh(medico)
    return medico


@router.put("/medicos/{medico_id}", response_model=schemas.MedicoOut)
def actualizar_medico(
    medico_id: int,
    data: schemas.MedicoUpdate,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    medico = db.query(models.Medico).filter(models.Medico.id == medico_id).first()
    if not medico:
        raise HTTPException(status_code=404, detail="Médico no encontrado")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(medico, field, value)
    db.commit()
    db.refresh(medico)
    return medico


@router.delete("/medicos/{medico_id}")
def eliminar_medico(
    medico_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    medico = db.query(models.Medico).filter(models.Medico.id == medico_id).first()
    if not medico:
        raise HTTPException(status_code=404, detail="Médico no encontrado")
    medico.activo = False
    db.commit()
    return {"mensaje": "Médico desactivado"}


@router.get("/especialidades", response_model=list[schemas.EspecialidadOut])
def get_especialidades_admin(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(models.Especialidad).order_by(models.Especialidad.orden).all()


@router.post("/especialidades", response_model=schemas.EspecialidadOut, status_code=201)
def crear_especialidad(
    data: schemas.EspecialidadCreate,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    esp = models.Especialidad(**data.model_dump())
    db.add(esp)
    db.commit()
    db.refresh(esp)
    return esp

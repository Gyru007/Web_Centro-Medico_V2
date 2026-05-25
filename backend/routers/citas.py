from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth import require_recepcionista_or_above, require_admin, get_current_user
import models, schemas

router = APIRouter()


@router.get("/citas", response_model=list[schemas.CitaOut])
def get_todas_citas(
    estado: str = None,
    db: Session = Depends(get_db),
    current_user=Depends(require_recepcionista_or_above),
):
    q = db.query(models.Cita)
    if estado:
        q = q.filter(models.Cita.estado == estado)
    return q.order_by(models.Cita.fecha_cita.asc()).all()


@router.get("/citas/pendientes", response_model=list[schemas.CitaOut])
def get_citas_pendientes(
    db: Session = Depends(get_db),
    current_user=Depends(require_recepcionista_or_above),
):
    return (
        db.query(models.Cita)
        .filter(models.Cita.estado == "pendiente")
        .order_by(models.Cita.fecha_cita.asc())
        .all()
    )


@router.get("/citas/{cita_id}", response_model=schemas.CitaOut)
def get_cita(
    cita_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_recepcionista_or_above),
):
    cita = db.query(models.Cita).filter(models.Cita.id == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return cita


@router.put("/citas/{cita_id}/estado")
def actualizar_estado(
    cita_id: int,
    body: schemas.ActualizarEstadoCita,
    db: Session = Depends(get_db),
    current_user=Depends(require_recepcionista_or_above),
):
    cita = db.query(models.Cita).filter(models.Cita.id == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    cita.estado = body.estado
    if body.notas_recepcion:
        cita.notas_recepcion = body.notas_recepcion
    cita.atendida_por = current_user.id
    db.commit()
    return {"mensaje": f"Cita actualizada a estado: {body.estado}"}


@router.delete("/citas/{cita_id}")
def eliminar_cita(
    cita_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    cita = db.query(models.Cita).filter(models.Cita.id == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    db.delete(cita)
    db.commit()
    return {"mensaje": "Cita eliminada"}


@router.get("/contactos", response_model=None)
def get_contactos(
    db: Session = Depends(get_db),
    current_user=Depends(require_recepcionista_or_above),
):
    return db.query(models.ContactoWeb).order_by(models.ContactoWeb.creado_en.desc()).all()

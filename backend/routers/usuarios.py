from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth import require_admin, hash_password, get_current_user
import models, schemas

router = APIRouter()


@router.get("/usuarios", response_model=list[schemas.UsuarioOut])
def get_usuarios(db: Session = Depends(get_db), _=Depends(require_admin)):
    return db.query(models.Usuario).all()


@router.post("/usuarios", response_model=schemas.UsuarioOut, status_code=201)
def crear_usuario(
    data: schemas.UsuarioCreate,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    existing = db.query(models.Usuario).filter(models.Usuario.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    usuario = models.Usuario(
        nombre=data.nombre,
        email=data.email,
        hashed_password=hash_password(data.password),
        rol_id=data.rol_id,
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario


@router.put("/usuarios/{usuario_id}", response_model=schemas.UsuarioOut)
def actualizar_usuario(
    usuario_id: int,
    data: schemas.UsuarioUpdate,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(usuario, field, value)
    db.commit()
    db.refresh(usuario)
    return usuario


@router.delete("/usuarios/{usuario_id}")
def eliminar_usuario(
    usuario_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    if usuario_id == current_user.id:
        raise HTTPException(status_code=400, detail="No puedes eliminarte a ti mismo")
    usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    usuario.activo = False
    db.commit()
    return {"mensaje": "Usuario desactivado"}


@router.get("/me", response_model=schemas.UsuarioOut)
def get_me(current_user=Depends(get_current_user)):
    return current_user


@router.get("/roles")
def get_roles(db: Session = Depends(get_db), _=Depends(require_admin)):
    return db.query(models.Rol).all()

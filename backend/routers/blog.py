from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
from auth import require_editor_or_admin, get_current_user
import models, schemas

router = APIRouter()


@router.get("/blog", response_model=list[schemas.PostOut])
def get_posts_admin(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(models.PostBlog).order_by(models.PostBlog.creado_en.desc()).all()


@router.post("/blog", response_model=schemas.PostOut, status_code=201)
def crear_post(
    data: schemas.PostCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_editor_or_admin),
):
    existing = db.query(models.PostBlog).filter(models.PostBlog.slug == data.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug ya existe")
    post = models.PostBlog(**data.model_dump(), autor_id=current_user.id)
    if data.estado == "publicado":
        post.publicado_en = datetime.utcnow()
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.put("/blog/{post_id}", response_model=schemas.PostOut)
def actualizar_post(
    post_id: int,
    data: schemas.PostUpdate,
    db: Session = Depends(get_db),
    _=Depends(require_editor_or_admin),
):
    post = db.query(models.PostBlog).filter(models.PostBlog.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post no encontrado")
    updates = data.model_dump(exclude_unset=True)
    if updates.get("estado") == "publicado" and post.estado != "publicado":
        post.publicado_en = datetime.utcnow()
    for field, value in updates.items():
        setattr(post, field, value)
    db.commit()
    db.refresh(post)
    return post


@router.delete("/blog/{post_id}")
def eliminar_post(
    post_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_editor_or_admin),
):
    post = db.query(models.PostBlog).filter(models.PostBlog.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post no encontrado")
    db.delete(post)
    db.commit()
    return {"mensaje": "Post eliminado"}


@router.get("/categorias", response_model=list[schemas.CategoriaOut])
def get_categorias(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(models.CategoriaBlog).all()

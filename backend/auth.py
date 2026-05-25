from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import get_db
import models
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY  = os.getenv("SECRET_KEY", "clave_super_secreta_cambia_en_produccion_2024")
ALGORITHM   = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "480"))

pwd_context   = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> models.Usuario:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No autenticado o token inválido",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(models.Usuario).filter(models.Usuario.email == email).first()
    if user is None or not user.activo:
        raise credentials_exception
    return user


def require_admin(current_user: models.Usuario = Depends(get_current_user)):
    if current_user.rol.nombre != "admin":
        raise HTTPException(status_code=403, detail="Se requiere rol administrador")
    return current_user


def require_editor_or_admin(current_user: models.Usuario = Depends(get_current_user)):
    if current_user.rol.nombre not in ("admin", "editor"):
        raise HTTPException(status_code=403, detail="Se requiere rol editor o administrador")
    return current_user


def require_recepcionista_or_above(current_user: models.Usuario = Depends(get_current_user)):
    if current_user.rol.nombre not in ("admin", "recepcionista"):
        raise HTTPException(status_code=403, detail="Acceso denegado")
    return current_user

from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.auth.security import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    crear_token_acceso,
    verificar_contrasena,
)
from app.crud.usuarios import obtener_usuario_por_correo
from app.db import get_db

router = APIRouter(prefix="/auth", tags=["Autenticación"])


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    rol: str
    nombre: str


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Iniciar sesión y obtener token JWT",
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    Autentica al usuario con correo (campo `username`) y contraseña.
    Retorna un token JWT junto con el rol y nombre del usuario.
    """
    usuario = obtener_usuario_por_correo(db, form_data.username)

    if not usuario or not verificar_contrasena(form_data.password, usuario.contrasena_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo electrónico o contraseña incorrectos.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = crear_token_acceso(
        data={"sub": usuario.correo},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        rol=usuario.rol,
        nombre=usuario.nombre,
    )
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.auth.dependencies import get_admin_actual, get_usuario_actual
from app.crud.usuarios import crear_usuario, obtener_usuario_por_id, obtener_usuarios
from app.db import get_db
from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioCreate, UsuarioResponse

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])


@router.post(
    "/",
    response_model=UsuarioResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar un nuevo usuario",
)
def registrar_usuario(datos: UsuarioCreate, db: Session = Depends(get_db)):
    """Endpoint público para registrar nuevos usuarios en el sistema."""
    return crear_usuario(db, datos)


@router.get(
    "/yo",
    response_model=UsuarioResponse,
    summary="Ver mi perfil",
)
def mi_perfil(usuario_actual: Usuario = Depends(get_usuario_actual)):
    """Retorna los datos del usuario actualmente autenticado."""
    return usuario_actual


@router.get(
    "/",
    response_model=List[UsuarioResponse],
    summary="Listar todos los usuarios (solo admin)",
)
def listar_usuarios(
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_admin_actual),
):
    """Retorna la lista completa de usuarios. Requiere rol admin."""
    return obtener_usuarios(db)


@router.get(
    "/{id_usuario}",
    response_model=UsuarioResponse,
    summary="Obtener usuario por ID (solo admin)",
)
def obtener_usuario(
    id_usuario: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_admin_actual),
):
    """Busca un usuario por su ID. Requiere rol admin."""
    return obtener_usuario_por_id(db, id_usuario)
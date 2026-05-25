from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.auth.dependencies import get_admin_actual, get_usuario_actual
from app.crud.espacios import (
    actualizar_espacio,
    crear_espacio,
    obtener_espacio_por_id,
    obtener_espacios,
)
from app.db import get_db
from app.models.usuario import Usuario
from app.schemas.espacio import EspacioCreate, EspacioResponse, EspacioUpdate

router = APIRouter(prefix="/espacios", tags=["Espacios"])


@router.post(
    "/",
    response_model=EspacioResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear espacio institucional (solo admin)",
)
def crear_nuevo_espacio(
    datos: EspacioCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_admin_actual),
):
    """Registra un nuevo espacio. Requiere rol admin."""
    return crear_espacio(db, datos)


@router.get(
    "/",
    response_model=List[EspacioResponse],
    summary="Listar todos los espacios",
)
def listar_espacios(
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_usuario_actual),
):
    """Retorna todos los espacios institucionales. Requiere autenticación."""
    return obtener_espacios(db)


@router.get(
    "/{id_espacio}",
    response_model=EspacioResponse,
    summary="Obtener espacio por ID",
)
def obtener_espacio(
    id_espacio: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_usuario_actual),
):
    """Retorna un espacio específico por su ID. Requiere autenticación."""
    return obtener_espacio_por_id(db, id_espacio)


@router.put(
    "/{id_espacio}",
    response_model=EspacioResponse,
    summary="Actualizar espacio (solo admin)",
)
def actualizar_espacio_endpoint(
    id_espacio: int,
    datos: EspacioUpdate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_admin_actual),
):
    """Actualiza los campos de un espacio institucional. Requiere rol admin."""
    return actualizar_espacio(db, id_espacio, datos)
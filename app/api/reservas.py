from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.auth.dependencies import get_admin_actual, get_usuario_actual
from app.crud.reservas import (
    actualizar_estado_reserva,
    cancelar_reserva,
    crear_reserva,
    obtener_reserva_por_id,
    obtener_reservas,
    obtener_reservas_por_usuario,
)
from app.db import get_db
from app.models.usuario import Usuario
from app.schemas.reserva import ReservaCreate, ReservaResponse, ReservaUpdateEstado

router = APIRouter(prefix="/reservas", tags=["Reservas"])


@router.post(
    "/",
    response_model=ReservaResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear una nueva reserva",
)
def crear_nueva_reserva(
    datos: ReservaCreate,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(get_usuario_actual),
):
    """
    Crea una reserva aplicando todas las reglas de negocio.
    La reserva nace siempre en estado 'esperando'.
    Requiere autenticación.
    """
    return crear_reserva(db, datos, usuario_actual)


@router.get(
    "/mis-reservas",
    response_model=List[ReservaResponse],
    summary="Ver mis reservas",
)
def mis_reservas(
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(get_usuario_actual),
):
    """Retorna todas las reservas del usuario autenticado."""
    return obtener_reservas_por_usuario(db, usuario_actual.id_usuario)


@router.get(
    "/",
    response_model=List[ReservaResponse],
    summary="Listar todas las reservas (solo admin)",
)
def listar_reservas(
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_admin_actual),
):
    """Retorna todas las reservas del sistema. Requiere rol admin."""
    return obtener_reservas(db)


@router.get(
    "/{id_reserva}",
    response_model=ReservaResponse,
    summary="Obtener reserva por ID",
)
def obtener_reserva(
    id_reserva: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_usuario_actual),
):
    """Retorna una reserva específica por su ID. Requiere autenticación."""
    return obtener_reserva_por_id(db, id_reserva)


@router.patch(
    "/{id_reserva}/estado",
    response_model=ReservaResponse,
    summary="Aprobar o rechazar una reserva (solo admin)",
)
def cambiar_estado_reserva(
    id_reserva: int,
    datos: ReservaUpdateEstado,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_admin_actual),
):
    """
    Cambia el estado de una reserva a 'aprobada' o 'rechazada'.
    Requiere rol admin.
    """
    return actualizar_estado_reserva(db, id_reserva, datos)


@router.delete(
    "/{id_reserva}",
    response_model=ReservaResponse,
    summary="Cancelar una reserva",
)
def cancelar_mi_reserva(
    id_reserva: int,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(get_usuario_actual),
):
    """
    Cancela una reserva (la pasa a estado 'rechazada').
    Solo el propietario de la reserva o un admin pueden cancelarla.
    """
    return cancelar_reserva(db, id_reserva, usuario_actual)
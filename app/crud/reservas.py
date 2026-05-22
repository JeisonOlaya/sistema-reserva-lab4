from datetime import date, datetime, time, timedelta

from fastapi import HTTPException, status
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from app.models.espacio import Espacio
from app.models.reserva import Reserva
from app.models.usuario import Usuario
from app.schemas.reserva import ReservaCreate, ReservaUpdateEstado

# ──────────────────────────────────────────────
# Constantes de horario hábil
# ──────────────────────────────────────────────
HORA_APERTURA_SEMANA = time(7, 0)
HORA_CIERRE_SEMANA = time(20, 0)
HORA_APERTURA_SABADO = time(8, 0)
HORA_CIERRE_SABADO = time(12, 0)

ESTADOS_QUE_BLOQUEAN = ("esperando", "aprobada")


# ──────────────────────────────────────────────
# Validaciones de reglas de negocio
# ──────────────────────────────────────────────

def _validar_coherencia_horas(hora_inicio: time, hora_fin: time) -> None:
    """Regla F: hora_inicio debe ser estrictamente menor que hora_fin."""
    if hora_inicio >= hora_fin:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="La hora de inicio debe ser anterior a la hora de fin.",
        )


def _validar_horario_habilitado(fecha: date, hora_inicio: time, hora_fin: time) -> None:
    """
    Regla E: Lun–Vie 07:00–20:00 · Sáb 08:00–12:00 · Dom no permitido.
    Se valida tanto la hora de inicio como la de fin para que todo el bloque
    quede dentro del horario permitido.
    """
    dia = fecha.weekday()  # 0=Lun … 6=Dom

    if dia == 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se permiten reservas los domingos.",
        )

    if dia == 5:  # Sábado
        if hora_inicio < HORA_APERTURA_SABADO or hora_fin > HORA_CIERRE_SABADO:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Los sábados solo se permiten reservas entre "
                    f"{HORA_APERTURA_SABADO.strftime('%H:%M')} y "
                    f"{HORA_CIERRE_SABADO.strftime('%H:%M')}."
                ),
            )
    else:  # Lunes a Viernes
        if hora_inicio < HORA_APERTURA_SEMANA or hora_fin > HORA_CIERRE_SEMANA:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"De lunes a viernes solo se permiten reservas entre "
                    f"{HORA_APERTURA_SEMANA.strftime('%H:%M')} y "
                    f"{HORA_CIERRE_SEMANA.strftime('%H:%M')}."
                ),
            )


def _validar_anticipacion_24h(fecha: date, hora_inicio: time) -> None:
    """Regla D: La reserva debe realizarse con al menos 24 horas de anticipación."""
    fecha_hora_reserva = datetime.combine(fecha, hora_inicio)
    ahora = datetime.now()
    if (fecha_hora_reserva - ahora) < timedelta(hours=24):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "La reserva debe realizarse con al menos 24 horas de anticipación. "
                f"Fecha/hora de la reserva: {fecha_hora_reserva.strftime('%Y-%m-%d %H:%M')}."
            ),
        )


def _validar_espacio_activo(espacio: Espacio) -> None:
    """Regla G: No se pueden reservar espacios con estado diferente a 'activo'."""
    if espacio.estado != "activo":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"El espacio '{espacio.nombre}' no está disponible para reservas "
                f"(estado actual: '{espacio.estado}')."
            ),
        )


def _validar_capacidad(cantidad_asistentes: int, espacio: Espacio) -> None:
    """Regla H: Los asistentes no pueden superar la capacidad del espacio."""
    if cantidad_asistentes > espacio.capacidad:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"La cantidad de asistentes ({cantidad_asistentes}) supera la "
                f"capacidad máxima del espacio '{espacio.nombre}' ({espacio.capacidad} personas)."
            ),
        )


def _validar_sin_solapamiento(
    db: Session,
    id_espacio: int,
    fecha: date,
    hora_inicio: time,
    hora_fin: time,
    excluir_id: int | None = None,
) -> None:
    """
    Regla C: No permitir reservas que se solapan en el mismo espacio y fecha.
    Solo se consideran reservas en estado 'esperando' o 'aprobada'.
    Dos intervalos [A, B) y [C, D) se solapan cuando A < D AND C < B.
    """
    query = db.query(Reserva).filter(
        and_(
            Reserva.id_espacio == id_espacio,
            Reserva.fecha == fecha,
            Reserva.estado.in_(ESTADOS_QUE_BLOQUEAN),
            Reserva.hora_inicio < hora_fin,
            Reserva.hora_fin > hora_inicio,
        )
    )

    if excluir_id is not None:
        query = query.filter(Reserva.id_reserva != excluir_id)

    conflicto = query.first()
    if conflicto:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                f"El espacio ya tiene una reserva activa que se solapa con el "
                f"horario solicitado (reserva ID {conflicto.id_reserva}: "
                f"{conflicto.hora_inicio.strftime('%H:%M')} – "
                f"{conflicto.hora_fin.strftime('%H:%M')})."
            ),
        )


# ──────────────────────────────────────────────
# Operaciones CRUD
# ──────────────────────────────────────────────

def crear_reserva(db: Session, datos: ReservaCreate, usuario: Usuario) -> Reserva:
    """
    Crea una nueva reserva aplicando todas las reglas de negocio.
    El estado inicial siempre es 'esperando'.
    """
    # 1. Verificar que el espacio exista
    espacio = db.query(Espacio).filter(Espacio.id_espacio == datos.id_espacio).first()
    if not espacio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No existe ningún espacio con ID {datos.id_espacio}.",
        )

    # 2. Aplicar todas las reglas en orden
    _validar_coherencia_horas(datos.hora_inicio, datos.hora_fin)
    _validar_horario_habilitado(datos.fecha, datos.hora_inicio, datos.hora_fin)
    _validar_anticipacion_24h(datos.fecha, datos.hora_inicio)
    _validar_espacio_activo(espacio)
    _validar_capacidad(datos.cantidad_asistentes, espacio)
    _validar_sin_solapamiento(db, datos.id_espacio, datos.fecha, datos.hora_inicio, datos.hora_fin)

    nueva = Reserva(
        id_usuario=usuario.id_usuario,
        id_espacio=datos.id_espacio,
        fecha=datos.fecha,
        hora_inicio=datos.hora_inicio,
        hora_fin=datos.hora_fin,
        cantidad_asistentes=datos.cantidad_asistentes,
        estado="esperando",
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


def obtener_reservas(db: Session) -> list[Reserva]:
    """Retorna todas las reservas del sistema (uso exclusivo del admin)."""
    return db.query(Reserva).all()


def obtener_reservas_por_usuario(db: Session, id_usuario: int) -> list[Reserva]:
    """Retorna solo las reservas del usuario indicado."""
    return db.query(Reserva).filter(Reserva.id_usuario == id_usuario).all()


def obtener_reserva_por_id(db: Session, id_reserva: int) -> Reserva:
    """Busca una reserva por su ID. Lanza 404 si no existe."""
    reserva = db.query(Reserva).filter(Reserva.id_reserva == id_reserva).first()
    if not reserva:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró ninguna reserva con ID {id_reserva}.",
        )
    return reserva


def actualizar_estado_reserva(
    db: Session, id_reserva: int, datos: ReservaUpdateEstado
) -> Reserva:
    """
    Cambia el estado de una reserva a 'aprobada' o 'rechazada'.
    Solo puede ser invocado por un admin (validado en la capa de API).
    """
    reserva = obtener_reserva_por_id(db, id_reserva)

    if reserva.estado == "rechazada" and datos.estado == "rechazada":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La reserva ya se encuentra en estado 'rechazada'.",
        )

    reserva.estado = datos.estado
    db.commit()
    db.refresh(reserva)
    return reserva


def cancelar_reserva(db: Session, id_reserva: int, usuario: Usuario) -> Reserva:
    """
    Cancela una reserva cambiando su estado a 'rechazada'.
    Solo el propietario de la reserva o un admin pueden cancelarla.
    """
    reserva = obtener_reserva_por_id(db, id_reserva)

    es_propietario = reserva.id_usuario == usuario.id_usuario
    es_admin = usuario.rol == "admin"

    if not es_propietario and not es_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para cancelar esta reserva.",
        )

    if reserva.estado == "rechazada":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Esta reserva ya fue cancelada o rechazada previamente.",
        )

    reserva.estado = "rechazada"
    db.commit()
    db.refresh(reserva)
    return reserva
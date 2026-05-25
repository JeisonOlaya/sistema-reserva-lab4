from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.espacio import Espacio
from app.schemas.espacio import EspacioCreate, EspacioUpdate


def crear_espacio(db: Session, datos: EspacioCreate) -> Espacio:
    """Crea un nuevo espacio institucional."""
    nuevo = Espacio(
        nombre=datos.nombre,
        ubicacion=datos.ubicacion,
        capacidad=datos.capacidad,
        estado=datos.estado,
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


def obtener_espacios(db: Session) -> list[Espacio]:
    """Retorna todos los espacios institucionales."""
    return db.query(Espacio).all()


def obtener_espacio_por_id(db: Session, id_espacio: int) -> Espacio:
    """Busca un espacio por su ID. Lanza 404 si no existe."""
    espacio = db.query(Espacio).filter(Espacio.id_espacio == id_espacio).first()
    if not espacio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró ningún espacio con ID {id_espacio}.",
        )
    return espacio


def actualizar_espacio(db: Session, id_espacio: int, datos: EspacioUpdate) -> Espacio:
    """Actualiza los campos enviados de un espacio. Lanza 404 si no existe."""
    espacio = obtener_espacio_por_id(db, id_espacio)
    campos = datos.model_dump(exclude_unset=True)
    for campo, valor in campos.items():
        setattr(espacio, campo, valor)
    db.commit()
    db.refresh(espacio)
    return espacio
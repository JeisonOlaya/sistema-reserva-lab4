from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioCreate
from app.auth.security import hashear_contrasena


def crear_usuario(db: Session, datos: UsuarioCreate) -> Usuario:
    """Registra un nuevo usuario. Lanza 400 si el correo ya existe."""
    existente = db.query(Usuario).filter(Usuario.correo == datos.correo).first()
    if existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe un usuario registrado con el correo '{datos.correo}'.",
        )

    nuevo = Usuario(
        nombre=datos.nombre,
        correo=datos.correo,
        contrasena_hash=hashear_contrasena(datos.contrasena),
        rol=datos.rol,
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


def obtener_usuarios(db: Session) -> list[Usuario]:
    """Retorna la lista de todos los usuarios registrados."""
    return db.query(Usuario).all()


def obtener_usuario_por_id(db: Session, id_usuario: int) -> Usuario:
    """Busca un usuario por su ID. Lanza 404 si no existe."""
    usuario = db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró ningún usuario con ID {id_usuario}.",
        )
    return usuario


def obtener_usuario_por_correo(db: Session, correo: str) -> Usuario | None:
    """Busca un usuario por su correo. Retorna None si no existe."""
    return db.query(Usuario).filter(Usuario.correo == correo).first()
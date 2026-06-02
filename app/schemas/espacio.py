from pydantic import BaseModel, field_validator
from typing import Optional


class EspacioBase(BaseModel):
    nombre: str
    ubicacion: str
    capacidad: int
    estado: Optional[str] = "activo"

    @field_validator("capacidad")
    @classmethod
    def capacidad_positiva(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("La capacidad debe ser mayor a cero")
        return v

    @field_validator("estado")
    @classmethod
    def validar_estado(cls, v: str) -> str:
        estados_validos = {"activo", "inactivo"}
        if v not in estados_validos:
            raise ValueError(f"El estado debe ser uno de: {', '.join(estados_validos)}")
        return v


class EspacioCreate(EspacioBase):
    pass


class EspacioUpdate(BaseModel):
    nombre: Optional[str] = None
    ubicacion: Optional[str] = None
    capacidad: Optional[int] = None
    estado: Optional[str] = None

    @field_validator("estado")
    @classmethod
    def validar_estado(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in {"activo", "inactivo"}:
            raise ValueError("El estado debe ser 'activo' o 'inactivo'")
        return v


class EspacioResponse(EspacioBase):
    id_espacio: int

    model_config = {"from_attributes": True}
from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import date, time


class ReservaCreate(BaseModel):
    id_espacio: int
    fecha: date
    hora_inicio: time
    hora_fin: time
    cantidad_asistentes: int

    @field_validator("cantidad_asistentes")
    @classmethod
    def asistentes_positivos(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("La cantidad de asistentes debe ser mayor a cero")
        return v


class ReservaUpdateEstado(BaseModel):
    estado: str

    @field_validator("estado")
    @classmethod
    def validar_estado(cls, v: str) -> str:
        estados_validos = {"aprobada", "rechazada"}
        if v not in estados_validos:
            raise ValueError(
                f"Solo se puede cambiar el estado a: {', '.join(estados_validos)}"
            )
        return v


class ReservaResponse(BaseModel):
    id_reserva: int
    id_usuario: int
    id_espacio: int
    fecha: date
    hora_inicio: time
    hora_fin: time
    cantidad_asistentes: int
    estado: str

    model_config = {"from_attributes": True}
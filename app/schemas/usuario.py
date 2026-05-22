from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional


class UsuarioBase(BaseModel):
    nombre: str
    correo: EmailStr
    rol: Optional[str] = "usuario"

    @field_validator("rol")
    @classmethod
    def validar_rol(cls, v: str) -> str:
        roles_validos = {"admin", "usuario"}
        if v not in roles_validos:
            raise ValueError(f"El rol debe ser uno de: {', '.join(roles_validos)}")
        return v


class UsuarioCreate(UsuarioBase):
    contrasena: str


class UsuarioResponse(BaseModel):
    id_usuario: int
    nombre: str
    correo: str
    rol: str

    model_config = {"from_attributes": True}
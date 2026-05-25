"""
Script de datos iniciales (seed) para el Sistema de Reservas.

Crea en la base de datos:
  - 1 usuario administrador
  - 1 usuario regular de prueba
  - 3 espacios institucionales de ejemplo

USO:
    python -m app.seed

REQUISITOS:
  - El archivo .env debe estar configurado con DATABASE_URL válida.
  - La base de datos debe existir (CREATE DATABASE reservas_db).
  - Las tablas deben existir: ejecuta primero el servidor una vez
    (uvicorn app.main:app) o el script database/init.sql.

ADVERTENCIA:
  Ejecutar este script más de una vez generará un error de correo
  duplicado (restricción UNIQUE), lo cual es el comportamiento esperado.
"""

import sys
from sqlalchemy.exc import IntegrityError
from app.db import SessionLocal, engine, Base

# Importar modelos para que Base los registre antes de create_all
from app.models import usuario, espacio, reserva  # noqa: F401
from app.models.usuario import Usuario
from app.models.espacio import Espacio
from app.auth.security import hashear_contrasena


# ──────────────────────────────────────────────
# Datos iniciales
# ──────────────────────────────────────────────

USUARIOS_INICIALES = [
    {
        "nombre": "Administrador del Sistema",
        "correo": "admin@institucion.edu.co",
        "contrasena": "Admin2024*",
        "rol": "admin",
    },
    {
        "nombre": "Usuario de Prueba",
        "correo": "usuario@institucion.edu.co",
        "contrasena": "Usuario2024*",
        "rol": "usuario",
    },
]

ESPACIOS_INICIALES = [
    {
        "nombre": "Sala de Reuniones Principal",
        "ubicacion": "Bloque A, Piso 1 — Oficina 101",
        "capacidad": 15,
        "estado": "activo",
    },
    {
        "nombre": "Laboratorio de Sistemas A",
        "ubicacion": "Bloque B, Piso 2 — Sala 201",
        "capacidad": 30,
        "estado": "activo",
    },
    {
        "nombre": "Auditorio Central",
        "ubicacion": "Bloque C, Piso 1 — Entrada principal",
        "capacidad": 120,
        "estado": "activo",
    },
    {
        "nombre": "Aula Especial de Videoconferencia",
        "ubicacion": "Bloque A, Piso 3 — Sala 302",
        "capacidad": 20,
        "estado": "activo",
    },
    {
        "nombre": "Laboratorio de Electrónica",
        "ubicacion": "Bloque D, Piso 1 — Sala 101",
        "capacidad": 25,
        "estado": "inactivo",   # ejemplo de espacio no reservable
    },
]


# ──────────────────────────────────────────────
# Funciones de seed
# ──────────────────────────────────────────────

def crear_tablas() -> None:
    """Crea todas las tablas definidas en los modelos si no existen."""
    print("📦 Verificando / creando tablas en la base de datos...")
    Base.metadata.create_all(bind=engine)
    print("   ✅ Tablas listas.\n")


def seed_usuarios(db) -> list[Usuario]:
    """Inserta los usuarios iniciales y retorna la lista de objetos creados."""
    print("👤 Insertando usuarios iniciales...")
    creados = []

    for datos in USUARIOS_INICIALES:
        usuario_obj = Usuario(
            nombre=datos["nombre"],
            correo=datos["correo"],
            contrasena_hash=hashear_contrasena(datos["contrasena"]),
            rol=datos["rol"],
        )
        db.add(usuario_obj)
        try:
            db.flush()   # detecta duplicados antes del commit global
            creados.append(usuario_obj)
            print(f"   ✅ [{datos['rol'].upper()}] {datos['nombre']} — {datos['correo']}")
            print(f"       Contraseña inicial: {datos['contrasena']}")
        except IntegrityError:
            db.rollback()
            print(f"   ⚠️  El correo '{datos['correo']}' ya existe — omitido.")

    return creados


def seed_espacios(db) -> list[Espacio]:
    """Inserta los espacios institucionales de ejemplo."""
    print("\n🏢 Insertando espacios institucionales...")
    creados = []

    for datos in ESPACIOS_INICIALES:
        espacio_obj = Espacio(
            nombre=datos["nombre"],
            ubicacion=datos["ubicacion"],
            capacidad=datos["capacidad"],
            estado=datos["estado"],
        )
        db.add(espacio_obj)
        db.flush()
        creados.append(espacio_obj)
        estado_emoji = "✅" if datos["estado"] == "activo" else "🔒"
        print(
            f"   {estado_emoji} {datos['nombre']} "
            f"(cap. {datos['capacidad']}) — {datos['estado'].upper()}"
        )

    return creados


def imprimir_resumen(usuarios_creados: list, espacios_creados: list) -> None:
    """Muestra un resumen con las credenciales de acceso para desarrollo."""
    print("\n" + "=" * 60)
    print("  ✅  SEED COMPLETADO EXITOSAMENTE")
    print("=" * 60)

    print("\n📋 CREDENCIALES DE ACCESO PARA DESARROLLO:")
    print("-" * 60)
    for datos in USUARIOS_INICIALES:
        print(f"  Rol      : {datos['rol'].upper()}")
        print(f"  Correo   : {datos['correo']}")
        print(f"  Contraseña: {datos['contrasena']}")
        print()

    print(f"  Espacios creados : {len(espacios_creados)}")
    activos = sum(1 for e in espacios_creados if e.estado == "activo")
    print(f"    → Activos      : {activos}")
    print(f"    → Inactivos    : {len(espacios_creados) - activos}")

    print("\n🔗 Endpoints para probar de inmediato:")
    print("   POST http://localhost:8000/auth/login")
    print("   GET  http://localhost:8000/docs")
    print("=" * 60)


# ──────────────────────────────────────────────
# Punto de entrada
# ──────────────────────────────────────────────

def run_seed() -> None:
    """Función principal que orquesta todo el proceso de seed."""
    print("\n🌱 Iniciando proceso de seed...\n")

    # 1. Crear tablas si no existen
    crear_tablas()

    db = SessionLocal()
    try:
        # 2. Insertar datos
        usuarios_creados = seed_usuarios(db)
        espacios_creados = seed_espacios(db)

        # 3. Confirmar todos los cambios en una sola transacción
        db.commit()

        # 4. Mostrar resumen
        imprimir_resumen(usuarios_creados, espacios_creados)

    except Exception as error:
        db.rollback()
        print(f"\n❌ Error durante el seed: {error}")
        print("   Los cambios fueron revertidos.")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
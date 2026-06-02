from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importar modelos ANTES de create_all para que SQLAlchemy los registre
from app.models import usuario, espacio, reserva  # noqa: F401
from app.db import Base, engine

# Importar routers
from app.api import auth, usuarios, espacios, reservas

# Crear tablas en la base de datos al arrancar
Base.metadata.create_all(bind=engine)

# Instancia principal de FastAPI
app = FastAPI(
    title="Sistema de Reservas de Espacios Institucionales",
    description=(
        "API REST para la gestión de reservas de salas de reuniones, laboratorios, "
        "auditorios y aulas especiales. Incluye autenticación JWT y control de acceso "
        "por roles (admin / usuario)."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # En producción: reemplazar por la URL del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registro de routers
app.include_router(auth.router)
app.include_router(usuarios.router)
app.include_router(espacios.router)
app.include_router(reservas.router)


# Ruta raíz
@app.get("/", tags=["Estado"], summary="Verificar que el servidor está activo")
def root():
    return {
        "estado": "activo",
        "aplicacion": "Sistema de Reservas de Espacios Institucionales",
        "version": "1.0.0",
        "documentacion_swagger": "/docs",
        "documentacion_redoc": "/redoc",
    }
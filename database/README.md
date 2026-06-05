# Sistema de Reserva de Espacios Institucionales

---

# Descripción del Proyecto

El Sistema de Reserva de Espacios Institucionales es una aplicación web que permite la gestión y reserva de espacios dentro de una institución educativa.

La solución fue desarrollada utilizando una arquitectura basada en servicios, compuesta por:

* Frontend desarrollado con React + Vite.
* Backend desarrollado con FastAPI.
* Base de datos PostgreSQL.
* Contenedorización mediante Docker y Docker Compose.

Todo el sistema puede desplegarse mediante un único comando utilizando Docker Compose.

---

# Tecnologías Utilizadas

## Frontend

* React
* Vite
* JavaScript

## Backend

* Python
* FastAPI
* SQLAlchemy
* Uvicorn

## Base de Datos

* PostgreSQL 16

## Infraestructura

* Docker
* Docker Compose
* Ubuntu (WSL)
* Git

---

# Requisitos Previos

Antes de realizar el despliegue, es necesario tener instalado:

## Git

Verificar instalación:

```bash
git --version
```

## Docker

Verificar instalación:

```bash
docker --version
```

## Docker Compose

Verificar instalación:

```bash
docker compose version
```

## WSL (Opcional para Windows)

Verificar instalación:

```bash
wsl --status
```

---

# Instalación del Proyecto

## 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
```

## 2. Ingresar al proyecto

```bash
cd sistema-reserva-lab4
```

## 3. Verificar archivos del proyecto

```bash
ls -la
```

Se debe visualizar una estructura similar a:

```text
docker-compose.yml
Dockerfile.backend
.env.example
requirements.txt
frontend/
database/
app/
```

---

# Configuración del Entorno

## Crear el archivo de variables de entorno

Copiar el archivo de ejemplo:

```bash
cp .env.example .env
```

## Verificar el archivo .env

```bash
cat .env
```

Ejemplo:

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/reservas_db
SECRET_KEY=xxxxxxxx
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

# Despliegue con Docker Compose

## Construcción e inicio de servicios

Desde la raíz del proyecto ejecutar:

```bash
docker compose up -d
```

Este comando realiza automáticamente:

* Construcción de las imágenes Docker.
* Creación de la red interna.
* Creación de los contenedores.
* Inicialización de PostgreSQL.
* Inicialización del backend FastAPI.
* Inicialización del frontend React + Vite.

---

# Verificación del Despliegue

## Verificar contenedores activos

```bash
docker ps
```

Se deben visualizar los contenedores correspondientes a:

* Base de datos PostgreSQL.
* Backend FastAPI.
* Frontend React.

## Verificar logs del backend

```bash
docker logs reservas_backend
```

Resultado esperado:

```text
INFO: Uvicorn running on http://0.0.0.0:8000
INFO: Application startup complete.
```

---

# Acceso a la Aplicación

## Frontend

Abrir en el navegador:

```text
http://localhost:5173
```

## Backend

```text
http://localhost:8000
```

## Documentación Swagger

```text
http://localhost:8000/docs
```

---

# Comandos de Administración

## Ver contenedores activos

```bash
docker ps
```

## Ver todos los contenedores

```bash
docker ps -a
```

## Ver logs del backend

```bash
docker logs reservas_backend
```

## Ver logs en tiempo real

```bash
docker logs -f reservas_backend
```

## Detener los servicios

```bash
docker compose down
```

## Reiniciar los servicios

```bash
docker compose restart
```

## Reconstruir imágenes

```bash
docker compose up -d --build
```

---

# Arquitectura del Sistema

```text
┌─────────────────────┐
│     React + Vite    │
│     Puerto 5173     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   FastAPI Backend   │
│     Puerto 8000     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     PostgreSQL      │
│     Puerto 5432     │
└─────────────────────┘
```

Todos los servicios se comunican mediante la red interna definida por Docker Compose.

---

# Problemas Comunes y Soluciones

## Error: archivo .env no encontrado

Solución:

```bash
cp .env.example .env
```

---

## Error: password authentication failed for user postgres

Verificar que las credenciales configuradas en el archivo `.env` coincidan con las definidas para PostgreSQL.

---

## Error: permission denied while trying to connect to the Docker API

Agregar el usuario al grupo Docker:

```bash
sudo usermod -aG docker $USER
```

Cerrar sesión y volver a iniciar.

---

# Evidencias de Funcionamiento

Se recomienda incluir las siguientes capturas de pantalla:

1. Ejecución exitosa de `docker compose up -d`.
2. Resultado del comando `docker ps`.
3. Aplicación ejecutándose en `http://localhost:5173`.
4. Documentación Swagger disponible en `http://localhost:8000/docs`.
5. Logs del backend mostrando el inicio correcto del servidor.

---

# Conclusiones

El despliegue del Sistema de Reserva de Espacios Institucionales se realizó exitosamente mediante Docker Compose, permitiendo la ejecución integrada del frontend, backend y base de datos a través de un único comando.

La utilización de contenedores garantiza portabilidad, facilidad de instalación y consistencia entre los distintos entornos de ejecución.

# Sistema de Reservas 
# 🏛️ Sistema de Reservas de Espacios Institucionales

> API REST escalable para la gestión de reservas de salas de reuniones, laboratorios,
> auditorios y aulas especiales. Construida con **FastAPI**, **SQLAlchemy v2**,
> **Pydantic v2**, autenticación **JWT** y **PostgreSQL**.

---

## 📑 Tabla de Contenidos

1. [Descripción General](#-descripción-general)
2. [Arquitectura del Sistema](#-arquitectura-del-sistema)
3. [Estructura del Proyecto](#-estructura-del-proyecto)
4. [Requisitos Previos](#-requisitos-previos)
5. [Instalación Paso a Paso](#-instalación-paso-a-paso)
6. [Configuración de la Base de Datos](#-configuración-de-la-base-de-datos)
7. [Configuración de Variables de Entorno](#-configuración-de-variables-de-entorno)
8. [Ejecución del Servidor](#-ejecución-del-servidor)
9. [Documentación Interactiva de la API](#-documentación-interactiva-de-la-api)
10. [Guía de Integración para el Frontend](#-guía-de-integración-para-el-frontend)
11. [Reglas de Negocio Implementadas](#-reglas-de-negocio-implementadas)
12. [Roles y Control de Acceso](#-roles-y-control-de-acceso)

---

## 📌 Descripción General

El **Sistema de Reservas de Espacios Institucionales** es una API REST diseñada con
principios de **arquitectura limpia por capas** y orientada a la escalabilidad
horizontal. Permite a una institución educativa o empresarial administrar la
disponibilidad y ocupación de sus espacios físicos, aplicando reglas de negocio
estrictas para evitar conflictos de horario, reservas fuera de tiempo hábil y
sobreocupación de espacios.

| Característica         | Tecnología                          |
|------------------------|-------------------------------------|
| Framework backend      | FastAPI 0.111+                      |
| Lenguaje               | Python 3.10+                        |
| ORM                    | SQLAlchemy 2.0+                     |
| Validación de datos    | Pydantic v2                         |
| Base de datos          | PostgreSQL 14+                      |
| Autenticación          | JWT — OAuth2 Bearer Token           |
| Hash de contraseñas    | passlib + bcrypt                    |
| Servidor ASGI          | Uvicorn                             |
| CORS                   | Habilitado (`allow_origins=["*"]`)  |

---

## 🏗️ Arquitectura del Sistema

El proyecto implementa una arquitectura **desacoplada por capas**, donde cada capa
tiene una responsabilidad única y bien definida:

```
HTTP Request
     │
     ▼
┌──────────────────────────────┐
│     Capa API  (app/api/)     │  ← Recibe peticiones HTTP, aplica
│  auth · usuarios · espacios  │    dependencias de autenticación
│         · reservas           │    y delega al CRUD
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│    Capa CRUD  (app/crud/)    │  ← Orquesta la lógica de negocio,
│  usuarios · espacios         │    valida reglas y ejecuta
│         · reservas           │    operaciones sobre la BD
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  Capa Modelos (app/models/)  │  ← Define las entidades ORM
│  usuario · espacio · reserva │    mapeadas a tablas PostgreSQL
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       PostgreSQL             │  ← Persistencia de datos
└──────────────────────────────┘
```

### Resumen de responsabilidades por capa

| Capa             | Ubicación          | Responsabilidad                                                   |
|------------------|--------------------|-------------------------------------------------------------------|
| **Models**       | `app/models/`      | Entidades ORM: tablas `usuarios`, `espacios`, `reservas`          |
| **Schemas**      | `app/schemas/`     | Contratos de entrada/salida validados con Pydantic v2             |
| **CRUD**         | `app/crud/`        | Lógica de negocio, validaciones de reglas y acceso a datos        |
| **Auth**         | `app/auth/`        | Hash de contraseñas, firma/verificación JWT, dependencias FastAPI |
| **API**          | `app/api/`         | Endpoints HTTP, control de acceso por rol, respuestas HTTP        |
| **DB**           | `app/db.py`        | Configuración del engine, sesión y dependencia `get_db`           |

---

## 📂 Estructura del Proyecto

```
laboratorio4/
├── app/
│   ├── api/
│   │   ├── auth.py          # Endpoint de login y generación de token JWT
│   │   ├── espacios.py      # CRUD de espacios institucionales
│   │   ├── reservas.py      # Gestión completa de reservas
│   │   └── usuarios.py      # Registro y consulta de usuarios
│   ├── auth/
│   │   ├── dependencies.py  # Dependencias FastAPI: usuario actual, rol admin
│   │   └── security.py      # Hash bcrypt, creación y decodificación de JWT
│   ├── crud/
│   │   ├── espacios.py      # Operaciones de BD para espacios
│   │   ├── reservas.py      # Operaciones de BD + reglas de negocio
│   │   └── usuarios.py      # Operaciones de BD para usuarios
│   ├── models/
│   │   ├── espacio.py       # Modelo ORM: tabla `espacios`
│   │   ├── reserva.py       # Modelo ORM: tabla `reservas`
│   │   └── usuario.py       # Modelo ORM: tabla `usuarios`
│   ├── schemas/
│   │   ├── espacio.py       # Esquemas Pydantic para espacios
│   │   ├── reserva.py       # Esquemas Pydantic para reservas
│   │   └── usuario.py       # Esquemas Pydantic para usuarios
│   ├── db.py                # Engine SQLAlchemy, SessionLocal, Base
│   └── main.py              # Bootstrap: CORS, routers, create_all
├── .env                     # ⚠️ Variables de entorno reales (NO subir a Git)
├── .env.example             # Plantilla de variables de entorno
├── .gitignore
└── requirements.txt
```

---

## ✅ Requisitos Previos

Asegúrate de tener instaladas las siguientes herramientas antes de continuar:

| Herramienta     | Versión mínima | Verificación                  |
|-----------------|----------------|-------------------------------|
| Python          | 3.10           | `python --version`            |
| pip             | 22+            | `pip --version`               |
| PostgreSQL      | 14             | `psql --version`              |
| Git             | 2.x            | `git --version`               |

---

## 🚀 Instalación Paso a Paso

### Paso 1 — Clonar el repositorio

```bash
git clone https://github.com/<tu-usuario>/<tu-repositorio>.git
cd laboratorio4
```

### Paso 2 — Crear el entorno virtual de Python

Se recomienda **siempre** trabajar dentro de un entorno virtual para aislar las
dependencias del proyecto del sistema operativo.

```bash
# Crear el entorno virtual
python -m venv venv

# Activar en Linux / macOS
source venv/bin/activate

# Activar en Windows (PowerShell)
.\venv\Scripts\Activate.ps1

# Activar en Windows (CMD)
.\venv\Scripts\activate.bat
```

Una vez activado, el prompt del terminal mostrará el prefijo `(venv)`.

### Paso 3 — Instalar dependencias

```bash
pip install -r requirements.txt
```

### Paso 4 — Configurar las variables de entorno

```bash
# Copiar la plantilla al archivo real
cp .env.example .env

# Abrir y editar el archivo .env con tus valores reales
```

> Consulta la sección [Configuración de Variables de Entorno](#-configuración-de-variables-de-entorno)
> para el detalle de cada variable.

---

## 🗄️ Configuración de la Base de Datos

### 1. Crear la base de datos vacía en PostgreSQL

Antes de arrancar el servidor, el único paso manual necesario es **crear la base de
datos vacía** en tu servidor local de PostgreSQL. SQLAlchemy se encargará de crear
todas las tablas automáticamente.

Conéctate a PostgreSQL con el cliente `psql` y ejecuta:

```sql
CREATE DATABASE reservas_db;
```

O bien desde la terminal:

```bash
psql -U postgres -c "CREATE DATABASE reservas_db;"
```

> ✅ **Solo necesitas crear la base de datos.** No es necesario crear tablas,
> columnas ni relaciones de forma manual. Al iniciar la aplicación por primera vez,
> SQLAlchemy ejecuta `Base.metadata.create_all(bind=engine)` en `main.py`, lo que
> inspecciona todos los modelos ORM registrados y **crea automáticamente** las
> tablas `usuarios`, `espacios` y `reservas` con sus columnas, tipos de dato,
> claves primarias y claves foráneas.

---

### 2. Configurar la variable `DATABASE_URL`

La variable `DATABASE_URL` en el archivo `.env` le indica a SQLAlchemy cómo
conectarse al servidor de PostgreSQL. Su formato es el siguiente:

```
DATABASE_URL=postgresql://[usuario]:[contraseña]@[servidor]:[puerto]/[nombre_db]
```

| Segmento       | Descripción                                        | Valor por defecto (desarrollo) |
|----------------|----------------------------------------------------|-------------------------------|
| `[usuario]`    | Usuario de PostgreSQL con acceso a la base de datos | `postgres`                   |
| `[contraseña]` | Contraseña del usuario de PostgreSQL               | `postgres`                    |
| `[servidor]`   | Host donde corre el servidor PostgreSQL            | `localhost`                   |
| `[puerto]`     | Puerto TCP de PostgreSQL                           | `5432`                        |
| `[nombre_db]`  | Nombre de la base de datos creada en el paso anterior | `reservas_db`              |

**Ejemplo completo para desarrollo local:**

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/reservas_db
```

> ⚠️ **Nota de desarrollo local:** en una instalación estándar de PostgreSQL, el
> superusuario por defecto es `postgres` con contraseña `postgres`. Si tu
> instalación usa credenciales distintas, reemplázalas en la `DATABASE_URL`.

---

## 🔐 Configuración de Variables de Entorno

Copia `.env.example` a `.env` y completa cada variable:

```env
# ─── Base de datos ──────────────────────────────────────────────────────────
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/reservas_db

# ─── Seguridad JWT ──────────────────────────────────────────────────────────
SECRET_KEY=cambia_esta_clave_secreta_por_una_segura
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Descripción de cada variable

| Variable                      | Descripción                                                                                    |
|-------------------------------|------------------------------------------------------------------------------------------------|
| `DATABASE_URL`                | Cadena de conexión completa a PostgreSQL. Ver sección anterior para su composición.            |
| `SECRET_KEY`                  | Clave privada usada para **firmar y verificar** los tokens JWT. Debe ser larga y aleatoria.    |
| `ALGORITHM`                   | Algoritmo criptográfico para el JWT. Se usa `HS256` (HMAC-SHA256), estándar de la industria.  |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Tiempo de vida del token JWT en minutos. Pasado este tiempo, el usuario deberá volver a iniciar sesión. |

### 🔑 Generar una `SECRET_KEY` segura

Para entornos que no sean de prueba local, genera una clave de alta entropía con:

```bash
# Opción 1: openssl (Linux / macOS / WSL)
openssl rand -hex 32

# Opción 2: Python (multiplataforma)
python -c "import secrets; print(secrets.token_hex(32))"
```

El resultado será una cadena hexadecimal de 64 caracteres, por ejemplo:

```
a3f8c1e2d4b7a9f0e1c2d3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4
```

Copia ese valor en tu `.env`:

```env
SECRET_KEY=a3f8c1e2d4b7a9f0e1c2d3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4
```

---

> ### 🚨 Advertencia de Seguridad para Producción / Despliegue
>
> Antes de desplegar esta aplicación en cualquier entorno accesible desde Internet
> o una red institucional, es **OBLIGATORIO** cumplir con los siguientes puntos:
>
> 1. **Cambiar la contraseña de la base de datos.** Nunca usar `postgres:postgres`
>    en producción. Crea un usuario dedicado con contraseña robusta y otórgale
>    únicamente los permisos necesarios sobre `reservas_db`.
>
> 2. **Generar una `SECRET_KEY` de alta entropía** usando el comando indicado
>    anteriormente. Una clave débil o predecible compromete la seguridad de todos
>    los tokens JWT emitidos.
>
> 3. **Restringir el CORS.** En `main.py`, reemplazar `allow_origins=["*"]` por
>    la URL exacta del frontend desplegado:
>    ```python
>    allow_origins=["https://tu-dominio.com"]
>    ```
>
> 4. **No subir el archivo `.env` al repositorio.** Verificar que `.gitignore`
>    incluya la línea `.env`.

---

## ▶️ Ejecución del Servidor

Con el entorno virtual activado, las dependencias instaladas y el archivo `.env`
configurado, inicia el servidor con:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

| Parámetro        | Descripción                                                                 |
|------------------|-----------------------------------------------------------------------------|
| `app.main:app`   | Ruta al objeto FastAPI: módulo `app.main`, instancia `app`                  |
| `--reload`       | Reinicio automático al detectar cambios en el código (solo para desarrollo) |
| `--host 0.0.0.0` | Escucha en todas las interfaces de red del equipo                           |
| `--port 8000`    | Puerto TCP donde queda expuesta la API                                      |

Una salida exitosa en la terminal se verá así:

```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [xxxxx] using WatchFiles
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

---

## 📖 Documentación Interactiva de la API

FastAPI genera automáticamente dos interfaces de documentación interactiva basadas
en el estándar **OpenAPI 3.0**:

| Interfaz     | URL local                           | Descripción                                                    |
|--------------|-------------------------------------|----------------------------------------------------------------|
| Swagger UI   | http://localhost:8000/docs          | Permite explorar y **ejecutar** endpoints directamente         |
| ReDoc        | http://localhost:8000/redoc         | Vista de documentación de solo lectura, más limpia y navegable |
| OpenAPI JSON | http://localhost:8000/openapi.json  | Esquema JSON consumible por herramientas externas (Postman, etc.) |

> 💡 **Recomendación:** usa **Swagger UI** (`/docs`) durante el desarrollo para
> probar los endpoints en tiempo real. El botón **Authorize** en la esquina
> superior derecha permite ingresar el token JWT para probar endpoints protegidos.

---

## 🔌 Guía de Integración para el Frontend

> ✅ **CORS habilitado:** la API tiene configurado `allow_origins=["*"]`,
> `allow_methods=["*"]` y `allow_headers=["*"]`, lo que permite conexiones
> inmediatas desde **cualquier** origen. Es compatible con **React**, **Angular**,
> **Vue.js** y **Vanilla JS** usando `fetch` o `axios` sin configuración adicional.

---

### Flujo de autenticación recomendado

```
1. POST /auth/login  →  Recibir { access_token, token_type, rol, nombre }
2. Guardar el token  →  localStorage / sessionStorage / estado global
3. Incluir en headers de cada petición protegida:
   Authorization: Bearer <access_token>
```

---

### Módulo 1 — 🔑 Autenticación (`/auth`)

| Método | Endpoint      | Acceso  | Descripción                                  |
|--------|---------------|---------|----------------------------------------------|
| `POST` | `/auth/login` | Público | Autentica al usuario y retorna el token JWT  |

**Request — `POST /auth/login`**

> Se envía como `application/x-www-form-urlencoded` (estándar OAuth2):

```
username=correo@ejemplo.com&password=mi_contrasena
```

O con `axios`:

```javascript
const params = new URLSearchParams();
params.append("username", "correo@ejemplo.com");
params.append("password", "mi_contrasena");

const { data } = await axios.post("/auth/login", params);
```

**Response exitoso `200 OK`:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "rol": "usuario",
  "nombre": "María García"
}
```

**Response de error `401 Unauthorized`:**

```json
{
  "detail": "Correo electrónico o contraseña incorrectos."
}
```

---

### Módulo 2 — 👤 Usuarios (`/usuarios`)

| Método | Endpoint         | Acceso       | Descripción                         |
|--------|------------------|--------------|-------------------------------------|
| `POST` | `/usuarios/`     | Público      | Registrar un nuevo usuario          |
| `GET`  | `/usuarios/yo`   | Autenticado  | Ver perfil del usuario actual       |
| `GET`  | `/usuarios/`     | Solo `admin` | Listar todos los usuarios           |
| `GET`  | `/usuarios/{id}` | Solo `admin` | Obtener un usuario por ID           |

**Request — `POST /usuarios/` (Registro)**

```json
{
  "nombre": "Carlos López",
  "correo": "carlos@universidad.edu.co",
  "contrasena": "MiClave2024!",
  "rol": "usuario"
}
```

> 📌 El campo `rol` acepta `"usuario"` (por defecto) o `"admin"`.

**Response exitoso `201 Created`:**

```json
{
  "id_usuario": 3,
  "nombre": "Carlos López",
  "correo": "carlos@universidad.edu.co",
  "rol": "usuario"
}
```

---

### Módulo 3 — 🏢 Espacios (`/espacios`)

| Método | Endpoint           | Acceso       | Descripción                             |
|--------|--------------------|--------------|---------------------------------------------|
| `POST` | `/espacios/`       | Solo `admin` | Crear un nuevo espacio institucional    |
| `GET`  | `/espacios/`       | Autenticado  | Listar todos los espacios               |
| `GET`  | `/espacios/{id}`   | Autenticado  | Obtener un espacio por ID               |
| `PUT`  | `/espacios/{id}`   | Solo `admin` | Actualizar datos de un espacio          |

**Request — `POST /espacios/` (Crear espacio)**

```json
{
  "nombre": "Laboratorio de Sistemas A",
  "ubicacion": "Bloque B, Piso 2",
  "capacidad": 30,
  "estado": "activo"
}
```

> 📌 El campo `estado` acepta `"activo"` (por defecto) o `"inactivo"`.

**Response exitoso `201 Created`:**

```json
{
  "id_espacio": 1,
  "nombre": "Laboratorio de Sistemas A",
  "ubicacion": "Bloque B, Piso 2",
  "capacidad": 30,
  "estado": "activo"
}
```

**Request — `PUT /espacios/{id}` (Actualización parcial)**

```json
{
  "estado": "inactivo"
}
```

---

### Módulo 4 — 📅 Reservas (`/reservas`)

| Método   | Endpoint                  | Acceso       | Descripción                                  |
|----------|---------------------------|--------------|----------------------------------------------|
| `POST`   | `/reservas/`              | Autenticado  | Crear una nueva reserva                      |
| `GET`    | `/reservas/mis-reservas`  | Autenticado  | Ver las reservas del usuario actual          |
| `GET`    | `/reservas/`              | Solo `admin` | Listar todas las reservas del sistema        |
| `GET`    | `/reservas/{id}`          | Autenticado  | Obtener una reserva por ID                   |
| `PATCH`  | `/reservas/{id}/estado`   | Solo `admin` | Aprobar o rechazar una reserva               |
| `DELETE` | `/reservas/{id}`          | Autenticado  | Cancelar una reserva propia (o admin)        |

**Request — `POST /reservas/` (Crear reserva)**

```json
{
  "id_espacio": 1,
  "fecha": "2025-08-15",
  "hora_inicio": "09:00:00",
  "hora_fin": "11:00:00",
  "cantidad_asistentes": 20
}
```

> 📌 El campo `fecha` usa formato `YYYY-MM-DD`. Los campos de hora usan `HH:MM:SS`.

**Response exitoso `201 Created`:**

```json
{
  "id_reserva": 7,
  "id_usuario": 3,
  "id_espacio": 1,
  "fecha": "2025-08-15",
  "hora_inicio": "09:00:00",
  "hora_fin": "11:00:00",
  "cantidad_asistentes": 20,
  "estado": "esperando"
}
```

**Request — `PATCH /reservas/{id}/estado` (Aprobar o rechazar)**

```json
{
  "estado": "aprobada"
}
```

> 📌 Solo acepta `"aprobada"` o `"rechazada"`. Requiere rol `admin`.

**Ejemplo de error de regla de negocio `409 Conflict`:**

```json
{
  "detail": "El espacio ya tiene una reserva activa que se solapa con el horario solicitado (reserva ID 4: 08:00 – 10:30)."
}
```

---

### Ejemplo de configuración de cliente con Axios (JavaScript)

```javascript
// axios-config.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

// Interceptor: adjunta el token JWT a cada petición automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## 📋 Reglas de Negocio Implementadas

Todas las validaciones se aplican en la capa `app/crud/reservas.py` y retornan
`HTTPException` con mensajes descriptivos en español.

| ID | Regla                        | Comportamiento del sistema                                                              |
|----|------------------------------|-----------------------------------------------------------------------------------------|
| A  | Autenticación obligatoria    | Todo endpoint de reserva o espacio requiere token JWT válido. Retorna `401` si falla.   |
| B  | Autorización por rol         | Solo `admin` puede aprobar/rechazar reservas y gestionar espacios. Retorna `403`.       |
| C  | Sin solapamiento de horarios | Verifica reservas activas (`esperando` / `aprobada`) en el mismo espacio, fecha y hora. |
| D  | Anticipación mínima 24h      | La reserva debe crearse con al menos 24 horas de antelación a la hora de inicio.        |
| E  | Horario hábil                | Lun–Vie 07:00–20:00 · Sáb 08:00–12:00 · Dom: no permitido. Retorna `400`.              |
| F  | Coherencia de tiempo         | `hora_inicio` debe ser estrictamente menor que `hora_fin`. Retorna `422`.               |
| G  | Espacios inactivos           | No se pueden reservar espacios con estado diferente a `"activo"`. Retorna `400`.        |
| H  | Capacidad máxima             | `cantidad_asistentes` no puede superar la `capacidad` registrada del espacio.           |
| I  | Estado inicial               | Toda reserva nueva nace en estado `"esperando"`. Solo `admin` cambia a `"aprobada"` / `"rechazada"`. |

---

## 👥 Roles y Control de Acceso

| Acción                                  | `usuario` | `admin` |
|-----------------------------------------|:---------:|:-------:|
| Iniciar sesión                          | ✅        | ✅      |
| Registrar cuenta                        | ✅        | ✅      |
| Ver perfil propio                       | ✅        | ✅      |
| Consultar espacios                      | ✅        | ✅      |
| Crear reserva propia                    | ✅        | ✅      |
| Ver sus propias reservas                | ✅        | ✅      |
| Cancelar reserva propia                 | ✅        | ✅      |
| Listar todos los usuarios               | ❌        | ✅      |
| Crear / actualizar espacios             | ❌        | ✅      |
| Ver todas las reservas del sistema      | ❌        | ✅      |
| Aprobar o rechazar cualquier reserva    | ❌        | ✅      |
| Cancelar cualquier reserva              | ❌        | ✅      |

---

> 📬 Para reportar errores o proponer mejoras, abre un *Issue* en el repositorio
> del proyecto indicando el endpoint afectado, el payload enviado y el error
> recibido.

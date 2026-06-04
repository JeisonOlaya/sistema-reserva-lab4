# Sistema de Reservas Institucionales - Frontend

## Descripción General

Este proyecto corresponde al desarrollo del Frontend del Sistema de Reservas Institucionales. La aplicación fue desarrollada utilizando React y permite la interacción con la API REST del sistema para gestionar usuarios, espacios institucionales y reservas.

El sistema implementa autenticación mediante JWT y control de acceso basado en roles (Administrador y Usuario).

---

# Tecnologías Utilizadas

* React
* React Router DOM
* Axios
* SweetAlert2
* CSS
* Vite
* Docker

---

# Estructura del Proyecto

src/

* components/

  * Loader
  * Navbar
  * PrivateRoute

* pages/

  * auth/
  * usuarios/
  * espacios/
  * reservas/
  * sistema/

* services/

  * authService
  * usuarioService
  * espacioService
  * reservaService
  * estadoService

* routes/

  * AppRouter

---

# Módulo de Autenticación

## Inicio de Sesión

Permite a los usuarios autenticarse mediante correo electrónico y contraseña.

Funciones principales:

* Consumo del endpoint de login.
* Almacenamiento del token JWT.
* Almacenamiento del nombre del usuario.
* Almacenamiento del rol del usuario.
* Redirección automática al perfil.

---

# Módulo de Usuarios

## Registro de Usuario

Permite registrar nuevos usuarios en el sistema.

Datos registrados:

* Nombre
* Correo electrónico
* Contraseña
* Rol

## Consulta de Usuarios

Disponible para administración.

Funciones:

* Listar usuarios.
* Buscar usuarios por ID.
* Visualizar información básica.

## Perfil

Permite visualizar la información del usuario autenticado:

* ID
* Nombre
* Correo
* Rol

Se incluye una identificación visual del rol mediante etiquetas de color.

---

# Módulo de Espacios

Gestiona los espacios institucionales disponibles para reserva.

## Funcionalidades

* Listar espacios.
* Buscar espacios por ID.
* Crear espacios.
* Editar espacios.

Información administrada:

* Nombre
* Ubicación
* Capacidad
* Estado

Las operaciones de creación y edición están restringidas al rol administrador.

---

# Módulo de Reservas

Permite la administración completa de reservas institucionales.

## Crear Reserva

El usuario puede crear reservas indicando:

* Espacio
* Fecha
* Hora de inicio
* Hora de finalización
* Cantidad de asistentes

Validaciones implementadas:

* La cantidad de asistentes debe ser mayor a cero.
* La hora de inicio debe ser menor a la hora final.
* La reserva debe realizarse con mínimo 24 horas de anticipación.
* Solo se permiten reservas entre lunes y viernes.

## Mis Reservas

Permite visualizar únicamente las reservas del usuario autenticado.

Información mostrada:

* ID
* Espacio
* Fecha
* Hora inicio
* Hora fin
* Estado

Además, permite cancelar reservas.

## Gestión de Reservas

Disponible para administradores.

Permite:

* Visualizar todas las reservas.
* Aprobar reservas.
* Rechazar reservas.

Estados manejados:

* Pendiente
* Aprobada
* Rechazada

## Consulta General de Reservas

Vista administrativa para consultar todas las reservas registradas en el sistema.

Incluye búsqueda por ID de reserva.

---

# Estado del Sistema

Permite consultar información general de la API.

Información mostrada:

* Estado del servicio
* Nombre de la aplicación
* Versión
* URL de Swagger
* URL de ReDoc

---

# Seguridad

El sistema utiliza:

* JWT (JSON Web Token)
* Protección de rutas mediante PrivateRoute
* Control de acceso basado en roles
* Persistencia de sesión mediante localStorage

---

# Navegación

Principales rutas:

/ -> Login

/usuarios/registrar -> Registro

/perfil -> Perfil

/usuarios -> Gestión de usuarios

/espacios -> Gestión de espacios

/espacios/crear -> Crear espacio

/espacios/editar/:id -> Editar espacio

/reservas -> Consulta general de reservas

/reservas/crear -> Crear reserva

/mis-reservas -> Reservas del usuario

/gestion-reservas -> Administración de reservas

/estado -> Estado del sistema

---

# Autor

Helen Yurahay Yanes Baron

Desarrolladora de Software
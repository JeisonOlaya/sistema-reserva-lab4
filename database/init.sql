-- ============================================================
-- Sistema de Reservas de Espacios Institucionales
-- Script de inicialización de base de datos
-- Compatible con PostgreSQL 14+
-- ============================================================
-- INSTRUCCIONES DE USO:
--   Opción 1 (terminal):
--     psql -U postgres -d reservas_db -f database/init.sql
--   Opción 2 (Docker Compose):
--     Montar este archivo en /docker-entrypoint-initdb.d/
-- ============================================================

-- ------------------------------------------------------------
-- Extensiones útiles
-- ------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- búsquedas por similitud de texto

-- ------------------------------------------------------------
-- Eliminar tablas si existen (para reinicialización limpia)
-- El orden importa por las claves foráneas
-- ------------------------------------------------------------
DROP TABLE IF EXISTS reservas  CASCADE;
DROP TABLE IF EXISTS espacios  CASCADE;
DROP TABLE IF EXISTS usuarios  CASCADE;

-- ------------------------------------------------------------
-- Tabla: usuarios
-- ------------------------------------------------------------
CREATE TABLE usuarios (
    id_usuario       SERIAL          PRIMARY KEY,
    nombre           VARCHAR(100)    NOT NULL,
    correo           VARCHAR(150)    NOT NULL UNIQUE,
    contrasena_hash  VARCHAR(255)    NOT NULL,
    rol              VARCHAR(20)     NOT NULL DEFAULT 'usuario'
                                    CHECK (rol IN ('admin', 'usuario'))
);

COMMENT ON TABLE  usuarios              IS 'Usuarios registrados en el sistema';
COMMENT ON COLUMN usuarios.id_usuario   IS 'Identificador único autoincremental';
COMMENT ON COLUMN usuarios.nombre       IS 'Nombre completo del usuario';
COMMENT ON COLUMN usuarios.correo       IS 'Correo electrónico — debe ser único en el sistema';
COMMENT ON COLUMN usuarios.contrasena_hash IS 'Hash bcrypt de la contraseña — nunca texto plano';
COMMENT ON COLUMN usuarios.rol          IS 'Rol del usuario: admin o usuario';

-- Índice para búsquedas frecuentes por correo (login)
CREATE INDEX idx_usuarios_correo ON usuarios (correo);

-- ------------------------------------------------------------
-- Tabla: espacios
-- ------------------------------------------------------------
CREATE TABLE espacios (
    id_espacio   SERIAL          PRIMARY KEY,
    nombre       VARCHAR(100)    NOT NULL,
    ubicacion    VARCHAR(150)    NOT NULL,
    capacidad    INTEGER         NOT NULL CHECK (capacidad > 0),
    estado       VARCHAR(30)     NOT NULL DEFAULT 'activo'
                                 CHECK (estado IN ('activo', 'inactivo'))
);

COMMENT ON TABLE  espacios             IS 'Espacios físicos de la institución disponibles para reserva';
COMMENT ON COLUMN espacios.id_espacio  IS 'Identificador único autoincremental';
COMMENT ON COLUMN espacios.nombre      IS 'Nombre descriptivo del espacio (ej: Laboratorio A)';
COMMENT ON COLUMN espacios.ubicacion   IS 'Ubicación física dentro de la institución';
COMMENT ON COLUMN espacios.capacidad   IS 'Número máximo de personas permitidas en el espacio';
COMMENT ON COLUMN espacios.estado      IS 'Estado operativo: activo (reservable) o inactivo';

-- Índice para filtrar por espacios activos frecuentemente
CREATE INDEX idx_espacios_estado ON espacios (estado);

-- ------------------------------------------------------------
-- Tabla: reservas
-- ------------------------------------------------------------
CREATE TABLE reservas (
    id_reserva           SERIAL      PRIMARY KEY,
    id_usuario           INTEGER     NOT NULL
                                     REFERENCES usuarios (id_usuario)
                                     ON DELETE CASCADE,
    id_espacio           INTEGER     NOT NULL
                                     REFERENCES espacios (id_espacio)
                                     ON DELETE CASCADE,
    fecha                DATE        NOT NULL,
    hora_inicio          TIME        NOT NULL,
    hora_fin             TIME        NOT NULL,
    cantidad_asistentes  INTEGER     NOT NULL CHECK (cantidad_asistentes > 0),
    estado               VARCHAR(20) NOT NULL DEFAULT 'esperando'
                                     CHECK (estado IN ('esperando', 'aprobada', 'rechazada')),

    -- Restricción: hora_inicio siempre menor que hora_fin
    CONSTRAINT chk_horas_coherentes CHECK (hora_inicio < hora_fin)
);

COMMENT ON TABLE  reservas                    IS 'Reservas de espacios realizadas por los usuarios';
COMMENT ON COLUMN reservas.id_reserva         IS 'Identificador único autoincremental';
COMMENT ON COLUMN reservas.id_usuario         IS 'FK al usuario que realizó la reserva';
COMMENT ON COLUMN reservas.id_espacio         IS 'FK al espacio que se está reservando';
COMMENT ON COLUMN reservas.fecha              IS 'Fecha de la reserva (YYYY-MM-DD)';
COMMENT ON COLUMN reservas.hora_inicio        IS 'Hora de inicio del bloque reservado';
COMMENT ON COLUMN reservas.hora_fin           IS 'Hora de fin del bloque reservado';
COMMENT ON COLUMN reservas.cantidad_asistentes IS 'Número de personas que asistirán';
COMMENT ON COLUMN reservas.estado             IS 'Estado: esperando | aprobada | rechazada';

-- Índice compuesto para acelerar la consulta de solapamiento de horarios
-- (la validación más crítica del sistema)
CREATE INDEX idx_reservas_disponibilidad
    ON reservas (id_espacio, fecha, estado)
    WHERE estado IN ('esperando', 'aprobada');

-- Índice para consultas por usuario (mis reservas)
CREATE INDEX idx_reservas_usuario ON reservas (id_usuario);

-- ------------------------------------------------------------
-- Vista útil: reservas con información completa
-- Facilita consultas desde herramientas externas o reportes
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW v_reservas_detalle AS
SELECT
    r.id_reserva,
    u.nombre            AS nombre_usuario,
    u.correo            AS correo_usuario,
    e.nombre            AS nombre_espacio,
    e.ubicacion         AS ubicacion_espacio,
    e.capacidad         AS capacidad_espacio,
    r.fecha,
    r.hora_inicio,
    r.hora_fin,
    r.cantidad_asistentes,
    r.estado
FROM reservas r
JOIN usuarios u ON r.id_usuario = u.id_usuario
JOIN espacios e ON r.id_espacio = e.id_espacio;

COMMENT ON VIEW v_reservas_detalle IS
    'Vista desnormalizada de reservas con nombre de usuario y espacio — solo lectura';
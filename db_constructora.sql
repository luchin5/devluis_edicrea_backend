
CREATE SCHEMA seguridad;
CREATE SCHEMA inmobiliaria;
CREATE SCHEMA capacitacion;

-- SEGURIDAD
CREATE TABLE seguridad.rol (
    id integer generated always as identity primary key,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(200)
);

CREATE TABLE seguridad.usuario (
    id integer generated always as identity primary key,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol_id INTEGER
);

-- INMOBILIARIA
CREATE TABLE inmobiliaria.proyecto (
   id integer generated always as identity primary key,
    nombre VARCHAR(120) NOT NULL,
    descripcion TEXT,
    ubicacion VARCHAR(200),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INTEGER
);

CREATE TABLE inmobiliaria.plano (
   id integer generated always as identity primary key,
    nombre VARCHAR(120) NOT NULL,
    archivo_svg VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    proyecto_id INTEGER
);

CREATE TABLE inmobiliaria.zona (
    id integer generated always as identity primary key,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    plano_id INTEGER
);

CREATE TABLE inmobiliaria.lote (
    id integer generated always as identity primary key,
    numero VARCHAR(20) NOT NULL,
    area NUMERIC(10,2) NOT NULL,
    precio NUMERIC(12,2) NOT NULL,
    coordenadas_svg TEXT,
    zona_id INTEGER,
    estado_id INTEGER,
    usuario_id INTEGER
);

CREATE TABLE inmobiliaria.estado (
   id integer generated always as identity primary key,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(200)
);


-- CAPACITACIÓN
CREATE TABLE capacitacion.capacitacion (
    id integer generated always as identity primary key,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INTEGER
);

CREATE TABLE capacitacion.material_capacitacion (
    id integer generated always as identity primary key,
    nombre VARCHAR(150) NOT NULL,
    tipo VARCHAR(50),
    url VARCHAR(255),
    capacitacion_id INTEGER
);

---

ALTER TABLE seguridad.usuario
ADD CONSTRAINT fk_usuario_rol_id
FOREIGN KEY (rol_id)
REFERENCES seguridad.rol(id)
ON UPDATE CASCADE
ON DELETE CASCADE;

ALTER TABLE inmobiliaria.proyecto
ADD CONSTRAINT fk_proyecto_usuario_id
FOREIGN KEY (usuario_id)
REFERENCES seguridad.usuario(id)
ON UPDATE CASCADE
ON DELETE CASCADE;

ALTER TABLE capacitacion.capacitacion
ADD CONSTRAINT fk_capacitacion_usuario_id
FOREIGN KEY (usuario_id)
REFERENCES seguridad.usuario(id)
ON UPDATE CASCADE
ON DELETE CASCADE;

ALTER TABLE capacitacion.material_capacitacion
ADD CONSTRAINT fk_material_capacitacion_capacitacion_id
FOREIGN KEY (capacitacion_id)
REFERENCES capacitacion.capacitacion(id)
ON UPDATE CASCADE
ON DELETE CASCADE;

ALTER TABLE inmobiliaria.plano
ADD CONSTRAINT fk_plano_proyecto_id
FOREIGN KEY (proyecto_id)
REFERENCES inmobiliaria.proyecto(id)
ON UPDATE CASCADE
ON DELETE CASCADE;

ALTER TABLE inmobiliaria.zona
ADD CONSTRAINT fk_zona_plano_id
FOREIGN KEY (plano_id)
REFERENCES inmobiliaria.plano(id)
ON UPDATE CASCADE
ON DELETE CASCADE;

ALTER TABLE inmobiliaria.lote
ADD CONSTRAINT fk_lote_zona_id
FOREIGN KEY (zona_id)
REFERENCES inmobiliaria.zona(id)
ON UPDATE CASCADE
ON DELETE CASCADE;

ALTER TABLE inmobiliaria.lote
ADD CONSTRAINT fk_lote_estado_id
FOREIGN KEY (estado_id)
REFERENCES inmobiliaria.estado(id)
ON UPDATE CASCADE
ON DELETE CASCADE;

ALTER TABLE inmobiliaria.lote
ADD CONSTRAINT fk_lote_usuario_id
FOREIGN KEY (usuario_id)
REFERENCES seguridad.usuario(id)
ON UPDATE CASCADE
ON DELETE CASCADE;

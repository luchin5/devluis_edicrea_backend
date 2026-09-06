-- =====================================
-- SEGURIDAD
-- =====================================

INSERT INTO seguridad.rol (nombre, descripcion)
VALUES
('Administrador', 'Administrador del sistema'),
('Colaborador', 'Colaborador encargado de la gestión de lotes');


INSERT INTO seguridad.usuario
(nombres, apellidos, correo, contrasena, rol_id)
VALUES
('Luis', 'Gonzáles', 'luis@constructora.com', '123456', 1),
('María', 'Quispe', 'maria@constructora.com', '123456', 2),
('Carlos', 'Torres', 'carlos@constructora.com', '123456', 2);


-- =====================================
-- INMOBILIARIA
-- =====================================

INSERT INTO inmobiliaria.proyecto
(nombre, descripcion, ubicacion, usuario_id)
VALUES
(
'Residencial Las Palmeras',
'Proyecto residencial de viviendas',
'Arequipa',
1
);


INSERT INTO inmobiliaria.plano
(nombre, archivo_svg, proyecto_id)
VALUES
(
'Plano General',
'las_palmeras.svg',
1
);


INSERT INTO inmobiliaria.zona
(nombre, descripcion, plano_id)
VALUES
('Zona A','Zona principal',1),
('Zona B','Zona secundaria',1);


INSERT INTO inmobiliaria.estado
(nombre, descripcion)
VALUES
('Libre','Disponible para venta'),
('Separado','Reservado temporalmente'),
('Vendido','Venta concluida');


INSERT INTO inmobiliaria.lote
(
numero,
area,
precio,
coordenadas_svg,
zona_id,
estado_id,
usuario_id
)
VALUES

(
'A-01',
120.50,
58000,
'polygon(10,20,30,40)',
1,
1,
2
),

(
'A-02',
125.00,
61000,
'polygon(40,50,60,70)',
1,
2,
2
),

(
'A-03',
130.75,
65000,
'polygon(80,90,100,110)',
1,
3,
3
),

(
'B-01',
140.20,
72000,
'polygon(20,30,50,60)',
2,
1,
3
),

(
'B-02',
150.00,
76000,
'polygon(25,35,55,65)',
2,
1,
NULL
);


-- =====================================
-- CAPACITACIONES
-- =====================================

INSERT INTO capacitacion.capacitacion
(
titulo,
descripcion,
usuario_id
)
VALUES
(
'Proceso de Venta',
'Capacitación para la gestión comercial de lotes.',
1
),

(
'Uso del Sistema',
'Manual de uso del sistema CRM.',
1
);


INSERT INTO capacitacion.material_capacitacion
(
nombre,
tipo,
url,
capacitacion_id
)
VALUES

(
'Manual del Sistema',
'PDF',
'https://empresa.com/manual.pdf',
2
),

(
'Video Comercial',
'VIDEO',
'https://empresa.com/video.mp4',
1
),

(
'Presentación',
'PPT',
'https://empresa.com/presentacion.pptx',
1
);
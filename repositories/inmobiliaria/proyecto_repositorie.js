// CAPA DE DATOS
// Repositorio de proyectos

import db from "../../config/config_db.js";

export const getProyectos = async () => {
  try {
    const resultado = await db.any(`
      SELECT
        p.id,
        p.nombre,
        p.descripcion,
        p.ubicacion,
        p.fecha_registro,
        p.usuario_id,
        COUNT(pl.id)::int AS total_planos
      FROM inmobiliaria.proyecto p
      LEFT JOIN inmobiliaria.plano pl
        ON pl.proyecto_id = p.id
      GROUP BY
        p.id,
        p.nombre,
        p.descripcion,
        p.ubicacion,
        p.fecha_registro,
        p.usuario_id
      ORDER BY p.id;
    `);

    return resultado;
  } catch (error) {
    console.error("Error en getProyectos:", error);
    throw error;
  }
};

export const getProyectoById = async (id) => {
  try {/*
    const resultado = await db.oneOrNone(`SELECT * FROM inmobiliaria.proyecto WHERE id = $1`, [id]);
    return resultado;*/

     // Proyecto
    const proyecto = await db.oneOrNone(`
      SELECT
        id,
        nombre,
        descripcion,
        ubicacion,
        fecha_registro
      FROM inmobiliaria.proyecto
      WHERE id = $1
    `, [id]);

    // Cards
    const cards = await db.one(`
      SELECT
        COUNT(l.id) AS total_lotes,
        COUNT(*) FILTER (WHERE e.nombre = 'Libre') AS libres,
        COUNT(*) FILTER (WHERE e.nombre = 'Separado') AS separados,
        COUNT(*) FILTER (WHERE e.nombre = 'Vendido') AS vendidos
      FROM inmobiliaria.lote l
      INNER JOIN inmobiliaria.zona z
        ON z.id = l.zona_id
      INNER JOIN inmobiliaria.plano pl
        ON pl.id = z.plano_id
      INNER JOIN inmobiliaria.estado e
        ON e.id = l.estado_id
      WHERE pl.proyecto_id = $1
    `, [id]);

    // Estado de lotes (PieChart)
    const estadoLotes = await db.any(`
      SELECT
        e.nombre AS estado,
        COUNT(l.id)::int AS total
      FROM inmobiliaria.lote l
      INNER JOIN inmobiliaria.estado e
        ON e.id = l.estado_id
      INNER JOIN inmobiliaria.zona z
        ON z.id = l.zona_id
      INNER JOIN inmobiliaria.plano pl
        ON pl.id = z.plano_id
      WHERE pl.proyecto_id = $1
      GROUP BY e.nombre
      ORDER BY e.nombre
    `, [id]);

// Ventas mensuales
const ventasMensuales = await db.any(`
  SELECT
    EXTRACT(MONTH FROM l.fecha_venta)::int AS numero_mes,
    COUNT(l.id)::int AS ventas
  FROM inmobiliaria.lote l
  INNER JOIN inmobiliaria.zona z
    ON z.id = l.zona_id
  INNER JOIN inmobiliaria.plano pl
    ON pl.id = z.plano_id
  WHERE
    pl.proyecto_id = $1
    AND l.estado_id = 3
    AND l.fecha_venta IS NOT NULL
  GROUP BY
    EXTRACT(MONTH FROM l.fecha_venta)
  ORDER BY
    numero_mes
`, [id]);
    return {
      proyecto,
      cards,
      estadoLotes,
      ventasMensuales
    };
  } catch (error) {
    console.error("Error en getProyectoById:", error);
    throw error;
  }     
}

export const createProyecto = async (proyecto) => {
  try {
    const { nombre, descripcion, ubicacion, fecha_registro, usuario_id } = proyecto;
    const resultado = await db.one(`INSERT INTO inmobiliaria.proyecto (nombre, descripcion, ubicacion, fecha_registro, usuario_id) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, descripcion, ubicacion, fecha_registro, usuario_id]);
    return resultado;
  } catch (error) {
    console.error("Error en createProyecto:", error);
    throw error;
  }
}

export const updateProyecto = async (id, proyecto) => {
  try {
    const { nombre, descripcion, ubicacion, fecha_registro, usuario_id } = proyecto;
    const resultado = await db.one(`UPDATE inmobiliaria.proyecto 
        SET nombre = $1, descripcion = $2, ubicacion = $3, fecha_registro = $4, usuario_id = $5 WHERE id = $6 RETURNING *`,
      [nombre, descripcion, ubicacion, fecha_registro, usuario_id, id]);
    return resultado;
  } catch (error) {
    console.error("Error en updateProyecto:", error);
    throw error;
  }
}

export const deleteProyecto = async (id) => {
  try {
    const resultado = await db.result(`DELETE FROM inmobiliaria.proyecto WHERE id = $1`, [id]);
    return resultado.rowCount > 0;
  } catch (error) {
    console.error("Error en deleteProyecto:", error);
    throw error;
  }
}
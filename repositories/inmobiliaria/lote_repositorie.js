// CAPA DE DATOS
// Repositorio de lotes

import db from "../../config/config_db.js";

// Hacer la funciones solo con pg-promise

export const getAllLotes = async () => {
  try {

    const resultado = await db.any(
      `SELECT
    l.*,
    u.nombres,
    u.apellidos
FROM inmobiliaria.lote l
LEFT JOIN seguridad.usuario u
    ON u.id = l.usuario_id`
    );

    return resultado;

  } catch (error) {
    console.error("Error en getAllLotes:", error);
    throw new Error("Error al obtener los lotes");
  }
};

// estadistica por zona
export const getEstadisticaPorZonaId = async (zonaId) => {
  try {
    const resultado = await db.one(
      `SELECT
    COUNT(*) FILTER (WHERE estado_id = 1) AS disponibles,
    COUNT(*) FILTER (WHERE estado_id = 2) AS separados,
    COUNT(*) FILTER (WHERE estado_id = 3) AS vendidos,
    COUNT(*) FILTER (WHERE estado_id = 4) AS amortizados
FROM inmobiliaria.lote
WHERE zona_id = $1;`,
      [zonaId],
    );
    console.log("Resultado de getEstadisticaPorZonaId:", resultado);
    return resultado;
  } catch (error) {
    console.error("Error en getEstadisticaPorZonaId:", error);
    throw new Error("Error al obtener los lotes por zona");
  }
};

export const getLoteById = async (id) => {
  try {
    const resultado = await db.oneOrNone(
      "SELECT * FROM inmobiliaria.lote WHERE id = $1",
      [id],
    );
    return resultado;
  } catch (error) {
    console.error("Error en getLoteById:", error);
    throw new Error("Error al obtener el lote por ID");
  }
};

export const getLotexSvg = async (path) => {
  console.log("Obteniendo lote por SVG con path:", path);
  try {
    const lote = await db.oneOrNone(
      `SELECT
          l.*,
          u.nombres,
          u.apellidos
       FROM inmobiliaria.lote l
       LEFT JOIN seguridad.usuario u
          ON u.id = l.usuario_id
       WHERE l.coordenadas_svg = $1`,
      [path],
    );

    return lote;
  } catch (error) {
    console.error("Error en getLotexSvg:", error);
    throw new Error("Error al obtener el lote por SVG");
  }
};
/*
export const getLotexSvg = async (path) => {
  try {
    const lote = await db.oneOrNone(
      `SELECT *
FROM inmobiliaria.lote
WHERE coordenadas_svg=$1;`,
      [path],
    );
    return lote;
  } catch (error) {
    console.error("Error en getLoteById:", error);
    throw new Error("Error al obtener el lote por ID");
  }
};*/

export const getCountEstado = async () => {
  try {
    const resultado = await db.any(`
            SELECT
                e.nombre AS estado,
                COUNT(l.id) AS total
            FROM inmobiliaria.estado e
            LEFT JOIN inmobiliaria.lote l
                ON l.estado_id = e.id
            GROUP BY e.id, e.nombre
            ORDER BY e.id;
        `);

    return resultado;
  } catch (error) {
    console.error("Error en getCountEstado:", error);
    throw new Error("Error al contar los lotes por estado");
  }
};

export const getVentasMensuales = async () => {
  try {
    const resultado = await db.any(`
            SELECT
                EXTRACT(MONTH FROM fecha_actualizacion) AS mes_numero,

                CASE EXTRACT(MONTH FROM fecha_actualizacion)
                    WHEN 1 THEN 'Ene'
                    WHEN 2 THEN 'Feb'
                    WHEN 3 THEN 'Mar'
                    WHEN 4 THEN 'Abr'
                    WHEN 5 THEN 'May'
                    WHEN 6 THEN 'Jun'
                    WHEN 7 THEN 'Jul'
                    WHEN 8 THEN 'Ago'
                    WHEN 9 THEN 'Sep'
                    WHEN 10 THEN 'Oct'
                    WHEN 11 THEN 'Nov'
                    WHEN 12 THEN 'Dic'
                END AS mes,

                COUNT(*) AS ventas

            FROM inmobiliaria.lote

            WHERE estado_id = 3
              AND EXTRACT(YEAR FROM fecha_actualizacion) =
                  EXTRACT(YEAR FROM CURRENT_DATE)

            GROUP BY
                EXTRACT(MONTH FROM fecha_actualizacion)

            ORDER BY
                mes_numero;
        `);

    return resultado;
  } catch (error) {
    console.error("Error en getVentasMensuales:", error);
    throw new Error("Error al obtener las ventas mensuales");
  }
};

export const getDashboardProyectos = async () => {
  try {
    const resultado = await db.any(`
            SELECT
                p.id,
                p.nombre,

                COUNT(l.id) AS lotes,

                COUNT(CASE
                        WHEN e.nombre='Vendido'
                        THEN 1
                     END) AS vendidos

            FROM inmobiliaria.proyecto p

            LEFT JOIN inmobiliaria.plano pl
                ON p.id=pl.proyecto_id

            LEFT JOIN inmobiliaria.zona z
                ON pl.id=z.plano_id

            LEFT JOIN inmobiliaria.lote l
                ON z.id=l.zona_id

            LEFT JOIN inmobiliaria.estado e
                ON l.estado_id=e.id

            GROUP BY p.id,p.nombre

            ORDER BY p.nombre;
        `);

    return resultado;
  } catch (error) {
    console.error(error);
    throw new Error("Error proyectos");
  }
};

export const getLoteCount = async () => {
  try {
    const resultado = await db.oneOrNone(
      "SELECT COUNT(*) FROM inmobiliaria.lote",
    );
    console.log("....TOTAL.", resultado);
    return resultado;
  } catch (error) {
    console.error("Error en count all lotes", error);
    throw new Error("Error al obtener el lote por ID");
  }
};

export const createLote = async (lote) => {
  try {
    const {
      numero,
      area,
      precio,
      coordenadas_svg,
      zona_id,
      estado_id,
      version_actual,
      usuario_id,
    } = lote;
    const resultado = await db.one(
      `INSERT INTO inmobiliaria.lote
             (numero, area,precio,coordenadas_svg,zona_id,estado_id,usuario_id,version_actual) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        numero,
        area,
        precio,
        coordenadas_svg,
        zona_id,
        estado_id,
        usuario_id,
        version_actual,
      ],
    );
    return resultado;
  } catch (error) {
    console.error("Error en createLote:", error);
    throw new Error("Error al crear el lote");
  }
};

// update para administrador
export const updateLote = async (id, lote) => {
  try {
    const { numero, area, precio, estado_id, usuario_id } = lote;

    const resultado = await db.one(
      `UPDATE inmobiliaria.lote
       SET
          numero = $1,
          area = $2,
          precio = $3,
          estado_id = $4,
          usuario_id = $5,
          version_actual = version_actual + 1,
          fecha_actualizacion = NOW()
       WHERE id = $6
       RETURNING *`,
      [numero, area, precio, estado_id, usuario_id, id],
    );

    return resultado;

  } catch (error) {
    console.error("Error en updateLote:", error);
    throw new Error("Error al actualizar el lote");
  }
};

// update para vendedor
export const updateEstadoLoteXVendedor = async (id, lote) => {
  try {
    const { estado_id, usuario_id } = lote;

    const resultado = await db.one(
      `UPDATE inmobiliaria.lote
       SET
          estado_id = $1,
          usuario_id = $2,
          version_actual = version_actual + 1,
          fecha_actualizacion = NOW(),
          fecha_vencimiento =
            CASE
              WHEN $1 = 2 THEN NOW() + INTERVAL '7 days'
              WHEN $1 = 4 THEN NOW() + INTERVAL '15 days'
              ELSE NULL
            END
       WHERE id = $3
       RETURNING *`,
      [estado_id, usuario_id, id],
    );

     const loteConUsuario = await db.one(
      `SELECT
          l.*,
          u.nombres,
          u.apellidos
       FROM inmobiliaria.lote l
       LEFT JOIN seguridad.usuario u
          ON u.id = l.usuario_id
       WHERE l.id = $1`,
      [id]
    );

    return loteConUsuario;
  } catch (error) {
    console.error("Error en updateEstadoLoteXVendedor:", error);
    throw new Error("Error al actualizar el estado del lote");
  }
};

// Liberar lote (vendedor)
export const liberarLotesVencidos = async () => {
  try {
    const lotesLiberados = await db.any(
      `UPDATE inmobiliaria.lote
       SET
          estado_id = 1,
          fecha_vencimiento = NULL,
          fecha_actualizacion = NOW()
       WHERE estado_id IN (2, 4)
         AND fecha_vencimiento IS NOT NULL
         AND fecha_vencimiento < NOW()
         RETURNING *`
    );

    return lotesLiberados;
  } catch (error) {
    console.error("Error en liberarLotesVencidos:", error);
    throw new Error("Error al liberar lotes vencidos");
  }
};

export const deleteLote = async (id) => {
  try {
    await db.result("DELETE FROM inmobiliaria.lote WHERE id = $1", [id]);
    return { message: "Lote eliminado correctamente" };
  } catch (error) {
    console.error("Error en deleteLote:", error);
    throw new Error("Error al eliminar el lote");
  }
};

export const deleteLoteByZona = async (zonaId) => {
  try {
    await db.result("DELETE FROM inmobiliaria.lote WHERE zona_id = $1", [
      zonaId,
    ]);
    return { message: "Lote eliminado correctamente" };
  } catch (error) {
    console.error("Error en deleteLote:", error);
    throw new Error("Error al eliminar el lote");
  }
};

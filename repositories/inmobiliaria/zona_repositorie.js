// CAPA DE DATOS
// Repositorio de zonas

import db from "../../config/config_db.js";

// Hacer la funciones solo con pg-promise

export const getAllZonas = async () => {   
    try {
        const resultado = await db.any("SELECT * FROM inmobiliaria.zona");
        return resultado;
    }   
    catch (error) {
        console.error("Error en getAllZonas:", error);
        throw new Error("Error al obtener las zonas");
    }
};

export const getZonaById = async (id) => {
    try {
        const resultado = await db.oneOrNone
        (`SELECT
    z.id,
    z.nombre,
    z.descripcion,
    z.color,

    p.id AS plano_id,
    p.nombre AS plano,

    pr.id AS proyecto_id,
    pr.nombre AS proyecto,

    STRING_AGG(l.coordenadas_svg, ',' ORDER BY l.id) AS svgids

FROM inmobiliaria.zona z

INNER JOIN inmobiliaria.plano p
    ON p.id = z.plano_id

INNER JOIN inmobiliaria.proyecto pr
    ON pr.id = p.proyecto_id

LEFT JOIN inmobiliaria.lote l
    ON l.zona_id = z.id

WHERE z.id = $1

GROUP BY
    z.id,
    z.nombre,
    z.descripcion,
    z.color,
    p.id,
    p.nombre,
    pr.id,
    pr.nombre;`, [id]);   
        return resultado;
    } catch (error) {
        console.error("Error en getZonaById:", error);
        throw new Error("Error al obtener la zona por ID");
    }
};

export const getZona_x_svg = async () => {
    try {
        const resultado = await db.any
        (`SELECT
    z.id,
    z.nombre,
    z.descripcion,
    z.plano_id,
    z.color,
    string_agg(l.coordenadas_svg, ',') AS svgIds
FROM inmobiliaria.zona z
LEFT JOIN inmobiliaria.lote l
ON l.zona_id = z.id
GROUP BY
    z.id,
    z.nombre,
    z.descripcion,
    z.plano_id,z.color;`);   
        return resultado;
    } catch (error) {
        console.error("Error en getZonaxsvg:", error);
        throw new Error("Error al obtener la zona por svg");
    }
};


export const createZona = async (zona) => {
    try {
        const { nombre,descripcion,plano_id } = zona;
        const resultado = await db.one(`INSERT INTO inmobiliaria.zona (nombre, descripcion, plano_id,color) 
            VALUES ($1, $2, $3,$4) RETURNING *`, 
            [zona.nombre, zona.descripcion, zona.plano_id,zona.color]);
        return resultado;
    } catch (error) {
        console.error("Error en createZona:", error);
        throw new Error("Error al crear la zona");
    }
};

export const updateZona = async (id, zona) => {
    try {
        const { nombre, descripcion, color } = zona;
        const resultado = await db.one(
            `UPDATE inmobiliaria.zona SET
             nombre = $1, descripcion = $2, color = $3
              WHERE id = $4 RETURNING *`,
        [nombre, descripcion, color, id]);
        return resultado;
    } catch (error) {
        console.error("Error en updateZona:", error);
        throw new Error("Error al actualizar la zona");
    }
};

export const deleteZona = async (id) => {
    try {
        await db.result("DELETE FROM inmobiliaria.zona WHERE id = $1", [id]);
        return { message: "Zona eliminada correctamente" };
    } catch (error) {
        console.error("Error en deleteZona:", error);
        throw new Error("Error al eliminar la zona");
    }
};
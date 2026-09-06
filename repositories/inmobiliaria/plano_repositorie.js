// CAPA DE DATOS
// Repositorio de planos

import db from '../../config/config_db.js';

export const getPlanos = async () => {
    try {
        const resultado = await db.any(`SELECT * FROM inmobiliaria.plano`);
        return resultado;
    } catch (error) {
        console.error("Error en getPlanos:", error);
        throw error;
    }
};

export const getPlanoById = async (id) => {
    try {
        const resultado = await db.oneOrNone(`SELECT * FROM inmobiliaria.plano WHERE id = $1`, [id]);
        return resultado;
    } catch (error) {
        console.error("Error en getPlanoById:", error);
        throw error;
    }
};

export const createPlano = async (plano) => {
    try {
        const { nombre, archivo_svg, fecha_registro, proyecto_id } = plano;
        const resultado = await db.one(`INSERT INTO inmobiliaria.plano (nombre, archivo_svg, fecha_registro,proyecto_id) 
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [nombre, archivo_svg, fecha_registro, proyecto_id]);
        return resultado;
    } catch (error) {
        console.error("Error en createPlano:", error);
        throw error;
    }
};

export const updatePlano = async (id, plano) => {
    try {
        const { nombre, archivo_svg, fecha_registro, proyecto_id } = plano;
        const resultado = await db.one(`UPDATE inmobiliaria.plano 
            SET nombre = $1, archivo_svg = $2, fecha_registro = $3, proyecto_id = $4 WHERE id = $5 RETURNING *`,
            [nombre, archivo_svg, fecha_registro, proyecto_id, id]);
        return resultado;
    } catch (error) {
        console.error("Error en updatePlano:", error);
        throw error;
    }
};

export const deletePlano = async (id) => {
    try {
        const resultado = await db.result(`DELETE FROM inmobiliaria.plano WHERE id = $1`, [id]);
        return resultado.rowCount > 0;
    } catch (error) {
        console.error("Error en deletePlano:", error);
        throw error;
    }
};
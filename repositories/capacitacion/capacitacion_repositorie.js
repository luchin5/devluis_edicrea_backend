// CAPA DE DATOS
// Repositorio de capacitaciones

import db from '../../config/config_db.js';

// Hacer la funciones solo con pg-promise

export const getAllCapacitaciones = async () => {
    try {
        const resultado = await db.any("SELECT * FROM capacitacion.capacitacion");
        return resultado;
    } catch (error) {
        console.error("Error en getAllCapacitaciones:", error);
        throw new Error("Error al obtener las capacitaciones");
    }
};

export const getCapacitacionById = async (id) => {
    try {
        const resultado = await db.oneOrNone("SELECT * FROM capacitacion.capacitacion WHERE id = $1", [id]);
        return resultado;
    } catch (error) {
        console.error("Error en getCapacitacionById:", error);
        throw new Error("Error al obtener la capacitación por ID");
    }
};

export const createCapacitacion = async (capacitacion) => {
    try {
        const { titulo, descripcion, fecha_publicacion, usuario_id } = capacitacion;    
        const resultado = await db.one(`INSERT INTO capacitacion.capacitacion
             (titulo, descripcion, fecha_publicacion, usuario_id)
            VALUES ($1, $2, $3, $4) RETURNING *`, 
            [titulo, descripcion, fecha_publicacion, usuario_id]);
        return resultado;
    } catch (error) {
        console.error("Error en createCapacitacion:", error);
        throw new Error("Error al crear la capacitación");
    }
};

export const updateCapacitacion = async (id, capacitacion) => {
    try {
        const { titulo, descripcion, fecha_publicacion, usuario_id } = capacitacion;
        const resultado = await db.one(`UPDATE capacitacion.capacitacion SET
             titulo = $1, descripcion = $2, fecha_publicacion = $3, usuario_id = $4 WHERE id = $5 RETURNING *`,
              [titulo, descripcion, fecha_publicacion, usuario_id, id]);
        return resultado;
    }   
catch (error) {
        console.error("Error en updateCapacitacion:", error);
        throw new Error("Error al actualizar la capacitación");
    }
};

export const deleteCapacitacion = async (id) => {
    try {
        await db.result("DELETE FROM capacitacion.capacitacion WHERE id = $1", [id]);
        return { message: "Capacitación eliminada correctamente" };
    } catch (error) {
        console.error("Error en deleteCapacitacion:", error);
        throw new Error("Error al eliminar la capacitación");
    }
};
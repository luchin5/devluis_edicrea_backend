// CAPA DE DATOS
// Repositorio de capacitaciones

import db from "../../config/config_db.js";

// Hacer la funciones solo con pg-promise

export const getAllMaterialCapacitaciones = async () => {
    try {
        const resultado = await db.any("SELECT * FROM capacitacion.material_capacitacion");
        return resultado;
    }   catch (error) {
        console.error("Error en getAllMaterialCapacitaciones:", error);
        throw new Error("Error al obtener los materiales de capacitación");
    }
};

export const getMaterialCapacitacionById = async (id) => {
    try {
        const resultado = await db.oneOrNone("SELECT * FROM capacitacion.material_capacitacion WHERE id  = $1", [id]);
        return resultado;
    } catch (error) {
        console.error("Error en getMaterialCapacitacionById:", error);
        throw new Error("Error al obtener el material de capacitación por ID");
    }
};

export const createMaterialCapacitacion = async (material) => {
    try {
        const { nombre, tipo, url, capacitacion_id } = material;
        const resultado = await db.one(`INSERT INTO capacitacion.material_capacitacion
             (nombre, tipo, url, capacitacion_id) 
            VALUES ($1, $2, $3, $4) RETURNING *`, 
            [nombre, tipo, url, capacitacion_id]);
        return resultado;
    } catch (error) {
        console.error("Error en createMaterialCapacitacion:", error);
        throw new Error("Error al crear el material de capacitación");
    }
};

export const updateMaterialCapacitacion = async (id, material) => {
    try {
        const { nombre, tipo, url, capacitacion_id } = material;
        const resultado = await db.one(`UPDATE capacitacion.material_capacitacion SET
             nombre = $1, tipo = $2, url = $3, capacitacion_id = $4 WHERE id = $5 RETURNING *`,
              [nombre, tipo, url, capacitacion_id, id]);
        return resultado;
    } catch (error) {
        console.error("Error en updateMaterialCapacitacion:", error);
        throw new Error("Error al actualizar el material de capacitación");
    }
};

export const deleteMaterialCapacitacion = async (id) => {
    try {
        await db.result("DELETE FROM capacitacion.material_capacitacion WHERE id = $1", [id]);
        return { message: "Material de capacitación eliminado correctamente" };
    } catch (error) {
        console.error("Error en deleteMaterialCapacitacion:", error);
        throw new Error("Error al eliminar el material de capacitación");
    }
};
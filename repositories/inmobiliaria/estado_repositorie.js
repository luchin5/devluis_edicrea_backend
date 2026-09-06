// CAPA DE DATOS
// Repositorio de estados

import db from "../../config/config_db.js";

// Hacer la funciones solo con pg-promise

export const getAllEstados = async () => {
    try {
        const resultado = await db.any("SELECT * FROM inmobiliaria.estado");
        return resultado;
    }   
    catch (error) {
        console.error("Error en getAllEstados:", error);
        throw new Error("Error al obtener los estados");
    }
};

export const getEstadoById = async (id) => {
    try {
        const resultado = await db.oneOrNone("SELECT * FROM inmobiliaria.estado WHERE id  = $1", [id]);
        return resultado;
    } catch (error) {
        console.error("Error en getEstadoById:", error);
        throw new Error("Error al obtener el estado por ID");
    }
};

export const createEstado = async (estado) => {
    try {
        const { nombre, descripcion } = estado;
        const resultado = await db.one(`INSERT INTO inmobiliaria.estado (nombre, descripcion) 
            VALUES ($1, $2) RETURNING *`, 
            [nombre, descripcion]);
        return resultado;
    } catch (error) {
        console.error("Error en createEstado:", error);
        throw new Error("Error al crear el estado");
    }
};

export const updateEstado = async (id, estado) => {
    try {
        const   
{ nombre, descripcion } = estado;
        const resultado = await db.one(`UPDATE inmobiliaria.estado SET
             nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *`,
              [nombre, descripcion, id]);
        return resultado;
    } catch (error) {
        console.error("Error en updateEstado:", error);
        throw new Error("Error al actualizar el estado");
    }
};

export const deleteEstado = async (id) => {
    try {
        await db.result("DELETE FROM inmobiliaria.estado WHERE id = $1", [id]);
        return { message: "Estado eliminado correctamente" };
    } catch (error) {
        console.error("Error en deleteEstado:", error);
        throw new Error("Error al eliminar el estado");
    }
};
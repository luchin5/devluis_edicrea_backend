// CAPA DE DATOS
// Repositorio de roles

import db from '../../config/config_db.js';

export const getRoles = async () => {
  try {
    const resultado = await db.any(`SELECT * FROM seguridad.rol`);
    return resultado;
  } catch (error) {
    console.error("Error en getRoles:", error);
    throw error;
  }
};

export const getRolById = async (id) => {
  try {
    const resultado = await db.oneOrNone(`SELECT * FROM seguridad.rol WHERE id = $1`, [id]);
    return resultado;
  } catch (error) {
    console.error("Error en getRolById:", error);
    throw error;
  }
};

export const createRol = async (rol) => {
  try {
    const { nombre, descripcion } = rol;
    const resultado = await db.one(`INSERT INTO seguridad.rol (nombre,descripcion) VALUES ($1, $2) RETURNING *`,
         [nombre, descripcion]);
    return resultado;
  } catch (error) {
    console.error("Error en createRol:", error);
    throw error;
  }
};

export const updateRol = async (id, rol) => {
  try {
    const { nombre, descripcion } = rol;
    const resultado = await db.one(`UPDATE seguridad.rol SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *`, 
        [nombre, descripcion, id]);
    return resultado;
  } catch (error) {
    console.error("Error en updateRol:", error);
    throw error;
  }
};

export const deleteRol = async (id) => {
  try {
    const resultado = await db.result(`DELETE FROM seguridad.rol WHERE id = $1`, [id]);
    return resultado;
  } catch (error) {
    console.error("Error en deleteRol:", error);
    throw error;
  }
};

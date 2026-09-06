// CAPA DE DATOS
// Repositorio de usuarios

import db from "../../config/config_db.js";

export const Login = async (usuario) => {
  try{ 
  const { nickname } = usuario;
 
  const resultado = await db.oneOrNone(`SELECT * FROM seguridad.usuario WHERE nickname = $1`,
     [nickname]);

     return resultado;
  }
  catch (error) {
    console.error("Error en Login:", error);
    throw error;
  }
};

export const getUsuarioById = async (id) => {
  try {
   const resultado = await db.oneOrNone(`SELECT * FROM seguridad.usuario WHERE id = $1`, [id]);
 
  return resultado;
} catch (error) {
  console.error("Error en getUsuarioById:", error);
  throw error;
}
};

export const getUsuarios = async () => {
  try {
    const resultado = await db.any(`SELECT id,nombres,apellidos,nickname,rol_id FROM seguridad.usuario`);
    return resultado;
  } catch (error) {
    console.error("Error en getUsuarios:", error);
    throw error;
  }
}

export const createUsuario = async (usuario) => {
  try {
    const { nombres, apellidos, nickname, contrasena, rol_id } = usuario;
    const resultado = await db.one(`INSERT INTO seguridad.usuario (nombres, apellidos, nickname, contrasena, rol_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombres, apellidos, nickname, contrasena, rol_id]);
    return resultado;
  } catch (error) {
    console.error("Error en createUsuario:", error);
    throw error;
  }
}

export const updateUsuario = async (id, usuario) => {
  try {
    const { nombres, apellidos, nickname, contrasena, rol_id } = usuario;
    const resultado = await db.one(`UPDATE seguridad.usuario SET nombres = $1, apellidos = $2, nickname = $3, contrasena = $4, rol_id = $5 WHERE id = $6 RETURNING *`,
      [nombres, apellidos, nickname, contrasena, rol_id, id]);
    return resultado;
  } catch (error) {
    console.error("Error en updateUsuario:", error);
    throw error;
  }
}

export const deleteUsuario = async (id) => {
  try {
    const resultado = await db.result(`DELETE FROM seguridad.usuario WHERE id = $1`, [id]);
    return resultado;
  } catch (error) {
    console.error("Error en deleteUsuario:", error);
    throw error;
  }
}
// CAPA DE NEGOCIO
// Servicio de usuarios

import {
  Login,
  getUsuarioById,
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../../repositories/seguridad/usuario_repositorie.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUsuarioService = async (usuario) => {
  try {
    const resultado = await Login(usuario);
    if (!resultado) {
      throw new Error("Usuario no existe");
    }
    const contrasenaCorrecta = await bcrypt.compare(
      usuario.contrasena,
      resultado.contrasena,
    );
    if (!contrasenaCorrecta) {
      throw new Error("Contrasena incorrecta");
    }

    const token = jwt.sign(
      {
        id: resultado.id,
        nickname: resultado.nickname,
        rol_id: resultado.rol_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn:'8h'
      },
    );

    return {
      token,
      usuario:{
        id:resultado.id,
        nombres:resultado.nombres,
        apellidos:resultado.apellidos,
        nickname:resultado.nickname,
        rol_id:resultado.rol_id
      }
    };
  } catch (error) {
    throw error;
  }
};

export const obtenerUsuarioPorIdService = async (id) => {
  try {
    const resultado = await getUsuarioById(id);
    return resultado;
  } catch (error) {
    console.error("Error en obtenerUsuarioPorId:", error);
    throw error;
  }
};

export const obtenerUsuariosService = async () => {
  try {
    const resultado = await getUsuarios();
    return resultado;
  } catch (error) {
    console.error("Error en obtenerUsuarios:", error);
    throw error;
  }
};

export const crearUsuarioService = async (usuario) => {
  try {
    const hash = await bcrypt.hash(usuario.contrasena, 10);
    usuario.contrasena = hash;

    const resultado = await createUsuario(usuario);

    return resultado;
  } catch (error) {
    console.error("Error en crearUsuario:", error);
    throw error;
  }
};

export const actualizarUsuarioService = async (id, usuario) => {
  try {
    const resultado = await updateUsuario(id, usuario);
    return resultado;
  } catch (error) {
    console.error("Error en actualizarUsuario:", error);
    throw error;
  }
};

export const eliminarUsuarioService = async (id) => {
  try {
    const resultado = await deleteUsuario(id);
    return resultado;
  } catch (error) {
    console.error("Error en eliminarUsuario:", error);
    throw error;
  }
};

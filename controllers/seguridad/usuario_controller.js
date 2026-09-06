// CAPA DE INTERFAZ
// Controlador de usuarios

import {
  loginUsuarioService,
  obtenerUsuarioPorIdService,
  obtenerUsuariosService,
  crearUsuarioService,
  actualizarUsuarioService,
  eliminarUsuarioService,
} from "../../services/seguridad/usuario_service.js";

export const loginController = async (req, res) => {
  try {
    
    const usuario = req.body;
    const resultado = await loginUsuarioService(usuario);
    
    res.status(200).json({ message: "Login exitoso", usuario: resultado });
  } catch (error) {
     if (
      error.message === "Usuario no existe" ||
      error.message === "Contrasena incorrecta"
    ) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const obtenerUsuarioPorIdController = async (req, res) => {
  try {
    const id = req.query.id;
    const resultado = await obtenerUsuarioPorIdService(id);

    if (resultado) {
      res.status(200).json(resultado);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error en obtenerUsuarioPorId:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const obtenerUsuariosController = async (req, res) => {
  try {
    const resultado = await obtenerUsuariosService();
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Error en obtenerUsuarios:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const crearUsuarioController = async (req, res) => {
  try {
    const usuario = req.body;
    const resultado = await crearUsuarioService(usuario);
    res
      .status(201)
      .json({ message: "Usuario creado exitosamente", usuario: resultado });
  } catch (error) {
    console.error("Error en crearUsuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const actualizarUsuarioController = async (req, res) => {
  try {
    const id = req.query.id;
    const usuario = req.body;
    const resultado = await actualizarUsuarioService(id, usuario);
    res
      .status(200)
      .json({
        message: "Usuario actualizado exitosamente",
        usuario: resultado,
      });
  } catch (error) {
    console.error("Error en actualizarUsuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const eliminarUsuarioController = async (req, res) => {
  try {
    const id = req.query.id;
    const resultado = await eliminarUsuarioService(id);
    if (resultado.rowCount === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error en eliminarUsuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

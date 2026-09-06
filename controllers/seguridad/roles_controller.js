// CAPA DE INTERFAZ
// Controlador de roles

import { obtenerRolesService, obtenerRolPorIdService, crearRolService, actualizarRolService, eliminarRolService } from '../../services/seguridad/rol_service.js';

export const obtenerRolesController = async (req, res) => {
    try {
        const roles = await obtenerRolesService();
        res.status(200).json(roles);
    } catch (error) {
        console.error("Error en obtenerRoles:", error);
        res.status(500).json({ error: "Error al obtener los roles" });
    }   
};

export const obtenerRolPorIdController   = async (req, res) => {    
    try {
        const id = req.query.id;
        const rol = await obtenerRolPorIdService(id);   

        if (rol) {
            res.status(200).json(rol);
        } else {
            res.status(404).json({ error: "Rol no encontrado" });
        }
    } catch (error) {
        console.error("Error en obtenerRolPorId:", error);
        res.status(500).json({ error: "Error al obtener el rol" });
    }
};

export const crearRolController = async (req, res) => {
    try {
        const rol = req.body;
        const nuevoRol = await crearRolService(rol);
        res.status(201).json(nuevoRol);
    } catch (error) {
        console.error("Error en crearRol:", error);
        res.status(500).json({ error: "Error al crear el rol" });
    }
};

export const actualizarRolController = async (req, res) => {
    try {
        const id = req.query.id;
        const rol = req.body;
        const rolActualizado = await actualizarRolService(id, rol);

        if (rolActualizado) {
            res.status(200).json(rolActualizado);
        } else {
            res.status(404).json({ error: "Rol no encontrado" });
        }
    } catch (error) {
        console.error("Error en actualizarRol:", error);
        res.status(500).json({ error: "Error al actualizar el rol" });
    }
};

export const eliminarRolController = async (req, res) => {
    try {
        const id = req.query.id;
        const resultado = await eliminarRolService(id);

        if (resultado.rowCount > 0) {
            res.status(200).json({ message: "Rol eliminado exitosamente" });
        } else {
            res.status(404).json({ error: "Rol no encontrado" });
        }
    } catch (error) {
        console.error("Error en eliminarRol:", error);
        res.status(500).json({ error: "Error al eliminar el rol" });
    }
};


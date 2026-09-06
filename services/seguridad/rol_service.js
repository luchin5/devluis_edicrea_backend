// CAPA DE NEGOCIO
// Servicio de roles

import { getRoles, getRolById, createRol, updateRol, deleteRol } from '../../repositories/seguridad/rol_repositorie.js';

export const obtenerRolesService = async () => {
    try {
        const roles = await getRoles();
        return roles;
    } catch (error) {
        console.error("Error en obtenerRolesService:", error);
        throw error;
    }
};

export const obtenerRolPorIdService = async (id) => {
    try {
        const rol = await getRolById(id);
        return rol;
    } catch (error) {
        console.error("Error en obtenerRolPorIdService:", error);
        throw error;
    }
};

export const crearRolService = async (rol) => {
    try {
        const nuevoRol = await createRol(rol);
        return nuevoRol;
    } catch (error) {
        console.error("Error en crearRolService:", error);
        throw error;
    }
};

export const actualizarRolService = async (id, rol) => {
    try {
        const rolActualizado = await updateRol(id, rol);
        return rolActualizado;
    } catch (error) {
        console.error("Error en actualizarRolService:", error);
        throw error;
    }
};

export const eliminarRolService = async (id) => {
    try {
        const resultado = await deleteRol(id);
        return resultado;
    } catch (error) {
        console.error("Error en eliminarRolService:", error);
        throw error;
    }
};  
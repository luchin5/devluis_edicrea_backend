// CAPA DE SERVICIOS
// Servicio de proyectos

import {getProyectoById,getProyectos,updateProyecto,deleteProyecto,createProyecto} from '../../repositories/inmobiliaria/proyecto_repositorie.js';

export const obtenerProyectosService = async () => {
    try {
        const proyectos = await getProyectos();
        return proyectos;
    } catch (error) {
        console.error("Error en obtenerProyectos:", error);
        throw error;
    }
};

export const obtenerProyectoPorIdService = async (id) => {
    try {
        const proyecto = await getProyectoById(id);
        return proyecto;
    } catch (error) {
        console.error("Error en obtenerProyectoPorId:", error);
        throw error;
    }
};

export const crearProyectoService = async (proyecto) => {
    try {
        const nuevoProyecto = await createProyecto(proyecto);
        return nuevoProyecto;
    } catch (error) {
        console.error("Error en crearProyecto:", error);
        throw error;
    }
};

export const actualizarProyectoService = async (id, proyecto) => {
    try {
        const proyectoActualizado = await updateProyecto(id, proyecto);
        return proyectoActualizado;
    } catch (error) {
        console.error("Error en actualizarProyecto:", error);
        throw error;
        }
};

export const eliminarProyectoService = async (id) => {
    try {
        const resultado = await deleteProyecto(id);
        return resultado;
    } catch (error) {
        console.error("Error en eliminarProyecto:", error);
        throw error;
    }
};
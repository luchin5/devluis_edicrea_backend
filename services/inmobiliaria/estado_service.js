// CAPA DE NEGOCIOS
// Servicio de estados

import {getAllEstados,getEstadoById,updateEstado,deleteEstado,createEstado} from '../../repositories/inmobiliaria/estado_repositorie.js';

export const getEstadosService = async () => {
    try {
        const estados = await getAllEstados();
        return estados;
    } catch (error) {
        console.error("Error en getEstadosService:", error);
        throw error;
    }
};

export const getEstadoByIdService = async (id) => {
    try {
        const estado = await getEstadoById(id);
        return estado;
    } catch (error) {
        console.error("Error en getEstadoByIdService:", error);
        throw error;
    }
};

export const createEstadoService = async (estado) => {
    try {
        const nuevoEstado = await createEstado(estado);
        return nuevoEstado;
    } catch (error) {
        console.error("Error en createEstadoService:", error);
        throw error;
    }
};

export const updateEstadoService = async (id, estado) => {
    try {
        const estadoActualizado = await updateEstado(id, estado);
        return estadoActualizado;
    } catch (error) {
        console.error("Error en updateEstadoService:", error);
        throw error;
    }
};

export const deleteEstadoService = async (id) => {
    try {
        const resultado = await deleteEstado(id);
        return resultado;
    } catch (error) {
        console.error("Error en deleteEstadoService:", error);
        throw error;
    }
};
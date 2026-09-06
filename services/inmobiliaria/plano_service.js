// CAPA DE NEGOCIOS
// Controlador de planos

import {
    getPlanos,
    getPlanoById,
    createPlano,
    updatePlano,
    deletePlano
} from '../../repositories/inmobiliaria/plano_repositorie.js';

export const obtenerPlanosService = async () => {
    try {
        const planos = await getPlanos();
        return planos;
    } catch (error) {
        console.error("Error en obtenerPlanos:", error);
        throw error;
    }
};

export const obtenerPlanoPorIdService = async (id) => {
    try {
        const plano = await getPlanoById(id);       
        return plano;
    } catch (error) {
        console.error("Error en obtenerPlanoPorId:", error);
        throw error;
    }
};

export const crearPlanoService = async (plano) => {
    try {
        const nuevoPlano = await createPlano(plano);
        return nuevoPlano;
    } catch (error) {
        console.error("Error en crearPlano:", error);
        throw error;
    }
};

export const actualizarPlanoService = async (id, plano) => {
    try {
        const planoActualizado = await updatePlano(id, plano);
        return planoActualizado;
    } catch (error) {
        console.error("Error en actualizarPlano:", error);
        throw error;
    }       
};

export const eliminarPlanoService = async (id) => {
    try {
        const resultado = await deletePlano(id);
        return resultado;
    } catch (error) {
        console.error("Error en eliminarPlano:", error);
        throw error;
    }
};  

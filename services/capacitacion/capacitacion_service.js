import {getAllCapacitaciones,getCapacitacionById,updateCapacitacion,deleteCapacitacion,createCapacitacion} from '../../repositories/capacitacion/capacitacion_repositorie.js';

export const getCapacitacionesService = async () => {
    try {
        const capacitaciones = await getAllCapacitaciones();
        return capacitaciones;
    } catch (error) {
        console.error("Error en getCapacitacionesService:", error);
        throw error;
    }   
};

export const getCapacitacionByIdService = async (id) => {
    try {
        const capacitacion = await getCapacitacionById(id);
        return capacitacion;
    } catch (error) {
        console.error("Error en getCapacitacionByIdService:", error);
        throw error;
    }
};

export const createCapacitacionService = async (capacitacion) => {
    try {
        const nuevaCapacitacion = await createCapacitacion(capacitacion);
        return nuevaCapacitacion;
    } catch (error) {
        console.error("Error en createCapacitacionService:", error);
        throw error;
    }
};

export const updateCapacitacionService = async (id, capacitacion) => {
    try {
        const capacitacionActualizada = await updateCapacitacion(id, capacitacion);
        return capacitacionActualizada;
    } catch (error) {
        console.error("Error en updateCapacitacionService:", error);
        throw error;
    }
};

export const deleteCapacitacionService = async (id) => {
    try {
        const resultado = await deleteCapacitacion(id);
        return resultado;
    } catch (error) {
        console.error("Error en deleteCapacitacionService:", error);
        throw error;
    }
};
// CAPA DE LOGICA DE NEGOCIOS
// Servicio de materiales de capacitación

import { getAllMaterialCapacitaciones, getMaterialCapacitacionById, createMaterialCapacitacion, updateMaterialCapacitacion, deleteMaterialCapacitacion } from '../../repositories/capacitacion/material_capa_repositorie.js';

export const getMaterialesService = async () => {
    try {
        const materiales = await getAllMaterialCapacitaciones();
        return materiales;
    } catch (error) {
        console.error("Error en getMaterialesService:", error);
        throw error;
    }
};

export const getMaterialByIdService = async (id) => {
    try {
        const material = await getMaterialCapacitacionById(id);
        return material;
    } catch (error) {
        console.error("Error en getMaterialByIdService:", error);
        throw error;
    }
};

export const createMaterialService = async (material) => {
    try {
        const nuevoMaterial = await createMaterialCapacitacion(material);
        return nuevoMaterial;
    } catch (error) {
        console.error("Error en createMaterialService:", error);
        throw error;
    }
};

export const updateMaterialService = async (id, material) => {
    try {
        const materialActualizado = await updateMaterialCapacitacion(id, material);
        return materialActualizado;
    } catch (error) {
        console.error("Error en updateMaterialService:", error);
        throw error;
    }
};

export const deleteMaterialService = async (id) => {
    try {
        const resultado = await deleteMaterialCapacitacion(id);
        return resultado;
    } catch (error) {
        console.error("Error en deleteMaterialService:", error);
        throw error;
    }
};  
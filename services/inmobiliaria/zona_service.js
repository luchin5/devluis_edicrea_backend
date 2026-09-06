// CAPA DE NEGOCIOS
// Controlador de proyectos


import {getAllZonas,getZona_x_svg,
    getZonaById,createZona,updateZona,deleteZona} from '../../repositories/inmobiliaria/zona_repositorie.js';

import {createLote, deleteLoteByZona} from '../../repositories/inmobiliaria/lote_repositorie.js'

export const getZonasService = async (req, res) => {
    try {
        const zonas = await getAllZonas();
        return zonas;
    }   catch (error) {
        console.error("Error en getZonasService:", error);
        throw error;
    }
};

export const getZonaByIdService = async (id) => {
    try {
        const zona = await getZonaById(id);
        return zona;
    } catch (error) {
        console.error("Error en getZonaByIdService:", error);
        throw error;
    }
};

export const getZonaXSVGService = async () => {
    try {
        const zona = await getZona_x_svg();
        return zona;
    } catch (error) {
        console.error("Error en getZonaXSVGService:", error);
        throw error;
    }
};

export const createZonaService = async (data) => {
    try {
        const nuevaZona = await createZona(data);
        for (const lote of data.lotes){
            await createLote({
                ...lote,
                zona_id: nuevaZona.id
            })
        }
        return nuevaZona;
    } catch (error) {
        console.error("Error en createZonaService:", error);
        throw error;
    }
};

export const updateZonaService = async (id, zona) => {
    try {
        const zonaActualizada = await updateZona(id, zona);
        
        await deleteLoteByZona(id)

        for (const lote of zona.lotes) {

            await createLote({
                ...lote,
                zona_id: id
            })

        }

        return zonaActualizada;
    } catch (error) {
        console.error("Error en updateZonaService:", error);
        throw error;
    }
};

export const deleteZonaService = async (id) => {
    try {
        const resultado = await deleteZona(id);
        return resultado;
    }   
    catch (error) {
        console.error("Error en deleteZonaService:", error);
        throw error;
    }
};
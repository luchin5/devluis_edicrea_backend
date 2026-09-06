// CAPA DE INTERFAZ
// Controlador de zonas

import { getZonaByIdService,getZonaXSVGService ,getZonasService, createZonaService, updateZonaService, deleteZonaService } from '../../services/inmobiliaria/zona_service.js';

export const obtenerZonasController = async (req, res) => {
    try {
        const zonas = await getZonasService();
        if (!zonas || zonas.length === 0) {
            return res.status(404).json({ message: "No se encontraron zonas" });
        }
        res.status(200).json(zonas);

    }   catch (error) { 
        console.error("Error en obtenerZonasController:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const obtenerZonaPorIdController = async (req, res) => {
    const { id } = req.query;
    try {
        const zona = await getZonaByIdService(id);
        if (!zona) {
            return res.status(404).json({ message: "Zona no encontrada" });
        }
        res.status(200).json(zona);
    } catch (error) {
        console.error("Error en obtenerZonaPorIdController:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const obtenerZonaXSVGController = async (req, res) => {
    
    try {
        const zona = await getZonaXSVGService();
        if (!zona) {
            return res.status(404).json({ message: "Zona no encontrada" });
        }
        res.status(200).json(zona);
    } catch (error) {
        console.error("Error en obtenerZonaPorSVG Controller:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const crearZonaController = async (req, res) => {
    const zonaData = req.body;
    try {
        const nuevaZona = await createZonaService(zonaData);
        res.status(201).json(nuevaZona);
    } catch (error) {
        console.error("Error en crearZonaController:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const actualizarZonaController = async (req, res) => {
    const { id } = req.query;
    const zonaData = req.body;
    try {
        const zonaActualizada = await updateZonaService(id, zonaData);
        if (!zonaActualizada) {
            return res.status(404).json({ message: "Zona no encontrada" });
        }
        res.status(200).json(zonaActualizada);
    } catch (error) {
        console.error("Error en actualizarZonaController:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const eliminarZonaController = async (req, res) => {
    const { id } = req.query;
    try {
        const resultado = await deleteZonaService(id);
        if (!resultado) {
            return res.status(404).json({ message: "Zona no encontrada" });
        }
        res.status(200).json({ message: "Zona eliminada correctamente" });
    } catch (error) {
        console.error("Error en eliminarZonaController:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

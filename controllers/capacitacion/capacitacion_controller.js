import {getCapacitacionByIdService,getCapacitacionesService,createCapacitacionService,updateCapacitacionService,deleteCapacitacionService} from '../../services/capacitacion/capacitacion_service.js';

export const obtenerCapacitacionesController = async (req, res) => {
    try {
        const capacitaciones = await getCapacitacionesService();
        if (!capacitaciones || capacitaciones.length === 0) {
            return res.status(404).json({ message: "No se encontraron capacitaciones" });
        }
        res.status(200).json(capacitaciones);
    } catch (error) {
        console.error("Error en obtenerCapacitacionesController:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const obtenerCapacitacionPorIdController = async (req, res) => {
    const { id } = req.query;
    try {
        const capacitacion = await getCapacitacionByIdService(id);
        if (!capacitacion) {
            return res.status(404).json({ message: "Capacitación no encontrada" });
        }   
        res.status(200).json(capacitacion);
    } catch (error) {
        console.error("Error en obtenerCapacitacionPorIdController:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const crearCapacitacionController = async (req, res) => {
    const capacitacionData = req.body;
    try {
        const nuevaCapacitacion = await createCapacitacionService(capacitacionData);
        res.status(201).json(nuevaCapacitacion);
    } catch (error) {
        console.error("Error en crearCapacitacionController:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const actualizarCapacitacionController = async (req, res) => {
    const { id } = req.query;
    const capacitacionData = req.body;
    try {
        const capacitacionActualizada = await updateCapacitacionService(id, capacitacionData);
        if (!capacitacionActualizada) {
            return res.status(404).json({ message: "Capacitación no encontrada" });
        }
        res.status(200).json(capacitacionActualizada);
    } catch (error) {
        console.error("Error en actualizarCapacitacionController:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const eliminarCapacitacionController = async (req, res) => {
    const { id } = req.query;
    try {
        const resultado = await deleteCapacitacionService(id);
        if (!resultado) {
            return res.status(404).json({ message: "Capacitación no encontrada" });
        }
        res.status(200).json({ message: "Capacitación eliminada correctamente" });
    } catch (error) {
        console.error("Error en eliminarCapacitacionController:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
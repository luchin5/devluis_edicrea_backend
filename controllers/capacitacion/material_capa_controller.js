// CAPA DE INTERFAZ DE USUARIO
// Controlador de materiales de capacitación

import {getMaterialByIdService,getMaterialesService,updateMaterialService,createMaterialService,deleteMaterialService} from '../../services/capacitacion/material_capa_service.js';

export const obtenerMaterialesController = async (req, res) => {
    try {
        const materiales = await getMaterialesService();
        if (!materiales || materiales.length === 0) {
            return res.status(404).json({ message: "No se encontraron materiales de capacitación" });
        }
        res.status(200).json(materiales);
    } catch (error) {
        console.error("Error en obtenerMaterialesController:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const obtenerMaterialPorIdController = async (req, res) => {
    const { id } = req.query;
    try {
        const material = await getMaterialByIdService(id);
        if (!material) {
            return res.status(404).json({ message: "Material de capacitación no encontrado" });
        }
        res.status(200).json(material);
    } catch (error) {
        console.error("Error en obtenerMaterialPorIdController:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }   
};  

export const crearMaterialController = async (req, res) => {
    const materialData = req.body;
    try {
        const nuevoMaterial = await createMaterialService(materialData);
        res.status(201).json(nuevoMaterial);
    } catch (error) {
        console.error("Error en crearMaterialController:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const actualizarMaterialController = async (req, res) => {
    const { id } = req.query;
    const materialData = req.body;
    try {
        const materialActualizado = await updateMaterialService(id, materialData);
        if (!materialActualizado) {
            return res.status(404).json({ message: "Material de capacitación no encontrado" });
        }
        res.status(200).json(materialActualizado);
    } catch (error) {
        console.error("Error en actualizarMaterialController:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const eliminarMaterialController = async (req, res) => {
    const { id } = req.query;
    try {
        const resultado = await deleteMaterialService(id);
        if (!resultado) {
            return res.status(404).json({ message: "Material de capacitación no encontrado" });
        }
        res.status(200).json({ message: "Material de capacitación eliminado correctamente" });
    } catch (error) {
        console.error("Error en eliminarMaterialController:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
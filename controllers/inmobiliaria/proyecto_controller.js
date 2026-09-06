// CAPA DE NEGOCIOS
// Controlador de proyectos

import { obtenerProyectosService, obtenerProyectoPorIdService, crearProyectoService, actualizarProyectoService, eliminarProyectoService } from '../../services/inmobiliaria/proyecto_service.js';

export const getProyectosController = async (req, res) => {
    try {
        const proyectos = await obtenerProyectosService();
        res.json(proyectos);
    } catch (error) {
        console.error("Error en getProyectosController:", error);
        res.status(500).json({ error: "Error al obtener los proyectos" });
    }
};

export const getProyectoByIdController = async (req, res) => {
    try {
        const { id } = req.query; 
        const proyecto = await obtenerProyectoPorIdService(id);        
        if (proyecto) {
            res.json(proyecto);
        } else {
            res.status(404).json({ error: "Proyecto no encontrado" });
        }
    } catch (error) {
        console.error("Error en getProyectoByIdController:", error);
        res.status(500).json({ error: "Error al obtener el proyecto" });
    }
};

export const createProyectoController = async (req, res) => {
    try {
        const proyecto = req.body;  
        const nuevoProyecto = await crearProyectoService(proyecto);    

        res.status(201).json(nuevoProyecto);
    } catch (error) {
        console.error("Error en createProyectoController:", error);
        res.status(500).json({ error: "Error al crear el proyecto" });
    }
};

export const updateProyectoController = async (req, res) => {       

    try {
        const { id } = req.query;
        const proyecto = req.body;
        const proyectoActualizado = await actualizarProyectoService(id, proyecto);
        res.json(proyectoActualizado);
    } catch (error) {
        console.error("Error en updateProyectoController:", error);
        res.status(500).json({ error: "Error al actualizar el proyecto" });
    }
};

export const deleteProyectoController = async (req, res) => {
    try {
        const { id } = req.query;
        const resultado = await eliminarProyectoService(id);
        if (resultado) {
            res.status(200).json({ message: "Proyecto eliminado correctamente" });
        } else {
            res.status(404).json({ error: "Proyecto no encontrado" });
        }
    } catch (error) {
        console.error("Error en deleteProyectoController:", error);
        res.status(500).json({ error: "Error al eliminar el proyecto" });
    }
};
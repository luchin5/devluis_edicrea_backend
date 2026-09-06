import {getEstadoByIdService,getEstadosService,createEstadoService,updateEstadoService,deleteEstadoService} from '../../services/inmobiliaria/estado_service.js';

export const obtenerEstadosController = async (req, res) => {
    try {
        const estados = await getEstadosService();
        if (!estados || estados.length === 0) {
            return res.status(404).json({ message: "No se encontraron estados" });
        }
        res.status(200).json(estados);
    } catch (error) {
        console.error("Error en obtenerEstadosController:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const obtenerEstadoPorIdController = async (req, res) => {
    const { id } = req.query;
    try {
        const estado = await getEstadoByIdService(id);
        if (!estado) {
            return res.status(404).json({ message: "Estado no encontrado" });
        }
        res.status(200).json(estado);
    } catch (error) {
        console.error("Error en obtenerEstadoPorIdController:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const crearEstadoController = async (req, res) => {
    const estadoData = req.body;
    try {
        const nuevoEstado = await createEstadoService(estadoData);
        res.status(201).json(nuevoEstado);
    } catch (error) {
        console.error("Error en crearEstadoController:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const actualizarEstadoController = async (req, res) => {
    const { id } = req.query;
    const estadoData = req.body;
    try {
        const estadoActualizado = await updateEstadoService(id, estadoData);
        if (!estadoActualizado) {
            return res.status(404).json({ message: "Estado no encontrado" });
        }
        res.status(200).json(estadoActualizado);
    } catch (error) {
        console.error("Error en actualizarEstadoController:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const eliminarEstadoController = async (req, res) => {
    const { id } = req.query;
    try {
        const resultado = await deleteEstadoService(id);
        if (!resultado) {
            return res.status(404).json({ message: "Estado no encontrado" });
        }
        res.status(200).json({ message: "Estado eliminado correctamente" });
    } catch (error) {
        console.error("Error en eliminarEstadoController:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
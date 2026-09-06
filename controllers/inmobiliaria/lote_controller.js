// CAPA DE INTERFAZ
// Interfaz de lotes

import {
  getLoteByIdService,
  getCounEstadoService,
  getDashboarProyectosService,
  getVentasMensualesService,
  getLotesService,
  getLoteCountService,
  createLoteService,
  updateLoteService,
  deleteLoteService,
  getLotexSVGService,
  updateEstadoLoteXVendedorService,
  getEstadisticaPorZonaIdService
} from "../../services/inmobiliaria/lote_service.js";

export const obtenerLotesController = async (req, res) => {
  try {
    const lotes = await getLotesService();
    if (!lotes || lotes.length === 0) {
      return res.status(404).json({ message: "No se encontraron lotes" });
    }
    res.status(200).json(lotes);
  } catch (error) {
    console.error("Error en obtenerLotesController:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const obtenerEstadisticaPorZonaIdController = async (req, res) => {
  const { id } = req.query;
  try {
    const estadistica = await getEstadisticaPorZonaIdService(id);
    if (!estadistica || estadistica.length === 0) {
      return res.status(404).json({ message: "No se encontraron datos para la zona especificada" });
    }
    res.status(200).json(estadistica);
  } catch (error) {
    console.error("Error en obenerEstadisticaPorZonaIdController:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const obtenerLoteXsvgController  = async (req,res) => {
  try {
    
    const { path } = req.query
    const lote = await getLotexSVGService(path)
    console.log("LOTE ENCONTRADO:", lote);
     if (!lote) {
      return res.status(404).json({ message: "Lote no encontrado" });
    }
    res.status(200).json(lote);
  } catch (error) {
    console.error("Error en obtener lote x SVG", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export const obtenerLotePorIdController = async (req, res) => {
  const { id } = req.query;
  try {
    const lote = await getLoteByIdService(id);
    if (!lote) {
      return res.status(404).json({ message: "Lote no encontrado" });
    }
    res.status(200).json(lote);
  } catch (error) {
    console.error("Error en obtenerLotePorIdController:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const obtenerCantidadLotesController = async (req, res) => {
  try {
    const total_lote = await getLoteCountService();
    console.log("....control", total_lote);
    if (!total_lote) {
      return res.status(404).json({ message: "Lotes no encontrados" });
    }
    res.status(200).json({ total_lote: Number(total_lote.count) });
  } catch (error) {
    console.error("Error en obtenerLotePorIdController:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
// nuevos

export const obtenerCountEstadoController = async (req, res) => {
  try {
    const estados = await getCounEstadoService();

    if (!estados || estados.length === 0) {
      return res.status(404).json({
        message: "No se encontraron estados",
      });
    }

    res.status(200).json(estados);
  } catch (error) {
    console.error("Error en obtenerCountEstadoController:", error);

    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

export const obtenerVentasMensualeController = async (req, res) => {
  try {
    const ventas = await getVentasMensualesService();

    if (!ventas || ventas.length === 0) {
      return res.status(404).json({
        message: "No se encontraron ventas",
      });
    }

    res.status(200).json(ventas);
  } catch (error) {
    console.error("Error en obtenerVentasMensualeController:", error);

    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

export const obtenerDashboardProyectosController = async (req, res) => {
  try {
    const proyectos = await getDashboarProyectosService();

    if (!proyectos || proyectos.length === 0) {
      return res.status(404).json({
        message: "No se encontraron proyectos",
      });
    }

    res.status(200).json(proyectos);
  } catch (error) {
    console.error("Error en obtenerDashboardProyectosController:", error);

    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

export const crearLoteController = async (req, res) => {
  const loteData = req.body;
  try {
    const nuevoLote = await createLoteService(loteData);
    res.status(201).json(nuevoLote);
  } catch (error) {
    console.error("Error en crearLoteController:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// controlador para administrador: actualiza los datos del lote
export const actualizarLoteController = async (req, res) => {
  const { id } = req.query;

  const loteData = {
    ...req.body,
    usuario_id: req.usuario.id,
  };

  try {
    const io = req.app.get("io");

    const loteActualizado = await updateLoteService(id, loteData, io);

    if (!loteActualizado) {
      return res.status(404).json({
        message: "Lote no encontrado",
      });
    }

    res.status(200).json(loteActualizado);
  } catch (error) {
    console.error("Error en actualizarLoteController:", error);

    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// controlador para vendedor: actualiza el estado del lote
export const actualizarEstadoLoteXVendedorController = async (req, res) => {
  const { id } = req.query;

  const loteData = {
    ...req.body,
    usuario_id: req.usuario.id,
  };

  try {
    const io = req.app.get("io");

    const loteActualizado = await updateEstadoLoteXVendedorService(id, loteData, io);

    if (!loteActualizado) {
      return res.status(404).json({
        message: "Lote no encontrado",
      });
    }

    res.status(200).json(loteActualizado);
  } catch (error) {
    console.error("Error en actualizarEstadoLoteXVendedorController:", error);

    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

export const eliminarLoteController = async (req, res) => {
  const { id } = req.query;
  try {
    const resultado = await deleteLoteService(id);
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Error en eliminarLoteController:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

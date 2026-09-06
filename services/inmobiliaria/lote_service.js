// CAPA DE NEGOCIOS
// Servicio de lotes

import {
  getAllLotes,
  getLoteCount,
  getLoteById,
  updateLote,
  deleteLote,
  createLote,
  getCountEstado,
  getDashboardProyectos,
  getVentasMensuales,
  getLotexSvg,
  updateEstadoLoteXVendedor,
  getEstadisticaPorZonaId,
  liberarLotesVencidos
} from "../../repositories/inmobiliaria/lote_repositorie.js";

export const getLotesService = async () => {
  try {
    const lotes = await getAllLotes();
    return lotes;
  } catch (error) {
    console.error("Error en getLotesService:", error);
    throw error;
  }
};

// estadistica por zona
export const getEstadisticaPorZonaIdService = async (zonaId) => {
  try {
    const estadistica = await getEstadisticaPorZonaId(zonaId);
    return estadistica;
  } catch (error) {
    console.error("Error en getEstadisticaPorZonaIdService:", error);
    throw error;
  }
}

export const getLotexSVGService = async (path) => {
  try {
    const lote = await getLotexSvg (path)
    return lote
  } catch (error) {
      console.error("Error en getLotesService:", error);
    throw error;
  }
}

export const getLoteByIdService = async (id) => {
  try {
    const lote = await getLoteById(id);
    return lote;
  } catch (error) {
    console.error("Error en getLoteByIdService:", error);
    throw error;
  }
};

export const getLoteCountService = async () => {
  try {
    const lote = await getLoteCount();
    return lote;
  } catch (error) {
    console.error("Error en getLoteByIdService:", error);
    throw error;
  }
};

// nuevos
export const getCounEstadoService = async () => {
  try {
    const cantidad = await getCountEstado();
    return cantidad;
  } catch (error) {
    throw error;
  }
};
export const getVentasMensualesService = async () => {
  try {
    const ventas = await getVentasMensuales();
    return ventas;
  } catch (error) {
    throw error;
  }
};
export const getDashboarProyectosService = async () => {
  try {
    const proyectos = await getDashboardProyectos();
    return proyectos;
  } catch (error) {
    throw error;
  }
};
//
export const createLoteService = async (lote) => {
  try {
    const nuevoLote = await createLote(lote);
    return nuevoLote;
  } catch (error) {
    console.error("Error en createLoteService:", error);
    throw error;
  }
};

// Función para administrador: actualiza los datos del lote
export const updateLoteService = async (id, lote, io) => {
  try {
    const loteActualizado = await updateLote(id, lote);
    console.log("Emitiendo evento de actualización de lote:", loteActualizado);
    io.emit("loteActualizado", loteActualizado); // Emitir evento de actualización a todos los clientes conectados
    return loteActualizado;
  } catch (error) {
    console.error("Error en updateLoteService:", error);
    throw error;
  }
};

// Función para vendedor: actualiza el estado del lote y emite un evento de actualización a todos los clientes conectados
export const updateEstadoLoteXVendedorService = async (id, lote, io) => {
  try {
    const loteActualizado = await updateEstadoLoteXVendedor(id, lote);
    console.log("Emitiendo evento de actualización de lote (vendedor):", loteActualizado);
    io.emit("loteActualizado", loteActualizado); // Emitir evento de actualización a todos los clientes conectados
    return loteActualizado;
  } catch (error) {
    console.error("Error en updateEstadoLoteXVendedorService:", error);
    throw error;
  }
};

// Función para liberar lote
export const liberarLotesVencidosService = async () => {
  try {
    return await liberarLotesVencidos();
  } catch (error) {
    console.error("Error en liberarLotesVencidosService:", error);
    throw error;
  }
};

export const deleteLoteService = async (id) => {
  try {
    const resultado = await deleteLote(id);
    return resultado;
  } catch (error) {
    console.error("Error en deleteLoteService:", error);
    throw error;
  }
};

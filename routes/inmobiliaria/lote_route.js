import {
  obtenerLotePorIdController,
  obtenerCountEstadoController,
  obtenerDashboardProyectosController,
  obtenerVentasMensualeController,
  obtenerLotesController,
  obtenerCantidadLotesController,
  actualizarLoteController,
  eliminarLoteController,
  crearLoteController,
  obtenerLoteXsvgController,
  actualizarEstadoLoteXVendedorController,
  obtenerEstadisticaPorZonaIdController
} from "../../controllers/inmobiliaria/lote_controller.js";
import express from "express";
import { validarRol } from "../../middleware/validar_rol_jwt.js";

const loteRouter = express.Router();

// Rutas para Lotes
loteRouter.get("/lotes", validarRol([1, 2]), obtenerLotesController);
loteRouter.get("/lotes_id", validarRol([1, 2]), obtenerLotePorIdController);
loteRouter.get("/lotes_cantidad_estados",validarRol([1,2]),obtenerCountEstadoController);
loteRouter.get("/lotes_proyectos",validarRol([1,2]),obtenerDashboardProyectosController);
loteRouter.get('/lotes_ventas',validarRol([1,2]),obtenerVentasMensualeController);
loteRouter.get("/lotes_count",validarRol([1,2]),obtenerCantidadLotesController);

loteRouter.post("/lotes", validarRol([1]), crearLoteController);
loteRouter.put("/lotes", validarRol([1]), actualizarLoteController);
loteRouter.put("/lotes_vendedor", validarRol([2]), actualizarEstadoLoteXVendedorController);
loteRouter.delete("/lotes", validarRol([1]), eliminarLoteController);
loteRouter.get('/lotes_x_path',validarRol([1,2]),obtenerLoteXsvgController)
loteRouter.get('/estadisticas_zona_id',validarRol([1,2]),obtenerEstadisticaPorZonaIdController)

export default loteRouter;
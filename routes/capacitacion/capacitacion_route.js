import {obtenerCapacitacionPorIdController,obtenerCapacitacionesController,eliminarCapacitacionController,crearCapacitacionController,actualizarCapacitacionController} from '../../controllers/capacitacion/capacitacion_controller.js';
import express from 'express';
import { validarRol } from '../../middleware/validar_rol_jwt.js';
const capacitacionRouter = express.Router();

// Rutas para Capacitaciones
capacitacionRouter.get('/capacitaciones',validarRol([1,2]),  obtenerCapacitacionesController);
capacitacionRouter.get('/capacitaciones_id',validarRol([1,2]),  obtenerCapacitacionPorIdController);
capacitacionRouter.post('/capacitaciones',validarRol([1]),  crearCapacitacionController);
capacitacionRouter.put('/capacitaciones', validarRol([1]), actualizarCapacitacionController);
capacitacionRouter.delete('/capacitaciones',validarRol([1]), eliminarCapacitacionController);

export default capacitacionRouter;
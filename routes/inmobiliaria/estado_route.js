import {obtenerEstadoPorIdController,obtenerEstadosController,crearEstadoController,actualizarEstadoController,eliminarEstadoController} from '../../controllers/inmobiliaria/estado_controller.js';
import express from 'express';
import { validarRol } from '../../middleware/validar_rol_jwt.js';
const estadoRouter = express.Router();

// Rutas para Estados
estadoRouter.get('/estados',validarRol([1,2]),  obtenerEstadosController);
estadoRouter.get('/estados_id',validarRol([1,2]),  obtenerEstadoPorIdController);
estadoRouter.post('/estados',validarRol([1]),  crearEstadoController);
estadoRouter.put('/estados',validarRol([1]),  actualizarEstadoController);
estadoRouter.delete('/estados',validarRol([1]),  eliminarEstadoController);

export default estadoRouter;
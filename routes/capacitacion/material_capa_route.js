import {obtenerMaterialPorIdController,obtenerMaterialesController,crearMaterialController,actualizarMaterialController,eliminarMaterialController} from '../../controllers/capacitacion/material_capa_controller.js';
import express from 'express';
import { validarRol } from '../../middleware/validar_rol_jwt.js';
const materialRouter = express.Router();

// Rutas para Materiales de Capacitación
materialRouter.get('/materiales',validarRol([1,2]),  obtenerMaterialesController);
materialRouter.get('/materiales_id',validarRol([1,2]),  obtenerMaterialPorIdController);
materialRouter.post('/materiales',validarRol([1]),  crearMaterialController);
materialRouter.put('/materiales', validarRol([1]), actualizarMaterialController);
materialRouter.delete('/materiales',validarRol([1]),  eliminarMaterialController);

export default materialRouter;
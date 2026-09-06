import {crearZonaController,obtenerZonaXSVGController,obtenerZonaPorIdController,obtenerZonasController,actualizarZonaController,eliminarZonaController} from '../../controllers/inmobiliaria/zona_controller.js';
import express from 'express';
import { validarRol } from '../../middleware/validar_rol_jwt.js';

const zonaRouter = express.Router();

// Rutas para Zonas
zonaRouter.get('/zonas', validarRol([1,2]), obtenerZonasController);
zonaRouter.get('/zonas_id',validarRol([1,2]),obtenerZonaPorIdController);
zonaRouter.get('/zonas_svg',validarRol([1,2]),obtenerZonaXSVGController);
zonaRouter.post('/zonas', validarRol([1]),crearZonaController);
zonaRouter.put('/zonas',validarRol([1]), actualizarZonaController);
zonaRouter.delete('/zonas',validarRol([1]), eliminarZonaController);

export default zonaRouter;
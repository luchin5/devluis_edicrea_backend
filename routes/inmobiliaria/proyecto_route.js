import {getProyectoByIdController,getProyectosController,updateProyectoController,deleteProyectoController,createProyectoController} from '../../controllers/inmobiliaria/proyecto_controller.js';
import express from 'express';
import { validarRol } from '../../middleware/validar_rol_jwt.js';
const proyectoRouter = express.Router();

proyectoRouter.get('/proyecto',validarRol([1,2]), getProyectosController);
proyectoRouter.get('/proyecto_id',validarRol([1,2]),  getProyectoByIdController);
proyectoRouter.post('/proyecto',validarRol([1]),  createProyectoController);
proyectoRouter.put('/proyecto',validarRol([1]),  updateProyectoController);
proyectoRouter.delete('/proyecto',validarRol([1]),  deleteProyectoController);

export default proyectoRouter;
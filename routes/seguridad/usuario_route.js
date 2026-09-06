import {crearUsuarioController,obtenerUsuarioPorIdController,obtenerUsuariosController,actualizarUsuarioController,eliminarUsuarioController} from '../../controllers/seguridad/usuario_controller.js';
import express from 'express';
import { validarRol } from '../../middleware/validar_rol_jwt.js';

const usuarioRouter = express.Router();


usuarioRouter.post('/usuarios',validarRol([1]), crearUsuarioController);
usuarioRouter.get('/usuario_id',validarRol([1]), obtenerUsuarioPorIdController);
usuarioRouter.get('/usuarios',validarRol([1]), obtenerUsuariosController);
usuarioRouter.put('/usuarios',validarRol([1]),actualizarUsuarioController);
usuarioRouter.delete('/usuario',validarRol([1]), eliminarUsuarioController);

export default usuarioRouter;
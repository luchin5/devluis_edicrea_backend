import {obtenerRolesController,crearRolController,obtenerRolPorIdController,actualizarRolController,eliminarRolController} from "../../controllers/seguridad/roles_controller.js";
import express from "express";
import { validarRol } from "../../middleware/validar_rol_jwt.js";

const rolRouter = express.Router(); 

rolRouter.get('/roles',validarRol([1]), obtenerRolesController);  
rolRouter.get('/rol_id',validarRol([1]), obtenerRolPorIdController);
rolRouter.put('/roles',validarRol([1]), actualizarRolController);
rolRouter.delete('/rol',validarRol([1]), eliminarRolController);  
rolRouter.post('/roles',validarRol([1]), crearRolController);

export default rolRouter;
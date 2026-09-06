import {getPlanoByIdController,getPlanosController,updatePlanoController,createPlanoController,deletePlanoController} from '../../controllers/inmobiliaria/plano_controller.js';
import { validarRol } from '../../middleware/validar_rol_jwt.js';
import express from 'express';
import upload from '../../middleware/upload_plano.js'

const planoRouter = express.Router();

planoRouter.get('/plano',validarRol([1,2]), getPlanosController);
planoRouter.get('/plano_id',validarRol([1,2]), getPlanoByIdController);
planoRouter.post('/plano',validarRol([1]),upload.single('archivo_dwg'), createPlanoController);
planoRouter.put('/plano', validarRol([1]), upload.single('archivo_dwg'), updatePlanoController);
planoRouter.delete('/plano',validarRol([1]), deletePlanoController);

export default planoRouter;
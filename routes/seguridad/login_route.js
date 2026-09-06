import { loginController } from "../../controllers/seguridad/usuario_controller.js";
import express from 'express'

const loginRouter = express.Router();

loginRouter.post('/login',loginController);

export default loginRouter;
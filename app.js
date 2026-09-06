// Importar dependencias
import morgan from 'morgan';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';

// Importar rutas
import usuarioRouter from './routes/seguridad/usuario_route.js';
import rolRouter from './routes/seguridad/rol_route.js';
import proyectoRouter from './routes/inmobiliaria/proyecto_route.js';
import planoRouter from './routes/inmobiliaria/plano_route.js';
import zonaRouter from './routes/inmobiliaria/zona_route.js';
import loteRouter from './routes/inmobiliaria/lote_route.js';
import estadoRouter from './routes/inmobiliaria/estado_route.js';
import capacitacionRouter from './routes/capacitacion/capacitacion_route.js';
import materialRouter from './routes/capacitacion/material_capa_route.js';
import loginRouter from './routes/seguridad/login_route.js';

// Importar configuración de sockets
import {configurarSockets} from './socket/socket.js';

// Importar middleware de auth
import { verificarJWT } from './middleware/auth_jwt.js';
import { validarRol } from './middleware/validar_rol_jwt.js';


// Importar liberación automática de lotes vencidos
import { liberarLotesVencidosService } 
  from "./services/inmobiliaria/lote_service.js";

const app = express();
// MIDDLEWARES
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use('/uploads',express.static('uploads'))

const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: "*"
    },
});

// Configurar sockets controlador y servicios
app.set('io', io);

// Ruta de login
app.use('/api_v1',loginRouter);

// Middleware JWT
app.use(verificarJWT);

// Rutas en general
app.use('/api_v1/usuarios', usuarioRouter);
app.use('/api_v1/roles',validarRol([1]), rolRouter);    
app.use('/api_v1/proyectos', proyectoRouter);
app.use('/api_v1/planos', planoRouter);
app.use('/api_v1/zonas', zonaRouter);
app.use('/api_v1/lotes', loteRouter);
app.use('/api_v1/estados', estadoRouter);
app.use('/api_v1/capacitaciones', capacitacionRouter);
app.use('/api_v1/materiales', materialRouter);

// Configurar eventos de socket
configurarSockets(io);

// Iniciar el servidor

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Servidor escuchando en todas las interfaces`);
    console.log(`🌐 Local: http://localhost:${PORT}/api_v1`);
});

// Liberación automática de lotes vencidos
const ejecutarLiberacionLotes = async () => {
    console.log("⏱️ Ejecutando liberación automática de lotes vencidos...");
    try {
        const lotesLiberados = await liberarLotesVencidosService();
        console.log(`✅ Liberación automática de lotes vencidos completada. Total lotes liberados: ${lotesLiberados.length}`);
        if (lotesLiberados.length > 0) {
            console.log(
                `♻️ Se liberaron automáticamente ${lotesLiberados.length} lote(s) vencido(s).`
            );

            lotesLiberados.forEach((lote) => {
              io.emit("loteActualizado", lote);
            });
        }
    } catch (error) {
        console.error(
            "❌ Error en la liberación automática de lotes:",
            error
        );
    }
};

// Ejecutar al iniciar el servidor
ejecutarLiberacionLotes();

// Revisar cada minuto
setInterval(ejecutarLiberacionLotes, 60 * 1000);
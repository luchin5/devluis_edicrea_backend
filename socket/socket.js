import {bloquearLote,liberarLote,liberarLotesPorSocket} from '../socket/socket_lote.js';

export const configurarSockets = (io) => {

    // Escuchar conexiones de clientes
    io.on("connection", (socket) => {

        console.log("Usuario conectado:", socket.id);

        // Escuchar evento de edición de lote
        socket.on("editarLote", ({ loteId, usuarioId }) => {

            const permitido = bloquearLote(loteId, usuarioId,socket.id);

            if (!permitido) {

                socket.emit("loteBloqueado", {
                    loteId,
                    mensaje: "Otro colaborador está editando este lote."
                });

                return;
            }

           // socket.join(`lote-${loteId}`);
            socket.emit("loteDisponible", {
                loteId
            });

            socket.broadcast.emit("loteEnEdicion", {
                loteId,
                usuarioId,
                socketId:socket.id
            });

        });

        // Escuchar evento de liberación de lote
        socket.on("liberarLote", ({ loteId }) => {

            liberarLote(loteId);

            io.emit("loteLiberado", {
                loteId
            });

        });

        // Escuchar evento de desconexión
        socket.on("disconnect", () => {

            liberarLotesPorSocket(socket.id);

            console.log("Usuario desconectado:", socket.id);

        });

    });

};
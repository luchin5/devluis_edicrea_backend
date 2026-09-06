const lotesBloqueados = new Map();

export const bloquearLote = (loteId, usuarioId, socketId) => {

    const bloqueo = lotesBloqueados.get(loteId);

    if (bloqueo && bloqueo.usuarioId !== usuarioId) {

        return false;

    }

    lotesBloqueados.set(loteId, {

        usuarioId,
        socketId,
        fecha: Date.now()

    });

    console.log(`Lote ${loteId} bloqueado por usuario ${usuarioId}`);

    return true;

};

export const liberarLote = (loteId) => {

    lotesBloqueados.delete(loteId);

};

export const obtenerBloqueo = (loteId) => {

    return lotesBloqueados.get(loteId);

};

export const liberarLotesPorSocket = (socketId) => {

    for (const [loteId, bloqueo] of lotesBloqueados.entries()) {

        if (bloqueo.socketId === socketId) {

            lotesBloqueados.delete(loteId);

            console.log(`Lote ${loteId} liberado por desconexión`);

        }

    }

};
export const validarRol = (idsRolesPermitidos) => {
    return (req, res, next) => {
        const rolUsuarioId = req.usuario.rol_id; // Aquí sacas el ID del rol

        if (!idsRolesPermitidos.includes(rolUsuarioId)) {
            return res.status(403).json({
                message: "No tienes permisos para acceder a este recurso"
            });
        }

        next();
    };
};
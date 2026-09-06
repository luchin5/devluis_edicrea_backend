import jwt from "jsonwebtoken";

export const verificarJWT = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      message: "Token no enviado",
    });
  }

  const token = authorization.split(" ")[1];

  try {
    const usuario = jwt.verify(
      token,

      process.env.JWT_SECRET,
    );

    req.usuario = usuario;

    next();
  } catch {
    return res.status(401).json({
      message: "Token inválido",
    });
  }
};

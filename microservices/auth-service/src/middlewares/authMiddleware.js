const jwt = require('jsonwebtoken');
const logger = require('../util/logger');

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    logger.warn('Middleware de autenticación | Token no proporcionado');
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.error(`Middleware de autenticación | Token inválido: ${err.message}`);
      return res.status(403).json({ error: 'Token inválido' });
    }

    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;

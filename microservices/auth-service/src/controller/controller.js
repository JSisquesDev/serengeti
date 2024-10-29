/**
 * Controlador para las operaciones CRUD de autenticaciones
 * @module authController
 */

const authService = require('../service/service');
const logger = require('../util/logger');

/**
 * Obtiene todas las autenticaciones
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.getAllAuths = async (req, res) => {
  try {
    logger.info('src/controller/controller.js | Obteniendo todas las autenticaciones');
    const auths = await authService.getAllAuths();
    res.status(200).json(auths);
  } catch (error) {
    logger.error(`src/controller/controller.js | Error al obtener las autenticaciones: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Obtiene una autenticación por ID
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.getAuthById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      logger.warn('src/controller/controller.js | ID de autenticación no proporcionado');
      return res.status(400).json({ error: 'ID de autenticación requerido' });
    }

    logger.info(`src/controller/controller.js | Obteniendo autenticación con ID: ${id}`);
    const auth = await authService.getAuthById(id);
    res.status(200).json(auth);
  } catch (error) {
    logger.error(`src/controller/controller.js | Error al obtener la autenticación: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Crea una nueva autenticación
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.createAuth = async (req, res) => {
  try {
    const authData = req.body;

    const requiredFields = ['usuario', 'password'];
    const missingFields = requiredFields.filter(field => !authData[field]);

    if (missingFields.length > 0) {
      logger.warn(`src/controller/controller.js | Faltan campos requeridos: ${missingFields.join(', ')}`);
      return res.status(400).json({
        error: 'Datos incompletos',
        missingFields: missingFields,
      });
    }

    logger.info('src/controller/controller.js | Creando nueva autenticación');
    const auth = await authService.createAuth(authData);
    res.status(201).json(auth);
  } catch (error) {
    logger.error(`src/controller/controller.js | Error al crear la autenticación: ${error.message}`);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Error de validación',
        details: error.message,
      });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Actualiza una autenticación existente
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.updateAuth = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      logger.warn('src/controller/controller.js | ID de autenticación no proporcionado');
      return res.status(400).json({ error: 'ID de autenticación requerido' });
    }

    const updateData = req.body;
    logger.info(`src/controller/controller.js | Actualizando autenticación con ID: ${id}`);
    const auth = await authService.updateAuth(id, updateData);
    res.status(200).json(auth);
  } catch (error) {
    logger.error(`src/controller/controller.js | Error al actualizar la autenticación: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Elimina una autenticación
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.deleteAuth = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      logger.warn('src/controller/controller.js | ID de autenticación no proporcionado');
      return res.status(400).json({ error: 'ID de autenticación requerido' });
    }

    logger.info(`src/controller/controller.js | Eliminando autenticación con ID: ${id}`);
    const auth = await authService.deleteAuth(id);
    res.status(200).json(auth);
  } catch (error) {
    logger.error(`src/controller/controller.js | Error al eliminar la autenticación: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Controlador para las operaciones CRUD de notificaciones
 * @module notificationController
 */

const notificationService = require('../service/service');
const logger = require('../util/logger');

/**
 * Obtiene todas las notificaciones
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.getAllNotifications = async (req, res) => {
  try {
    // Lógica para obtener todas las notificaciones
    logger.info('src/controller/notification.js | Obteniendo todas las notificaciones');
    const notifications = await notificationService.getAllNotifications();
    res.status(200).json(notifications);
  } catch (error) {
    logger.error(`src/controller/notification.js | Error al obtener las notificaciones: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Obtiene una notificación por ID
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!id) {
      logger.warn('src/controller/notification.js | ID de notificación no proporcionado');
      return res.status(400).json({ error: 'ID de notificación requerido' });
    }

    // Lógica para obtener una notificación por ID
    logger.info(`src/controller/notification.js | Obteniendo notificación con ID: ${id}`);
    const notification = await notificationService.getNotificationById(id);
    res.status(200).json(notification);
  } catch (error) {
    logger.error(`src/controller/notification.js | Error al obtener la notificación: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Crea una nueva notificación
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.createNotification = async (req, res) => {
  try {
    const notificationData = req.body;

    // Validar campos requeridos
    const requiredFields = ['userId', 'titulo', 'mensaje'];
    const missingFields = requiredFields.filter(field => !notificationData[field]);

    if (missingFields.length > 0) {
      logger.warn(`src/controller/notification.js | Faltan campos requeridos: ${missingFields.join(', ')}`);
      return res.status(400).json({
        error: 'Datos incompletos',
        missingFields: missingFields,
      });
    }

    // Lógica para crear una nueva notificación
    logger.info('src/controller/notification.js | Creando nueva notificación');
    const notification = await notificationService.createNotification(notificationData);
    res.status(201).json(notification);
  } catch (error) {
    logger.error(`src/controller/notification.js | Error al crear la notificación: ${error.message}`);
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
 * Actualiza una notificación existente
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.updateNotification = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!id) {
      logger.warn('src/controller/notification.js | ID de notificación no proporcionado');
      return res.status(400).json({ error: 'ID de notificación requerido' });
    }

    const updateData = req.body;
    // Lógica para actualizar una notificación
    logger.info(`src/controller/notification.js | Actualizando notificación con ID: ${id}`);
    const notification = await notificationService.updateNotification(id, updateData);
    res.status(200).json(notification);
  } catch (error) {
    logger.error(`src/controller/notification.js | Error al actualizar la notificación: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Elimina una notificación
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!id) {
      logger.warn('src/controller/notification.js | ID de notificación no proporcionado');
      return res.status(400).json({ error: 'ID de notificación requerido' });
    }

    // Lógica para eliminar una notificación
    logger.info(`src/controller/notification.js | Eliminando notificación con ID: ${id}`);
    const notification = await notificationService.deleteNotification(id);
    res.status(200).json(notification);
  } catch (error) {
    logger.error(`src/controller/notification.js | Error al eliminar la notificación: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

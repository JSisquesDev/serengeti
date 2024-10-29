const Notification = require('../model/notification');
const logger = require('../util/logger');
const redis = require('../util/redis');

/**
 * Servicio para gestionar las notificaciones del sistema
 * @module NotificationService
 */

/**
 * Crea una nueva notificación en el sistema
 * @async
 * @param {Object} notificationData - Datos de la notificación a crear
 * @param {string} notificationData.userId - ID del usuario destinatario
 * @param {string} notificationData.titulo - Título de la notificación
 * @param {string} notificationData.mensaje - Contenido del mensaje
 * @param {string} [notificationData.estado='pendiente'] - Estado de la notificación
 * @returns {Promise<Object>} Notificación creada
 * @throws {Error} Si hay un error al crear la notificación
 */
exports.createNotification = async notificationData => {
  try {
    const notification = new Notification(notificationData);
    const savedNotification = await notification.save();
    // Guardar en caché
    await redis.set(`notification:${savedNotification._id}`, JSON.stringify(savedNotification));
    logger.info(`src/service/notification.js | Notificación creada con ID: ${savedNotification._id}`);
    return savedNotification;
  } catch (error) {
    logger.error(`src/service/notification.js | Error al crear notificación: ${error.message}`);
    throw error;
  }
};

/**
 * Obtiene todas las notificaciones del sistema
 * @async
 * @returns {Promise<Array>} Lista de notificaciones
 * @throws {Error} Si hay un error al obtener las notificaciones
 */
exports.getAllNotifications = async () => {
  try {
    // Intentar obtener de caché
    const cachedNotifications = await redis.get('notifications:all');
    if (cachedNotifications) {
      logger.info('src/service/notification.js | Notificaciones recuperadas desde caché');
      return JSON.parse(cachedNotifications);
    }

    const notifications = await Notification.find();
    // Guardar en caché por 5 minutos
    await redis.setex('notifications:all', 300, JSON.stringify(notifications));
    logger.info('src/service/notification.js | Notificaciones recuperadas exitosamente de BD');
    return notifications;
  } catch (error) {
    logger.error(`src/service/notification.js | Error al obtener notificaciones: ${error.message}`);
    throw error;
  }
};

/**
 * Obtiene una notificación específica por su ID
 * @async
 * @param {string} id - ID de la notificación a buscar
 * @returns {Promise<Object|null>} Notificación encontrada o null si no existe
 * @throws {Error} Si hay un error al obtener la notificación
 */
exports.getNotificationById = async id => {
  try {
    // Intentar obtener de caché
    const cachedNotification = await redis.get(`notification:${id}`);
    if (cachedNotification) {
      logger.info(`src/service/notification.js | Notificación recuperada desde caché con ID: ${id}`);
      return JSON.parse(cachedNotification);
    }

    const notification = await Notification.findById(id);
    if (!notification) {
      logger.warn(`src/service/notification.js | Notificación no encontrada con ID: ${id}`);
      return null;
    }
    // Guardar en caché
    await redis.set(`notification:${id}`, JSON.stringify(notification));
    logger.info(`src/service/notification.js | Notificación recuperada con ID: ${id}`);
    return notification;
  } catch (error) {
    logger.error(`src/service/notification.js | Error al obtener notificación: ${error.message}`);
    throw error;
  }
};

/**
 * Actualiza una notificación existente
 * @async
 * @param {string} id - ID de la notificación a actualizar
 * @param {Object} updateData - Datos a actualizar
 * @param {string} [updateData.titulo] - Nuevo título
 * @param {string} [updateData.mensaje] - Nuevo mensaje
 * @param {string} [updateData.estado] - Nuevo estado
 * @param {Date} [updateData.fechaLectura] - Nueva fecha de lectura
 * @returns {Promise<Object|null>} Notificación actualizada o null si no existe
 * @throws {Error} Si hay un error al actualizar la notificación
 */
exports.updateNotification = async (id, updateData) => {
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedNotification) {
      logger.warn(`src/service/notification.js | Notificación no encontrada para actualizar con ID: ${id}`);
      return null;
    }
    // Actualizar caché
    await redis.set(`notification:${id}`, JSON.stringify(updatedNotification));
    // Invalidar caché de todas las notificaciones
    await redis.del('notifications:all');
    logger.info(`src/service/notification.js | Notificación actualizada con ID: ${id}`);
    return updatedNotification;
  } catch (error) {
    logger.error(`src/service/notification.js | Error al actualizar notificación: ${error.message}`);
    throw error;
  }
};

/**
 * Elimina una notificación del sistema
 * @async
 * @param {string} id - ID de la notificación a eliminar
 * @returns {Promise<Object|null>} Notificación eliminada o null si no existe
 * @throws {Error} Si hay un error al eliminar la notificación
 */
exports.deleteNotification = async id => {
  try {
    const deletedNotification = await Notification.findByIdAndDelete(id);
    if (!deletedNotification) {
      logger.warn(`src/service/notification.js | Notificación no encontrada para eliminar con ID: ${id}`);
      return null;
    }
    // Eliminar de caché
    await redis.del(`notification:${id}`);
    // Invalidar caché de todas las notificaciones
    await redis.del('notifications:all');
    logger.info(`src/service/notification.js | Notificación eliminada con ID: ${id}`);
    return deletedNotification;
  } catch (error) {
    logger.error(`src/service/notification.js | Error al eliminar notificación: ${error.message}`);
    throw error;
  }
};

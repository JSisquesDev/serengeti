const Reservation = require('../model/reservation');
const logger = require('../util/logger');
const redis = require('../util/redis');

/**
 * Módulo que maneja las operaciones CRUD para las reservas
 * @module ReservationService
 */

/**
 * Crea una nueva reserva en la base de datos
 * @async
 * @param {Object} reservationData - Datos de la reserva a crear
 * @param {string} reservationData.userId - ID del usuario que hace la reserva
 * @param {string} reservationData.roomId - ID de la habitación reservada
 * @param {Date} reservationData.checkIn - Fecha de entrada
 * @param {Date} reservationData.checkOut - Fecha de salida
 * @param {number} reservationData.guests - Número de huéspedes
 * @returns {Promise<Object>} reserva creada
 * @throws {Error} Si hay un error al crear la reserva
 */
exports.createReservation = async reservationData => {
  try {
    const reservation = new Reservation(reservationData);
    const savedReservation = await reservation.save();

    // Invalidar cache de todas las reservas
    await redis.del('all_reservations');

    logger.info(`src/service/reservation.js | Reserva creada con ID: ${savedReservation._id}`);
    return savedReservation;
  } catch (error) {
    logger.error(`src/service/reservation.js | Error al crear reserva: ${error.message}`);
    throw error;
  }
};

/**
 * Obtiene todas las reservas del sistema
 * @async
 * @returns {Promise<Array>} Lista de todas las reservas
 * @throws {Error} Si hay un error al obtener las reservas
 */
exports.getAllReservations = async () => {
  try {
    // Intentar obtener de cache
    const cachedReservations = await redis.get('all_reservations');
    if (cachedReservations) {
      logger.info('src/service/reservation.js | Reservas recuperadas desde cache');
      return JSON.parse(cachedReservations);
    }

    const reservations = await Reservation.find();
    // Guardar en cache
    await redis.setex('all_reservations', process.env.REDIS_CACHE_TTL, JSON.stringify(reservations));
    logger.info('src/service/reservation.js | Reservas recuperadas exitosamente de BD');
    return reservations;
  } catch (error) {
    logger.error(`src/service/reservation.js | Error al obtener reservas: ${error.message}`);
    throw error;
  }
};

/**
 * Busca y retorna una reserva específica por su ID
 * @async
 * @param {string} id - ID de la reserva a buscar
 * @returns {Promise<Object|null>} reserva encontrada o null si no existe
 * @throws {Error} Si hay un error al obtener la reserva
 */
exports.getReservationById = async id => {
  try {
    // Intentar obtener de cache
    const cachedReservation = await redis.get(`reservation:${id}`);

    if (cachedReservation) {
      logger.info(`src/service/reservation.js | Reserva recuperada desde cache con ID: ${id}`);
      return JSON.parse(cachedReservation);
    }

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      logger.warn(`src/service/reservation.js | Reserva no encontrada con ID: ${id}`);
      return null;
    }

    // Guardar en cache
    await redis.setex(`reservation:${id}`, process.env.REDIS_CACHE_TTL, JSON.stringify(reservation));
    logger.info(`src/service/reservation.js | Reserva recuperada de BD con ID: ${id}`);
    return reservation;
  } catch (error) {
    logger.error(`src/service/reservation.js | Error al obtener reserva: ${error.message}`);
    throw error;
  }
};

/**
 * Actualiza una reserva existente
 * @async
 * @param {string} id - ID de la reserva a actualizar
 * @param {Object} updateData - Datos actualizados de la reserva
 * @param {string} [updateData.roomId] - ID de la nueva habitación
 * @param {Date} [updateData.checkIn] - Nueva fecha de entrada
 * @param {Date} [updateData.checkOut] - Nueva fecha de salida
 * @param {number} [updateData.guests] - Nuevo número de huéspedes
 * @returns {Promise<Object|null>} reserva actualizada o null si no existe
 * @throws {Error} Si hay un error al actualizar la reserva
 */
exports.updateReservation = async (id, updateData) => {
  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedReservation) {
      logger.warn(`src/service/reservation.js | Reserva no encontrada para actualizar con ID: ${id}`);
      return null;
    }

    // Invalidar caches
    await Promise.all([redis.del(`reservation:${id}`), redis.del('all_reservations')]);

    logger.info(`src/service/reservation.js | Reserva actualizada con ID: ${id}`);
    return updatedReservation;
  } catch (error) {
    logger.error(`src/service/reservation.js | Error al actualizar reserva: ${error.message}`);
    throw error;
  }
};

/**
 * Elimina una reserva del sistema
 * @async
 * @param {string} id - ID de la reserva a eliminar
 * @returns {Promise<Object|null>} reserva eliminada o null si no existe
 * @throws {Error} Si hay un error al eliminar la reserva
 */
exports.deleteReservation = async id => {
  try {
    const deletedReservation = await Reservation.findByIdAndDelete(id);
    if (!deletedReservation) {
      logger.warn(`src/service/reservation.js | Reserva no encontrada para eliminar con ID: ${id}`);
      return null;
    }

    // Invalidar caches
    await Promise.all([redis.del(`reservation:${id}`), redis.del('all_reservations')]);

    logger.info(`src/service/reservation.js | Reserva eliminada con ID: ${id}`);
    return deletedReservation;
  } catch (error) {
    logger.error(`src/service/reservation.js | Error al eliminar reserva: ${error.message}`);
    throw error;
  }
};

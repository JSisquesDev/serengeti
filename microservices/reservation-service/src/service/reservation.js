const Reservation = require('../model/reservation');
const logger = require('../util/logger');

/**
 * Crea una nueva reservación
 * @param {Object} reservationData Datos de la reservación
 * @returns {Promise<Object>} Reservación creada
 */
exports.createReservation = async reservationData => {
  try {
    const reservation = new Reservation(reservationData);
    const savedReservation = await reservation.save();
    logger.info(`src/service/reservation.js | Reservación creada con ID: ${savedReservation._id}`);
    return savedReservation;
  } catch (error) {
    logger.error(`src/service/reservation.js | Error al crear reservación: ${error.message}`);
    throw error;
  }
};

/**
 * Obtiene todas las reservaciones
 * @returns {Promise<Array>} Lista de reservaciones
 */
(exports.getAllReservations = async () => {
  try {
    const reservations = await Reservation.find();
    logger.info('src/service/reservation.js | Reservaciones recuperadas exitosamente');
    return reservations;
  } catch (error) {
    logger.error(`src/service/reservation.js | Error al obtener reservaciones: ${error.message}`);
    throw error;
  }
}),
  /**
   * Obtiene una reservación por ID
   * @param {string} id ID de la reservación
   * @returns {Promise<Object>} Reservación encontrada
   */
  (exports.getReservationById = async id => {
    try {
      const reservation = await Reservation.findById(id);
      if (!reservation) {
        logger.warn(`src/service/reservation.js | Reservación no encontrada con ID: ${id}`);
        return null;
      }
      logger.info(`src/service/reservation.js | Reservación recuperada con ID: ${id}`);
      return reservation;
    } catch (error) {
      logger.error(`src/service/reservation.js | Error al obtener reservación: ${error.message}`);
      throw error;
    }
  }),
  /**
   * Actualiza una reservación
   * @param {string} id ID de la reservación
   * @param {Object} updateData Datos actualizados
   * @returns {Promise<Object>} Reservación actualizada
   */
  (exports.updateReservation = async (id, updateData) => {
    try {
      const updatedReservation = await Reservation.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedReservation) {
        logger.warn(`src/service/reservation.js | Reservación no encontrada para actualizar con ID: ${id}`);
        return null;
      }
      logger.info(`src/service/reservation.js | Reservación actualizada con ID: ${id}`);
      return updatedReservation;
    } catch (error) {
      logger.error(`src/service/reservation.js | Error al actualizar reservación: ${error.message}`);
      throw error;
    }
  }),
  /**
   * Elimina una reservación
   * @param {string} id ID de la reservación
   * @returns {Promise<Object>} Reservación eliminada
   */
  (exports.deleteReservation = async id => {
    try {
      const deletedReservation = await Reservation.findByIdAndDelete(id);
      if (!deletedReservation) {
        logger.warn(`src/service/reservation.js | Reservación no encontrada para eliminar con ID: ${id}`);
        return null;
      }
      logger.info(`src/service/reservation.js | Reservación eliminada con ID: ${id}`);
      return deletedReservation;
    } catch (error) {
      logger.error(`src/service/reservation.js | Error al eliminar reservación: ${error.message}`);
      throw error;
    }
  });

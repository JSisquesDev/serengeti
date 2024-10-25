/**
 * Controlador para las operaciones CRUD de reservaciones
 * @module reservationController
 */

const reservationService = require('../service/reservation');
const logger = require('../util/logger');

/**
 * Obtiene todas las reservaciones
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.getAllReservations = async (req, res) => {
  try {
    // Lógica para obtener todas las reservaciones
    logger.info('src/controller/reservation.js | Obteniendo todas las reservaciones');
    const reservations = await reservationService.getAllReservations();
    res.status(200).json(reservations);
  } catch (error) {
    logger.error(`src/controller/reservation.js | Error al obtener las reservaciones: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Obtiene una reservación por ID
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.getReservationById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!id) {
      logger.warn('src/controller/reservation.js | ID de reservación no proporcionado');
      return res.status(400).json({ error: 'ID de reservación requerido' });
    }

    // Lógica para obtener una reservación por ID
    logger.info(`src/controller/reservation.js | Obteniendo reservación con ID: ${id}`);
    const reservation = await reservationService.getReservationById(id);
    res.status(200).json(reservation);
  } catch (error) {
    logger.error(`src/controller/reservation.js | Error al obtener la reservación: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Crea una nueva reservación
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.createReservation = async (req, res) => {
  try {
    const reservationData = req.body;

    // Validar campos requeridos
    const requiredFields = ['customerEmail', 'date', 'time', 'numberOfPeople'];
    const missingFields = requiredFields.filter(field => !reservationData[field]);

    if (missingFields.length > 0) {
      logger.warn(`src/controller/reservation.js | Faltan campos requeridos: ${missingFields.join(', ')}`);
      return res.status(400).json({
        error: 'Datos incompletos',
        missingFields: missingFields,
      });
    }

    // Validar formato de fecha
    const date = new Date(reservationData.date);
    if (isNaN(date.getTime())) {
      logger.warn('src/controller/reservation.js | Formato de fecha inválido');
      return res.status(400).json({
        error: 'Error de validación',
        details: 'El formato de la fecha es inválido. Use YYYY-MM-DD',
      });
    }
    reservationData.date = date;

    // Lógica para crear una nueva reservación
    logger.info('src/controller/reservation.js | Creando nueva reservación');
    const reservation = await reservationService.createReservation(reservationData);
    res.status(201).json(reservation);
  } catch (error) {
    logger.error(`src/controller/reservation.js | Error al crear la reservación: ${error.message}`);
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
 * Actualiza una reservación existente
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!id) {
      logger.warn('src/controller/reservation.js | ID de reservación no proporcionado');
      return res.status(400).json({ error: 'ID de reservación requerido' });
    }

    const updateData = req.body;
    // Lógica para actualizar una reservación
    logger.info(`src/controller/reservation.js | Actualizando reservación con ID: ${id}`);
    const reservation = await reservationService.updateReservation(id, updateData);
    res.status(200).json(reservation);
  } catch (error) {
    logger.error(`src/controller/reservation.js | Error al actualizar la reservación: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Elimina una reservación
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!id) {
      logger.warn('src/controller/reservation.js | ID de reservación no proporcionado');
      return res.status(400).json({ error: 'ID de reservación requerido' });
    }

    // Lógica para eliminar una reservación
    logger.info(`src/controller/reservation.js | Eliminando reservación con ID: ${id}`);
    const reservation = await reservationService.deleteReservation(id);
    res.status(200).json(reservation);
  } catch (error) {
    logger.error(`src/controller/reservation.js | Error al eliminar la reservación: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

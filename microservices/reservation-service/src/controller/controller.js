/**
 * Controlador para las operaciones CRUD de reservas
 * @module reservationController
 */

const reservationService = require('../service/service');
const logger = require('../util/logger');

/**
 * Obtiene todas las reservas
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.getAllReservations = async (req, res) => {
  try {
    // Lógica para obtener todas las reservas
    logger.info('src/controller/reservation.js | Obteniendo todas las reservas');
    const reservations = await reservationService.getAllReservations();
    res.status(200).json(reservations);
  } catch (error) {
    logger.error(`src/controller/reservation.js | Error al obtener las reservas: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Obtiene una reserva por ID
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.getReservationById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!id) {
      logger.warn('src/controller/reservation.js | ID de reserva no proporcionado');
      return res.status(400).json({ error: 'ID de reserva requerido' });
    }

    // Lógica para obtener una reserva por ID
    logger.info(`src/controller/reservation.js | Obteniendo reserva con ID: ${id}`);
    const reservation = await reservationService.getReservationById(id);
    res.status(200).json(reservation);
  } catch (error) {
    logger.error(`src/controller/reservation.js | Error al obtener la reserva: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Crea una nueva reserva
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

    // Lógica para crear una nueva reserva
    logger.info('src/controller/reservation.js | Creando nueva reserva');
    const reservation = await reservationService.createReservation(reservationData);
    res.status(201).json(reservation);
  } catch (error) {
    logger.error(`src/controller/reservation.js | Error al crear la reserva: ${error.message}`);
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
 * Actualiza una reserva existente
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!id) {
      logger.warn('src/controller/reservation.js | ID de reserva no proporcionado');
      return res.status(400).json({ error: 'ID de reserva requerido' });
    }

    const updateData = req.body;
    // Lógica para actualizar una reserva
    logger.info(`src/controller/reservation.js | Actualizando reserva con ID: ${id}`);
    const reservation = await reservationService.updateReservation(id, updateData);
    res.status(200).json(reservation);
  } catch (error) {
    logger.error(`src/controller/reservation.js | Error al actualizar la reserva: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Elimina una reserva
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!id) {
      logger.warn('src/controller/reservation.js | ID de reserva no proporcionado');
      return res.status(400).json({ error: 'ID de reserva requerido' });
    }

    // Lógica para eliminar una reserva
    logger.info(`src/controller/reservation.js | Eliminando reserva con ID: ${id}`);
    const reservation = await reservationService.deleteReservation(id);
    res.status(200).json(reservation);
  } catch (error) {
    logger.error(`src/controller/reservation.js | Error al eliminar la reserva: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

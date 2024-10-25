const express = require('express');
const router = express.Router();
const reservationController = require('../controller/reservation');

/**
 * @swagger
 * /api/v1/reservations:
 *   get:
 *     summary: Obtiene todas las reservaciones
 *     tags: [Reservaciones]
 *     responses:
 *       200:
 *         description: Lista de reservaciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservacion'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', reservationController.getAllReservations);

/**
 * @swagger
 * /api/v1/reservations/{id}:
 *   get:
 *     summary: Obtiene una reservación por ID
 *     tags: [Reservaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la reservación
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservación obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservacion'
 *       404:
 *         description: Reservación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', reservationController.getReservationById);

/**
 * @swagger
 * /api/v1/reservations:
 *   post:
 *     summary: Crea una nueva reservación
 *     tags: [Reservaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevaReservacion'
 *     responses:
 *       201:
 *         description: Reservación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservacion'
 *       400:
 *         description: Datos de reservación inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', reservationController.createReservation);

/**
 * @swagger
 * /api/v1/reservations/{id}:
 *   put:
 *     summary: Actualiza una reservación existente
 *     tags: [Reservaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la reservación a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActualizarReservacion'
 *     responses:
 *       200:
 *         description: Reservación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservacion'
 *       400:
 *         description: Datos de actualización inválidos
 *       404:
 *         description: Reservación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', reservationController.updateReservation);

/**
 * @swagger
 * /api/v1/reservations/{id}:
 *   delete:
 *     summary: Elimina una reservación
 *     tags: [Reservaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la reservación a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservación eliminada exitosamente
 *       404:
 *         description: Reservación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', reservationController.deleteReservation);

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservacion:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único de la reservación
 *         fechaInicio:
 *           type: string
 *           format: date
 *           description: Fecha de inicio de la reservación
 *         fechaFin:
 *           type: string
 *           format: date
 *           description: Fecha de fin de la reservación
 *         huespedes:
 *           type: integer
 *           description: Número de huéspedes
 *         habitacion:
 *           type: string
 *           description: Tipo de habitación
 *     NuevaReservacion:
 *       type: object
 *       required:
 *         - fechaInicio
 *         - fechaFin
 *         - huespedes
 *         - habitacion
 *       properties:
 *         fechaInicio:
 *           type: string
 *           format: date
 *         fechaFin:
 *           type: string
 *           format: date
 *         huespedes:
 *           type: integer
 *         habitacion:
 *           type: string
 *     ActualizarReservacion:
 *       type: object
 *       properties:
 *         fechaInicio:
 *           type: string
 *           format: date
 *         fechaFin:
 *           type: string
 *           format: date
 *         huespedes:
 *           type: integer
 *         habitacion:
 *           type: string
 */

module.exports = router;

const express = require('express');
const router = express.Router();
const reservationController = require('../controller/notification');

/**
 * @swagger
 * /api/v1/notifications:
 *   get:
 *     summary: Obtiene todas las notificaciones
 *     tags: [Notificaciones]
 *     responses:
 *       200:
 *         description: Lista de notificaciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notificacion'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', reservationController.getAllReservations);

/**
 * @swagger
 * /api/v1/notifications/{id}:
 *   get:
 *     summary: Obtiene una notificación por ID
 *     tags: [Notificaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la notificación
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notificación obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notificacion'
 *       404:
 *         description: Notificación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', reservationController.getReservationById);

/**
 * @swagger
 * /api/v1/notifications:
 *   post:
 *     summary: Crea una nueva notificación
 *     tags: [Notificaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevaNotificacion'
 *     responses:
 *       201:
 *         description: Notificación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notificacion'
 *       400:
 *         description: Datos de notificación inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', reservationController.createReservation);

/**
 * @swagger
 * /api/v1/notifications/{id}:
 *   put:
 *     summary: Actualiza una notificación existente
 *     tags: [Notificaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la notificación a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActualizarNotificacion'
 *     responses:
 *       200:
 *         description: Notificación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notificacion'
 *       400:
 *         description: Datos de actualización inválidos
 *       404:
 *         description: Notificación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', reservationController.updateReservation);

/**
 * @swagger
 * /api/v1/notifications/{id}:
 *   delete:
 *     summary: Elimina una notificación
 *     tags: [Notificaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la notificación a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notificación eliminada exitosamente
 *       404:
 *         description: Notificación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', reservationController.deleteReservation);

/**
 * @swagger
 * components:
 *   schemas:
 *     Notificacion:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único de la notificación
 *         tipo:
 *           type: string
 *           description: Tipo de notificación (email, sms, push)
 *         destinatario:
 *           type: string
 *           description: Destinatario de la notificación
 *         contenido:
 *           type: string
 *           description: Contenido de la notificación
 *         estado:
 *           type: string
 *           description: Estado de la notificación (pendiente, enviada, fallida)
 *         fechaCreacion:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación de la notificación
 *     NuevaNotificacion:
 *       type: object
 *       required:
 *         - tipo
 *         - destinatario
 *         - contenido
 *       properties:
 *         tipo:
 *           type: string
 *         destinatario:
 *           type: string
 *         contenido:
 *           type: string
 *     ActualizarNotificacion:
 *       type: object
 *       properties:
 *         tipo:
 *           type: string
 *         destinatario:
 *           type: string
 *         contenido:
 *           type: string
 *         estado:
 *           type: string
 */

module.exports = router;

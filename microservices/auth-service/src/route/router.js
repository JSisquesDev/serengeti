const express = require('express');
const router = express.Router();
const authController = require('../controller/controller');

/**
 * @swagger
 * /api/v1/auth:
 *   post:
 *     summary: Crea una nueva autenticación
 *     tags: [Autenticaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NuevaAutenticacion'
 *     responses:
 *       201:
 *         description: Autenticación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Autenticacion'
 *       400:
 *         description: Datos de autenticación inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', authController.createAuth);

/**
 * @swagger
 * /api/v1/auth/{id}:
 *   put:
 *     summary: Actualiza una autenticación existente
 *     tags: [Autenticaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la autenticación a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActualizarAutenticacion'
 *     responses:
 *       200:
 *         description: Autenticación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Autenticacion'
 *       400:
 *         description: Datos de actualización inválidos
 *       404:
 *         description: Autenticación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', authController.updateAuth);

/**
 * @swagger
 * /api/v1/auth/{id}:
 *   delete:
 *     summary: Elimina una autenticación
 *     tags: [Autenticaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la autenticación a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Autenticación eliminada exitosamente
 *       404:
 *         description: Autenticación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', authController.deleteAuth);

/**
 * @swagger
 * components:
 *   schemas:
 *     Autenticacion:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único de la autenticación
 *         usuario:
 *           type: string
 *           description: Usuario de la autenticación
 *         token:
 *           type: string
 *           description: Token de autenticación
 *         fechaCreacion:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación de la autenticación
 *     NuevaAutenticacion:
 *       type: object
 *       required:
 *         - usuario
 *         - token
 *       properties:
 *         usuario:
 *           type: string
 *         token:
 *           type: string
 *     ActualizarAutenticacion:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 */

module.exports = router;

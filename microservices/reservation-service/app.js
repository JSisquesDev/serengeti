/**
 * Módulo principal de la aplicación de reservaciones
 * @module app
 */

const express = require('express');
const app = express();
const dotenv = require('dotenv');

// Carga las variables de entorno
dotenv.config();

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// Middleware para parsear datos de formularios URL-encoded
app.use(express.urlencoded({ extended: true }));

// Importa y configura Swagger
const swaggerMiddleware = require('./src/config/swaggerConfig');
swaggerMiddleware(app);

// Importa el router de reservaciones
const reservationsRouter = require('./src/route/reservation');

// Configura la ruta base para las reservaciones
app.use(process.env.API_BASE_PATH, reservationsRouter);

// Exporta la aplicación para su uso en otros módulos
module.exports = app;

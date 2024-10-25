/**
 * Configuración de Swagger para la documentación de la API
 * @module swaggerConfig
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv');

// Carga las variables de entorno
dotenv.config();

/**
 * Opciones de configuración para Swagger
 * @type {Object}
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: process.env.API_NAME,
      version: process.env.API_VERSION,
      description: process.env.API_DESCRIPTION,
    },
    servers: [
      {
        url: process.env.API_SERVER_URL,
        description: 'Servidor de desarrollo',
      },
    ],
    basePath: process.env.API_BASE_PATH, // Añadida la ruta base de la API
  },
  apis: ['./src/route/*.js'], // Rutas de los archivos que contienen las definiciones de la API
};

// Genera las especificaciones de Swagger
const specs = swaggerJsdoc(options);

/**
 * Middleware para configurar Swagger en la aplicación Express
 * @param {Object} app - Instancia de la aplicación Express
 */
const swaggerMiddleware = app => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
};

module.exports = swaggerMiddleware;

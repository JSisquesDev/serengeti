/**
 * Módulo de configuración y conexión a Redis
 * @module redis
 */

const Redis = require('ioredis');
const logger = require('./logger');
const redisConfig = require('../config/redisConfig');

/**
 * Instancia de conexión a Redis
 * @type {Redis}
 */
const redis = new Redis(redisConfig);

// Manejar eventos de conexión
redis.on('connect', () => {
  logger.info('src/util/redis.js | Conectado exitosamente a Redis');
});

/**
 * Manejo de errores de conexión a Redis
 */
redis.on('error', error => {
  logger.error(`src/util/redis.js | Error de conexión a Redis: ${error.message}`);
});

/**
 * Exporta la instancia de Redis configurada
 * @type {Redis}
 */
module.exports = redis;

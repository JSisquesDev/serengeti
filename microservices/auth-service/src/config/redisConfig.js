const Redis = require('ioredis');
const logger = require('../util/logger');

/**
 * Configuración para la conexión a Redis
 * @typedef {Object} RedisConfig
 * @property {string} host - Host del servidor Redis. Por defecto 'localhost'
 * @property {number} port - Puerto del servidor Redis. Por defecto 6379
 * @property {Function} retryStrategy - Función que determina el tiempo de espera entre reintentos de conexión
 */

/**
 * Objeto de configuración para Redis
 * @type {RedisConfig}
 */
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: times => {
    /**
     * Calcula el tiempo de espera entre reintentos
     * @param {number} times - Número de intentos realizados
     * @returns {number} Tiempo de espera en milisegundos
     */
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};

module.exports = redisConfig;

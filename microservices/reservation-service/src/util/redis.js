const Redis = require('ioredis');
const logger = require('./logger');
const redisConfig = require('../config/redisConfig');

// Crear instancia de Redis
const redis = new Redis(redisConfig);

// Manejar eventos de conexión
redis.on('connect', () => {
  logger.info('src/util/redis.js | Conectado exitosamente a Redis');
});

redis.on('error', error => {
  logger.error(`src/util/redis.js | Error de conexión a Redis: ${error.message}`);
});

module.exports = redis;

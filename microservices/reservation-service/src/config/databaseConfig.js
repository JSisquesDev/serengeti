const mongoose = require('mongoose');
const logger = require('../util/logger');

// Obtener variables de entorno
const { MONGO_INITDB_ROOT_USERNAME, MONGO_INITDB_ROOT_PASSWORD, MONGO_DB_NAME, MONGO_DB_HOST, MONGO_DB_PORT } = process.env;

// Construir URL de conexión
const mongoUrl = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_DB_HOST}:${MONGO_DB_PORT}/${MONGO_DB_NAME}?authSource=admin`;

// Configuración de conexión
const connectDB = async () => {
  try {
    await mongoose.connect(mongoUrl);
    logger.info('src/config/databaseConfig.js | Conexión exitosa a MongoDB');
  } catch (error) {
    logger.error(`src/config/databaseConfig.js | Error al conectar a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Eventos de conexión
mongoose.connection.on('disconnected', () => {
  logger.warn('src/config/databaseConfig.js | Desconectado de MongoDB');
});

mongoose.connection.on('error', err => {
  logger.error(`src/config/databaseConfig.js | Error de conexión MongoDB: ${err.message}`);
});

module.exports = connectDB;

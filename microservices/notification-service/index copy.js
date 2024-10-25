require('dotenv').config();

const app = require('./app');
const logger = require('./src/util/logger');

const connectDB = require('./src/config/databaseConfig');

// Conectar a MongoDB
connectDB();

const port = process.env.API_PORT;

app.listen(port, () => {
  logger.info(`index.js | Servidor inicializado, corriendo en el puerto ${port}`);
});

const winston = require('winston');
const path = require('path');
const { format } = winston;

const logDir = path.join(__dirname, '..', '..', 'log');

const customFormat = format.printf(({ level, message, timestamp }) => {
  const date = new Date(timestamp);
  const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
  return `[${level.toUpperCase()}]: ${message}`;
});

const getLogFileName = () => {
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.log`;
};

const logger = winston.createLogger({
  level: process.env.API_LOG_LEVEL || 'INFO',
  format: format.combine(format.timestamp(), customFormat),
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: path.join(logDir, getLogFileName()) })],
});

// Asegurarse de que la carpeta de logs exista
const fs = require('fs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

module.exports = logger;

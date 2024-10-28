const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true,
  },
  titulo: {
    type: String,
    required: true,
    trim: true,
  },
  mensaje: {
    type: String,
    required: true,
  },
  estado: {
    type: String,
    enum: ['pendiente', 'enviada', 'leida'],
    default: 'pendiente',
  },
  fechaEnvio: {
    type: Date,
    default: Date.now,
  },
  fechaLectura: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para actualizar updatedAt antes de cada actualización
notificationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);

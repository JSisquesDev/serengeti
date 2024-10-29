const User = require('../model/userSchema');
const Role = require('../model/roleSchema');
const redis = require('redis');

// Configuración del cliente de Redis
const redisClient = redis.createClient();
redisClient.on('error', err => {
  console.error('Error de Redis:', err);
});

/**
 * Obtiene todas las autenticaciones
 * @returns {Promise<Array>} - Lista de autenticaciones
 */
exports.getAllAuths = async () => {
  const cacheKey = 'all_auths';
  const cachedAuths = await redisClient.get(cacheKey);

  if (cachedAuths) {
    return JSON.parse(cachedAuths);
  }

  const auths = await User.find().populate('roles');
  redisClient.setex(cacheKey, 3600, JSON.stringify(auths)); // Cachea por 1 hora
  return auths;
};

/**
 * Obtiene una autenticación por ID
 * @param {string} id - ID de la autenticación
 * @returns {Promise<Object>} - Autenticación encontrada
 */
exports.getAuthById = async id => {
  const cacheKey = `auth_${id}`;
  const cachedAuth = await redisClient.get(cacheKey);

  if (cachedAuth) {
    return JSON.parse(cachedAuth);
  }

  const auth = await User.findById(id).populate('roles');
  if (auth) {
    redisClient.setex(cacheKey, 3600, JSON.stringify(auth)); // Cachea por 1 hora
  }
  return auth;
};

/**
 * Crea una nueva autenticación
 * @param {Object} authData - Datos de la autenticación
 * @returns {Promise<Object>} - Autenticación creada
 */
exports.createAuth = async authData => {
  const user = new User(authData);
  const createdAuth = await user.save();
  redisClient.del('all_auths'); // Elimina el cache de todas las autenticaciones
  return createdAuth;
};

/**
 * Actualiza una autenticación existente
 * @param {string} id - ID de la autenticación a actualizar
 * @param {Object} authData - Nuevos datos de la autenticación
 * @returns {Promise<Object>} - Autenticación actualizada
 */
exports.updateAuth = async (id, authData) => {
  const updatedAuth = await User.findByIdAndUpdate(id, authData, { new: true }).populate('roles');
  redisClient.del(`auth_${id}`); // Elimina el cache de la autenticación actualizada
  redisClient.del('all_auths'); // Elimina el cache de todas las autenticaciones
  return updatedAuth;
};

/**
 * Elimina una autenticación
 * @param {string} id - ID de la autenticación a eliminar
 * @returns {Promise<Object>} - Resultado de la eliminación
 */
exports.deleteAuth = async id => {
  const result = await User.findByIdAndDelete(id);
  redisClient.del(`auth_${id}`); // Elimina el cache de la autenticación eliminada
  redisClient.del('all_auths'); // Elimina el cache de todas las autenticaciones
  return result;
};

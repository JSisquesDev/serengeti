# Imagen base
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar archivo package.json
COPY package.json .

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos
COPY . .

# Exponer el puerto 3000
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]

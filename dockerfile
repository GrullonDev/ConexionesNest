# Utiliza una imagen de Node.js estable
FROM node:20-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración e instalación
COPY package.json yarn.lock ./

# Instala las dependencias
RUN yarn install

# Copia el resto del código fuente
COPY . .

# Copia el archivo de entorno de desarrollo
COPY .env .env

# Expone el puerto en el que correrá NestJS
EXPOSE 3000

# Comando para iniciar la app
CMD ["yarn", "start:dev"]
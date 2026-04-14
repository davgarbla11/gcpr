FROM node:current-alpine

WORKDIR /usr/src/app

# 1. Copiamos dependencias e instalamos (respetando tu configuración original)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# 2. Copiamos el resto de tu código
COPY . .

# 3. Exponemos el puerto de Astro
EXPOSE 4321

ENV HOST=0.0.0.0
ENV PORT=4321

# 4. LA MAGIA: Al arrancar el contenedor, compila el código y luego sirve la versión de producción
CMD sh -c "npm run build && npm run preview -- --host 0.0.0.0 --port 4321"
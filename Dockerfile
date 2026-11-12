# ---- Build: instala todo (incluidas devDependencies) y compila ----
FROM node:22-alpine AS build
RUN apk add --no-cache openssl
WORKDIR /app
COPY package.json package-lock.json ./
COPY extensions/pack-proteina-creatina/package.json extensions/pack-proteina-creatina/
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

# ---- Runtime: solo dependencias de producción ----
FROM node:22-alpine
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production
EXPOSE 3000
COPY package.json package-lock.json ./
COPY extensions/pack-proteina-creatina/package.json extensions/pack-proteina-creatina/
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/build ./build
COPY prisma ./prisma
CMD ["npm", "run", "docker-start"]

# --- Сборка фронтенда ---
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build-only

# --- Раздача статики через nginx ---
FROM nginx:alpine

ENV BACKEND_HOST=backend \
    BACKEND_PORT=8080

# Убираем дефолтную welcome-страницу образа nginx
RUN rm -f /etc/nginx/conf.d/default.conf

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

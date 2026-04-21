FROM node:20-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY angular.json tsconfig.json tsconfig.app.json tsconfig.spec.json ./
COPY public ./public
COPY src ./src
RUN npm run build:ci

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/portfolio-ferchuz/browser /usr/share/nginx/html

EXPOSE 80

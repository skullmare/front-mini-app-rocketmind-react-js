# Stage 1: build client bundle
FROM node:18-alpine AS client-builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY src ./src
COPY public ./public
COPY vite.config.js ./
COPY index.html ./

RUN npm run build

# Stage 2: install server dependencies
FROM node:18-alpine AS server-builder

WORKDIR /app

COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --omit=dev

COPY server ./server
COPY --from=client-builder /app/dist ./dist

# Stage 3: production runtime
FROM node:18-alpine

ENV NODE_ENV=production
ENV PORT=4000

WORKDIR /app/server

COPY --from=server-builder /app/server ./
COPY --from=server-builder /app/dist ../dist

EXPOSE 4000

CMD ["node", "src/index.js"]




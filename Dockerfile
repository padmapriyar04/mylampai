FROM node:18-alpine AS builder
RUN apk add --no-cache g++ make py3-pip libc6-compat ffmpeg
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production Stage
FROM node:18-alpine AS production
RUN apk add --no-cache libc6-compat ffmpeg
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app ./
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "start"]
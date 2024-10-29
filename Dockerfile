# Builder Stage
FROM node:18-alpine AS builder
RUN apk add --no-cache g++ make py3-pip libc6-compat ffmpeg
WORKDIR /app
COPY package*.json ./
RUN npm ci  # Install dependencies
COPY . .
RUN npm run build  # Build the Next.js app

# Production Stage
FROM node:18-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app ./
RUN npx prisma db push  # Sync Prisma schema with MongoDB
EXPOSE 3000
CMD ["npm", "run", "start"]

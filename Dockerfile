# Use an official Node.js image as a base
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Expose the port that the app will run on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "start"]
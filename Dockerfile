# Use an official Node runtime as the build image
FROM node:14 AS build-stage

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the current directory contents into the container
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:14 AS production-stage

# Set working directory
WORKDIR /app

# Copy the build folder and package files
COPY --from=build-stage /app/build/ /app/build/
COPY package*.json ./

# Install 'serve' package
RUN npm install serve

# Expose the web server port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]

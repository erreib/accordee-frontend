# Use an official Node runtime as a base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install any needed packages
RUN npm install

# Copy the current directory contents into the container
COPY . .

# Build the app
RUN npm run build

# Install serve for serving the application
RUN npm install -g serve

# Copy entrypoint script into the image
COPY entrypoint.sh /entrypoint.sh

# Make sure the script is executable
RUN chmod +x /entrypoint.sh

# Set the entry point
ENTRYPOINT ["/entrypoint.sh"]

# Make port 5000 available to the outside world
EXPOSE 5000

# Command to run the application using serve
CMD serve -s build -l $PORT

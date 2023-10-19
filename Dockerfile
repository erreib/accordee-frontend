# Use the official Node.js image as the base image
FROM node:16

# Set environment variables
ENV REACT_APP_BACKEND_URL=https://backend.accord.ee
ENV REACT_APP_GCP_BUCKET_URL=https://storage.cloud.google.com/accordee-media
ENV REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_cmF0aW9uYWwtc3BhbmllbC00NC5jbGVyay5hY2NvdW50cy5kZXYk

# Set the working directory in the container
WORKDIR /app

# Copy your app's source code to the container
COPY . /app

# Install dependencies and build your React app
RUN npm install
RUN npm run build

# Start your app
CMD ["npm", "start"]

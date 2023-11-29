# Build stage
FROM node:16 as build-stage

# Set environment variables
ENV VITE_BACKEND_URL=https://backend.accord.ee
ENV VITE_GCP_BUCKET_URL=https://storage.cloud.google.com/accordee-media

WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]

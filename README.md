
# Accordee Frontend

Accordee is a dynamic web application for creating and managing personalized dashboards. Built with React, leveraging React Three Fiber for 3D effects, and recently migrated to Vite for an optimized developer experience and faster build times.

## Features

- **Dynamic Dashboard Creation**: Users can create customizable dashboards.
- **Interactive 3D Elements**: Utilizing React Three Fiber for engaging UI components.
- **Live Dashboard Editing**: Real-time editing capabilities for dashboard customization.
- **Responsive Design**: Ensures a seamless experience across various devices and screen sizes.

## Technology Stack

- **Frontend**: React, React Three Fiber
- **Build Tool**: Vite
- **Backend**: Express.js (Accordee Backend)
- **Database**: Postgresql
- **Containerization**: Docker with Nginx for serving production builds

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- NPM
- Docker (for containerization and deployment)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://dev.eriksmedia.com/erreib/accordee-frontend
   ```

2. Install dependencies:
   ```bash
   cd accordee-frontend
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

### Building for Production

- Run the build script to create a production-ready build:
  ```bash
  npm run build
  ```

### Docker

- Build and run the Docker container:
  ```bash
  docker build -t accordee:latest .
  docker run -p 80:80 accordee:latest
  ```

## Configuration

- Environment variables:
  - `VITE_BACKEND_URL`: URL to the backend API.
  - `VITE_GCP_BUCKET_URL`: URL to the Google Cloud Platform bucket for media storage.

## Contributing

[Instructions for contributing, if applicable]

## License

[License information, if applicable]

Accordee Frontend © 2023 Accordee Team
# Videoflix Frontend

This is the frontend of the **Videoflix** application built with **Angular**. The frontend handles video previews, categories, user interfaces, and interacts with the Videoflix backend API. The project includes support for HLS video streaming using **video.js**.

## Table of Contents

1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [HLS Player Setup](#hls-player-setup)
5. [Development Server](#development-server)
6. [Build](#build)
7. [Deployment](#deployment)
8. [Folder Structure](#folder-structure)

## Requirements

Before starting, make sure you have the following software installed:

- **Node.js** version 12.0 or higher
- **Angular CLI** version 10.0 or higher
- **NPM** version 6.0 or higher

## Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

## Configuration

1. **Guest Login Configuration**: Update the `src/app/shared/config.ts` file with guest login credentials.

2. **Environment Settings**: Update the `src/environments/environments.ts` file with the appropriate `baseUrl` for API requests.

## HLS Player Setup

The project uses **video.js** for HLS video streaming. The necessary libraries are already included. Ensure the following:

1. Install the following dependencies if not already present:

   ```bash
   npm install video.js @videojs/http-streaming
   ```

2. Ensure that the required styles for `video.js` are included in `angular.json`:

   ```json
   "styles": [
     "src/styles.scss",
     "https://vjs.zencdn.net/8.16.1/video-js.css",
     "https://unpkg.com/@videojs/themes@1/dist/city/index.css"
   ]
   ```

## Development Server

To run the development server, use the following command:

   ```bash
   ng serve
   ```

Navigate to `http://localhost:4200/` in your browser. The app will automatically reload if you make any changes to the source files.

## Build

To build the project for production:

   ```bash
   ng build --prod
   ```

The production build will be stored in the `dist/` directory.

## Deployment

The build artifacts in the `dist/` directory can be deployed to any web server or cloud service for hosting.

## Folder Structure

   ```bash
   src/
   ├── app/
   ├── assets/
   ├── environments/
   ├── styles.scss
   └── index.html
   ├── config.ts
   ```

- **app/components/**: Angular components such as video preview, video categories, etc.
- **app/services/**: Services for handling API calls.
- **app/shared/**: Shared resources like the guest login configuration.
- **assets/**: Static files such as images and fonts.
- **environments/**: Environment-specific configurations.
- **styles.scss**: Global styles for the application.

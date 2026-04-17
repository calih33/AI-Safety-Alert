# AI-Safety-Alert: Campus Hazard Reporting

Team Members: Cali, Isaac, Daniel, and Justice

A full-stack application for reporting and managing campus safety hazards, integrated with an AI dispatcher.

## Tech Stack

- Frontend: React + Vite
- Backend: Laravel (PHP 8.2+)
- Database: SQLite (Physical file persistence)
- Deployment: Azure App Service (Backend) & Static Web Apps (Frontend)

## Local Development

Follow these physical steps to get the environment breathing on your local machine.

### Backend Setup

Bash

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate:refresh --seed
php artisan serve
```

### Frontend Setup

Bash

```bash
cd frontend
npm install
npm run dev
```

## Azure Deployment Configuration

The physical connection between the two services requires these exact environment variables.

### Backend App Service

Set these in Settings > Configuration:

- APP_KEY: Your generated Laravel key
- APP_URL: https://ai-safety-app-dxdbcyd7abg6d8cx.westus3-01.azurewebsites.net
- DB_CONNECTION: sqlite
- DB_DATABASE: /home/site/wwwroot/database/database.sqlite
- FRONTEND_URL: Your live Static Web App URL
- SANCTUM_STATEFUL_DOMAINS: Your frontend domain (no https)
- GITHUB_TOKEN: Required for the AI Dispatcher

### Frontend Static Web App

Set these in Settings > Environment variables:

- VITE_API_BASE_URL: https://ai-safety-app-dxdbcyd7abg6d8cx.westus3-01.azurewebsites.net/api

## Submission Checklist

- Source Code: Uploaded to D2L.
- Presentation Slides: Uploaded to D2L.
- Live Demo: Verified on Azure.
- Team: All members ready for the April 16th presentation.

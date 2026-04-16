

<h2>BACKEND LAUNCHING</h2> 

cd backend

composer install

cp .env.example .env

php artisan key:generate

touch database/database.sqlite

php artisan migrate:refresh --seed

php artisan serve

<h2>FRONTEND LAUNCHING</h2>

cd frontend

npm install

npm run dev

<h2>AZURE DEPLOYMENT</h2>

<p>Use these environment values when deploying:</p>

<ul>
<li><strong>Backend</strong>: APP_NAME, APP_ENV, APP_KEY, APP_DEBUG=false, APP_URL, DB_CONNECTION, DB_DATABASE, DB_HOST, DB_USERNAME, DB_PASSWORD, GITHUB_TOKEN, SANCTUM_STATEFUL_DOMAINS</li>
<li><strong>Frontend</strong>: VITE_API_BASE_URL=https://your-backend-domain/api</li>
</ul>

<p>Deployment flow:</p>

<ol>
<li>Deploy Laravel backend to Azure App Service.</li>
<li>Set the backend environment variables in Azure App Settings.</li>
<li>Deploy the Vite React frontend to Azure Static Web Apps or a second App Service.</li>
<li>Point <code>VITE_API_BASE_URL</code> at the live backend URL.</li>
<li>Verify login, ticket creation, ticket update, delete, and admin views in production.</li>
</ol>

<h2>SUBMISSION CHECKLIST</h2>

<ul>
<li>Source code uploaded to D2L.</li>
<li>Presentation slides uploaded to D2L.</li>
<li>Live demo working in Azure.</li>
<li>Team members prepared to present.</li>
</ul>

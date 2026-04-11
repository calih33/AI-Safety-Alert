

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

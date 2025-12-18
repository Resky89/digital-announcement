# Announcement API

REST API for managing announcements and assets. Public users can only read announcements and assets. Only the admin can log in (JWT) and manage data.

## Quick start

- Install dependencies
```
composer install
```
- Configure environment
```
cp .env.example .env
php artisan key:generate
```
- Set database connection in `.env` and optionally:
```
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```
- Migrate and seed (creates admin and sample users)
```
php artisan migrate --seed
```
- Run server
```
php artisan serve
```

## Authentication (Admin only)
- POST `/api/auth/login`
```
{
  "email": "admin@example.com",
  "password": "admin123"
}
```
Response contains `access_token` and `refresh_token`.
- POST `/api/auth/refresh` with `Authorization: Bearer <refresh_token>`
- GET `/api/auth/me` with `Authorization: Bearer <access_token>`
- POST `/api/auth/logout` with `Authorization: Bearer <access_token>`

Only the user with email equal to `ADMIN_EMAIL` can log in.

## Public Endpoints (no auth)
- GET `/api/public/announcements`
- GET `/api/public/announcements/{announcement}`
- GET `/api/public/assets/{asset}`
- GET `/api/public/assets/{asset}/stream`

## Admin Endpoints (JWT Bearer)
- Announcements
  - POST `/api/admin/announcements`
  - PUT `/api/admin/announcements/{announcement}`
  - PATCH `/api/admin/announcements/{announcement}`
  - DELETE `/api/admin/announcements/{announcement}`
- Assets
  - POST `/api/admin/assets`
  - DELETE `/api/admin/assets/{asset}`
- Users (no role fields)
  - GET `/api/admin/users`
  - GET `/api/admin/users/{user}`
  - POST `/api/admin/users`
  - PATCH `/api/admin/users/{user}`
  - DELETE `/api/admin/users/{user}`

## Postman
Import `docs/Announcement-API.postman_collection.json`. Set collection variable `baseUrl` (default `http://localhost:8000`).

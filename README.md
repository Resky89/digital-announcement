# Digital Announcement System

Sistem Digital Announcement adalah aplikasi berbasis web untuk mengelola dan menampilkan pengumuman digital dengan dukungan multimedia (gambar dan video). Sistem ini terdiri dari 4 komponen utama yang saling terintegrasi menggunakan Docker.

## 📋 Daftar Isi

- [Arsitektur Sistem](#-arsitektur-sistem)
- [Teknologi](#-teknologi)
- [Struktur Project](#-struktur-project)
- [API Endpoints](#-api-endpoints)
- [Cara Penggunaan](#-cara-penggunaan)
- [Docker Configuration](#-docker-configuration)
- [Troubleshooting](#-troubleshooting)

---

## 🏗️ Arsitektur Sistem

Sistem ini menggunakan arsitektur **Microservices** dengan 4 service utama:

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  announcement-  │◄────►│  announcement-  │◄────►│  announcement-  │
│      ui         │      │      api        │      │     asset       │
│   (Frontend)    │      │   (Backend)     │      │  (File Server)  │
│                 │      │                 │      │                 │
└─────────────────┘      └────────┬────────┘      └─────────────────┘
                                  │
                                  │
                         ┌────────▼────────┐
                         │                 │
                         │    database     │
                         │  (MySQL +       |
                         │ PHPMyAdmin)     │
                         │                 │
                         └─────────────────┘
```

### Penjelasan Komponen:

1. **announcement-ui** (Port 80)
   - Frontend aplikasi menggunakan Next.js
   - Menampilkan pengumuman ke publik
   - Panel admin untuk kelola konten

2. **announcement-api** (Port 8000)
   - Backend REST API menggunakan Laravel 12
   - Autentikasi JWT
   - CRUD operations untuk announcements, assets, users

3. **announcement-asset** (Port 8081)
   - Static file server untuk gambar dan video
   - Menggunakan Nginx
   - Shared volume dengan announcement-api

4. **database** (Port 3306)
   - MySQL 8.0 database
   - PHPMyAdmin (Port 8080) untuk management
   - Persistent storage

---

## 🛠️ Teknologi

### Backend (announcement-api)
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| PHP | 8.2+ | Runtime environment |
| Laravel | 12.0 | Framework backend |
| JWT Auth | 2.2 | Autentikasi & Authorization |
| MySQL | 8.0 | Database |
| Nginx | Stable Alpine | Web server |
| PHP-FPM | - | Process manager |

**Dependensi Utama:**
- `php-open-source-saver/jwt-auth` - JSON Web Token authentication
- `laravel/tinker` - Interactive shell

### Frontend (announcement-ui)
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| Next.js | 16.0.10 | React framework |
| React | 19.2.1 | UI library |
| TypeScript | 5.x | Type-safe JavaScript |
| TailwindCSS | 4.x | Styling framework |
| Zustand | 5.0.9 | State management |
| Axios | 1.13.2 | HTTP client |

**UI Components:**
- Radix UI (Dialog, Dropdown, Toast, Avatar)
- Lucide React (Icons)
- clsx (Conditional classnames)

### Infrastructure
- **Docker** & **Docker Compose** - Container orchestration
- **Nginx** - Reverse proxy & static file server
- **PHPMyAdmin** - Database management

---

## 📁 Struktur Project

```
Digital-Announcement/
│
├── announcement-api/          # Laravel Backend API
│   ├── app/                   # Application logic
│   │   ├── Http/Controllers/API/
│   │   │   ├── AuthController.php
│   │   │   ├── AnnouncementController.php
│   │   │   ├── AssetController.php
│   │   │   └── UserController.php
│   │   ├── Models/
│   │   └── Middleware/
│   ├── routes/
│   │   └── api.php            # API routes definition
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── public/
│   │   └── docs/
│   │       └── openapi.yaml   # API Documentation
│   ├── .env.example
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── nginx.conf
│
├── announcement-ui/           # Next.js Frontend
│   ├── src/
│   │   ├── app/               # App router pages
│   │   ├── components/        # React components
│   │   ├── lib/               # Utilities & API client
│   │   └── types/             # TypeScript types
│   ├── public/                # Static assets
│   ├── .env
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── nginx/
│       └── default.conf
│
├── announcement-asset/        # Static File Server
│   ├── images/                # Image storage
│   ├── videos/                # Video storage
│   ├── nginx.conf
│   └── docker-compose.yml
│
└── database/                  # Database Service
    └── docker-compose.yml
```

---

## 🔌 API Endpoints

Base URL: `http://localhost:8000`

Swagger Documentation: `http://localhost:8002`

### 🔓 Public Endpoints

#### Announcements
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/public/announcements` | List semua pengumuman |
| GET | `/api/public/announcements/{id}` | Detail pengumuman |

#### Assets
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/public/assets/{id}` | Metadata asset |
| GET | `/api/public/assets/{id}/stream` | Stream/download file |

### 🔐 Authentication

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/login` | Login (email + password) |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout (invalidate token) |
| GET | `/api/auth/me` | User info saat ini |

**Login Request:**
```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

**Login Response:**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "csrf_token": "i2c0c0a..."
}
```

### 🔒 Admin Endpoints (Requires JWT)

Semua endpoint admin memerlukan header:
```
Authorization: Bearer {access_token}
```

#### Announcements
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/admin/announcements` | Buat pengumuman baru |
| PUT/PATCH | `/api/admin/announcements/{id}` | Update pengumuman |
| DELETE | `/api/admin/announcements/{id}` | Hapus pengumuman |

#### Assets
| Method | Endpoint | Deskripsi | Query Params |
|--------|----------|-----------|--------------|
| GET | `/api/admin/assets` | List assets | `per_page`, `search`, `announcement_id` |
| POST | `/api/admin/assets` | Upload asset (multipart/form-data) | - |
| PUT/PATCH | `/api/admin/assets/{id}` | Update asset | - |
| DELETE | `/api/admin/assets/{id}` | Hapus asset | - |

**Upload Asset:**
- Max size: 5MB (images), 10MB (videos)
- Allowed images: jpg, jpeg, png, gif, svg
- Allowed videos: mp4, mov, avi, mkv, webm, mpeg, mpg

#### Users
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/admin/users` | List users (paginated) |
| GET | `/api/admin/users/{id}` | Detail user |
| POST | `/api/admin/users` | Buat user baru |
| PUT/PATCH | `/api/admin/users/{id}` | Update user |
| DELETE | `/api/admin/users/{id}` | Hapus user |

---

## 🚀 Cara Penggunaan

### Prerequisites
- Docker & Docker Compose terinstall
- Port available: 80, 3306, 8000, 8002, 8080, 8081
- Git

### 1️⃣ Clone Repository
```bash
git clone <repository-url>
cd Digital-Announcement
```

### 2️⃣ Setup Environment Variables

#### Backend (.env)
```bash
cd announcement-api
cp .env.example .env
```

Edit file `.env` sesuai kebutuhan:
```env
APP_NAME=AnnouncementAPI
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=announcement_db
DB_USERNAME=announcement_user
DB_PASSWORD=user123

JWT_SECRET=your_jwt_secret_key_here
```

#### Frontend (.env)
```bash
cd ../announcement-ui
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env
```

### 3️⃣ Create Docker Network
```bash
docker network create digital_net
```

### 4️⃣ Start Services

#### A. Start Database (wajib pertama kali)
```bash
cd database
docker-compose up -d
```

Tunggu hingga MySQL siap (±30 detik), cek dengan:
```bash
docker logs announcement-mysql
```

#### B. Start Backend API
```bash
cd ../announcement-api
docker-compose up -d
```

#### C. Run Migrations & Seeders (pertama kali)
```bash
# Generate application key
docker exec announcement-api-app php artisan key:generate

# Generate JWT secret
docker exec announcement-api-app php artisan jwt:secret

# Run migrations
docker exec announcement-api-app php artisan migrate

# (Optional) Seed data dummy
docker exec announcement-api-app php artisan db:seed
```

#### D. Start Asset Server
```bash
cd ../announcement-asset
docker-compose up -d
```

#### E. Start Frontend
```bash
cd ../announcement-ui
docker-compose up -d
```

### 5️⃣ Verify Services

| Service | URL | Status Check |
|---------|-----|--------------|
| Frontend | http://localhost | Browser |
| Backend API | http://localhost:8000 | `curl http://localhost:8000/health` |
| Swagger Docs | http://localhost:8002 | Browser |
| Asset Server | http://localhost:8081 | Browser |
| PHPMyAdmin | http://localhost:8080 | Browser (root/root) |

### 6️⃣ Login ke Admin Panel

Default credentials (jika menggunakan seeder):
```
Email: admin@example.com
Password: admin123
```

---

## 🐳 Docker Configuration

### Network
Semua services menggunakan shared network `digital_net` untuk komunikasi internal.

```bash
# Create network
docker network create digital_net

# List networks
docker network ls

# Inspect network
docker network inspect digital_net
```

### Volumes

#### Database
```yaml
volumes:
  mysql_data:/var/lib/mysql  # Persistent MySQL data
```

#### API & Assets (Shared Volume)
```yaml
volumes:
  - ../announcement-asset:/var/www/html/public/assets
```

### Ports Mapping

| Container | Internal Port | External Port |
|-----------|---------------|---------------|
| announcement-ui (Nginx) | 80 | 80 |
| announcement-api (Nginx) | 80 | 8000 |
| announcement-api-swagger | 8080 | 8002 |
| announcement-mysql | 3306 | 3306 |
| announcement-phpmyadmin | 80 | 8080 |
| announcement-asset | 80 | 8081 |

### Useful Docker Commands

```bash
# View logs
docker logs -f <container-name>

# View all containers
docker ps -a

# Stop all services
docker-compose down

# Stop with volume removal
docker-compose down -v

# Rebuild containers
docker-compose up -d --build

# Execute command in container
docker exec -it <container-name> bash

# View container stats
docker stats
```

---

## 🔧 Troubleshooting

### 1. Port Already in Use

**Error:**
```
Error starting userland proxy: listen tcp4 0.0.0.0:80: bind: address already in use
```

**Solusi:**
```bash
# Windows - Cek port yang digunakan
netstat -ano | findstr :80

# Kill proses
taskkill /PID <PID> /F

# Atau ubah port di docker-compose.yml
ports:
  - "8080:80"  # Ubah dari 80 ke 8080
```

### 2. Network 'digital_net' not found

**Error:**
```
ERROR: Network digital_net declared as external, but could not be found
```

**Solusi:**
```bash
docker network create digital_net
```

### 3. MySQL Connection Refused

**Error:**
```
SQLSTATE[HY000] [2002] Connection refused
```

**Solusi:**
```bash
# 1. Pastikan MySQL sudah running
docker ps | grep mysql

# 2. Tunggu MySQL ready
docker logs announcement-mysql

# 3. Cek connection dari API container
docker exec announcement-api-app php artisan tinker
>>> DB::connection()->getPdo();

# 4. Restart API container
docker-compose restart app
```

### 4. Permission Denied (Storage/Cache)

**Error:**
```
The stream or file "/var/www/html/storage/logs/laravel.log" could not be opened: failed to open stream: Permission denied
```

**Solusi:**
```bash
# Masuk ke container
docker exec -it announcement-api-app bash

# Set permission
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### 5. JWT Secret Not Set

**Error:**
```
The JWT secret has not been set
```

**Solusi:**
```bash
docker exec announcement-api-app php artisan jwt:secret
```

### 6. CORS Error di Frontend

**Error:**
```
Access to XMLHttpRequest at 'http://localhost:8000/api' blocked by CORS policy
```

**Solusi:**
Edit `announcement-api/config/cors.php`:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost', 'http://localhost:3000'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

### 7. Asset Upload Failed

**Error:**
```
The file could not be uploaded
```

**Solusi:**
```bash
# 1. Cek volume mounting
docker inspect announcement-api-app | grep Mounts -A 20

# 2. Cek permission di announcement-asset
cd announcement-asset
chmod -R 775 images videos

# 3. Pastikan direktori ada
mkdir -p images videos
```

### 8. Frontend Can't Connect to API

**Solusi:**
```bash
# 1. Cek .env frontend
cat announcement-ui/.env
# Should have: NEXT_PUBLIC_API_URL=http://localhost:8000

# 2. Rebuild frontend container
cd announcement-ui
docker-compose down
docker-compose up -d --build

# 3. Cek network connectivity
docker exec announcement-ui ping announcement-api-nginx
```

### 9. Docker Build Failed

**Error:**
```
failed to solve with frontend dockerfile.v0
```

**Solusi:**
```bash
# Clear Docker cache
docker builder prune -a

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up -d
```

### 10. Database Migration Failed

**Solusi:**
```bash
# 1. Drop all tables & re-migrate
docker exec announcement-api-app php artisan migrate:fresh

# 2. With seeder
docker exec announcement-api-app php artisan migrate:fresh --seed

# 3. Rollback specific migration
docker exec announcement-api-app php artisan migrate:rollback --step=1
```

---

## 📝 Development Workflow

### Menambah Fitur Baru

1. **Backend:**
   ```bash
   # Create controller
   docker exec announcement-api-app php artisan make:controller API/NewController
   
   # Create model & migration
   docker exec announcement-api-app php artisan make:model NewModel -m
   
   # Run migration
   docker exec announcement-api-app php artisan migrate
   ```

2. **Frontend:**
   - Edit files di `announcement-ui/src/`
   - Hot reload otomatis aktif (dev mode)
   - Production: rebuild container

### Testing API dengan Curl

```bash
# Health check
curl http://localhost:8000/health

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Get announcements (public)
curl http://localhost:8000/api/public/announcements

# Create announcement (admin)
curl -X POST http://localhost:8000/api/admin/announcements \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Content test"}'
```

---

## 📚 Resources

- [Laravel Documentation](https://laravel.com/docs/12.x)
- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com/)
- [JWT Auth Package](https://jwt-auth.readthedocs.io/)
- [OpenAPI Specification](http://localhost:8002) (when running)

---

## 👥 Contributors

- Development Team

## 📄 License

Private Project

---

**Last Updated:** 2026-01-03

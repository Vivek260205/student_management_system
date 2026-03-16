# Student Management SaaS Platform

A production-ready Student Management System built with Spring Boot backend and React frontend, containerized with Docker.

## 🚀 Quick Start (Production)

### Prerequisites
- Docker & Docker Compose
- At least 2GB RAM available

### Run Production Stack

```bash
# Clone repository
git clone <repository-url>
cd student-management-system

# Start all services
docker-compose up --build -d

# View logs
docker-compose logs -f
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **MySQL Database**: localhost:3306

### Default Admin Credentials
- **Username**: `admin`
- **Password**: `adminpass`

## 🏗️ Architecture

### Services
- **MySQL 8**: Database with persistent storage
- **Backend**: Spring Boot API server (Java 17)
- **Frontend**: React + Vite served by Nginx

### Ports
- Frontend: `3000` → Nginx `80`
- Backend: `8080` → Spring Boot `8080`
- Database: `3306` → MySQL `3306`

## 🔧 Configuration

### Environment Variables (.env)
```env
# Database
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=student_db

# JWT Security
JWT_SECRET=your-super-secret-jwt-key-here

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Production Features
- ✅ Spring Boot production profile
- ✅ MySQL database with health checks
- ✅ CORS configuration for frontend
- ✅ JWT authentication with secure secrets
- ✅ Nginx reverse proxy for API calls
- ✅ Docker health checks and restart policies
- ✅ Persistent database volumes

## 🛠️ Development Setup

### Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

### Database (Local MySQL)
```sql
CREATE DATABASE student_db;
-- Configure connection in application.yml
```

## 📁 Project Structure

```
├── backend/                 # Spring Boot application
│   ├── Dockerfile          # Multi-stage build
│   ├── pom.xml            # Maven dependencies
│   └── src/
│       ├── main/java/com/example/sms/
│       │   ├── controller/    # REST controllers
│       │   ├── entity/        # JPA entities
│       │   ├── repository/    # Data repositories
│       │   ├── security/      # JWT & Spring Security
│       │   └── config/        # Application config
│       └── main/resources/
│           ├── application.yml # App configuration
│           └── db/migration/   # Flyway migrations
├── frontend/               # React application
│   ├── Dockerfile          # Build & Nginx serve
│   ├── nginx.conf          # Nginx configuration
│   ├── package.json        # Dependencies
│   └── src/
│       ├── components/     # Reusable components
│       ├── pages/          # Page components
│       ├── hooks/          # Custom hooks
│       └── api/            # API client
├── docker-compose.yml      # Production orchestration
├── .env                    # Environment variables
└── README.md
```

## 🔒 Security Features

- JWT-based authentication
- Password encryption (BCrypt)
- CORS protection
- SQL injection prevention
- XSS protection headers
- Content Security Policy

## 📊 Features

- **Dashboard**: Analytics with charts (Recharts)
- **Student Management**: CRUD operations with search
- **Attendance System**: Daily marking with bulk operations
- **Reports**: PDF/CSV export capabilities
- **AI Insights**: Smart attendance analytics
- **Dark/Light Mode**: Theme switching
- **Responsive Design**: Mobile-friendly UI
- **Toast Notifications**: User feedback system

## 🐳 Docker Commands

```bash
# Build and start
docker-compose up --build -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Rebuild specific service
docker-compose up --build -d [service-name]

# Clean up
docker-compose down -v --remove-orphans
```

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Students
- `GET /api/students` - List all students
- `POST /api/students` - Create student
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student

### Attendance
- `GET /api/attendance` - Get attendance for date
- `POST /api/attendance` - Submit attendance
- `GET /api/attendance/stats` - Attendance statistics
- `GET /api/attendance/daily` - Daily attendance data
- `GET /api/attendance/percentages` - Student attendance percentages

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📝 License

This project is licensed under the MIT License.

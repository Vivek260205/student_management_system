# Installation Guide - Premium Student Management System

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Quick Start with Docker](#quick-start-with-docker)
3. [Manual Installation](#manual-installation)
4. [Configuration](#configuration)
5. [Troubleshooting](#troubleshooting)
6. [Verification](#verification)

---

## System Requirements

### Minimum Requirements
- **CPU**: 2+ cores
- **RAM**: 4GB minimum (8GB recommended)
- **Disk Space**: 10GB free space
- **OS**: Linux, macOS, or Windows

### Software Requirements

| Component | Version | Required |
|-----------|---------|----------|
| Docker | 20.10+ | Yes |
| Docker Compose | 2.0+ | Yes |
| Java | 17+ | For manual setup |
| Node.js | 16+ | For manual setup |
| Maven | 3.8+ | For manual setup |
| npm | 8+ | For manual setup |

---

## Quick Start with Docker (Recommended)

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/student-management-system.git
cd student-management-system
```

### Step 2: Build and Start Services
```bash
docker-compose up --build
```

Wait for all services to be ready (approximately 30-60 seconds).

### Step 3: Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: localhost:3306

### Step 4: Login
```
Username: admin
Password: adminpass
```

### Useful Docker Commands
```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View running containers
docker-compose ps

# Clear all data (destructive)
docker-compose down -v
```

---

## Manual Installation

### Backend Setup

#### 1. Prerequisites
```bash
# Verify Java installation
java -version
# Expected: Java 17 or higher

# Verify Maven installation
mvn -version
# Expected: Maven 3.8 or higher
```

#### 2. Build Backend
```bash
cd backend
mvn clean install
```

This will:
- Download all dependencies
- Compile Java code
- Run tests
- Package the application

**Time to complete**: 3-5 minutes on first run

#### 3. Configure Backend

Edit `backend/src/main/resources/application.yml`:

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/student_management
    username: root
    password: root
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
  
  application:
    name: student-management-backend

jwt:
  secret: your-super-secret-jwt-key-change-this-in-production-at-least-32-characters
  expirationMs: 86400000  # 24 hours
```

#### 4. Start Backend
```bash
cd backend
mvn spring-boot:run
```

Expected output:
```
Started StudentManagementApplication in X.XXX seconds
```

---

### Frontend Setup

#### 1. Prerequisites
```bash
# Verify Node.js installation
node -version
# Expected: v16.0.0 or higher

# Verify npm installation
npm -version
# Expected: 8.0.0 or higher
```

#### 2. Install Dependencies
```bash
cd frontend
npm install
```

**Time to complete**: 1-2 minutes

#### 3. Configure Frontend

Edit `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:8080/api
VITE_JWT_KEY=token
```

#### 4. Start Development Server
```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v5.2.0  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

---

### Database Setup

#### Option 1: Docker Container
```bash
docker run -d \
  --name mysql-sms \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=student_management \
  -p 3306:3306 \
  -v mysql_data:/var/lib/mysql \
  mysql:8.0
```

#### Option 2: Local MySQL Installation

**macOS (Homebrew)**
```bash
brew install mysql
brew services start mysql
mysql -u root -e "CREATE DATABASE student_management;"
```

**Ubuntu/Debian**
```bash
sudo apt-get install mysql-server
sudo systemctl start mysql
mysql -u root -p -e "CREATE DATABASE student_management;"
```

**Windows**
- Download MySQL from https://dev.mysql.com/downloads/mysql/
- Run installer
- Create database via MySQL Workbench

**Verify Connection**
```bash
mysql -u root -p -h localhost -e "SELECT VERSION();"
```

---

## Configuration

### Environment Variables

#### Backend - application.yml
```yaml
# Database Configuration
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/student_management
    username: root
    password: root

# JWT Configuration  
jwt:
  secret: ${JWT_SECRET:your-secret-key-min-32-chars}
  expirationMs: ${JWT_EXPIRATION:86400000}

# Server Port
server:
  port: ${SERVER_PORT:8080}
```

#### Frontend - .env / .env.local
```bash
# API Base URL
VITE_API_URL=http://localhost:8080/api

# JWT Storage Key
VITE_JWT_KEY=token

# Enable Debug Mode
VITE_DEBUG=false
```

### JWT Secret Generation
```bash
# Generate a secure random key
openssl rand -base64 32

# Linux/macOS: Alternative
echo $(openssl rand -hex 32)
```

---

## Verification

### Backend Verification
```bash
# Check Docker container status
docker-compose ps

# View backend logs
docker-compose logs backend

# Test API endpoint
curl http://localhost:8080/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"adminpass"}'

# Expected response:
# {"token":"eyJ..."}
```

### Frontend Verification
```bash
# Check if frontend is accessible
curl http://localhost:3000

# Or open in browser
open http://localhost:3000
```

### Database Verification
```bash
# Connect to database
mysql -u root -p student_management

# Show tables
SHOW TABLES;

# Check initial data
SELECT * FROM users LIMIT 1;
```

---

## Troubleshooting

### Docker Issues

**Issue**: "Port 3000 already in use"
```bash
# Find process using port 3000
lsof -i :3000

# Or change port in docker-compose.yml
ports:
  - "3001:3000"  # Change to 3001
```

**Issue**: "Cannot connect to MySQL"
```bash
# Check MySQL container status
docker-compose ps

# Check MySQL logs
docker-compose logs mysql

# Verify port 3306 is exposed
docker ps | grep mysql
```

**Issue**: "Image build failed"
```bash
# Clear Docker cache
docker-compose down
docker system prune -a

# Rebuild
docker-compose up --build
```

### Backend Issues

**Issue**: "Failed to connect to database"
```bash
# Verify MySQL is running
ps aux | grep mysql

# Test connection
mysql -u root -p -h localhost -e "SELECT 1;"

# Check application.yml configuration
cat backend/src/main/resources/application.yml
```

**Issue**: "Port 8080 already in use"
```bash
# Change port in application.yml
server:
  port: 8081
```

**Issue**: "Build fails with dependency error"
```bash
# Clear Maven cache
rm -rf ~/.m2/repository

# Rebuild
mvn clean install
```

### Frontend Issues

**Issue**: "npm install fails"
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules

# Reinstall
npm install
```

**Issue**: "Cannot connect to backend API"
```bash
# Verify VITE_API_URL in .env.local
cat frontend/.env.local

# Check backend is running
curl http://localhost:8080/api/students
```

**Issue**: "Port 5173 already in use"
```bash
# Change port in vite.config.js
export default {
  server: {
    port: 5174
  }
}
```

### Common Errors

#### "ComException: Cannot run program mvn"
```bash
# Install Maven
brew install maven  # macOS
sudo apt-get install maven  # Ubuntu

# Verify installation
mvn -version
```

#### "npm ERR! code ERESOLVE"
```bash
# Use legacy peer deps
npm install --legacy-peer-deps

# Or upgrade npm
npm install -g npm@latest
```

#### "MySQL access denied"
```bash
# Verify credentials in application.yml
# Default: root/root

# Reset MySQL password if needed
mysql -u root -p -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';"
```

---

## Development Workflow

### Local Development with Hot Reload

**Terminal 1 - Backend**
```bash
cd backend
mvn spring-boot:run
```

**Terminal 2 - Frontend**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Database (Optional)**
```bash
# If not using Docker
mysql -u root -p student_management
```

### Code Changes
- Backend changes automatically reload with spring-boot-devtools
- Frontend changes automatically reload with Vite HMR

### Database Migrations
```bash
# Migrations are handled automatically by Flyway
# To add new migrations:
# 1. Create file: backend/src/main/resources/db/migration/V{next}__{description}.sql
# 2. Restart backend
```

---

## Production Deployment

### Environment Setup
```bash
# Create .env file with production values
JWT_SECRET=$(openssl rand -hex 32)
JWT_EXPIRATION=2592000000  # 30 days

# Database
MYSQL_ROOT_PASSWORD=secure_password_here
MYSQL_DATABASE=student_management_prod
```

### Build for Production

**Backend**
```bash
cd backend
mvn clean package -DskipTests
java -jar target/student-management-backend-*.jar
```

**Frontend**
```bash
cd frontend
npm run build
npm run preview  # Test build locally
```

### Docker Production Build
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## Performance Tuning

### Database Optimization
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_student_course ON students(course);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_user_username ON users(username);
```

### Backend Optimization
```yaml
# application.yml
spring:
  jpa:
    properties:
      hibernate:
        jdbc:
          batch_size: 20
          fetch_size: 50
        order_inserts: true
        order_updates: true
```

### Frontend Optimization
```json
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'charts': ['recharts'],
          'animations': ['framer-motion']
        }
      }
    },
    minify: 'terser',
    target: 'es2020'
  }
}
```

---

## Backup & Recovery

### Database Backup
```bash
# Docker backup
docker-compose exec mysql mysqldump -u root -p school_db > backup.sql

# Restore from backup
docker-compose exec -T mysql mysql -u root -p < backup.sql
```

### Data Export
```bash
# Export students to CSV
SELECT * FROM students INTO OUTFILE '/tmp/students.csv'
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n';
```

---

## Support

### Documentation
- [Premium Features](./PREMIUM_FEATURES.md)
- [API Documentation](./API_DOCS.md)
- [Architecture Guide](./ARCHITECTURE.md)

### Getting Help
1. Check [Troubleshooting](#troubleshooting) section
2. Review GitHub Issues
3. Check documentation
4. Contact support team

---

## Next Steps

After successful installation:

1. ✅ Login with default credentials
2. ✅ Create additional users (ADMIN, TEACHER, STUDENT)
3. ✅ Add students and courses
4. ✅ Test attendance marking
5. ✅ Generate reports
6. ✅ Explore premium features

---

**Installation Guide Version**: 2.0  
**Last Updated**: March 2026  
**Status**: ✅ Current

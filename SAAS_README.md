# 🚀 Premium Student Management System - SaaS Edition

> A comprehensive, production-ready student management platform built with Spring Boot, React, and modern SaaS architecture.

![Premium Dashboard](https://img.shields.io/badge/Status-Production%20Ready-success) ![License](https://img.shields.io/badge/License-MIT-blue) ![Version](https://img.shields.io/badge/Version-2.0%20Premium-blueviolet)

## ✨ Premium Features

### 📊 Advanced Admin Dashboard
- **Real-time Statistics**: Student count, teacher count, attendance, pending assignments
- **Professional Charts**: 
  - Area chart for weekly attendance trends
  - Bar chart for monthly attendance
  - Pie chart for course distribution
- **Performance Metrics**: Average score, performance distribution, trends
- **Beautiful UI**: Glassmorphism design, smooth animations, responsive layout

### 📁 Bulk Excel Import
- Upload Excel files (.xlsx) to import students in bulk
- Auto-validation with detailed error reporting
- Progress tracking and success/failure summary
- Template download for easy reference

### 📄 PDF Report Generation
- **Attendance Reports**: Individual student attendance with breakdown
- **Performance Reports**: Student scores, metrics, and classifications
- **Monthly Summary**: School-wide statistics and trends
- Professional formatting with tables and gradients

### 🔍 Advanced Search & Filters
- Real-time search by name, email, ID
- Multi-filter support (course, attendance range)
- Quick-select performance levels
- Instant results with clear filter status

### 🌙 Dark Mode UI
- System-wide dark mode toggle
- Optimized for eye comfort
- Persisted user preference
- All components support both themes

### 👥 Role-Based Dashboards
- **Admin Dashboard**: Full system overview and management
- **Teacher Dashboard**: Class management and submissions
- **Student Dashboard**: Personal profile and progress tracking

### 📈 Performance Analytics
Intelligent scoring formula:
```
Performance Score = (Attendance × 0.7) + (Assignments × 0.3)
```
- Excellent: 85-100%
- Good: 70-84%
- Average: 55-69%
- Poor: <55%

### 🎨 Premium UI Design
- Glassmorphism effects with frosted glass appearance
- Smooth animations and micro-interactions
- Gradient color scheme (Blue, Emerald, Purple, Orange)
- Loading skeletons and state indicators
- Fully responsive across all devices

## 🏗️ Architecture

```
                    ┌─────────────────┐
                    │   React Frontend │
                    │ (Vite + Tailwind)│
                    └────────┬─────────┘
                             │ HTTP/REST
                    ┌────────▼─────────┐
                    │  Spring Boot API │
                    │   (Java 17)      │
                    └────────┬─────────┘
                             │ SQL
                    ┌────────▼─────────┐
                    │ MySQL Database   │
                    │ (Docker)         │
                    └──────────────────┘
```

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.1.6
- **Language**: Java 17
- **Database**: MySQL 8.0
- **Authentication**: JWT (JSON Web Tokens)
- **Excel Processing**: Apache POI 5.2.3
- **Database Migration**: Flyway

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.2.0
- **Styling**: Tailwind CSS 3.4.7
- **Charts**: Recharts 3.8.0
- **Animations**: Framer Motion 12.36.0
- **PDF Generation**: jsPDF 4.2.0
- **Icons**: Lucide React 0.577.0

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **DBMS**: MySQL in Docker

## 🚀 Quick Start

### Using Docker Compose (Recommended)
```bash
# Clone the repository
git clone https://github.com/yourusername/student-management-system.git
cd student-management-system

# Build and start services
docker-compose up --build

# Application will be available at:
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
```

### Manual Setup

#### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
# Runs on http://localhost:8080
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

#### Database
```bash
docker run -d \
  --name mysql-sms \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=student_management \
  -p 3306:3306 \
  mysql:8.0
```

## 📝 Default Credentials

```
Username: admin
Password: adminpass
Role: ADMIN
```

## 📚 API Documentation

### Analytics Endpoints
```
GET  /api/analytics/dashboard-stats      # Get dashboard statistics
GET  /api/analytics/weekly-attendance    # Weekly attendance data
GET  /api/analytics/monthly-attendance   # Monthly attendance data
GET  /api/analytics/student-performance  # Student performance metrics
GET  /api/analytics/course-distribution  # Course distribution stats
```

### Import Endpoints
```
POST /api/import/students/excel         # Bulk import students from Excel
```

### Report Endpoints
```
GET  /api/reports/attendance/{studentId} # Generate attendance report
GET  /api/reports/performance/{studentId}# Generate performance report
GET  /api/reports/monthly               # Generate monthly summary
```

## 🎯 Key Features Deep Dive

### 1. Dashboard Statistics
Real-time tracking of:
- Total students and teachers
- Present/absent today
- Pending assignments
- Average performance score

### 2. attendance Tracking
- Daily attendance records
- Weekly and monthly trends
- Attendance percentage calculation
- Visual attendance charts

### 3. Assignment Management
- Assignment creation and tracking
- Submission tracking
- Submission deadline notifications
- Grade management

### 4. Course Management
- Multiple courses support
- Course-student mapping
- Subject management
- Course-wise analytics

## 🎨 UI/UX Highlights

### Glassmomorphism Design
Premium frosted glass effect on all cards with:
- Semi-transparent backgrounds
- Subtle border highlights
- Backdrop blur effects
- Smooth hover transitions

### Animations & Transitions
- Page entrance animations (Framer Motion)
- Staggered list animations
- Icon hover effects
- Loading state skeletons
- Button ripple effects

### Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop-enhanced features
- Touch-friendly interface

## 📊 Dashboard Screenshots Overview

1. **Premium Dashboard**
   - 4 stat cards with trends
   - Weekly and monthly attendance charts
   - Course distribution pie chart
   - Performance score overview

2. **Students Management**
   - Advanced search with filters
   - Bulk import capability
   - Student profile cards
   - Action buttons (Edit, Delete, Reports)

3. **Attendance Tracking**
   - Attendance calendar
   - Mark attendance interface
   - Attendance history
   - Attendance reports

4. **Reports Section**
   - Generate PDF reports
   - View attendance history
   - Performance analytics
   - Export data

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Protected API endpoints
- Secure password hashing (BCrypt)
- CSRF protection
- Input validation and sanitization

## 📈 Performance Optimization

- Code splitting and lazy loading
- Image optimization
- Caching strategies
- Database query optimization
- API response compression
- CDN-ready static assets

## 🧪 Testing

```bash
# Backend tests
cd backend
mvn test

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Docker Production Build
```bash
# Build production images
docker-compose -f docker-compose.yml build

# Deploy to production
docker-compose -f docker-compose.yml up -d

# View logs
docker-compose logs -f
```

### Environment Variables
Create `.env` file:
```
MYSQL_ROOT_PASSWORD=your_password
MYSQL_DATABASE=student_management
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION_MS=86400000
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👥 Team

- **Frontend Lead**: React/Tailwind Expert
- **Backend Lead**: Spring Boot Expert
- **DevOps**: Docker/Database Specialist
- **UI/UX**: Design System Specialist

## 🆘 Help & Support

### Documentation
- [Premium Features Guide](./PREMIUM_FEATURES.md)
- [API Documentation](./API_DOCS.md)
- [Installation Guide](./INSTALLATION.md)

### Common Issues
1. **Port already in use**: Change port in `docker-compose.yml`
2. **Database connection error**: Verify MySQL is running and credentials are correct
3. **Frontend won't load**: Clear browser cache and restart `npm run dev`

### Contact
- Email: support@sms.dev
- Issues: GitHub Issues
- Discussions: GitHub Discussions

## 🙏 Acknowledgments

Built with ❤️ using modern web technologies and best practices.

## 🎉 What's New in v2.0 Premium

✅ Advanced Admin Dashboard  
✅ Excel Import System  
✅ PDF Report Generation  
✅ Advanced Search & Filters  
✅ Dark Mode UI  
✅ Role-Based Dashboards  
✅ Performance Analytics  
✅ Premium UI Design (Glassmorphism)  
✅ Real-time Statistics  
✅ SaaS-ready Architecture  

---

**Current Version**: 2.0 Premium Edition  
**Last Updated**: March 2026  
**Status**: ✅ Production Ready

⭐ If you find this project helpful, please consider giving it a star! ⭐

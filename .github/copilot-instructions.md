# Copilot / AI Coding Instructions — Student Management System

Short: Build changes against a Spring Boot backend (Java 17) and a Vite React frontend (Tailwind). Keep security/roles and JWT flow intact.

Key architecture summary
- Backend: Spring Boot (package `com.example.sms`). API lives under `/api/*`.
  - Core packages: `entity`, `repository`, `controller`, `security`, `config`.
  - Data flow: `Controller -> Repository` (no service layer currently; add `service` folder if logic grows).
  - Auth: JWT issued at `POST /api/auth/login` (`AuthController`). JWT generation: `JwtUtils`.
  - Role model: Enum `Role` with values `ADMIN`, `STUDENT`. Roles stored in `users` + `user_roles`.
- Frontend: Vite + React under `frontend/`.
  - Routes: `/login`, `/` (dashboard), `/students` (admin only). Pages under `src/pages`.
  - Auth client pattern: store JWT in `localStorage` key `token`, attach `Authorization: Bearer <token>` header on requests.

Important files to reference
- Backend root: `backend/pom.xml`
- App entry: `backend/src/main/java/com/example/sms/StudentManagementApplication.java`
- JWT helper: `backend/src/main/java/com/example/sms/security/JwtUtils.java`
- JWT filter + security config: `backend/src/main/java/com/example/sms/security/JwtAuthFilter.java`, `SecurityConfig.java`
- Auth API: `backend/src/main/java/com/example/sms/controller/AuthController.java`
- Student APIs: `backend/src/main/java/com/example/sms/controller/StudentController.java`
- Entities: `backend/src/main/java/com/example/sms/entity/*` (Student, Attendance, User, Role)
- Flyway migrations: `backend/src/main/resources/db/migration/V1__init_schema.sql`
- Seed/init: `backend/src/main/java/com/example/sms/config/DataInitializer.java` (creates default admin)
- Frontend entry: `frontend/src/main.jsx`, pages in `frontend/src/pages`
- Docker & compose: `backend/Dockerfile`, `frontend/Dockerfile`, `docker-compose.yml`

Project-specific conventions and patterns
- Roles are expressed as enum `Role` and persisted via an `@ElementCollection` set on `User`.
- Controller authorization uses method-level `@PreAuthorize("hasRole('ADMIN')")` for admin-only routes.
- JWT claims include a `roles` claim as a comma-separated string; `JwtAuthFilter` maps these to `ROLE_<NAME>` authorities.
- No service layer yet; simple CRUD flows are implemented directly in controllers — when adding business logic, prefer creating `service` classes under `com.example.sms.service` and inject them into controllers.
- Validation uses Jakarta (`@Valid`) on controller request bodies; entity fields are simple — add DTOs under `dto/` when shape differs from entities.

How to run locally (dev)
- Backend (dev):

  cd backend
  mvn spring-boot:run

- Frontend (dev):

  cd frontend
  npm install
  npm run dev

- Full stack with Docker Compose (recommended for parity):

  docker-compose up --build

Notes about environment and secrets
- JWT configuration: `backend/src/main/resources/application.yml` (`jwt.secret`, `jwt.expirationMs`). Change `jwt.secret` for production.
- MySQL credentials used in `application.yml` are configured to match `docker-compose.yml` when using compose.

Adding features / changes (practical guidance)
- New authenticated endpoints: add controller under `controller/`, protect with `@PreAuthorize` or rely on roles from `JwtAuthFilter`.
- If you need to parse roles in backend code, use `SecurityContextHolder.getContext().getAuthentication()` rather than reading the token manually.
- For DB changes: add a Flyway migration in `backend/src/main/resources/db/migration` and keep migrations immutable.
- To add an initial user or sample data prefer `DataInitializer` (CommandLineRunner) for non-structural data; structural changes must go to Flyway migrations.

Frontend notes
- API base path: frontend calls `/api/...` (relative). When serving frontend via nginx in compose, the frontend proxies to backend via same network; in dev, set Vite proxy as needed.
- Auth pattern: simple `localStorage` token storage; the token is added manually in `Authorization` header in components. For extensibility, centralize Axios instance with an interceptor.

Examples (small snippets)
- Login request (frontend): POST `/api/auth/login` with JSON `{ "username": "admin", "password": "adminpass" }`. Response `{ "token": "..." }`.
- Protecting a controller method (backend):

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("/api/students")
  public List<Student> list() { ... }

Where to look when something fails
- Flyway migrations: check `backend/src/main/resources/db/migration` and application logs for migration failures.
- JWT issues: examine `JwtUtils` and `JwtAuthFilter`. Ensure `jwt.secret` length is sufficient for HMAC key size.
- Authentication failures: check `DataInitializer` seeding and password encoder (`BCryptPasswordEncoder`).

If you make changes that affect startup, run the combination locally with:

  docker-compose up --build

Ask for clarifications
- If you need APIs beyond Student CRUD or more advanced analytics, say which endpoints and data shapes you want and I will add DTOs, services, and frontend pages.

---
If anything in these instructions is unclear or missing (for example, preferred DTO shapes or dashboard chart libraries), tell me which area to expand and I will update this file.
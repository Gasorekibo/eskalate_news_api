# Backend REST API Assessment

This project is a REST API for a blogging platform built with Node.js, Express, and PostgreSQL. It implements authentication, role-based access control (RBAC), and article management with analytics.

## Features

- **Authentication**: User signup and login with JWT tokens.
- **Authorization**: Role-based access control for Authors and Admins.
- **Article Management**:
  - Create, read, update, and delete articles.
  - Authors can only manage their own articles.
- **Analytics**:
  - Automatic view tracking for articles.
  - Dashboard API for authors to view their article statistics.
- **Security**:
  - Password hashing with bcrypt.
  - JWT-based authentication.
  - Validation middleware for request data.

## Prerequisites

- **Node.js** (v14 or higher)
- **PostgreSQL** (v12 or higher)
- **Redis** (for the Analytics Engine)
- **Docker** (recommended for running Redis)
- **npm**


## Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Gasorekibo/backend_restApi_assessment.git
    cd backend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the `backend` directory with the following variables:
    ```env
    PORT=3000
    DATABASE_URL=your_database_url
    JWT_SECRET=your_secret_key
    
    # Redis Configuration
    REDIS_HOST=127.0.0.1
    REDIS_PORT=6379
    REDIS_PASSWORD=
    ```

4.  **Database Setup**
    Run the database synchronization script to create tables:
    ```bash
    npm run db:sync
    ```

5.  **Start Redis**
    You can use the provided Docker Compose file to start Redis:
    ```bash
    docker-compose up -d
    ```


## Running the Server

Start the development server:

```bash
npm run dev
```

The server will start on `http://localhost:3000`.

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login and get JWT token

### Articles

- `GET /api/v1/articles` - Get all articles (public)
- `GET /api/v1/articles/:id` - Get article by ID (public)
- `POST /api/v1/articles` - Create a new article (Author)
- `PUT /api/v1/articles/:id` - Update an article (Author)
- `DELETE /api/v1/articles/:id` - Delete an article (Author)

### Analytics

- `GET /api/v1/author/dashboard` - Get author dashboard metrics (Author)

## Validation

All requests to protected routes are validated using Joi schemas defined in `src/utils/validation.ts`.

## Analytics Engine

The Analytics Engine aggregates `ReadLog` entries into `DailyAnalytics` every day at 00:05 AM GMT. This process is powered by **BullMQ** and **Redis**, ensuring high-frequency engagement data is processed reliably in the background without affecting the main API performance.

### Bonus: Preventing Refresh Spams

To prevent a user from generating 100 `ReadLog` entries in 10 seconds by refreshing the page:
1.  **Rate Limiting**: Implement a cooling period (e.g., 5-10 minutes) per `(User, Article)` pair. Before creating a `ReadLog`, check if a recent entry exists for the same user/session and article.

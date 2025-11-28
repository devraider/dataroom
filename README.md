# Data Room

Full-stack secure data room application designed for enterprise file management, workspace collaboration, and controlled document sharing.
Data Room provides organizations a robust platform to securely store, organize, and share sensitive documents with granular access controls and role-based permissions.

## Tech Stack

### 1. Backend

- **Python 3.13** with [uv](https://github.com/astral-sh/uv) for fast package management
- **FastAPI** - Modern and high-performance web framework
- **SQLModel** - SQL databases with Python type safety based on SQLAlchemy and Pydantic
- **PostgreSQL** - Relational database
- **Google OAuth 2.0** for secure third-party authentication
- **JWT** - Secure authentication
- **Ruff** - Fast Python linter and formatter

### 2. Frontend

- **React 19** with TypeScript
- **Vite** - Frontend tooling and webpack alternative
- **TanStack Query** - Powerful data synchronization
- **Zustand** - Lightweight state management
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [Python](https://www.python.org/) 3.13 with [uv](https://github.com/astral-sh/uv)
- [Node.js](https://nodejs.org/) 18+ (for local frontend development)
- [Make](https://www.gnu.org/software/make/) (optional, for convenience commands)
- [dbBeaver](https://dbeaver.io/) or any PostgreSQL client (optional, for database management)
- [Google Cloud Platform Account](https://cloud.google.com/) (for OAuth 2.0 setup) - You need to create OAuth 2.0 credentials in GCP Console.

## Quick Start Guide

### 1. Using Docker (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd data-room
   ```

2. **Set up environment variables**

   ```bash
   # Backend
   cp backend/.env.example backend/.env

   # Frontend
   cp frontend/.env.example frontend/.env
   ```

3. **Start all services**

   ```bash
   make docker-up
   ```

   This will start:

   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:8000
   - **PostgreSQL**: localhost:5432

4. **View logs**

   ```bash
   make docker-logs
   ```

5. **Stop services**
   ```bash
   make docker-down
   ```

### 2. Local Development

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies with uv**

   ```bash
   make be-install
   # or: uv sync
   ```

3. **Set up environment**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**

   ```bash
   make be-dev
   # or: uv run uvicorn src.asgi:app --reload
   ```

   Backend will be available at http://localhost:8000

## Available Make Commands

### 1. Backend Commands

```bash
make be-install        # Install dependencies with uv
make be-dev            # Start development server with hot reload
make be-lint           # Run linter (ruff)
make be-format         # Format code (ruff)
make be-check          # Run all checks
```

### 2. Frontend Commands

```bash
make fe-install        # Install dependencies
make fe-dev            # Start development server
make fe-build          # Build for production
make fe-lint           # Run linter
make fe-preview        # Preview production build
make fe-test           # Run tests
make fe-test-coverage  # Run tests with coverage
```

### 3. Docker Commands

```bash
make docker-up         # Start all services
make docker-down       # Stop all services
make docker-build      # Build Docker images
make docker-logs       # View logs
make docker-clean      # Remove containers, volumes, and images
```

## Configuration

## Project Structure

## Testing

## Deployment

## API Documentation

## License

## Links

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [uv Documentation](https://github.com/astral-sh/uv)
- [Docker Documentation](https://docs.docker.com/)

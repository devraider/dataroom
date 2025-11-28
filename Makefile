.PHONY: help fe-install fe-dev fe-build fe-lint fe-type-check fe-preview fe-test fe-test-coverage \
        be-install be-dev be-lint be-format be-check be-test be-test-coverage \
        docker-up docker-down docker-build docker-logs docker-clean

help:
	@echo "Available commands:"
	@echo ""
	@echo "Frontend:"
	@echo "  make fe-install        - Install frontend dependencies"
	@echo "  make fe-dev            - Start frontend development server"
	@echo "  make fe-build          - Build frontend for production"
	@echo "  make fe-lint           - Run frontend linter"
	@echo "  make fe-type-check     - Run TypeScript type checking"
	@echo "  make fe-preview        - Preview production build"
	@echo "  make fe-test           - Run frontend tests"
	@echo "  make fe-test-coverage  - Run frontend tests with coverage"
	@echo ""
	@echo "Backend:"
	@echo "  make be-install        - Install backend dependencies with uv"
	@echo "  make be-dev            - Start backend development server"
	@echo "  make be-lint           - Run backend linter (ruff)"
	@echo "  make be-format         - Format backend code (ruff)"
	@echo "  make be-check          - Run linter and type checks"
	@echo "  make be-test           - Run backend tests"
	@echo "  make be-test           - Run backend tests"
	@echo "  make be-test-coverage  - Run backend tests with coverage"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-up         - Start all services with Docker Compose"
	@echo "  make docker-down       - Stop all services"
	@echo "  make docker-build      - Build Docker images"
	@echo "  make docker-logs       - View logs from all services"
	@echo "  make docker-clean      - Remove all containers, volumes, and images"

# Frontend commands
fe-install:
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

fe-dev:
	@echo "Starting frontend development server..."
	cd frontend && npm run dev

fe-build:
	@echo "Building frontend for production..."
	cd frontend && npm run build

fe-lint:
	@echo "Running frontend linter..."
	cd frontend && npm run lint

fe-type-check:
	@echo "Running TypeScript type checking..."
	cd frontend && npm run type-check

fe-preview:
	@echo "Previewing production build..."
	cd frontend && npm run preview

fe-test:
	@echo "Running frontend tests..."
	cd frontend && npm test

fe-test-coverage:
	@echo "Running frontend tests with coverage..."
	cd frontend && npm run test:coverage

# Backend commands
be-install:
	@echo "Installing backend dependencies with uv..."
	cd backend && uv sync

be-dev:
	@echo "Starting backend development server..."
	cd backend && uv run uvicorn src.asgi:app --reload

be-lint:
	@echo "Running backend linter..."
	cd backend && uv run ruff check .

be-format:
	@echo "Formatting backend code..."
	cd backend && uv run ruff format .

be-check:
	@echo "Running backend checks..."
	cd backend && uv run ruff check . && uv run ruff format --check .

be-test:
	@echo "Running backend tests..."
	cd backend && PYTHONPATH=.. uv run pytest

be-test-coverage:
	@echo "Running backend tests with coverage..."
	cd backend && PYTHONPATH=.. uv run pytest --cov=src --cov-report=term-missing

# Docker commands
docker-up:
	@echo "Starting Docker services..."
	docker-compose up -d

docker-down:
	@echo "Stopping Docker services..."
	docker-compose down

docker-build:
	@echo "Building Docker images..."
	docker-compose build

docker-logs:
	@echo "Viewing logs..."
	docker-compose logs -f

docker-clean:
	@echo "Cleaning up Docker resources..."
	docker-compose down -v --rmi all --remove-orphans

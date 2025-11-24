.PHONY: help fe-install fe-dev fe-build fe-lint fe-preview fe-test fe-test-coverage

help:
	@echo "Available commands:"
	@echo "  make fe-install        - Install frontend dependencies"
	@echo "  make fe-dev            - Start frontend development server"
	@echo "  make fe-build          - Build frontend for production"
	@echo "  make fe-lint           - Run frontend linter"
	@echo "  make fe-preview        - Preview production build"
	@echo "  make fe-test           - Run frontend tests"
	@echo "  make fe-test-coverage  - Run frontend tests with coverage"

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

fe-preview:
	@echo "Previewing production build..."
	cd frontend && npm run preview

fe-test:
	@echo "Running frontend tests..."
	cd frontend && npm test

fe-test-coverage:
	@echo "Running frontend tests with coverage..."
	cd frontend && npm run test:coverage

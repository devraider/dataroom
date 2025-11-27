FROM python:3.13-slim

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Set container environment variables
ENV HOST=0.0.0.0
ENV PORT=8000

WORKDIR /app

COPY pyproject.toml uv.lock ./

RUN uv sync --frozen --no-cache

COPY . ./backend

EXPOSE ${PORT}

CMD ["sh", "-c", "uv run uvicorn backend.src.asgi:app --host ${HOST} --port ${PORT}"]
from contextlib import asynccontextmanager

from fastapi import FastAPI

from backend.src.api.routes.workspace import workspace_router


@asynccontextmanager
async def lifespan_event(app: FastAPI):
    print("Starting up...")
    yield
    print("Shutting down...")


app = FastAPI(title="Data Room", version="1.0.0", lifespan=lifespan_event)



app.include_router(workspace_router)

from fastapi import FastAPI

from backend.src.api.routes.workspace import workspace_router

app = FastAPI(title="Data Room", version="1.0.0")



app.include_router(workspace_router)
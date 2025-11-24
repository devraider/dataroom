
import uvicorn
from fastapi import FastAPI

from backend.src.utils.settings import settings

app = FastAPI(title="Data Room", version="1.0.0")


if __name__ == "__main__":
    uvicorn.run(app, host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)

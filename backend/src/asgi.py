from fastapi import FastAPI
import uvicorn

app = FastAPI(title="Data Room", version="1.0.0")


if __name__ == "__main__":

    uvicorn.run(app)
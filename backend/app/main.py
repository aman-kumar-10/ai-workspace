from fastapi import FastAPI
from app.routes import router

app = FastAPI(
    title="AI Workspace"
)

app.include_router(router)
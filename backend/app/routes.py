from fastapi import APIRouter
from pydantic import BaseModel
from app.gemini import ask_gemini

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


@router.get("/")
def home():
    return {
        "message": "AI Workspace Backend Running 🚀"
    }


@router.post("/chat")
def chat(request: ChatRequest):

    reply = ask_gemini(request.message)

    return {
        "reply": reply
    }
from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel

from app.gemini import ask_gemini

router = APIRouter()

templates = Jinja2Templates(directory="templates")


class ChatRequest(BaseModel):
    message: str


@router.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={}
    )


@router.post("/chat")
async def chat(data: ChatRequest):

    reply = ask_gemini(data.message)

    return {
        "reply": reply
    }
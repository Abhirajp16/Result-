"""
Prism Backend - Contextual Socratic AI
Combines Interest Switching + Socratic Debate
Uses Hugging Face Inference API
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

load_dotenv()

# Configure Hugging Face
HF_TOKEN = os.getenv("HF_TOKEN", "")
client = InferenceClient(token=HF_TOKEN)

# Use a free, powerful model on Hugging Face
MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.3"

app = FastAPI(title="Prism API", version="1.0.0")

# CORS - allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────
# Data Models
# ──────────────────────────────────────────────

class LessonRequest(BaseModel):
    topic: str
    interest: str

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    topic: str
    interest: str
    message: str
    history: List[ChatMessage] = []

# ──────────────────────────────────────────────
# Hardcoded Educational Content (for hackathon demo)
# ──────────────────────────────────────────────

LESSONS = {
    "friction": {
        "title": "Friction in Physics",
        "content": """Friction is a force that opposes the relative motion of two surfaces in contact. 
There are two main types: static friction (prevents movement from starting) and kinetic friction (opposes ongoing movement). 
The coefficient of friction depends on the materials involved. 
Friction converts kinetic energy into heat. 
Without friction, you couldn't walk, drive, or even hold objects."""
    },
    "photosynthesis": {
        "title": "Photosynthesis in Biology",
        "content": """Photosynthesis is the process by which green plants convert sunlight into chemical energy (glucose). 
The equation is: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2. 
It occurs in chloroplasts, specifically in the thylakoid membranes. 
There are two stages: the light-dependent reactions and the Calvin cycle. 
Chlorophyll is the green pigment that absorbs sunlight."""
    },
    "pythagoras": {
        "title": "Pythagorean Theorem in Mathematics",
        "content": """The Pythagorean theorem states that in a right-angled triangle, the square of the hypotenuse equals the sum of squares of the other two sides: a² + b² = c². 
It only works for right triangles. 
It can be used to find distances, heights, and in navigation. 
The converse is also true: if a² + b² = c², the triangle is a right triangle."""
    },
    "world_war_2": {
        "title": "World War II in History",
        "content": """World War II (1939-1945) was the deadliest conflict in human history. 
It began with Germany's invasion of Poland. 
Key Allied powers included USA, UK, and USSR. Axis powers were Germany, Japan, and Italy. 
Major events include the Battle of Stalingrad, D-Day, and the atomic bombings of Hiroshima and Nagasaki. 
The war ended with the formation of the United Nations."""
    },
    "gravity": {
        "title": "Gravity in Physics",
        "content": """Gravity is a fundamental force of attraction between all objects with mass. 
Newton's Law of Universal Gravitation: F = G(m1*m2)/r². 
On Earth, gravitational acceleration is approximately 9.8 m/s². 
Gravity keeps planets in orbit around the Sun and the Moon in orbit around Earth. 
Einstein later described gravity as the curvature of spacetime caused by mass."""
    }
}

INTERESTS = [
    {"id": "minecraft", "name": "Minecraft", "emoji": "⛏️", "color": "#4CAF50"},
    {"id": "space", "name": "Space & Astronomy", "emoji": "🚀", "color": "#7C4DFF"},
    {"id": "cooking", "name": "Cooking & Food", "emoji": "🍳", "color": "#FF7043"},
    {"id": "soccer", "name": "Soccer & Sports", "emoji": "⚽", "color": "#29B6F6"},
    {"id": "gaming", "name": "Video Games", "emoji": "🎮", "color": "#E040FB"},
    {"id": "anime", "name": "Anime & Manga", "emoji": "🎌", "color": "#FF5252"},
]

TOPICS = [
    {"id": "friction", "name": "Friction", "subject": "Physics"},
    {"id": "photosynthesis", "name": "Photosynthesis", "subject": "Biology"},
    {"id": "pythagoras", "name": "Pythagorean Theorem", "subject": "Mathematics"},
    {"id": "world_war_2", "name": "World War II", "subject": "History"},
    {"id": "gravity", "name": "Gravity", "subject": "Physics"},
]


# ──────────────────────────────────────────────
# Helper: Call Hugging Face API
# ──────────────────────────────────────────────

def call_hf(messages: list) -> str:
    """Make a direct call to Hugging Face Inference API."""
    try:
        response = client.chat_completion(
            model=MODEL_ID,
            messages=messages,
            max_tokens=1024,
            temperature=0.7,
        )
        return response.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")


# ──────────────────────────────────────────────
# API Endpoints
# ──────────────────────────────────────────────

@app.get("/api/interests")
def get_interests():
    """Return available interests and topics."""
    return {"interests": INTERESTS, "topics": TOPICS}


@app.post("/api/generate-lesson")
def generate_lesson(req: LessonRequest):
    """
    INTEREST SWITCHER:
    Takes a topic + student interest and rewrites the lesson
    in the context of that interest.
    """
    lesson = LESSONS.get(req.topic)
    if not lesson:
        raise HTTPException(status_code=404, detail="Topic not found")

    messages = [
        {
            "role": "system",
            "content": "You are an expert educational content creator. You rewrite lessons to make them fun and engaging using the student's personal interests. Keep all facts accurate. Use markdown formatting."
        },
        {
            "role": "user",
            "content": f"""Rewrite this lesson so it becomes incredibly engaging for a student passionate about {req.interest}.

RULES:
1. Rewrite the ENTIRE lesson using analogies, examples, and scenarios from {req.interest}.
2. Keep ALL the educational facts accurate.
3. Make it feel like a story or adventure, not a textbook.
4. Use vivid, exciting language.
5. Format with markdown headers and bullet points.
6. Add a fun title related to {req.interest}.

ORIGINAL LESSON:
Title: {lesson['title']}
Content: {lesson['content']}

Now rewrite this lesson entirely in the world of {req.interest}:"""
        }
    ]

    rewritten = call_hf(messages)

    return {
        "original_title": lesson["title"],
        "interest": req.interest,
        "rewritten_lesson": rewritten
    }


@app.post("/api/chat")
def socratic_chat(req: ChatRequest):
    """
    SOCRATIC AI:
    The AI takes on a persona from the student's interest and
    debates them to test true understanding. Never gives direct answers.
    """
    lesson = LESSONS.get(req.topic)
    if not lesson:
        raise HTTPException(status_code=404, detail="Topic not found")

    persona_map = {
        "minecraft": "a legendary Minecraft Master Builder who has built every redstone contraption known to the game",
        "space": "a veteran astronaut and astrophysicist who has traveled to Mars three times",
        "cooking": "a world-renowned Michelin-star chef who sees science in every recipe",
        "soccer": "an elite soccer coach and sports scientist who analyzes everything through game strategy",
        "gaming": "a legendary game developer and esports champion who understands game physics deeply",
        "anime": "a wise sensei from a famous anime academy who teaches through dramatic storytelling"
    }

    persona = persona_map.get(req.interest, "a passionate expert")

    system_prompt = f"""You are {persona}. You are testing a student's understanding of: {lesson['title']}.

YOUR PERSONALITY:
- You speak using language, references, and analogies from {req.interest}.
- You are friendly but challenging - like a tough but caring mentor.
- You use emojis occasionally to keep things fun.

YOUR RULES (VERY IMPORTANT):
1. NEVER give the student the direct answer.
2. If they say something wrong, challenge them with a counter-question using a {req.interest} analogy.
3. If they say something partially right, acknowledge it but push deeper.
4. Use the Socratic method: always respond with questions that guide them to discover the answer themselves.
5. Keep responses short (2-4 sentences max).
6. If the student demonstrates CLEAR mastery of the core concept (they explain it correctly and thoroughly), 
   respond with enthusiastic praise AND include the exact text [MASTERY_ACHIEVED] at the end of your message.

THE EDUCATIONAL CONTENT THEY MUST MASTER:
{lesson['content']}"""

    # Build messages for Hugging Face chat format
    messages = [{"role": "system", "content": system_prompt}]

    # Add conversation history
    for msg in req.history:
        messages.append({"role": msg.role, "content": msg.content})

    # Add current user message
    messages.append({"role": "user", "content": req.message})

    response_text = call_hf(messages)

    # Check for mastery
    mastery = "[MASTERY_ACHIEVED]" in response_text
    clean_response = response_text.replace("[MASTERY_ACHIEVED]", "").strip()

    return {
        "response": clean_response,
        "mastery_achieved": mastery
    }


@app.get("/")
def root():
    return {"message": "Prism API is running!", "version": "1.0.0"}

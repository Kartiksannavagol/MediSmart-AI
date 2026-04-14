from fastapi import FastAPI
from app.routes import auth, user, appointment, ai

app = FastAPI()

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(appointment.router)
app.include_router(ai.router)

@app.get("/")
def root():
    return {"message": "MediSmart AI Backend Running"}
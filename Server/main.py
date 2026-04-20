from fastapi import FastAPI
from Server.models.models import Base
from Server.database.database import engine
from Server.routers import auth, user, category, menu, featuremenu, stats
from fastapi.middleware.cors import CORSMiddleware
from Server.core.security import limiter
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse
import Server.core.cloudinary_config

app = FastAPI()

app.state.limiter = limiter

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://cafe-fronend.vercel.app",
        "https://cafe-fronend-fqnyhyw96-buraphas-projects-9e8b659d.vercel.app",
        "https://cafe-fronend-git-main-buraphas-projects-9e8b659d.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(SlowAPIMiddleware)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(category.router)
app.include_router(menu.router)
app.include_router(featuremenu.router)
app.include_router(stats.router)


@app.get("/")
def read_root():
    print("Server is runing")
    return {"message": "Server is runing"}


@app.exception_handler(RateLimitExceeded)
def rate_limit_handler(request, exc):
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded. Please try again later."},
    )

from fastapi import FastAPI, Cookie, Response
from fastapi.middleware.cors import CORSMiddleware

# from app.api.endpoints.tasks import router as tasks_router
# from app.api.endpoints.users import router as users_router
# from app.api.endpoints.utils import router as utils_router
from .api import router as api_router
app = FastAPI(
    title="task_manager",
    description="API for Task Manager",
)

# app.include_router(tasks_router)
# app.include_router(users_router)
# app.include_router(utils_router)
app.include_router(api_router)

origins = [
    "http://localhost",
    "http://127.0.0.1",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

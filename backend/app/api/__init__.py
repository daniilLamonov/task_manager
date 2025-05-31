from fastapi import APIRouter
from .endpoints.users import router as users_router
from .endpoints.tasks import router as items_router
from .endpoints.utils import router as utils_router

router = APIRouter()
router.include_router(users_router)
router.include_router(items_router)
router.include_router(utils_router)

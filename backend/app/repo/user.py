from sqlalchemy import select

from app.db import models
from app.db.database import session_maker
from app.repo.base import BaseRepo


class UserRepo(BaseRepo):
    model = models.Users

    @classmethod
    async def get_by_email(cls, email):
        async with session_maker() as session:
            query = select(cls.model).where(cls.model.email == email)
            result = await session.execute(query)
            return result.scalar_one_or_none()
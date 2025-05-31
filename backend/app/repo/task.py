from alembic.util import status
from sqlalchemy import select, update

from app.db import models
from app.db.database import session_maker
from app.repo.base import BaseRepo


class TaskRepo(BaseRepo):
    model = models.Tasks

    @classmethod
    async def get_all_tasks(cls, team, **filter):
        async with session_maker() as session:
            query = (
                select(cls.model)
                .filter_by(**filter)
                .join(cls.model.creator)
                .where(cls.model.creator.has(team=team))
            )
            result = await session.execute(query)
            return result.scalars().all()

    @classmethod
    async def add(cls, name, description, user_id):
        async with session_maker() as session:
            task = cls.model(
                name=name, description=description, status="created", user_id=user_id
            )
            session.add(task)
            await session.commit()
            return task

    @classmethod
    async def update_task(cls, task_uuid, **params):
        async with session_maker() as session:
            query = (
                update(cls.model)
                .where(cls.model.uuid == task_uuid)
                .values(**params)
                .returning(cls.model)
            )
            result = await session.execute(query)
            await session.commit()
            return result.scalar()

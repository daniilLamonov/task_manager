from sqlalchemy import select, delete

from app.db.database import session_maker


class BaseRepo:
    model = None

    @classmethod
    async def get_all(cls, **filters):
        async with session_maker() as session:
            query = select(cls.model).filter_by(**filters)
            result = await session.execute(query)
            return result.scalars().all()

    @classmethod
    async def get_by_uuid(cls, uuid):
        async with session_maker() as session:
            query = select(cls.model).where(cls.model.uuid == uuid)
            result = await session.execute(query)
            return result.scalar_one_or_none()

    @classmethod
    async def create(cls, data: dict):
        async with session_maker() as session:
            obj = cls.model(**data)
            session.add(obj)
            await session.commit()
            return obj

    @classmethod
    async def delete_by_uuid(cls, uuid):
        async with session_maker() as session:
            query = delete(cls.model).filter_by(uuid=uuid)
            await session.execute(query)
            await session.commit()
            # obj = await cls.get_by_uuid(uuid)
            # session.delete(obj)
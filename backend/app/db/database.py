from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core import settings

engine = create_async_engine(settings.DB_URL)
session_maker = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

async def get_session() -> AsyncSession:
    async with session_maker() as session:
        yield session


class Base(DeclarativeBase):
    pass
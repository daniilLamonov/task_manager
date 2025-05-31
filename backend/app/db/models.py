from sqlalchemy import ForeignKey

from app.db.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from uuid import UUID, uuid4


class Users(Base):
    __tablename__ = "users"
    uuid: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(nullable=True)
    team: Mapped[str] = mapped_column(nullable=True)
    email: Mapped[str]
    hash_password: Mapped[str]

    created_tasks: Mapped[list["Tasks"]] = relationship(
        "Tasks",
        back_populates="creator",
        foreign_keys="Tasks.user_id"  # Явно указываем связь
    )
    assigned_tasks: Mapped[list["Tasks"]] = relationship(
        "Tasks",
        back_populates="assignee",
        foreign_keys="Tasks.user_in_work"  # Явно указываем связь
    )

class Tasks(Base):
    __tablename__ = "tasks"
    uuid: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    name: Mapped[str]
    description: Mapped[str]
    status: Mapped[str]
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.uuid"))
    user_in_work: Mapped[UUID] = mapped_column(
        ForeignKey("users.uuid"),
        nullable=True
    )
    creator: Mapped["Users"] = relationship(
        "Users",
        back_populates="created_tasks",
        foreign_keys=[user_id]  # Явно указываем связь
    )

    assignee: Mapped["Users"] = relationship(
        "Users",
        back_populates="assigned_tasks",
        foreign_keys=[user_in_work]  # Явно указываем связь
    )
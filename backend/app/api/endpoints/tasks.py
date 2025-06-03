import logging
from typing import List, Set

import redis
from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect

from app.api.deps import CurrentUser
from app.api.schemas.task import TaskOutSchema, TaskSchema
from app.repo.task import TaskRepo

from app.core import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
router = APIRouter(prefix="/tasks", tags=["tasks"])
active_connections: Set[WebSocket] = set()

# r = redis.Redis(host="localhost", port=6379)

@router.websocket("/ws/")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    logger.info(f"🟢 WebSocket подключён: {websocket.client}")
    try:
        active_connections.add(websocket)
        while True:
            try:
                data = await websocket.receive_json()
                logger.info(f"📩 Получено сообщение: {data}")
            except WebSocketDisconnect as e:
                logger.info(f"🔴 Клиент отключился: {websocket.client}, код: {e.code}")
                break
    finally:
        if websocket in active_connections:
            active_connections.remove(websocket)
            logger.info(f"⚠️ Удалено соединение: {websocket.client}")


@router.get("/", response_model=List[TaskOutSchema])
async def get_all_tasks(
    user: CurrentUser, in_work: bool = None, is_complete: bool = None
):
    team = user.team
    if in_work:
        try:
            return await TaskRepo.get_all_tasks(
                team, user_in_work=user.uuid, status="in_progress"
            )
        except Exception as e:
            logger.error(f"Ошибка при получении задач: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")
    if is_complete:
        try:
            return await TaskRepo.get_all_tasks(
                team, user_in_work=user.uuid, status="completed"
            )
        except Exception as e:
            logger.error(f"Ошибка при получении задач: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")
    try:
        return await TaskRepo.get_all_tasks(team, status="created")
    except Exception as e:
        logger.error(f"Ошибка при получении задач: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


async def broadcast(message: dict):
    disconnected = []
    for connection in active_connections:
        try:
            logger.info("message sent")
            await connection.send_json(message)
        except Exception:
            logger.error("Json not sent, maybe json serialization error")
            disconnected.append(connection)
    for conn in disconnected:
        active_connections.remove(conn)


@router.post("/add")
async def add_task(task: TaskSchema, user: CurrentUser):
    try:
        task_added = await TaskRepo.add(task.name, task.description, user.uuid)
        new_task = TaskOutSchema.model_validate(task_added).model_dump(mode="json")
        logger.info(active_connections, new_task)
        await broadcast({"action": "new", "task": new_task})
        return {"action": "new", "task": new_task}
    except Exception as e:
        logger.error(f"Ошибка при добавлении задачи: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/delete")
async def delete_task(uuid: str, user: CurrentUser):
    try:
        await TaskRepo.delete_by_uuid(uuid)
        await broadcast({"action": "take", "task": uuid})
        return {"success": True}
    except Exception as e:
        logger.error(f"Ошибка при удалении задачи: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/take_or_return_in_work", response_model=TaskOutSchema)
async def take_or_return_in_work(uuid: str, user: CurrentUser, is_take=None):
    status = "in_progress"
    user_uuid = user.uuid
    if not is_take:
        status = "created"
        user_uuid = None
    try:
        task = await TaskRepo.update_task(
            uuid, **{"status": status, "user_in_work": user_uuid}
        )
        logger.info(active_connections, task)
        await broadcast({"action": "take", "task": uuid})
        return task
    except Exception as e:
        logger.error(e)


@router.put("/complete", response_model=TaskOutSchema)
async def complete_task(uuid: str, user: CurrentUser):
    params = {"status": "completed"}
    try:
        task = await TaskRepo.update_task(uuid, **params)
        await broadcast({"action": "complete", "task": uuid})
        return task
    except Exception as e:
        logger.error(e)

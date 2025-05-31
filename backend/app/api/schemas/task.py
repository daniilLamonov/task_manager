import uuid
from pydantic import BaseModel


class TaskSchema(BaseModel):
    name: str
    description: str

class TaskOutSchema(BaseModel):
    uuid: uuid.UUID
    name: str
    description: str
    status: str
    user_id: uuid.UUID

    model_config = {
        "from_attributes": True
    }


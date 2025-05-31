import uuid
from pydantic import EmailStr, Field, BaseModel


class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserRegisterSchema(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    name: str
    team: str

class UserSchema(BaseModel):
    uuid: uuid.UUID
    name: str
    team: str
    model_config = {
        "from_attributes": True
    }

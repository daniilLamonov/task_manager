from datetime import datetime, timezone
from typing import Annotated
from uuid import UUID

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

from app.core.config import settings
from app.repo.user import UserRepo

from db.models import Users

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

def verify_token(token: str, token_type: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        expire = payload.get("exp")
        current_token_type = payload.get("type")
        if current_token_type != token_type or expire is None or datetime.fromtimestamp(expire, tz=timezone.utc) < datetime.now(timezone.utc):
            raise HTTPException(status_code=401)
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token, "access")
    user_uuid = UUID(payload.get("sub"))
    user = await UserRepo.get_by_uuid(user_uuid)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
CurrentUser = Annotated[Users, Depends(get_current_user)]



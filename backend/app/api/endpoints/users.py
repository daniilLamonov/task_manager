from fastapi import APIRouter, HTTPException, Depends

from app.api.deps import CurrentUser
from app.core.security import create_access_token, verify_password, hash_password
from app.api.schemas.user import UserSchema, UserRegisterSchema
from app.repo.user import UserRepo

from fastapi.security import OAuth2PasswordRequestForm


router = APIRouter(prefix="/users", tags=["users"])

@router.post("/register")
async def create_user(user: UserRegisterSchema):
    user_in_db = await UserRepo.get_by_email(user.email)
    if not user_in_db:
        try:
            return await UserRepo.create({"email": user.email,
                                          "hash_password": hash_password(user.password),
                                          "name": user.name,
                                          "team": user.team})
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    raise HTTPException(status_code=409, detail="Email already registered")


@router.post("/login")
async def login_user(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await UserRepo.get_by_email(form_data.username)
    if user:
        if verify_password(form_data.password, user.hash_password):
            token = create_access_token(data=user.uuid)
            return {"access_token": token, "token_type": "bearer"}
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    raise HTTPException(status_code=401, detail="Not user")


@router.get("/user", response_model=UserSchema)
async def get_user(user_id: str):
    user = await UserRepo.get_by_uuid(user_id)
    return user

@router.get("/me", response_model=UserSchema)
async def get_user(user: CurrentUser):
    return user
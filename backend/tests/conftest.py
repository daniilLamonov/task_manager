import httpx
import pytest
from app.main import app as fastapi_app

@pytest.fixture(scope='session')
async def client():
    transport = httpx.ASGITransport(app=fastapi_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        yield client

@pytest.fixture(scope='session')
async def auth_client():
    transport = httpx.ASGITransport(app=fastapi_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        response = await client.post("users/login",
                          data={"username": "user@example.com", "password": "stringst"})
        assert response.status_code == 200
        assert "access_token" in response.json()
        token = response.json()["access_token"]
        client.headers = {
            **client.headers,
            "Authorization": f"Bearer {token}"
        }
        yield client

# @pytest.fixture(scope="session", autouse=True)
# async def prepare_database():
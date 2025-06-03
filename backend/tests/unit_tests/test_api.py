import pytest
from httpx import AsyncClient
from fastapi.testclient import TestClient
from app.main import app as fastapi_app

# async def test_tasks(auth_client: AsyncClient):
#     responce = await auth_client.get(
#         "tasks/"
#     )
#     assert responce.status_code == 200

client = TestClient(fastapi_app)

def test_example():
    response = client.get("/utils/health-check")
    assert response.status_code == 200
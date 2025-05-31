import pytest
from httpx import AsyncClient

async def test_tasks(auth_client: AsyncClient):
    responce = await auth_client.get(
        "tasks/"
    )
    assert responce.status_code == 200

async def test_example():
    assert 1 + 1 == 2
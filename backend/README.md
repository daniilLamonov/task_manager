# Task Manager - Backend
## Зависимости
* Docker.
* uv.
* PostgreSQL

## В проекте используется пакетный менеджер uv

Для синхронизации проекта и установки зависимостей можно использовать
```concole
uv sync
```

### База данных

Этот проект использует **PostgreSQL** для хранения запросов. Для локальной работы потребуется установить БД на компьютер, либо воспользоваться контейнером.
Все зависимости БД находятся в файле .env в корне проекта.



## Запуск проекта

Чтобы запустить сервер FastAPI:

```bash
uvicorn app.main:app --reload
```

API работает на адресе `http://127.0.0.1:8000`.

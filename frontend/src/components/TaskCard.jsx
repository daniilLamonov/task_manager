import {Button, Card} from "antd";
import { useEffect, useState } from "react";
const API_BASE = import.meta.env.VITE_API_URL;

function TaskCard({ task, onAction, isMyTasks, onComplete, isComplete }) {
    const [username, setUsername] = useState("");

    useEffect(() => {
        const getUsername = async (userId) => {
            const response = await fetch(`${API_BASE}/users/user?user_id=${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const error = await response.json();
                alert(`Ошибка: ${error.detail}`);
                return;
            }

            const user = await response.json();
            setUsername(user.name);
        };

        if (task.user_id) {
            getUsername(task.user_id);
        }
    }, [task.user_id]);

    const handleDoubleClick = () => {
        const action = isMyTasks ? null : 1;
        onAction(task.task_id, action);
    };

    return (
        <Card
            title={task.name}
            extra={
                isMyTasks ?
                    <Button color="green" variant="outlined" onClick={() => onComplete(task.task_id)}>
                        Выполнить
                    </Button>
                    : null
            }
            style={{ width: 300 }}
            onDoubleClick={handleDoubleClick}
            hoverable
        >
            <p>{task.description}</p>
            <p>создатель: {username || "неизвестен"}</p>
        </Card>
    );
}

export default TaskCard;

import { useEffect, useState, useRef } from "react";
import TaskCard from "./TaskCard";
import {getUser, fetchTasks, addTaskAPI, takeOrReturnTaskBackAPI, completeTaskAPI} from "../api";
const API_BASE = import.meta.env.VITE_API_URL;

function TaskList({ onLogout }) {

    const [tasks, setTasks] = useState([]);
    const [isMyTasks, setIsMyTasks] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [ws, setWs] = useState(null);
    const token = localStorage.getItem("token");
    const [team, setTeam] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [newTaskName, setNewTaskName] = useState("");
    const [newTaskDescription, setNewTaskDescription] = useState("");


    const dropdownRef = useRef(null);

    useEffect(() => {
        const getTeam = async () => {
            try {
                const user = await getUser(token);
                setTeam(user.team);
            } catch (error) {
                console.log(error);
            }
        };
        getTeam();
    }, []);

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const data = await fetchTasks(token, isMyTasks, isComplete);
                const parsedTasks = data.map((task) => ({
                    task_id: task.uuid,
                    name: task.name,
                    description: task.description,
                    status: task.status,
                    user_id: task.user_id,
                }));
                setTasks(parsedTasks);
            } catch (err) {
                alert("Ошибка при загрузке задач: " + err.message);
            }
        };
        if (token) {
            loadTasks();
        }
    }, [token, isMyTasks, isComplete]);

    useEffect(() => {
        // const socket = new WebSocket(`ws://localhost:8000/tasks/ws/`);
        const socket = new WebSocket(`ws://${window.location.host}/tasks/ws/`);
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.action === "new") {
                const newTask = {
                    task_id: data.task.uuid,
                    name: data.task.name,
                    description: data.task.description,
                    status: data.task.status,
                    user_id: data.task.user_id,
                };
                setTasks((prev) => {
                    if (!isMyTasks || data.task.user_id === userId) {
                        return [...prev, newTask];
                    }
                    return prev;
                });
            }

            if (data.action === "take") {
                setTasks((tasks) => tasks.filter((task) => task.task_id !== data.task));
            }
            // if (data.action === "complete") {
            //     setTasks((tasks) => tasks.filter((task) => task.task_id !== data.task));
            // }

        };
        setWs(socket);
        return () => socket.close();
    }, []);

    const logOut = () => {
        localStorage.removeItem("token");
        onLogout?.();
    };

    const addTask = async () => {
        if (!token) {
            alert("Вы не авторизованы!");
            return;
        }
        const name = prompt("Введите заголовок задачи:");
        const description = prompt("Введите описание задачи:");

        await addTaskAPI (token, name, description)
    };

    const takeOrReturnTaskBack = async (taskId, isTake) => {
        if (!token) {
            alert("Вы не авторизованы!");
            return;
        }
        await takeOrReturnTaskBackAPI (token, taskId, isTake )
    };
    const onCompleteTask = async (taskId) => {
        if (!token) {
            alert("Вы не авторизованы!");
            return;
        }
        const response = await completeTaskAPI(token, taskId);
        setTasks((tasks) => tasks.filter((task) => task.task_id !== response.uuid));

    }


    // Закрытие меню при клике вне
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    let title = "Наши задачи"
    if (isMyTasks) {
        title = "Мои задачи"
    }
    if (isComplete) {
        title = "Завершенные задачи"
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-gray-700">Команда {team}</h1>
                    <h2 className="text-3xl font-bold">
                        {title}
                    </h2>
                </div>

                {/* Меню */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg"
                    >
                        Меню
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                            <button
                                onClick={() => {
                                    setIsMyTasks((prev) => !prev)
                                    setIsComplete(() => false)
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                {isMyTasks ? "Наши задачи" : "Мои задачи"}
                            </button>
                            <button
                                onClick={() => {
                                    setIsComplete(() => true)
                                    setIsMyTasks(() => false)

                            }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                Завершенные
                            </button>
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    setShowForm(true);
                                    // addTask();
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                Добавить задачу
                            </button>
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    logOut();
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                Выйти
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {showForm && (
                <div className="mt-6 p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
                    <h3 className="text-xl font-semibold mb-4">Новая задача</h3>
                    <input
                        type="text"
                        placeholder="Название"
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        className="w-full mb-2 px-3 py-2 border rounded"
                    />
                    <textarea
                        placeholder="Описание"
                        value={newTaskDescription}
                        onChange={(e) => setNewTaskDescription(e.target.value)}
                        className="w-full mb-2 px-3 py-2 border rounded"
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setShowForm(false)}
                            className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded"
                        >
                            Отмена
                        </button>
                        <button
                            onClick={async () => {
                                if (!newTaskName.trim()) {
                                    alert("Введите название задачи!");
                                    return;
                                }
                                await addTaskAPI(token, newTaskName, newTaskDescription);
                                setNewTaskName("");
                                setNewTaskDescription("");
                                setShowForm(false);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
                        >
                            Добавить
                        </button>
                    </div>
                </div>
            )}


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
                {tasks.map((task) => (
                    <TaskCard key={task.task_id} task={task} onAction={takeOrReturnTaskBack} isMyTasks={isMyTasks} onComplete={onCompleteTask} isComplete={isComplete} />
                ))}
            </div>
        </div>
    );

}

export default TaskList;
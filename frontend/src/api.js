// src/api.js
const API_BASE = import.meta.env.VITE_API_URL;

export const getUser = async (token) => {
    const response = await fetch(`${API_BASE}/users/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail);
    }
    return await response.json();
};


export const fetchTasks = async (token, isMyTasks, isComplete) => {
    let url = `${API_BASE}/tasks/`;
    if (isMyTasks) {
        url = `${API_BASE}/tasks/?in_work=${true}`
    }
    if (isComplete) {
        url = `${API_BASE}/tasks/?is_complete=${true}`
    }
    const response = await fetch(
        url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    return await response.json();
};

export const addTaskAPI = async (token, name, description) => {
    const response = await fetch(`${API_BASE}/tasks/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, description }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail);
    }
    return await response.json();
};

export const takeOrReturnTaskBackAPI = async (token, taskId, isTake) => {
    const response = await fetch(
        isTake ? `${API_BASE}/tasks/take_or_return_in_work?uuid=${taskId}&is_take=${isTake}` :
        `${API_BASE}/tasks/take_or_return_in_work?uuid=${taskId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail);
    }
    return await response.json();
};

export const completeTaskAPI = async (token, taskId) => {
    const response = await fetch(`${API_BASE}/tasks/complete?uuid=${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail);
    }
    return await response.json();
};


export const RegisterUserAPI = async (email, password, name, team) => {
    const response = await fetch(`${API_BASE}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name, team }),
    });

    if (!response.ok) {
        const error = await response.json();
        alert(`Ошибка регистрации: ${error.detail}`);
    }
    return await response.json();
};
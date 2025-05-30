import { useState } from "react";
import {RegisterUserAPI} from "../api.js";

function RegisterPage({ onRegisterSuccess, onBackToLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [team, setTeam] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        const response = await RegisterUserAPI(email, password, name, team);
        alert("Регистрация прошла успешно!");
        onRegisterSuccess();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleRegister}
                className="bg-white p-8 rounded shadow-md w-96 space-y-4"
            >
                <h2 className="text-2xl font-bold text-center">Регистрация</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Название команды"
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                >
                    Зарегистрироваться
                </button>
                <button
                    type="button"
                    onClick={onBackToLogin}
                    className="w-full text-blue-500 hover:underline mt-2"
                >
                    Уже есть аккаунт? Войти
                </button>
            </form>
        </div>
    );
}

export default RegisterPage;

import { useState } from "react";
import { Input, Button, message, Card } from "antd";
const API_BASE = import.meta.env.VITE_API_URL;

function LoginPage({ onLoginSuccess, onSwitchToRegister }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const formData = new URLSearchParams();
            formData.append("username", username);
            formData.append("password", password);

            const response = await fetch(`${API_BASE}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Неверный логин или пароль");
            }

            const data = await response.json();
            localStorage.setItem("token", data.access_token);
            message.success("Успешный вход!");
            onLoginSuccess?.(data);
        } catch (err) {
            message.error(err.message || "Ошибка авторизации");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card title="Вход в систему" style={{ width: 360 }} className="shadow-lg">
                <div className="space-y-4">
                    <Input
                        placeholder="Почта"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Input.Password
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="primary"
                        block
                        loading={loading}
                        onClick={handleLogin}
                    >
                        Войти
                    </Button>
                    <button
                        type="button"
                        onClick={onSwitchToRegister}
                        className="w-full text-blue-500 hover:underline mt-2"
                    >
                        Нет аккаунта? Зарегистрироваться
                    </button>

                </div>
            </Card>
        </div>
    );
}

export default LoginPage;

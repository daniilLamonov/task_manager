import { useState, useEffect } from "react";
import TaskList from "./components/TaskList";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";


const API_BASE = import.meta.env.VITE_API_URL;
function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        fetch(`${API_BASE}/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (res.ok) {
                    setIsLoggedIn(true);
                } else {
                    localStorage.removeItem("token");
                    setIsLoggedIn(false);
                }
            })
            .catch(() => {
                localStorage.removeItem("token");
                setIsLoggedIn(false);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center p-4">Загрузка...</div>;

    if (isLoggedIn) {
        return <TaskList onLogout={() => setIsLoggedIn(false)} />;
    }

    if (isRegistering) {
        return (
            <RegisterPage
                onRegisterSuccess={() => setIsRegistering(false)}
                onBackToLogin={() => setIsRegistering(false)}
            />
        );
    }

    return (
        <LoginPage
            onLoginSuccess={() => setIsLoggedIn(true)}
            onSwitchToRegister={() => setIsRegistering(true)}
        />
    );
}

export default App;

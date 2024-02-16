import { useEffect, useState } from "react";
import './ThemeToggleButton-light.css';
import './ThemeToggleButton-dark.css';

const ThemeToggleButton = () => {
    const [theme, setTheme] = useState(localStorage.getItem("mode") 
                                       ? localStorage.getItem("mode") 
                                       : "dark");

    const toggleTheme = () => {
        if (theme === 'light') {
        setTheme('dark');
        localStorage.setItem("mode", "dark");
        } else {
        setTheme('light');
        localStorage.setItem("mode", "light");
        }
    }

    useEffect(() => {
        if (theme) {
            document.body.className = theme;
        } else {
            document.body.className = "dark";
            localStorage.setItem("mode", "dark");
        }
    }, [theme]);

    return (
        <div className="theme-toggle-button">
            {theme === "dark" && <span class="material-symbols-outlined mode" onClick={toggleTheme}>light_mode</span>}
            {theme === "light" && <span class="material-symbols-outlined mode" onClick={toggleTheme}>dark_mode</span>}
        </div>
    );
}

export default ThemeToggleButton;
const isDarkModeEnabled = () => {
    return localStorage.theme == 'dark';
};

const setDarkMode = (darkMode = isDarkModeEnabled()) => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    darkMode ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');
    localStorage.theme = darkMode ? 'dark' : 'light';
}

const toggleDarkMode = () => setDarkMode(!isDarkModeEnabled());

export {
    isDarkModeEnabled,
    setDarkMode,
    toggleDarkMode
};

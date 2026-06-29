/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
} from "react";

import useLocalStorage from "../hooks/useLocalStorage";

const ThemeContext =
  createContext();

function ThemeProvider({
  children,
}) {
  const [isDarkMode, setIsDarkMode] =
  useLocalStorage(
    "startup-crm-theme",
    false
  );

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };  

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add(
        "dark"
      );
    } else {
      document.documentElement.classList.remove(
        "dark"
      );
    }
  }, [isDarkMode]);
  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}

export { ThemeContext, ThemeProvider, useTheme };

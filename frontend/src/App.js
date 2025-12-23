import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TrackerPage from "./pages/TrackerPage";
import AddApplicationPage from "./pages/AddApplicationPage";

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TrackerPage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/add" element={<AddApplicationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

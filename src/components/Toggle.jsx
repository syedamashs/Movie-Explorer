import React, { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function Toggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDark]);

  const handleToggle = () => {
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={handleToggle}
      style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "24px",
        zIndex: 1000
      }}
    >
      {isDark ? <FaSun color="orange" /> : <FaMoon color="black" />}
    </button>
  );
}

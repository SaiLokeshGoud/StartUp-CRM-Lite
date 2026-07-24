import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

import { LeadProvider } from "./context/LeadContext";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LeadProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </LeadProvider>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import Landing from "./Landing";
import "./index.css";
import "./i18n"; // ← подключение переводов

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Landing />
  </React.StrictMode>
);

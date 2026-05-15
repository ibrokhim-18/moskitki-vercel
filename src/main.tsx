import React from "react";
import ReactDOM from "react-dom/client";
import ReactGA from "react-ga4";
import Landing from "./Landing";
import "./index.css";
import "./i18n";

ReactGA.initialize("G-GPD3KZLEFQ");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Landing />
  </React.StrictMode>
);

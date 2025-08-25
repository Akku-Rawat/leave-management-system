import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LeaveProvider } from "./context/LeaveContext";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LeaveProvider>
        <App />
      </LeaveProvider>
    </BrowserRouter>
  </React.StrictMode>
);

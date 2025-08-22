// src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ApplyLeavePage from "./pages/ApplyLeavePage";
import HolidaysPage from "./pages/HolidaysPage"; // ⬅️ NEW

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/apply-leave" element={<ApplyLeavePage />} />
    <Route path="/holidays" element={<HolidaysPage />} /> {/* ⬅️ NEW */}
  </Routes>
);

export default App;

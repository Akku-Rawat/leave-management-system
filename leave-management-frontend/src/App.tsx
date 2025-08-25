// src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/employee/Dashboard";
import ApplyLeavePage from "./pages/employee/ApplyLeavePage";
import HolidaysPage from "./pages/employee/HolidaysPage";
import { Toaster } from "react-hot-toast"; // ✅ Import Toaster
import HistoryPage from "./pages/employee/HistoryPage";
const App: React.FC = () => (
  <>
    {/* ✅ Global toaster available across all routes */}
    <Toaster position="top-right" reverseOrder={false} />

    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/apply-leave" element={<ApplyLeavePage />} />
      <Route path="/holidays" element={<HolidaysPage />} />
      <Route path="/history" element={<HistoryPage />} />
    </Routes>
  </>
);

export default App;

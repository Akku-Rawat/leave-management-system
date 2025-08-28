// src/components/LoginPage.tsx

import React, { useState } from "react";
import { FaUser, FaUserTie, FaUserShield, FaLock, FaUserCircle } from "react-icons/fa";
import type { User } from "../Types";

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [step, setStep] = useState<"selectSection" | "login">("selectSection");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Only employee login allowed
  const validUsers = [
    { username: "dixant", password: "dixant" },
    { username:"hr", password:"hr" },
    { username:"boss", password:"boss" }
    // add other employee creds here
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      const match = validUsers.find(u => u.username === username && u.password === password);
      if (match) {
        onLogin({
          name: "Employee",
          id: username,
          department: "Engineering",
          role: username === "hr" ? "hr" : username === "boss" ? "boss" : "employee"
          
        });
      } else {
        setError("Invalid credentials");
        setIsLoading(false);
      }
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (step === "selectSection") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800">ROLAFACE</h1>
            <p className="text-xl text-gray-600">Leave Management System</p>
            <p className="text-gray-500 mt-2">Professional. Efficient. Reliable.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div
              onClick={() => setStep("login")}
              className="bg-white rounded-xl shadow-lg p-8 text-center cursor-pointer hover:shadow-2xl transition"
            >
              <FaUserCircle className="text-6xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800">Leave Management</h3>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 text-center opacity-50 cursor-not-allowed">
              <FaUserTie className="text-6xl text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800">Project Management</h3>
              <p className="text-sm text-gray-600 mt-2">Coming Soon</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 text-center opacity-50 cursor-not-allowed">
              <FaUserShield className="text-6xl text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800"></h3>
              <p className="text-sm text-gray-600 mt-2">Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // step === "login"
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-6">
          <FaLock className="text-5xl text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Employee Login</h2>
        </div>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold transition"
          >
            Sign In
          </button>
        </form>
        <button
          onClick={() => { setStep("selectSection"); setUsername(""); setPassword(""); setError(""); }}
          className="mt-4 text-blue-600 hover:underline text-sm"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

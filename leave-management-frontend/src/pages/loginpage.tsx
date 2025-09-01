import React, { useState } from "react";
import {
  FaUserCircle,
  FaUserTie,
  FaUserShield,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "../Types";

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [step, setStep] = useState<"selectSection" | "login">("selectSection");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const validUsers = [
    { username: "emp", password: "emp" },
    { username: "hr", password: "hr" },
    { username: "boss", password: "boss" },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShake(false);
    setIsLoading(true);

    setTimeout(() => {
      const match = validUsers.find(
        (u) => u.username === username && u.password === password
      );
      if (match) {
        onLogin({
          name: "Employee",
          id: username,
          department: "DEVELOPMENT",
          role:
            username === "hr" ? "hr" : username === "boss" ? "boss" : "employee",
        });
      } else {
        setError("Invalid credentials");
        setIsLoading(false);
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white mx-auto"></div>
          <p className="text-white text-center mt-4 font-medium">
            Authenticating...
          </p>
        </motion.div>
      </div>
    );
  }

  if (step === "selectSection") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 relative overflow-hidden">
        <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto max-w-6xl"
          >
            {/* Branding */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-16"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mx-auto max-w-2xl border border-white/10 shadow-2xl">
                <h1 className="text-6xl font-extrabold text-white drop-shadow-lg mb-4">
                  ROLAFACE
                </h1>
                <p className="text-2xl text-white/90 mb-2">
                  Leave Management System
                </p>
                <p className="text-white/70 text-lg">
                  Professional • Efficient • Reliable
                </p>
              </div>
            </motion.div>

            {/* Service Cards */}
            <div className="grid lg:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep("login")}
                className="group bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-center cursor-pointer hover:bg-white/20 transition duration-500 transform hover:-translate-y-2 border border-white/20 shadow-2xl hover:shadow-blue-500/40"
              >
                <div className="bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl p-4 w-20 h-20 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FaUserCircle className="text-4xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-200 transition-colors">
                  Leave Management
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  Manage employee leaves, requests, and approvals
                </p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium shadow-md hover:shadow-lg transition"
                >
                  Get Started
                </motion.button>
              </motion.div>

              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 text-center border border-white/10 shadow-xl opacity-70">
                <div className="bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl p-4 w-20 h-20 mx-auto mb-6">
                  <FaUserTie className="text-4xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Project Management
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  Track projects, tasks, and team collaboration
                </p>
                <span className="px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-semibold rounded-full">
                  Coming Soon
                </span>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 text-center border border-white/10 shadow-xl opacity-70">
                <div className="bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-2xl p-4 w-20 h-20 mx-auto mb-6">
                  <FaUserShield className="text-4xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  System Admin
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  Configure system settings and user management
                </p>
                <span className="px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-semibold rounded-full">
                  Coming Soon
                </span>
              </div>
            </div>

            <div className="text-center mt-16 text-white/60 text-sm">
              © 2025 ROLAFACE. All rights reserved.
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Login Step
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 relative overflow-hidden flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key="login-card"
          initial={{ opacity: 0, y: 40 }}
          animate={{
            opacity: 1,
            y: 0,
            x: shake ? [0, -10, 10, -10, 10, 0] : 0,
          }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
        >
          <div className="text-center mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl p-4 w-16 h-16 mx-auto mb-4">
              <FaLock className="text-3xl text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-white/80">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-gradient-to-r from-red-500 to-pink-500 border border-red-400/40 rounded-xl p-3 mb-4 shadow-md shadow-red-500/30">
              <p className="text-white text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-white/90 mb-2 font-medium">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your username"
                required
              />
              <p className="text-white/50 text-xs mt-1">Try: emp, hr, boss</p>
            </div>
            <div className="mb-6 relative">
              <label className="block text-white/90 mb-2 font-medium">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-white/70 hover:text-white"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-xl py-3 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Sign In
            </motion.button>
          </form>

          <button
            onClick={() => {
              setStep("selectSection");
              setUsername("");
              setPassword("");
              setError("");
            }}
            className="mt-6 w-full border border-white/40 text-white/90 py-2 rounded-xl hover:bg-white/10 transition"
          >
            ← Back to Services
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
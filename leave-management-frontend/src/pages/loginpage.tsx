import React, { useState } from "react";
import bgImage from "../assets/bg.jpg";
import logo from '../assets/rolafacelogo.jpg';
import { login } from "../services/api";

import {
  FaUserCircle,
  FaUserTie,
  FaUserShield,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import type { LoginPageProps } from "../Types";

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [step, setStep] = useState<"selectSection" | "login">("selectSection");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setShake(false);
  setIsLoading(true);

  try {
    // ✅ ab api.ts ka login function use hoga
    const data = await login(username, password);

    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    onLogin(data.user);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    setError(errMsg);
    setShake(true);
    setTimeout(() => setShake(false), 600);
  } finally {
    setIsLoading(false);
  }
};

  // 🔄 Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
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

  // 🌟 Section Selection
  if (step === "selectSection") {
    return (
      <div
        className="min-h-screen relative overflow-hidden bg-gray-900"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto max-w-6xl"
          >
            {/* Branding */}
            <div className="text-center mb-14">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 mx-auto max-w-2xl border border-white/10 shadow-lg">
                {/* Logo instead of text */}
               <img src={logo} alt="ROLAFACE Logo" className="mx-auto h-16 w-auto mb-3 drop-shadow" />
                {/* <p className="text-lg text-white/70 font-medium tracking-wide">
                  A unified workspace for teams — Leave, Projects & Admin
                </p> */}
              </div>
            </div>


            {/* Cards */}
            <div className="grid gap-8 md:grid-cols-3">
              {/* Active card */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep("login")}
                className="group bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-center cursor-pointer border border-white/20 shadow-2xl hover:shadow-blue-500/40 transition-all"
              >
                <div className="bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaUserCircle className="text-5xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-200">
                  Leave Management
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Manage employee leaves, requests, and approvals
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium shadow-md hover:shadow-lg transition"
                >
                  Get Started
                </motion.button>
              </motion.div>
              

              {/* Coming soon cards */}
              {[
                {
                  icon: <FaUserTie className="text-5xl text-white" />,
                  title: "Project Management",
                  desc: "Track projects, tasks, and team collaboration",
                  gradient: "from-emerald-400 to-green-600",
                },
                {
                  icon: <FaUserShield className="text-5xl text-white" />,
                  title: "System Admin",
                  desc: "Configure system settings and user management",
                  gradient: "from-fuchsia-500 to-purple-600",
                },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 text-center border border-white/10 shadow-xl hover:shadow-lg transition"
                >
                  <div
                    className={`bg-gradient-to-br ${card.gradient} rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center`}
                  >
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-white/70 text-sm mb-4">{card.desc}</p>
                  <span className="inline-block px-4 py-1 bg-yellow-400 text-gray-900 text-xs font-semibold rounded-full">
                    Coming Soon
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center mt-16 text-white/50 text-xs space-x-4">
              <span>© 2025 ROLAFACE. All rights reserved.</span>
              <a href="#" className="hover:text-white/80">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white/80">
                Contact
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // 🔑 Login Step
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-900 p-4"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
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
            <div className="bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FaLock className="text-2xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
            <p className="text-white/70 text-sm">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-3 mb-4 shadow-md shadow-red-500/30">
              <p className="text-white text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-white/80 mb-2 font-medium">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter your username"
                required
              />
              <p className="text-white/50 text-xs mt-1">Try: emp, hr, boss</p>
            </div>
            <div className="mb-6 relative">
              <label className="block text-white/90 mb-2 font-medium">Password</label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 pr-10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                  required
                />

                {/* Eye Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
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
            className="mt-6 w-full border border-white/30 text-white/80 py-2 rounded-xl hover:bg-white/10 transition"
          >
            ← Back to Services
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
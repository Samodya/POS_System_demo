import { motion } from "framer-motion";
import { useLogin } from "../hooks/useLogin";
import { useState } from "react";
import Cookies from "js-cookie";
import apiService from "../utilities/httpservices";

export default function Login() {
    const { login, error, isLoading } = useLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onClick = async (e) => {
    e.preventDefault(); 
  
    try {
      await login(username,password);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-black to-blue-900 overflow-hidden px-4">
      {/* Brand */}
      <div className="absolute top-10 text-3xl font-bold text-white select-none tracking-wider">
        <span className="text-white">Master</span>
        <span className="text-blue-400">Tech</span>
        <div className="text-sm">computer solutions</div>
      </div>
      <div></div>

      {/* Login Card */}
      <motion.div
        className="pointer-events-auto w-full max-w-md bg-gray-600 rounded-xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-semibold text-gray-400 mb-6">
          Sign in to your account
        </h1>

        <form className="space-y-5" onSubmit={onClick}>
          {/* Email */}
          <div className="">
            <div className="flex">
              <label
                htmlFor="username"
                className="block text-sm text-gray-200 mb-1"
              >
                Username
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-200">
                {/* Mail Icon */}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A9.003 9.003 0 0112 15a9.003 9.003 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </span>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e)=>{
                    setUsername(e.target.value)
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your username"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex ">
              <label
                htmlFor="password"
                className="block text-sm text-gray-300 mb-1"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                {/* Lock Icon */}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-4 4h8a2 2 0 002-2v-6a2 2 0 00-2-2H8a2 2 0 00-2 2v6a2 2 0 002 2zm0-10V7a4 4 0 118 0v2"
                  />
                </svg>
              </span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e)=>{
                    setPassword(e.target.value)
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" className="h-4 w-4" />
              Remember me
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>

        {/* <p className="text-sm text-center text-gray-300 mt-6">
          Don’t have an account?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p> */}
      </motion.div>
    </div>
  );
}

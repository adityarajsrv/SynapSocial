import { useState } from "react";
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import loginUI from "../assets/loginUI.png";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const endpoint = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Something went wrong");
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user.name);
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1200);
      } else {
        setSuccess("Registration successful! You can now log in.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 sm:p-12 overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] bg-repeat mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-800/10 to-transparent" />
      </div>
      <div className="relative z-10 w-full max-w-4xl bg-gray-800 rounded-2xl shadow-2xl mx-auto p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-center gap-12 border border-gray-700">
        <div className="w-full sm:w-1/2 h-96 rounded-xl overflow-hidden flex items-center justify-center bg-gray-900">
          <img className="h-[400px] w-[500px]" src={loginUI} alt="Login UI" />
        </div>
        <div className="w-full sm:w-1/2 space-y-8">
          <div className="text-center sm:text-left">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              {isLogin ? "Welcome Back" : "Join SynapSocial"}
            </h2>
            <p className="mt-2 text-sm text-gray-300">
              {isLogin
                ? "Sign in to unlock your potential"
                : "Start your journey"}
              <span
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-blue-400 hover:text-blue-300 cursor-pointer font-medium underline decoration-1"
              >
                {isLogin ? "Need an account?" : "Already registered?"}
              </span>
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-200"
                >
                  Username
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-600 bg-gray-700 focus:bg-gray-600 focus:border-blue-500 focus:ring-blue-500 text-white placeholder-gray-400 p-3 transition-all duration-200"
                  placeholder="Enter your username"
                  required
                />
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-600 bg-gray-700 focus:bg-gray-600 focus:border-blue-500 focus:ring-blue-500 text-white placeholder-gray-400 p-3 transition-all duration-200"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-200"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-gray-600 bg-gray-700 focus:bg-gray-600 focus:border-blue-500 focus:ring-blue-500 text-white placeholder-gray-400 p-3 pr-10 transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full flex items-center justify-center py-3 px-6 bg-gradient-to-r from-blue-800 to-blue-900 text-white rounded-xl hover:opacity-90 transition disabled:opacity-50"
            >
              <LockClosedIcon className="h-6 w-6 mr-2" />
              {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
            </button>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            {success && <p className="text-green-400 text-sm">{success}</p>}
          </form>

          <div className="text-center text-xs text-gray-400">
            <p>
              By signing up, you agree to our{" "}
              <a className="text-blue-400 hover:text-blue-300 underline">
                Terms
              </a>{" "}
              and{" "}
              <a className="text-blue-400 hover:text-blue-300 underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

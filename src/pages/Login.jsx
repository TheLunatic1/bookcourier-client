import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body p-8">
          <div className="text-center mb-8">
            <img src="/src/assets/bookC.webp" alt="BookCourier" className="w-20 h-20 mx-auto rounded-lg" />
            <h1 className="text-3xl font-bold mt-4">Welcome Back!</h1>
            <p className="text-base-content/60 mt-2">Login to your BookCourier account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="input-group">
                <span className="bg-base-200">
                  <FiMail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="input-group">
                <span className="bg-base-200">
                  <FiLock className="w-5 h-5" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input input-bordered w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-6"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Login"
              )}
            </button>
          </form>
          

          <div className="text-center mt-6">
            <p className="text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="link link-primary font-bold">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
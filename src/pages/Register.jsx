import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import API from "../services/api";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiImage, FiEye, FiEyeOff } from "react-icons/fi";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    photoURL: "",
  });

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(pwd)) return "Must contain 1 uppercase letter";
    if (!/[a-z]/.test(pwd)) return "Must contain 1 lowercase letter";
    if (!/[0-9]/.test(pwd)) return "Must contain 1 number";
    if (!/[!@#$%^&*]/.test(pwd)) return "Must contain 1 special character (!@#$%^&*)";
    return "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setForm({ ...form, photoURL: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validatePassword(form.password);
    if (error) {
      setPasswordError(error);
      return;
    }
    setPasswordError("");

    if (!form.photoURL) {
      toast.error("Please upload a profile picture");
      return;
    }

    setLoading(true);
    try {
      const success = await register(form.name, form.email, form.password, form.photoURL);
      if (success) {
        toast.success("Account created successfully!");
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error("Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center py-12">
      <div className="card bg-base-100 shadow-2xl w-full max-w-lg">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center mb-8">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <FiImage /> Profile Picture
                </span>
              </label>
              <div className="flex flex-col items-center">
                {!preview ? (
                  <label className="border-4 border-dashed border-base-300 rounded-xl w-48 h-48 flex items-center justify-center cursor-pointer hover:border-primary transition">
                    <div className="text-center">
                      <FiImage className="w-12 h-12 opacity-50" />
                      <p className="mt-2 text-sm">Click to upload</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      required
                    />
                  </label>
                ) : (
                  <div className="relative">
                    <img src={preview} alt="Preview" className="w-48 h-48 rounded-xl object-cover shadow-lg" />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview("");
                        setForm({ ...form, photoURL: "" });
                      }}
                      className="btn btn-circle btn-error absolute -top-3 -right-3"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <FiUser /> Full Name
                </span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <FiMail /> Email
                </span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <FiLock /> Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter strong password"
                  className="input input-bordered w-full pr-12"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    setPasswordError("");
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-4"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {passwordError && (
                <label className="label">
                  <span className="label-text-alt text-error">{passwordError}</span>
                </label>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
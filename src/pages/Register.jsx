import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiImage, FiLink, FiEye, FiEyeOff, FiX } from "react-icons/fi";
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
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
    if (!/[!@#$%^&*]/.test(pwd)) return "Must contain 1 special character";
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

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setPreview(urlInput);
      setForm({ ...form, photoURL: urlInput });
      setShowUrlInput(false);
      setUrlInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const pwdError = validatePassword(form.password);
    if (pwdError) {
      setPasswordError(pwdError);
      return;
    }

    if (!form.photoURL) {
      toast.error("Please add a profile picture (upload or URL)");
      return;
    }

    setLoading(true);
    try {
      const success = await register(form.name, form.email, form.password, form.photoURL);
      if (success) {
        toast.success("Account created!");
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
            {/* PROFILE PICTURE */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2 w-full">
                  <FiImage /> Profile Picture <span className="text-error">*</span>
                </span>
              </label>

              {!preview ? (
                <div className="space-y-4">
                  <label className="border-4 border-dashed border-base-300 rounded-xl w-full h-64 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition ">
                    <FiImage className="w-1/2 h-1/2 opacity-50 mt-10" />
                    <p className="mt-4">Click to upload image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  <div className="text-center">
                    <span className="text-sm opacity-70">or</span>
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(true)}
                      className="link link-primary ml-2 flex items-center gap-1 w-full"
                    >
                      <FiLink className="w-4 h-4" />
                      Add from URL
                    </button>
                  </div>

                  {showUrlInput && (
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://avatar.iran.liara.run/public"
                        className="input input-bordered flex-1"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleUrlSubmit()}
                      />
                      <button type="button" onClick={handleUrlSubmit} className="btn btn-success">
                        Add
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <img src={preview} alt="Preview" className="w-64 h-64 rounded-xl object-cover mx-auto shadow-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview("");
                      setForm({ ...form, photoURL: "" });
                      setShowUrlInput(false);
                    }}
                    className="btn btn-circle btn-error absolute top-2 right-2"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              )}

              {!preview && (
                <label className="label">
                  <span className="label-text-alt text-error w-full">Profile picture is required</span>
                </label>
              )}
            </div>

            {/* NAME */}
            <div className="form-control">
              <label className="label"><span className="label-text font-medium"><FiUser /> Full Name</span></label>
              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered w-full"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            {/* EMAIL */}
            <div className="form-control">
              <label className="label"><span className="label-text font-medium"><FiMail /> Email</span></label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="form-control">
              <label className="label"><span className="label-text font-medium"><FiLock /> Password</span></label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Strong password"
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

            <button
              type="submit"
              disabled={loading || !form.photoURL}
              className="btn btn-primary w-full"
            >
              {loading ? <span className="loading loading-spinner"></span> : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-6">
            Already have an account? <Link to="/login" className="link link-primary">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
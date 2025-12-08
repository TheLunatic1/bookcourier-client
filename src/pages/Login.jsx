import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import API from "../services/api";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) navigate("/dashboard");
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
    
      const displayName = user.displayName || user.email?.split("@")[0] || "User";
      const email = user.email;
      const photoURL = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`;
    
      if (!email) {
        toast.error("Google login failed: No email");
        return;
      }
    
      const res = await API.post("/users/google-login", {
        name: displayName,
        email,
        photoURL,
      });
    
      const { token, ...userData } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      toast.success(`Welcome, ${displayName.split(" ")[0]}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center py-12">
      <div className="card bg-base-100 shadow-2xl w-full max-w-md">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center mb-8">Login to BookCourier</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className=" form-control">
              <label className="label"><span className="label-text">Email</span></label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className=" form-control">
              <label className="label"><span className="label-text">Password</span></label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? <span className="loading loading-spinner"></span> : "Login"}
            </button>
          </form>

          <div className="divider">OR</div>

          <button
            onClick={handleGoogleLogin}
            className="btn btn-outline btn-primary w-full flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="link link-primary">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FiSun, FiMoon, FiMenu, FiLogOut } from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const newTheme = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const currentTheme = document.documentElement.getAttribute("data-theme") || "light";

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-2xl font-bold">
          <img
            src="https://i.imgur.com/kQ4ngAc.png"
            alt="BookCourier"
            className="h-10 w-10 rounded-lg object-contain bg-transparent p-1"
          />
          BookCourier
        </Link>
      </div>

      {/* Desktop menu */}
      <div className="hidden lg:flex items-center gap-4">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/all-books">All Books</Link></li>
          
          {user && (
            <>
              <li><Link to="/request-delivery">Request Delivery</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </>
          )}
        </ul>

        {/* Theme toggle */}
        <label className="swap swap-rotate">
          <input
            type="checkbox"
            checked={currentTheme === "dark"}
            onChange={toggleTheme}
            className="theme-controller"
          />
          <FiSun className="swap-off w-6 h-6 text-yellow-500" />
          <FiMoon className="swap-on w-6 h-6 text-blue-400" />
        </label>

        {/* User avatar / login */}
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={user.photoURL} alt={user.name} />
              </div>
            </label>
            <ul className="menu dropdown-content mt-3 p-4 shadow bg-base-100 rounded-box w-52">
              <li><span className="font-bold">{user.name}</span></li>
              <li><span className="text-sm opacity-70">Role: {user.role}</span></li>
              <li>
                <button onClick={handleLogout} className="btn btn-sm btn-error mt-3 w-full">
                  <FiLogOut className="mr-2" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      <div className="lg:hidden">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost">
            <FiMenu className="w-6 h-6" />
          </label>
          <ul tabIndex={0} className="menu dropdown-content mt-3 p-4 shadow bg-base-100 rounded-box w-64 z-50">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/all-books">All Books</Link></li>

            {user && (
              <>
                <li><Link to="/request-delivery">Request Delivery</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
              </>
            )}

            <li className="menu-title mt-3">Theme</li>
            <li>
              <label className="swap swap-rotate w-full justify-center py-3">
                <input
                  type="checkbox"
                  checked={currentTheme === "dark"}
                  onChange={toggleTheme}
                  className="theme-controller"
                />
                <FiSun className="swap-off w-6 h-6 text-yellow-500" />
                <FiMoon className="swap-on w-6 h-6 text-blue-400" />
              </label>
            </li>

            {user ? (
              <>
                <li><span className="font-bold">{user.name}</span></li>
                <li>
                  <button onClick={handleLogout} className="btn btn-error btn-sm w-full">
                    <FiLogOut className="mr-2" />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="btn btn-outline w-full">Login</Link></li>
                <li><Link to="/register" className="btn btn-primary w-full mt-2">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
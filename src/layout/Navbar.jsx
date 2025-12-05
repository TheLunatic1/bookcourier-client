import { Link } from "react-router-dom";
import { FiSun, FiMoon, FiMenu } from "react-icons/fi";

export default function Navbar() {
  const toggleTheme = () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const newTheme = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const currentTheme = typeof window !== "undefined" 
    ? (document.documentElement.getAttribute("data-theme") || localStorage.getItem("theme") || "light")
    : "light";

  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
      {/* Logo */}
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-2xl font-bold p-1">
          <img
            src="/src/assets/bookC.webp" // have to change logo later
            alt="BookCourier"
            className="h-9 w-9 rounded-lg object-contain bg-white p-1"
          />
          BookCourier
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center gap-4">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/all-books">All Books</Link></li>
          <li><Link to="/request-delivery">Request Delivery</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
        </ul>

        {/* Theme Toggle with React Icons */}
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

        <Link to="/login" className="btn btn-primary btn-sm">
          Login
        </Link>
      </div>

      {/* Mobile Menu */}
      <div className="lg:hidden">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost">
            <FiMenu className="w-6 h-6" />
          </label>
          <ul tabIndex={0} className="menu dropdown-content mt-3 p-4 shadow bg-base-100 rounded-box w-64 z-50">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/all-books">All Books</Link></li>
            <li><Link to="/request-delivery">Request Delivery</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
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
            <li><Link to="/login" className="btn btn-primary btn-sm mt-3">Login</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
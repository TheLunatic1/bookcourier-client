import { Link } from "react-router-dom";

export default function Navbar() {
  // Toggle theme
  const toggleTheme = () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const newTheme = current === "light" ? "dark" : "light";
    
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Read current theme directly from localStorage
  const currentTheme = typeof window !== "undefined" 
    ? (document.documentElement.getAttribute("data-theme") || localStorage.getItem("theme") || "light")
    : "light";

  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
      {/* Logo */}
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-2xl font-bold">
          <img
            src="/src/assets/bookC.webp" // have to change logo later
            alt="BookCourier"
            className="h-10 w-10 rounded-lg object-contain"
          />
          BookCourier
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center gap-2">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/all-books">All Books</Link></li>
          <li><Link to="/request-delivery">Request Delivery</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
        </ul>

        {/* Theme Toggle */}
        <label className="swap swap-rotate mx-4">
          <input
            type="checkbox"
            checked={currentTheme === "dark"}
            onChange={toggleTheme}
            className="theme-controller"
          />
          <span className="swap-on">🌙</span>
          <span className="swap-off">☀️</span>
        </label>

        <Link to="/login" className="btn btn-primary btn-sm">
          Login
        </Link>
      </div>

      {/* Mobile Menu */}
      <div className="lg:hidden">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 z-50">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/all-books">All Books</Link></li>
            <li><Link to="/request-delivery">Request Delivery</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li className="menu-title mt-2">Theme</li>
            <li>
              <label className="swap swap-rotate w-full justify-center">
                <input
                  type="checkbox"
                  checked={currentTheme === "dark"}
                  onChange={toggleTheme}
                  className="theme-controller"
                />
                <span className="swap-on">🌙 Dark</span>
                <span className="swap-off">☀️ Light</span>
              </label>
            </li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
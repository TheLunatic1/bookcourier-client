import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import API from "../services/api";
import { 
  FiPackage, FiHeart, FiUser, FiBookOpen, FiUsers, FiCheckCircle,
  FiLogOut, FiStar, FiMenu, FiX,
  FiFileText
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const requestLibrarian = async () => {
    setRequesting(true);
    try {
      await API.post("/users/request-librarian");
      toast.success("Request sent!");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      toast.error("Failed");
    }
    setRequesting(false);
  };

  if (!user) return null;

  const menu = {
    user: [
      { label: "My Orders", href: "/dashboard/orders", icon: FiPackage },
      { label: "Wishlist", href: "/dashboard/wishlist", icon: FiHeart },
      { label: "Invoices", href: "/dashboard/invoices", icon: FiFileText },
      { label: "Profile", href: "/dashboard/profile", icon: FiUser },
    ],
    librarian: [
      { label: "Add Book", href: "/dashboard/add-book", icon: FiBookOpen },
      { label: "My Books", href: "/dashboard/my-books", icon: FiPackage },
      { label: "Manage Orders", href: "/dashboard/librarian-orders", icon: FiPackage },
      { label: "Profile", href: "/dashboard/profile", icon: FiUser },
    ],
    admin: [
      { label: "All Users", href: "/dashboard/admin/users", icon: FiUsers },
      { label: "Librarian Requests", href: "/dashboard/admin/requests", icon: FiCheckCircle },
      { label: "All Orders", href: "/dashboard/admin/orders", icon: FiPackage },
      { label: "Manage Books", href: "/dashboard/admin/books", icon: FiBookOpen },
      { label: "Profile", href: "/dashboard/profile", icon: FiUser },
    ],
  };

  const items = menu[user.role] || menu.user;

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" checked={sidebarOpen} onChange={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <div className="drawer-content flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden navbar bg-base-100 shadow-lg">
          <div className="flex-none">
            <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost drawer-button">
              <FiMenu className="w-6 h-6" />
            </label>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-4 lg:p-8">
          <Outlet /> {/* This loads the child pages */}
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <div className="w-80 h-full bg-base-100 shadow-2xl">
          <div className="p-8">
            {/* Close button on mobile */}
            <label htmlFor="dashboard-drawer" className="btn btn-circle btn-ghost absolute right-4 top-4 lg:hidden">
              <FiX className="w-6 h-6" />
            </label>

            {/* User Info */}
            <div className="text-center mb-8">
              <div className="avatar">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4 mx-auto">
                  <img src={user.photoURL} alt={user.name} />
                </div>
              </div>
              <h2 className="text-2xl font-bold mt-6">{user.name}</h2>
              <div className="badge badge-primary badge-lg mt-3 py-4 px-6">
                {user.role.toUpperCase()}
              </div>
            </div>

            {/* Become Librarian */}
            {user.role === "user" && !user.librarianRequest && (
              <button
                onClick={requestLibrarian}
                disabled={requesting}
                className="btn btn-outline btn-accent w-full mb-6"
              >
                {requesting ? <span className="loading loading-spinner"></span> : (
                  <>
                    <FiStar className="mr-2" />
                    Become a Librarian
                  </>
                )}
              </button>
            )}

            {user.librarianRequest && user.role === "user" && (
              <div className="alert alert-info mb-6">
                <FiCheckCircle />
                <span>Request sent! Waiting for approval...</span>
              </div>
            )}

            {/* Menu */}
            <ul className="menu p-0">
              {items.map((item) => (
                <li key={item.href}>
                  <Link 
                    to={item.href}
                    className="mb-2"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="divider my-8"></div>

            <button onClick={logout} className="btn btn-error btn-outline w-full">
              <FiLogOut className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
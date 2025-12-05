// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import API from "../services/api";
import { 
  FiUser, FiPackage, FiHeart, FiSettings, FiLogOut, 
  FiStar, FiBookOpen, FiUsers, FiCheckCircle 
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [requesting, setRequesting] = useState(false);
  const [isLibrarian, setIsLibrarian] = useState(user?.role === "librarian");

  useEffect(() => {
    setIsLibrarian(user?.role === "librarian");
  }, [user]);

  const requestLibrarian = async () => {
    setRequesting(true);
    try {
      await API.post("/users/request-librarian", { userId: user._id });
      toast.success("Request sent to admin!");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      toast.error("Request failed");
    }
    setRequesting(false);
  };

  if (!user) return <div className="min-h-screen bg-base-200 flex items-center justify-center text-2xl">Loading...</div>;

  const menuItems = {
    user: [
      { icon: FiPackage, label: "My Orders", href: "/my-orders" },
      { icon: FiHeart, label: "Wishlist", href: "/wishlist" },
      { icon: FiUser, label: "Profile", href: "/profile" },
      { icon: FiSettings, label: "Settings", href: "/settings" },
    ],
    librarian: [
      { icon: FiBookOpen, label: "Add Book", href: "/add-book" },
      { icon: FiPackage, label: "My Books", href: "/my-books" },
      { icon: FiPackage, label: "Manage Orders", href: "/librarian-orders" },
      { icon: FiUser, label: "Profile", href: "/profile" },
    ],
    admin: [
      { icon: FiUsers, label: "All Users", href: "/admin/users" },
      { icon: FiCheckCircle, label: "Librarian Requests", href: "/admin/requests" },
      { icon: FiPackage, label: "All Orders", href: "/admin/orders" },
      { icon: FiSettings, label: "Site Settings", href: "/admin/settings" },
    ],
  };

  const items = menuItems[user.role] || menuItems.user;

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-2xl">
              <div className="card-body">
                <div className="text-center mb-6">
                  <div className="avatar">
                    <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
                      <img src={user.photoURL} alt={user.name} />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
                  <div className="badge badge-lg badge-primary mt-2">
                    {user.role.toUpperCase()}
                  </div>
                </div>

                {/* Librarian Request Button */}
                {user.role === "user" && !user.librarianRequest && (
                  <button
                    onClick={requestLibrarian}
                    disabled={requesting}
                    className="btn btn-outline btn-accent w-full mb-4"
                  >
                    {requesting ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      <>
                        <FiStar className="mr-2" /> Become a Librarian
                      </>
                    )}
                  </button>
                )}

                {user.librarianRequest && user.role === "user" && (
                  <div className="alert alert-info shadow-lg mb-4">
                    <FiCheckCircle />
                    <span>Request sent! Waiting for admin approval...</span>
                  </div>
                )}

                {/* Menu Items */}
                <div className="menu p-0">
                  {items.map((item, i) => (
                    <li key={i}>
                      <Link to={item.href} className="py-3">
                        <item.icon />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </div>

                <div className="divider"></div>
                
                <button onClick={logout} className="btn btn-error btn-outline w-full">
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="card bg-base-100 shadow-2xl">
              <div className="card-body">
                <h1 className="text-4xl font-bold mb-4">
                  {user.role === "admin" && "Admin Control Panel"}
                  {user.role === "librarian" && "Librarian Dashboard"}
                  {user.role === "user" && "Welcome Back!"}
                </h1>
                <p className="text-xl opacity-70">
                  {user.role === "admin" && "Manage the entire BookCourier system"}
                  {user.role === "librarian" && "Manage your library books and orders"}
                  {user.role === "user" && `Hello, ${user.name}! Ready to read?`}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                  {items.map((item, i) => (
                    <Link
                      key={i}
                      to={item.href}
                      className="card bg-base-200 hover:bg-base-300 transition-all hover:scale-105 cursor-pointer p-8 text-center"
                    >
                      <item.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h3 className="font-bold text-lg">{item.label}</h3>
                      <p className="text-sm opacity-70 mt-2">Click to manage</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import API from "../services/api";
import { 
  FiPackage, FiHeart, FiUser, 
  FiBookOpen, FiUsers, FiCheckCircle,
  FiLogOut, FiStar,
  FiFileText
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [requesting, setRequesting] = useState(false);

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

  if (!user) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const dashboardCards = {
    user: [
      { icon: FiPackage, label: "My Orders", href: "/my-orders", color: "text-blue-600" },
      { icon: FiHeart, label: "Wishlist", href: "/wishlist", color: "text-pink-600" },
      { icon: FiUser, label: "Profile", href: "/profile", color: "text-purple-600" },
      { icon: FiFileText, label: "Invoices", href: "/invoices", color: "text-teal-600" },
    ],
    librarian: [
      { icon: FiBookOpen, label: "Add Book", href: "/add-book", color: "text-green-600" },
      { icon: FiPackage, label: "My Books", href: "/my-books", color: "text-indigo-600" },
      { icon: FiPackage, label: "Manage Orders", href: "/librarian-orders", color: "text-orange-600" },
    ],
    admin: [
      { icon: FiUsers, label: "All Users", href: "/admin/users", color: "text-red-600" },
      { icon: FiCheckCircle, label: "Librarian Requests", href: "/admin/requests", color: "text-yellow-600" },
      { icon: FiPackage, label: "All Orders", href: "/admin/orders", color: "text-teal-600" },
    ],
  };

  const cards = dashboardCards[user.role] || dashboardCards.user;

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-2xl sticky top-6">
              <div className="card-body p-8">
                <div className="flex flex-col items-center">
                  <div className="avatar mb-6">
                    <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
                      <img src={user.photoURL} alt={user.name} className="object-cover" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-center">{user.name}</h2>
                  <div className="mt-4">
                    <span className="badge badge-lg badge-primary text-lg py-4 px-6">
                      {user.role.toUpperCase()}
                    </span>
                  </div>

                  {/* Become Librarian */}
                  {user.role === "user" && !user.librarianRequest && (
                    <button
                      onClick={requestLibrarian}
                      disabled={requesting}
                      className="btn btn-outline btn-accent w-full mt-8"
                    >
                      {requesting ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        <>
                          <FiStar className="mr-2" />
                          Become a Librarian
                        </>
                      )}
                    </button>
                  )}

                  {user.librarianRequest && user.role === "user" && (
                    <div className="alert alert-info shadow-lg mt-8 w-full text-center">
                      <FiCheckCircle className="w-5 h-5" />
                      <span className="text-sm">Request sent! Waiting for admin...</span>
                    </div>
                  )}

                  <div className="divider my-8"></div>

                  <button
                    onClick={logout}
                    className="btn btn-error btn-outline w-full"
                  >
                    <FiLogOut className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — PERFECTLY ALIGNED CARDS */}
          <div className="lg:col-span-3">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4">
                {user.role === "admin" && "Admin Control Panel"}
                {user.role === "librarian" && "Librarian Dashboard"}
                {user.role === "user" && `Welcome back, ${user.name.split(" ")[0]}!`}
              </h1>
              <p className="text-xl opacity-70 max-w-2xl mx-auto">
                {user.role === "admin" && "You have full control over BookCourier"}
                {user.role === "librarian" && "Manage your books and serve our readers"}
                {user.role === "user" && "Discover amazing books & get them delivered to your door!"}
              </p>
            </div>

            {/* ICONS PERFECTLY CENTERED — NO TEXT BELOW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {cards.map((card, i) => (
                <Link
                  key={i}
                  to={card.href}
                  className="group flex flex-col items-center justify-center p-10 rounded-2xl bg-base-100 shadow-xl hover:shadow-2xl transition-all hover:scale-110"
                >
                  <div className={`text-8xl mb-6 ${card.color} group-hover:scale-125 transition-transform`}>
                    <card.icon />
                  </div>
                  <h3 className="text-2xl font-bold text-center">{card.label}</h3>
                </Link>
              ))}
            </div>

            {/* Extra for Users */}
            {user.role === "user" && (
              <div className="text-center mt-16">
                <p className="text-lg opacity-80 mb-6">
                  Ready to read? Browse our collection and get books delivered!
                </p>
                <Link to="/all-books" className="btn btn-primary btn-lg">
                  Browse All Books
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
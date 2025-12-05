import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyOrders from "./pages/MyOrders";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AddBook from "./pages/AddBook";
import MyBooks from "./pages/MyBooks";
import AdminUsers from "./pages/AdminUsers";
import AdminRequests from "./pages/AdminRequests";

// Placeholders
import NotFound from "./pages/NotFound";
import AllBooks from "./pages/AllBooks";
import RequestDelivery from "./pages/RequestDelivery";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      {/* Main Layout (Navbar + Footer) */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/all-books" element={<AllBooks />} />
        <Route path="/request-delivery" element={<RequestDelivery />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/my-books" element={<MyBooks />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/requests" element={<AdminRequests />} />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
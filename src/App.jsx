// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyOrders from "./pages/MyOrders";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Invoices from "./pages/Invoices";
import AddBook from "./pages/AddBook";
import MyBooks from "./pages/MyBooks";
import LibrarianOrders from "./pages/LibrarianOrders";
import AdminUsers from "./pages/AdminUsers";
import AdminRequests from "./pages/AdminRequests";
import AdminOrders from "./pages/AdminOrders";
import AdminBooks from "./pages/AdminBooks";
import AllBooks from "./pages/AllBooks";
import BookDetails from "./pages/BookDetails";
import RequestDelivery from "./pages/RequestDelivery";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/all-books" element={<AllBooks />} />
        <Route path="/request-delivery" element={<RequestDelivery />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* DASHBOARD WITH SIDEBAR */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Default dashboard page */}
          <Route index element={
            <div className="text-center py-20">
              <h1 className="text-5xl font-bold mb-6">Welcome to Your Dashboard</h1>
              <p className="text-xl opacity-70">Select an option from the sidebar</p>
            </div>
          } />

          {/* User Routes */}
          <Route path="orders" element={<MyOrders />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="profile" element={<Profile />} />

          {/* Librarian Routes */}
          <Route path="add-book" element={<AddBook />} />
          <Route path="my-books" element={<MyBooks />} />
          <Route path="librarian-orders" element={<LibrarianOrders />} />

          {/* Admin Routes */}
          <Route path="admin/users" element={<AdminUsers />} />
          <Route path="admin/requests" element={<AdminRequests />} />
          <Route path="admin/orders" element={<AdminOrders />} />
          <Route path="admin/books" element={<AdminBooks />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
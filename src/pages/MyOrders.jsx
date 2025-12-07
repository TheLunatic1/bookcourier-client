import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import API from "../services/api";
import { Link } from "react-router-dom";
import { FiPackage, FiCreditCard, FiXCircle, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/my");
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handlePayNow = async (orderId) => {
    try {
      const res = await API.post("/payment/create-checkout-session", {
        orderId,
      });
      window.location.href = res.data.url;
    } catch (err) {
      toast.error("Payment failed");
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await API.patch(`/orders/${orderId}/status`, { status: "cancelled" });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: "cancelled" } : o));
      toast.success("Order cancelled");
    } catch (err) {
      toast.error("Cancel failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <FiPackage className="w-32 h-32 mx-auto opacity-20 mb-6" />
            <p className="text-2xl opacity-70">No orders yet</p>
            <Link to="/all-books" className="btn btn-primary mt-6">Browse Books</Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div key={order._id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-6">
                      <img src={order.bookCover} alt={order.bookTitle} className="w-24 h-32 object-cover rounded-lg" />
                      <div>
                        <h3 className="text-2xl font-bold">{order.bookTitle}</h3>
                        <p className="text-lg opacity-70">৳{order.price} + ৳150 delivery</p>
                        <p className="text-sm mt-2 opacity-70">Ordered on {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`badge badge-lg ${order.status === "delivered" ? "badge-success" : 
                        order.status === "cancelled" ? "badge-error" : "badge-warning"}`}>
                        {order.status.toUpperCase()}
                      </div>
                      <p className="text-2xl font-bold mt-4 text-primary">
                        ৳{(order.totalAmount / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-4 mt-8">
                    {order.status === "pending" && (
                      <>
                        <button
                          onClick={() => handlePayNow(order._id)}
                          className="btn btn-success flex-1"
                        >
                          <FiCreditCard className="mr-2" />
                          Pay Now
                        </button>
                        <button
                          onClick={() => handleCancel(order._id)}
                          className="btn btn-error flex-1"
                        >
                          <FiXCircle className="mr-2" />
                          Cancel Order
                        </button>
                      </>
                    )}
                    {order.status === "confirmed" && (
                      <div className="alert alert-info">
                        <FiCheckCircle />
                        <span>Payment received! Being prepared for delivery</span>
                      </div>
                    )}
                    {order.status === "delivered" && (
                      <div className="alert alert-success">
                        <FiCheckCircle />
                        <span>Delivered! Enjoy your book!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
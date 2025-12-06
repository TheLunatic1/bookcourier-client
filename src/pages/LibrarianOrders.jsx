import { useState, useEffect } from "react";
import API from "../services/api";
import useAuth from "../hooks/useAuth";
import { FiPackage, FiCheckCircle, FiTruck, FiXCircle } from "react-icons/fi";

export default function LibrarianOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/all");
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await API.patch(`/orders/${orderId}/status`, { status });
      setOrders(prev => prev.map(o => 
        o._id === orderId ? { ...o, status } : o
      ));
    } catch (err) {
      console.error(err);
    }
  };

  if (user?.role !== "librarian") {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <h1 className="text-6xl font-bold text-error">Access Denied</h1>
      </div>
    );
  }

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
        <h1 className="text-4xl font-bold text-center mb-12">Manage Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <FiPackage className="w-32 h-32 mx-auto opacity-20 mb-6" />
            <p className="text-2xl opacity-70">No orders yet</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div key={order._id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{order.book.title}</h3>
                      <p className="opacity-70">by {order.book.author}</p>
                      <p className="text-sm mt-2">User: {order.user.name}</p>
                      <p className="text-sm">Phone: {order.phone}</p>
                    </div>
                    <div className="text-right">
                      <div className={`badge badge-lg ${order.status === "delivered" ? "badge-success" : "badge-warning"}`}>
                        {order.status.toUpperCase()}
                      </div>
                      <p className="text-2xl font-bold mt-2">৳150</p>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    {order.status === "pending" && (
                      <button onClick={() => updateStatus(order._id, "confirmed")} className="btn btn-success">
                        <FiCheckCircle className="mr-2" />
                        Confirm
                      </button>
                    )}
                    {order.status === "confirmed" && (
                      <button onClick={() => updateStatus(order._id, "shipped")} className="btn btn-info">
                        <FiTruck className="mr-2" />
                        Ship
                      </button>
                    )}
                    {order.status === "shipped" && (
                      <button onClick={() => updateStatus(order._id, "delivered")} className="btn btn-primary">
                        <FiCheckCircle className="mr-2" />
                        Delivered
                      </button>
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
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import API from "../services/api";
import { FiPackage, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";

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
    if (user) fetchOrders();
  }, [user]);

  const getStatusBadge = (status) => {
    const map = {
      pending: { color: "badge-warning", icon: FiClock },
      shipped: { color: "badge-info", icon: FiPackage },
      delivered: { color: "badge-success", icon: FiCheckCircle },
      cancelled: { color: "badge-error", icon: FiXCircle },
    };
    const { color, icon: Icon } = map[status] || map.pending;
    return (
      <div className={`badge ${color} gap-1`}>
        <Icon className="w-4 h-4" />
        {status}
      </div>
    );
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
            <FiPackage className="w-24 h-24 mx-auto opacity-30 mb-4" />
            <p className="text-xl opacity-70">No orders yet</p>
            <a href="/all-books" className="btn btn-primary mt-6">Browse Books</a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img src={order.book.coverImage} alt={order.book.title} />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{order.book.title}</div>
                          <div className="text-sm opacity-70">by {order.book.author}</div>
                        </div>
                      </div>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>
                      {order.status === "pending" && (
                        <button className="btn btn-error btn-sm">Cancel</button>
                      )}
                      {order.status === "delivered" && (
                        <button className="btn btn-success btn-sm">Write Review</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
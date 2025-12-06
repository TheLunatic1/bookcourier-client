import { useState, useEffect } from "react";
import API from "../services/api";
import useAuth from "../hooks/useAuth";
import { FiPackage, FiUser, FiCalendar, FiDollarSign } from "react-icons/fi";

export default function AdminOrders() {
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

  if (user?.role !== "admin") {
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
        <h1 className="text-4xl font-bold text-center mb-12">All Orders (Admin View)</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <FiPackage className="w-32 h-32 mx-auto opacity-20 mb-6" />
            <p className="text-2xl opacity-70">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Book</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="font-mono text-sm">#{order._id.slice(-6)}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <FiUser />
                        <div>
                          <div className="font-bold">{order.user?.name || "Unknown"}</div>
                          <div className="text-sm opacity-70">{order.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="font-bold">{order.book?.title || "Unknown"}</div>
                        <div className="text-sm opacity-70">by {order.book?.author}</div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <FiDollarSign />
                        <span className="font-bold">৳150</span>
                      </div>
                    </td>
                    <td>
                      <div className={`badge ${order.status === "delivered" ? "badge-success" : 
                        order.status === "pending" ? "badge-warning" : "badge-info"}`}>
                        {order.status.toUpperCase()}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <FiCalendar />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
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
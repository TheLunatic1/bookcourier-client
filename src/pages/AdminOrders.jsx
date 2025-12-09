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
        <h1 className="text-4xl font-bold text-center mb-12">All Orders (Admin)</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl opacity-70">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>User</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <div className="flex items-center gap-4">
                        <img src={order.bookCover} alt={order.bookTitle} className="w-20 h-28 object-cover rounded" />
                        <div>
                          <div className="font-bold">{order.bookTitle}</div>
                          <div className="text-sm opacity-70">Delivery to {order.deliveryAddress}</div>
                          <div className="mt-2">
                            <div className="flex items-center gap-2 text-primary">
                              
                              <div>
                                Book: ৳{order.price}
                                <br />
                                Delivery: ৳150
                                <br />
                                Total: ৳{order.price + 150}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <FiUser />
                        {order.user.name}
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
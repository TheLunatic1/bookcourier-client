import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import API from "../services/api";
import { FiPackage, FiClock, FiCheckCircle } from "react-icons/fi";

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

  if (loading) return <div className="min-h-screen bg-base-200 flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <FiPackage className="w-32 h-32 mx-auto opacity-20 mb-6" />
            <p className="text-2xl opacity-70">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={order.book.coverImage} alt={order.book.title} className="w-20 h-20 rounded-lg" />
                      <div>
                        <h3 className="text-xl font-bold">{order.book.title}</h3>
                        <p className="text-sm opacity-70">Order #{order._id.slice(-6)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="badge badge-success badge-lg">
                        <FiCheckCircle className="mr-2" />
                        {order.status}
                      </div>
                      <p className="text-2xl font-bold mt-2">৳150</p>
                    </div>
                  </div>
                  <div className="mt-4 text-sm opacity-70">
                    Ordered on {new Date(order.createdAt).toLocaleDateString()}
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
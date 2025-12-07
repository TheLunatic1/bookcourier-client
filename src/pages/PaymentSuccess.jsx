import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API from "../services/api";
import { FiCheckCircle } from "react-icons/fi";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const updateOrder = async () => {
      if (orderId) {
        try {
          await API.patch(`/orders/${orderId}/status`, { status: "confirmed", paymentStatus: "paid" });
          console.log("Order confirmed!");
        } catch (err) {
          console.log("Update failed");
        }
      }
    };
    updateOrder();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card bg-base-100 shadow-2xl max-w-md w-full">
        <div className="card-body text-center">
          <FiCheckCircle className="w-24 h-24 text-success mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-success mb-4">Payment Successful!</h1>
          <p className="text-xl opacity-80 mb-8">Your order has been confirmed.</p>
          <div className="text-lg mb-8">
            <p>Order ID: {orderId?.slice(-6).toUpperCase() || "N/A"}</p>
          </div>
          <div className="flex gap-4">
            <Link to="/dashboard/orders" className="btn btn-primary flex-1">
              View My Orders
            </Link>
            <Link to="/all-books" className="btn btn-outline flex-1">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
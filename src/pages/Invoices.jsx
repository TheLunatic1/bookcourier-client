import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import API from "../services/api";
import { FiFileText, FiDownload, FiCalendar, FiDollarSign } from "react-icons/fi";

export default function Invoices() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        // Get user's orders that are "confirmed" or "delivered"
        const res = await API.get("/orders/my");
        const paidOrders = res.data.filter(
          order => order.status === "confirmed" || order.status === "delivered"
        );
        setInvoices(paidOrders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const generateInvoiceNumber = (id) => {
    return `INV-${id.slice(-6).toUpperCase()}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <h1 className="text-6xl font-bold text-error">Please log in</h1>
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
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">My Invoices</h1>
          <p className="text-xl opacity-70">All your paid book deliveries</p>
        </div>

        {invoices.length === 0 ? (
          <div className="text-center py-20">
            <FiFileText className="w-32 h-32 mx-auto opacity-20 mb-6" />
            <p className="text-2xl opacity-70">No invoices yet</p>
            <p className="text-lg mt-4">Your paid orders will appear here</p>
          </div>
        ) : (
          <div className="grid gap-6 max-w-4xl mx-auto">
            {invoices.map((invoice) => (
              <div key={invoice._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition">
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold flex items-center gap-3">
                        <FiFileText className="text-primary" />
                        {generateInvoiceNumber(invoice._id)}
                      </h3>
                      <p className="text-lg mt-2">
                        <strong>{invoice.book?.title || "Book"}</strong> by {invoice.book?.author || "Unknown"}
                      </p>
                      <div className="flex items-center gap-6 mt-4 text-sm opacity-70">
                        <div className="flex items-center gap-2">
                          <FiCalendar />
                          {new Date(invoice.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <FiDollarSign />
                          <span className="text-xl font-bold text-success">৳150</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`badge badge-lg ${invoice.status === "delivered" ? "badge-success" : "badge-info"}`}>
                        {invoice.status.toUpperCase()}
                      </div>
                      <button className="btn btn-ghost btn-sm mt-4">
                        <FiDownload className="w-5 h-5" />
                        Download PDF
                      </button>
                    </div>
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
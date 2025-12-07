import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import API from "../services/api";
import useAuth from "../hooks/useAuth";
import { FiUser, FiCalendar, FiTag, FiHeart, FiDollarSign, FiMapPin, FiPhone } from "react-icons/fi";
import toast from "react-hot-toast";

export default function BookDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [orderForm, setOrderForm] = useState({
    phone: "",
    address: ""
  });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await API.get(`/books/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login first");
      return;
    }

    try {
      await API.post("/orders", {
        bookId: book._id,
        phone: orderForm.phone,
        address: orderForm.address,
      });
      toast.success("Order placed! Proceed to payment");
      setShowModal(false);
      // Redirect to payment or show Pay Now
      Navigate("/my-orders");
    } catch (err) {
      toast.error("Order failed");
    }
  };

  if (loading) return <div className="min-h-screen bg-base-200 flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
  if (!book) return <div className="min-h-screen bg-base-200 flex items-center justify-center"><h1 className="text-6xl font-bold text-error">Book Not Found</h1></div>;

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left - Image */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-2xl sticky top-24">
              <figure className="px-8 pt-8">
                <img src={book.coverImage} alt={book.title} className="rounded-xl shadow-lg w-full" />
              </figure>
              <div className="card-body">
                <div className="flex justify-between items-center">
                  <div className={`badge badge-lg ${book.isAvailable ? "badge-success" : "badge-error"} gap-2`}>
                    {book.isAvailable ? "Available" : "Not Available"}
                  </div>
                  <button className="btn btn-circle btn-outline">
                    <FiHeart className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Details */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-2xl">
              <div className="card-body">
                <h1 className="text-5xl font-bold mb-4">{book.title}</h1>
                <p className="text-2xl opacity-80 mb-6">by {book.author}</p>

                {/* Price */}
                <div className="text-4xl font-bold text-primary mb-8 flex items-center gap-3">
                  <FiDollarSign />
                  ৳{book.price}
                </div>

                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2"><FiUser className="text-primary" /><span>Added by: <strong>{book.addedByName}</strong></span></div>
                  <div className="flex items-center gap-2"><FiCalendar className="text-primary" /><span>{new Date(book.createdAt).toLocaleDateString()}</span></div>
                  <div className="flex items-center gap-2"><FiTag className="text-primary" /><span>{book.category}</span></div>
                </div>

                {book.description && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">About this book</h2>
                    <p className="text-lg leading-relaxed opacity-80">{book.description}</p>
                  </div>
                )}

                {/* ORDER BUTTON */}
                <div className="flex gap-4 mt-10">
                  {book.isAvailable ? (
                    <button onClick={() => setShowModal(true)} className="btn btn-primary btn-lg flex-1">
                      Order Now (৳{book.price})
                    </button>
                  ) : (
                    <button className="btn btn-disabled btn-lg flex-1" disabled>
                      Currently Unavailable
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ORDER MODAL */}
        {showModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="text-2xl font-bold mb-6">Complete Your Order</h3>
              
              <div className="mb-6 p-4 bg-base-200 rounded-lg">
                <p className="font-bold text-lg">{book.title}</p>
                <p className="opacity-70">by {book.author}</p>
                <p className="text-2xl font-bold text-primary mt-4">৳{book.price}</p>
              </div>

              <form onSubmit={handleOrder}>
                <div className="form-control mb-4">
                  <label className="label"><span className="label-text">Name</span></label>
                  <input type="text" value={user?.name || ""} className="input input-bordered" disabled />
                </div>

                <div className="form-control mb-4">
                  <label className="label"><span className="label-text">Email</span></label>
                  <input type="email" value={user?.email || ""} className="input input-bordered" disabled />
                </div>

                <div className="form-control mb-4">
                  <label className="label"><span className="label-text flex items-center gap-2">
                    <FiPhone /> Phone Number
                  </span></label>
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    className="input input-bordered"
                    value={orderForm.phone}
                    onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-control mb-6">
                  <label className="label"><span className="label-text flex items-center gap-2">
                    <FiMapPin /> Delivery Address
                  </span></label>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    placeholder="House no, Road, Area, Dhaka"
                    value={orderForm.address}
                    onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                    required
                  />
                </div>

                <div className="modal-action">
                  <button type="submit" className="btn btn-primary">
                    Place Order (৳{book.price})
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
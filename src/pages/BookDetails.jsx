import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import useAuth from "../hooks/useAuth";
import { FiUser, FiCalendar, FiTag, FiHeart, FiDollarSign, FiMapPin, FiPhone, FiStar } from "react-icons/fi";
import toast from "react-hot-toast";


export default function BookDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [orderForm, setOrderForm] = useState({ phone: "", address: "" });
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await API.get(`/books/${id}`);
        setBook(res.data);

        if (user) {
          const ordersRes = await API.get("/orders/my");
          const hasOrdered = ordersRes.data.some(
            (order) => order.book._id === id && order.status === "delivered"
          );
          setCanReview(hasOrdered);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, user]);


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
      toast.success("Order placed successfully!");
      setShowModal(false);
      
      navigate("/dashboard/orders");
    } catch (err) {
      toast.error("Order failed");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (newRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      await API.post(`/reviews/${id}`, {
        rating: newRating,
        comment: newComment,
      });
      toast.success("Review submitted!");
      setNewRating(0);
      setNewComment("");
      // Refresh book
      const res = await API.get(`/books/${id}`);
      setBook(res.data);
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  if (loading) return <div className="min-h-screen bg-base-200 flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
  if (!book) return <div className="min-h-screen bg-base-200 flex items-center justify-center"><h1 className="text-6xl font-bold text-error">Book Not Found</h1></div>;

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-2xl sticky top-24">
              <figure className="px-8 pt-8">
                <img src={book.coverImage} alt={book.title} className="rounded-xl shadow-lg w-full object-contain max-h-96" />
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

          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-2xl">
              <div className="card-body">
                <h1 className="text-5xl font-bold mb-4">{book.title}</h1>
                <p className="text-2xl opacity-80 mb-6">by {book.author}</p>

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

                {/* REVIEWS SECTION */}
                <div className="mt-20">
                  <h2 className="text-3xl font-bold mb-8">Reviews & Ratings</h2>

                  {/* Average Rating */}
                  <div className="flex items-center gap-6 mb-8">
                    <div className="text-6xl font-bold text-yellow-500">
                      {book.averageRating.toFixed(1)}
                    </div>
                    <div>
                      <div className="rating rating-lg">
                        {[1,2,3,4,5].map(i => (
                          <input key={i} type="radio" name="rating-display" className="mask mask-star-2 bg-yellow-500" checked={i <= Math.round(book.averageRating)} readOnly />
                        ))}
                      </div>
                      <p className="text-lg opacity-70 mt-2">{book.reviewCount} reviews</p>
                    </div>
                  </div>

                  {/* REVIEW FORM — ONLY IF ORDERED */}
                  {user && canReview ? (
                    <div className="card bg-base-100 shadow-xl p-8 mb-12">
                      <h3 className="text-2xl font-bold mb-6">Write Your Review</h3>
                      <form onSubmit={handleReviewSubmit} className="space-y-6">
                        <div>
                          <label className="label"><span className="label-text font-medium">Your Rating</span></label>
                          <div className="rating rating-lg gap-2">
                            {[1,2,3,4,5].map(i => (
                              <input
                                key={i}
                                type="radio"
                                name="rating"
                                className="mask mask-star-2 bg-yellow-500"
                                checked={newRating === i}
                                onChange={() => setNewRating(i)}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="label"><span className="label-text font-medium">Your Review</span></label>
                          <textarea
                            className="textarea textarea-bordered w-full h-32"
                            placeholder="Share your thoughts about this book..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            required
                          />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg">
                          Submit Review
                        </button>
                      </form>
                    </div>
                  ) : user ? (
                    <div className="alert alert-info mb-8">
                      <span>You can review this book after it's delivered</span>
                    </div>
                  ) : null}

                  {/* ALL REVIEWS */}
                  <div className="space-y-6">
                    {book.reviews.length === 0 ? (
                      <p className="text-center py-12 text-xl opacity-70">No reviews yet. Be the first!</p>
                    ) : (
                      book.reviews.map((review) => (
                        <div key={review._id} className="card bg-base-100 shadow-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="avatar">
                                <div className="w-12 rounded-full">
                                  <img src={review.photoURL || "https://via.placeholder.com/50"} alt={review.name} />
                                </div>
                              </div>
                              <div>
                                <h4 className="font-bold">{review.name}</h4>
                                <div className="rating rating-sm">
                                  {[1,2,3,4,5].map(i => (
                                    <input key={i} type="radio" name={`r-${review._id}`} className="mask mask-star-2 bg-yellow-500" checked={i <= review.rating} readOnly />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <p className="text-sm opacity-70">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-lg">{review.comment}</p>
                        </div>
                      ))
                    )}
                  </div>
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
                  <label className="label"><span className="label-text flex items-center gap-2"><FiPhone /> Phone</span></label>
                  <input type="tel" className="input input-bordered" value={orderForm.phone} onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })} required />
                </div>
                <div className="form-control mb-6">
                  <label className="label"><span className="label-text flex items-center gap-2"><FiMapPin /> Address</span></label>
                  <textarea className="textarea textarea-bordered h-24" value={orderForm.address} onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })} required />
                </div>
                <div className="modal-action">
                  <button type="submit" className="btn btn-primary">Place Order (৳{book.price})</button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
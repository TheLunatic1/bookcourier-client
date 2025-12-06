// src/pages/BookDetails.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import useAuth from "../hooks/useAuth";
import { FiUser, FiCalendar, FiTag, FiHeart, FiMessageCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import toast from "react-hot-toast";

export default function BookDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWished, setIsWished] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await API.get(`/books/${id}`);
        setBook(res.data);

        if (user) {
          try {
            const wishlistRes = await API.get("/wishlist");
            const wished = wishlistRes.data.books?.some(b => b._id === id);
            setIsWished(wished);
          } catch (err) {
            console.log("Wishlist check failed");
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, user]);

  const toggleWishlist = async () => {
    try {
      if (isWished) {
        await API.delete(`/wishlist/${id}`);
      } else {
        await API.post("/wishlist", { bookId: id });
      }
      setIsWished(!isWished);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/reviews/${id}`, { rating: newRating, comment: newComment });
      toast.success("Review submitted!");
      window.location.reload();
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
                <img src={book.coverImage} alt={book.title} className="rounded-xl shadow-lg w-full" />
              </figure>
              <div className="card-body">
                <div className="flex justify-between items-center">
                  <div className={`badge badge-lg ${book.isAvailable ? "badge-success" : "badge-error"} gap-2`}>
                    {book.isAvailable ? <><FiCheckCircle /> Available</> : <><FiXCircle /> Not Available</>}
                  </div>
                  <button onClick={toggleWishlist} className={`btn btn-circle ${isWished ? "btn-error" : "btn-outline"}`}>
                    <FiHeart className={`w-6 h-6 ${isWished ? "fill-current" : ""}`} />
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

                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2"><FiUser className="text-primary" /><span>Added by: <strong>{book.addedByName}</strong></span></div>
                  <div className="flex items-center gap-2"><FiCalendar className="text-primary" /><span>{new Date(book.createdAt).toLocaleDateString()}</span></div>
                  <div className="flex items-center gap-2"><FiTag className="text-primary" /><span>{book.category}</span></div>
                </div>

                <div className="flex gap-4 mt-10">
                  {book.isAvailable ? (
                    <Link to="/request-delivery" state={{ book }} className="btn btn-primary btn-lg flex-1">
                      <FiCheckCircle className="mr-2" />
                      Request Delivery (৳150)
                    </Link>
                  ) : (
                    <button className="btn btn-disabled btn-lg flex-1" disabled>Currently Unavailable</button>
                  )}
                  <button className="btn btn-outline btn-lg"><FiMessageCircle className="mr-2" /> Write Review</button>
                </div>

                {/* REVIEWS SECTION */}
                <div className="mt-20">
                  <h2 className="text-3xl font-bold mb-8">Reviews & Ratings</h2>

                  <div className="flex items-center gap-6 mb-8">
                    <div className="text-6xl font-bold text-yellow-500">{book.averageRating.toFixed(1)}</div>
                    <div>
                      <div className="rating rating-lg">
                        {[1,2,3,4,5].map(i => (
                          <input key={i} type="radio" name="rating-display" className="mask mask-star-2 bg-yellow-500" checked={i <= Math.round(book.averageRating)} readOnly />
                        ))}
                      </div>
                      <p className="text-lg opacity-70 mt-2">{book.reviewCount} reviews</p>
                    </div>
                  </div>

                  {user && (
                    <div className="card bg-base-100 shadow-xl p-8 mb-12">
                      <h3 className="text-2xl font-bold mb-6">Write a Review</h3>
                      <form onSubmit={handleReviewSubmit} className="space-y-6">
                        <div>
                          <label className="label"><span className="label-text font-medium">Your Rating</span></label>
                          <div className="rating rating-lg">
                            {[1,2,3,4,5].map(i => (
                              <input key={i} type="radio" name="rating" className="mask mask-star-2 bg-yellow-500" value={i} onChange={(e) => setNewRating(i)} required />
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="label"><span className="label-text font-medium">Your Review</span></label>
                          <textarea className="textarea textarea-bordered w-full h-32" placeholder="Share your thoughts..." value={newComment} onChange={(e) => setNewComment(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg">Submit Review</button>
                      </form>
                    </div>
                  )}

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
                                  <img src="https://via.placeholder.com/150" alt={review.name} />
                                </div>
                              </div>
                              <div>
                                <h4 className="font-bold">{review.name}</h4>
                                <div className="rating rating-sm">
                                  {[1,2,3,4,5].map(i => (
                                    <input key={i} type="radio" name={`rating-${review._id}`} className="mask mask-star-2 bg-yellow-500" checked={i <= review.rating} readOnly />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <p className="text-sm opacity-70">{new Date(review.createdAt).toLocaleDateString()}</p>
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
      </div>
    </div>
  );
}
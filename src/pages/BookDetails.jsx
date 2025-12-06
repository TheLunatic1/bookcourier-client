import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import useAuth from "../hooks/useAuth";
import { FiUser, FiCalendar, FiTag, FiHeart, FiMessageCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function BookDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWished, setIsWished] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await API.get(`/books/${id}`);
        setBook(res.data);
        
        // Check wishlist
        if (user) {
          try {
            const wishlistRes = await API.get("/wishlist");
            const wished = wishlistRes.data.books?.some(b => b._id === id);
            setIsWished(wished);
          } catch (err) {
            console.log("Wishlist check failed (normal if not exist)");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-error">Book Not Found</h1>
          <Link to="/all-books" className="btn btn-primary mt-8">Back to Books</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left - Cover */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-2xl sticky top-24">
              <figure className="px-8 pt-8">
                <img 
                  src={book.coverImage} 
                  alt={book.title} 
                  className="rounded-xl shadow-lg w-full"
                />
              </figure>
              <div className="card-body">
                <div className="flex justify-between items-center">
                  <div className={`badge badge-lg ${book.isAvailable ? "badge-success" : "badge-error"} gap-2`}>
                    {book.isAvailable ? (
                      <>
                        <FiCheckCircle />
                        Available
                      </>
                    ) : (
                      <>
                        <FiXCircle />
                        Not Available
                      </>
                    )}
                  </div>
                  <button
                    onClick={toggleWishlist}
                    className={`btn btn-circle ${isWished ? "btn-error" : "btn-outline"}`}
                  >
                    <FiHeart className={`w-6 h-6 ${isWished ? "fill-current" : ""}`} />
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

                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2">
                    <FiUser className="text-primary" />
                    <span>Added by: <strong>{book.addedByName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-primary" />
                    <span>{new Date(book.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiTag className="text-primary" />
                    <span>{book.category}</span>
                  </div>
                </div>

                {/* Availability Status */}
                <div className="mb-8 p-6 bg-base-200 rounded-xl">
                  <h2 className="text-2xl font-bold mb-4">Availability Status</h2>
                  <div className={`text-3xl font-bold flex items-center gap-3 ${book.isAvailable ? "text-success" : "text-error"}`}>
                    {book.isAvailable ? (
                      <>
                        <FiCheckCircle className="w-10 h-10" />
                        This book is AVAILABLE for delivery
                      </>
                    ) : (
                      <>
                        <FiXCircle className="w-10 h-10" />
                        This book is CURRENTLY NOT AVAILABLE
                      </>
                    )}
                  </div>
                  <p className="text-lg opacity-70 mt-4">
                    {book.isAvailable 
                      ? "You can request delivery right now!"
                      : "This book has been borrowed or is under maintenance."
                    }
                  </p>
                </div>

                {book.description && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">About this book</h2>
                    <p className="text-lg leading-relaxed opacity-80">{book.description}</p>
                  </div>
                )}

                <div className="flex gap-4 mt-10">
                  {book.isAvailable ? (
                    <Link 
                      to={`/request-delivery?book=${book._id}`} 
                      className="btn btn-primary btn-lg flex-1"
                    >
                      <FiCheckCircle className="mr-2" />
                      Request Delivery (৳150)
                    </Link>
                  ) : (
                    <button className="btn btn-disabled btn-lg flex-1" disabled>
                      Currently Unavailable
                    </button>
                  )}
                  <button className="btn btn-outline btn-lg">
                    <FiMessageCircle className="mr-2" />
                    Write Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
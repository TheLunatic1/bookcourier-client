import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import API from "../services/api";
import { FiHeart, FiTrash2, FiBookOpen } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await API.get("/wishlist");
        setWishlist(res.data.books);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchWishlist();
  }, [user]);

  const removeFromWishlist = async (bookId) => {
    try {
      await API.delete(`/wishlist/${bookId}`);
      setWishlist(prev => prev.filter(b => b._id !== bookId));
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

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <FiHeart className="text-red-500 animate-pulse" />
            My Wishlist
          </h1>
          <span className="text-xl opacity-70">{wishlist.length} books</span>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <FiHeart className="w-32 h-32 mx-auto opacity-20 mb-6" />
            <p className="text-2xl opacity-70 mb-6">Your wishlist is empty</p>
            <Link to="/all-books" className="btn btn-primary btn-lg">
              <FiBookOpen className="mr-2" />
              Discover Books
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlist.map((book) => (
              <div key={book._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition group">
                <figure className="px-6 pt-6 relative">
                  <img 
                    src={book.coverImage} 
                    alt={book.title} 
                    className="rounded-xl h-64 object-cover w-full"
                  />
                  <button
                    onClick={() => removeFromWishlist(book._id)}
                    className="absolute top-8 right-8 btn btn-circle btn-error opacity-0 group-hover:opacity-100 transition"
                  >
                    <FiTrash2 />
                  </button>
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-lg">{book.title}</h2>
                  <p className="text-sm opacity-70">by {book.author}</p>
                  
                  <div className="card-actions justify-between items-center mt-4">
                    <div className="flex items-center gap-2">
                      <FiHeart className="text-red-500 animate-pulse" />
                      <span className="text-sm">In Wishlist</span>
                    </div>
                    <Link to={`/book/${book._id}`} className="btn btn-primary btn-sm">
                      View Details
                    </Link>
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
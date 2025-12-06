import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiEye, FiBookOpen, FiPlus, FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function MyBooks() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        const res = await API.get("/books/my");
        setBooks(res.data);
      } catch (err) {
        console.error("MyBooks error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.role === "librarian") {
      fetchMyBooks();
    }
  }, [user]);

  const handleDelete = async (bookId) => {
    if (!window.confirm("Delete this book permanently?")) return;

    try {
      await API.delete(`/books/${bookId}`);
      setBooks(prev => prev.filter(b => b._id !== bookId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleToggleAvailability = async (bookId, currentStatus) => {
    try {
      await API.patch(`/books/${bookId}/availability`);
      setBooks(prev => prev.map(b => 
        b._id === bookId ? { ...b, isAvailable: !currentStatus } : b
      ));
    } catch (err) {
      console.error("Toggle availability error:", err);
    }
  };

  if (user?.role !== "librarian") {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-error mb-4">Access Denied</h1>
          <p className="text-xl opacity-70">Only librarians can view this page</p>
        </div>
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
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <FiBookOpen className="text-primary" />
            My Books ({books.length})
          </h1>
          <Link to="/add-book" className="btn btn-primary">
            <FiPlus className="mr-2" />
            Add New Book
          </Link>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-20">
            <FiBookOpen className="w-32 h-32 mx-auto opacity-20 mb-6" />
            <p className="text-2xl opacity-70 mb-6">You haven't added any books yet</p>
            <Link to="/add-book" className="btn btn-primary btn-lg">
              Add Your First Book
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {books.map((book) => (
              <div key={book._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition group">
                <figure className="px-6 pt-6 relative">
                  <img 
                    src={book.coverImage} 
                    alt={book.title} 
                    className="rounded-xl h-72 object-cover w-full"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover, group-hover:bg-opacity-60 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-3">
                      <Link to={`/book/${book._id}`} className="btn btn-circle btn-info">
                        <FiEye />
                      </Link>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="btn btn-circle btn-error"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </figure>
                <div className="card-body p-6">
                  <h2 className="card-title text-lg">{book.title}</h2>
                  <p className="text-sm opacity-70">by {book.author}</p>
                  
                  <div className="mt-4">
                    <button
                      onClick={() => handleToggleAvailability(book._id, book.isAvailable)}
                      className={`btn btn-sm w-full ${book.isAvailable ? "btn-success" : "btn-error"}`}
                    >
                      {book.isAvailable ? (
                        <>
                          <FiCheckCircle className="mr-2" />
                          Available
                        </>
                      ) : (
                        <>
                          <FiXCircle className="mr-2" />
                          Not Available
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <div className="badge badge-outline">{book.category}</div>
                    <div className="badge badge-primary">
                      {new Date(book.createdAt).toLocaleDateString()}
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
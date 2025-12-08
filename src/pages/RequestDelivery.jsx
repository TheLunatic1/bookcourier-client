import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import API from "../services/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiSearch, FiMapPin, FiPhone, FiHome, FiCheckCircle, FiCreditCard } from "react-icons/fi";
import toast from "react-hot-toast";

export default function RequestDelivery() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookIdFromUrl = searchParams.get("book");

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await API.get("/books");
        const availableBooks = res.data.filter(book => book.isAvailable);
        setBooks(availableBooks);
        setFilteredBooks(availableBooks);

        // Auto-select book from URL
        if (bookIdFromUrl) {
          const book = availableBooks.find(b => b._id === bookIdFromUrl);
          if (book) {
            setSelectedBook(book);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [bookIdFromUrl]);

  useEffect(() => {
    const filtered = books.filter(book =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [search, books]);

  const handlePayment = async () => {
    if (!selectedBook) return;

    try {
      const res = await API.post("/payment/create-checkout-session", {
        bookId: selectedBook._id,
        bookTitle: selectedBook.title,
      });
      window.location.href = res.data.url;
    } catch (err) {
      toast.error("Payment failed. Try again.");
    }
  };

  // ONLY REGULAR USERS
  if (!user || user.role !== "user") {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-error mb-4">Access Denied</h1>
          <p className="text-xl opacity-70">Only regular users can request delivery</p>
          <button onClick={() => navigate("/dashboard")} className="btn btn-primary mt-8">
            Back to Dashboard
          </button>
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
            <FiHome className="text-primary" />
            Request Book Delivery
          </h1>
          <p className="text-xl opacity-70 mt-4">
            Delivery Charge: <strong className="text-primary">৳150</strong> (Paid via card)
          </p>
        </div>

        {/* Show pre-selected book */}
        {bookIdFromUrl && selectedBook && (
          <div className="alert alert-success max-w-2xl mx-auto mb-8">
            <FiCheckCircle className="w-6 h-6" />
            <span>
              Selected: <strong>{selectedBook.title}</strong> by {selectedBook.author}
            </span>
          </div>
        )}

        {!selectedBook ? (
          <div className="max-w-6xl mx-auto">
            <div className="form-control mb-8">
              <div className="input-group input-group-lg">
                <input
                  type="text"
                  placeholder="Search by title or author..."
                  className="input input-bordered input-lg w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBooks.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <p className="text-2xl opacity-70">No books available for delivery</p>
                </div>
              ) : (
                filteredBooks.map((book) => (
                  <div
                    key={book._id}
                    onClick={() => setSelectedBook(book)}
                    className="card bg-base-100 shadow-xl hover:shadow-2xl transition cursor-pointer hover:scale-105"
                  >
                    <figure className="px-6 pt-6">
                      <img src={book.coverImage} alt={book.title} className="rounded-xl h-64 object-cover w-full" />
                    </figure>
                    <div className="card-body">
                      <h2 className="card-title">{book.title}</h2>
                      <p className="text-sm opacity-70">by {book.author}</p>
                      <div className="badge badge-success mt-4">
                        <FiCheckCircle className="mr-2" />
                        Available
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <button onClick={() => setSelectedBook(null)} className="btn btn-ghost mb-8">
              ← Back to Books
            </button>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="card bg-base-100 shadow-2xl">
                <figure className="px-8 pt-8">
                  <img src={selectedBook.coverImage} alt={selectedBook.title} className="rounded-xl shadow-lg" />
                </figure>
                <div className="card-body">
                  <h2 className="text-3xl font-bold">{selectedBook.title}</h2>
                  <p className="text-xl opacity-80">by {selectedBook.author}</p>
                  <div className="badge badge-success badge-lg mt-4">
                    <FiCheckCircle className="mr-2" />
                    Available for Delivery
                  </div>
                </div>
              </div>

              <div className="card bg-base-100 shadow-2xl">
                <div className="card-body">
                  <h2 className="text-2xl font-bold mb-6">Complete Your Order</h2>
                  <div className="alert alert-info mb-6">
                    <FiCreditCard className="w-6 h-6" />
                    <span>Delivery Charge: <strong>৳150</strong></span>
                  </div>

                  <button onClick={handlePayment} className="btn btn-primary btn-lg w-full">
                    <FiCreditCard className="mr-2" />
                    Pay ৳150 & Confirm Delivery
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
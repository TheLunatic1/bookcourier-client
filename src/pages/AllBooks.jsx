import { useState, useEffect } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

export default function AllBooks() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await API.get("/books");
        const availableBooks = res.data.filter(book => book.isAvailable);
        setBooks(availableBooks);
        setFilteredBooks(availableBooks);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    let filtered = books.filter(book =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
    );

    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredBooks(filtered);
  }, [search, sortBy, books]);

  if (loading) return <div className="min-h-screen bg-base-200 flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-12">All Books</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-4xl mx-auto">
          <div className="flex-1">
            <div className="input-group">
              <span><FiSearch className="w-6 h-6" /></span>
              <input
                type="text"
                placeholder="Search by title or author..."
                className="input input-bordered w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <select
            className="select select-bordered w-full md:w-64"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl opacity-70">No books found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {filteredBooks.map((book) => (
              <Link
                key={book._id}
                to={`/book/${book._id}`}
                className="group card bg-base-100 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                <figure className="px-6 pt-6">
                  <img src={book.coverImage} alt={book.title} className="rounded-xl h-64 w-full object-cover" />
                </figure>
                <div className="card-body p-6">
                  <h3 className="card-title text-sm line-clamp-2">{book.title}</h3>
                  <p className="text-xs opacity-70">by {book.author}</p>
                  <p className="text-lg font-bold text-primary mt-2">৳{book.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
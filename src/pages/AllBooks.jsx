// src/pages/AllBooks.jsx — FINAL WITH HOVER EFFECT (SAME AS HOME)
import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Make sure this is imported
import API from "../services/api";
import { Link } from "react-router-dom";

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

  if (loading) return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );

  // Animation variants (same as Home)
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const scaleHover = {
    rest: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  const staggerContainer = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-12">All Books</h1>

        {/* SEARCH + SORT */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-5xl mx-auto items-stretch">
          <input
            type="text"
            placeholder="Search by title or author..."
            className="input input-bordered input-lg flex-1 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="select select-bordered input-lg w-full md:w-64"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>

        {/* BOOKS GRID */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl opacity-70">No books found</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {filteredBooks.map((book) => (
          <motion.div
            key={book._id}
            variants={scaleHover}
            initial="rest"
            whileHover="hover"
            className="group relative card bg-base-200 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden h-full flex flex-col border border-base-300 cursor-pointer"
          >
            {/* Card Content */}
            <figure className="px-8 pt-8 relative z-10">
              <img
                src={book.coverImage}
                alt={book.title}
                className="rounded-2xl h-80 w-full object-cover shadow-2xl border-4 border-white transition-transform duration-700 group-hover:scale-110"
              />
            </figure>

            {/* Hover Overlay with Description */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex flex-col justify-end p-8">
              <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2">
                {book.title}
              </h3>
              <p className="text-lg text-white/90 mb-4">by {book.author}</p>
              <p className="text-base text-white/80 line-clamp-3 mb-6">
                {book.description || "A captivating read from our trusted library partners. Available for immediate delivery."}
              </p>
              <div className="flex items-center justify-between">
                <div className="badge badge-success badge-lg py-4 px-6 text-lg font-bold">
                  ৳{book.price}
                </div>
                <Link
                  to={`/book/${book._id}`}
                  className="btn btn-accent btn-sm px-3 "
                >
                  View Details
                </Link>
              </div>
            </div>

            {/* Default visible info (bottom) */}
            <div className="card-body p-6 text-center relative z-10 bg-gradient-to-t from-base-200/80 to-transparent">
              <h3 className="font-bold text-xl line-clamp-1 text-primary group-hover:opacity-0 transition-opacity duration-300">
                {book.title}
              </h3>
              <p className="text-base opacity-80 group-hover:opacity-0 transition-opacity duration-300">
                by {book.author}
              </p>
              <div className="mt-4">
                <div className="badge badge-success badge-md py-3 px-6">
                  ৳{book.price}
                </div>
              </div>
            </div>
          </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
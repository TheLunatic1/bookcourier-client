import { useState, useEffect } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

export default function AllBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/books").then(res => {
      setBooks(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">All Books</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {books.map(book => (
            <div key={book._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition">
              <figure className="px-6 pt-6">
                <img src={book.coverImage} alt={book.title} className="rounded-xl h-64 object-cover" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{book.title}</h2>
                <p className="text-sm opacity-70">by {book.author}</p>
                <p className="text-sm mt-2 opacity-60">Added by: {book.addedByName}</p>
                <div className="card-actions justify-end mt-4">
                  <Link to={`/book/${book._id}`} className="btn btn-primary btn-sm">View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
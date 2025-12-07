import { useState, useEffect } from "react";
import API from "../services/api";
import useAuth from "../hooks/useAuth";
import { FiBookOpen, FiTrash2, FiToggleLeft, FiToggleRight } from "react-icons/fi";

export default function AdminBooks() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await API.get("/books");
        setBooks(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const togglePublish = async (bookId, currentStatus) => {
    try {
      await API.patch(`/books/${bookId}/publish`, { isAvailable: !currentStatus });
      setBooks(prev => prev.map(b => 
        b._id === bookId ? { ...b, isAvailable: !currentStatus } : b
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBook = async (bookId) => {
    if (!window.confirm("Delete this book and all its orders?")) return;
    try {
      await API.delete(`/books/${bookId}`);
      setBooks(prev => prev.filter(b => b._id !== bookId));
    } catch (err) {
      console.error(err);
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <h1 className="text-6xl font-bold text-error">Access Denied</h1>
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
        <h1 className="text-4xl font-bold text-center mb-12">Manage Books (Admin)</h1>

        {books.length === 0 ? (
          <div className="text-center py-20">
            <FiBookOpen className="w-32 h-32 mx-auto opacity-20 mb-6" />
            <p className="text-2xl opacity-70">No books added yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Librarian</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id}>
                    <td>
                      <div className="flex items-center gap-4">
                        <img src={book.coverImage} alt={book.title} className="w-16 h-20 object-cover rounded" />
                        <div>
                          <div className="font-bold">{book.title}</div>
                          <div className="text-sm opacity-70">by {book.author}</div>
                        </div>
                      </div>
                    </td>
                    <td>{book.addedByName}</td>
                    <td>
                      <div className={`badge ${book.isAvailable ? "badge-success" : "badge-error"}`}>
                        {book.isAvailable ? "Published" : "Unpublished"}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => togglePublish(book._id, book.isAvailable)}
                          className="btn btn-sm btn-outline"
                        >
                          {book.isAvailable ? <FiToggleLeft /> : <FiToggleRight />}
                        </button>
                        <button
                          onClick={() => deleteBook(book._id)}
                          className="btn btn-sm btn-error"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
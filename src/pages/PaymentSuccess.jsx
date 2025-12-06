import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API from "../services/api";
import { FiCheckCircle } from "react-icons/fi";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const bookId = searchParams.get("bookId");

  useEffect(() => {
    const saveOrder = async () => {
      if (bookId) {
        try {
          // Get book details first
          const bookRes = await API.get(`/books/${bookId}`);
          const book = bookRes.data;

          await API.post("/orders", {
            bookId: book._id,
            bookTitle: book.title,
            bookCover: book.coverImage,
          });
          console.log("Order saved!");
        } catch (err) {
          console.log("Order save failed (normal)", err.response?.data || err.message);
        }
      }
    };
    saveOrder();
  }, [bookId]);

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card bg-base-100 shadow-2xl max-w-md w-full">
        <div className="card-body text-center">
          <FiCheckCircle className="w-24 h-24 text-success mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-success mb-4">Payment Successful!</h1>
          <p className="text-xl mb-8">Your delivery is confirmed!</p>
          <Link to="/my-orders" className="btn btn-primary btn-lg">
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
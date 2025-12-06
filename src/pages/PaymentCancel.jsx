import { Link } from "react-router-dom";
import { FiXCircle, FiHome } from "react-icons/fi";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card bg-base-100 shadow-2xl max-w-md w-full">
        <div className="card-body text-center">
          <FiXCircle className="w-24 h-24 text-error mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-error mb-4">Payment Cancelled</h1>
          <p className="text-xl opacity-80 mb-8">
            No worries! Your payment was not processed.
          </p>
          <Link to="/request-delivery" className="btn btn-primary btn-lg">
            <FiHome className="mr-2" />
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
}
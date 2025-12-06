import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FiUserCheck, FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";
import toast from "react-hot-toast";

export default function AdminRequests() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await API.get("/admin/librarian-requests");
        setRequests(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === "admin") fetchRequests();
  }, [user]);

  const approveRequest = async (userId) => {
    try {
      await API.patch(`/admin/make-librarian/${userId}`);
      setRequests(prev => prev.filter(r => r._id !== userId));
      toast.success("Librarian approved successfully!");
    } catch (err) {
      toast.error("Approval failed");
    }
  };

  const rejectRequest = async (userId) => {
    try {
      await API.patch(`/admin/reject-librarian/${userId}`);
      setRequests(prev => prev.filter(r => r._id !== userId));
      toast.success("Request rejected");
    } catch (err) {
      toast.error("Rejection failed");
    }
  };

  // Only admin can access
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-error mb-4">Access Denied</h1>
          <p className="text-xl opacity-70">Only admins can approve requests</p>
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
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <FiUserCheck className="text-yellow-500" />
            Librarian Requests
          </h1>
          <div className="text-xl opacity-70">
            Pending: <span className="font-bold text-warning">{requests.length}</span>
          </div>
        </div>

        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body">
            {requests.length === 0 ? (
              <div className="text-center py-20">
                <FiClock className="w-32 h-32 mx-auto opacity-20 mb-6" />
                <p className="text-2xl opacity-70">No pending requests</p>
                <p className="text-lg mt-4">All librarians have been approved!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {requests.map((req) => (
                  <div key={req._id} className="flex items-center justify-between p-6 border rounded-xl hover:shadow-lg transition">
                    <div className="flex items-center gap-6">
                      <div className="avatar">
                        <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                          <img src={req.photoURL} alt={req.name} />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{req.name}</h3>
                        <p className="text-lg opacity-70">{req.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <FiClock className="text-warning" />
                          <span className="text-sm">
                            Requested on {new Date(req.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => approveRequest(req._id)}
                        className="btn btn-success"
                      >
                        <FiCheckCircle className="mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => rejectRequest(req._id)}
                        className="btn btn-error btn-outline"
                      >
                        <FiXCircle className="mr-2" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
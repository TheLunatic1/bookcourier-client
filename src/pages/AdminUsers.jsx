import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import API from "../services/api";
import { FiUser, FiMail, FiShield, FiAward, FiUserCheck, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === "admin") fetchUsers();
  }, [user]);

  const handleRoleChange = async (userId, newRole, currentRole) => {
    try {
      if (newRole === "librarian" && currentRole === "user") {
        // Promote user → librarian
        await API.patch(`/admin/make-librarian/${userId}`);
        toast.success("User promoted to librarian!");
      } 
      else if (newRole === "user" && currentRole === "librarian") {
        // Downgrade librarian → user
        await API.patch(`/admin/reject-librarian/${userId}`);
        toast.success("Librarian downgraded to user");
      } 
      else if (newRole === currentRole) {
        return;
      } 
      else {
        toast.error("Invalid role change");
        return;
      }

      // Refresh user list
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      toast.error("Role change failed");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await API.delete(`/admin/user/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast.success("User deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // Only admin can access
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-error mb-4">Access Denied</h1>
          <p className="text-xl opacity-70">Only admins can manage users</p>
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
            <FiAward className="text-yellow-500" />
            Admin - Manage Users
          </h1>
          <div className="text-xl opacity-70">
            Total Users: <span className="font-bold">{users.length}</span>
          </div>
        </div>

        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="hover">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <img src={u.photoURL} alt={u.name} />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{u.name}</div>
                            <div className="text-sm opacity-70">ID: {u._id.slice(-6)}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <FiMail />
                          {u.email}
                        </div>
                      </td>
                      <td>
                        <select
                          className="select select-bordered select-sm w-full max-w-xs"
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value, u.role)}
                          disabled={u.role === "admin"}
                        >
                          <option value="user">User</option>
                          <option value="librarian">Librarian</option>
                          <option value="admin" disabled>Admin</option>
                        </select>
                      </td>
                      <td>
                        {u.librarianRequest ? (
                          <div className="badge badge-warning gap-1">
                            <FiUserCheck />
                            Request Pending
                          </div>
                        ) : (
                          <div className="badge badge-success">Active</div>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="btn btn-error btn-sm"
                          disabled={u._id === user._id}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
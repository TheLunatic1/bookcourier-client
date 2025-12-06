import { useState } from "react";
import useAuth from "../hooks/useAuth";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FiBookOpen, FiImage, FiLink, FiUpload, FiX, FiGlobe } from "react-icons/fi";
import toast from "react-hot-toast";

export default function AddBook() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [isLinkMode, setIsLinkMode] = useState(false);
  const [form, setForm] = useState({
    title: "",
    author: "",
    coverImage: "",
    description: "",
    category: "Fiction",
  });

  // Only librarians
  if (user?.role !== "librarian") {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-error mb-4">Access Denied</h1>
          <p className="text-xl opacity-70">Only librarians can add books</p>
          <button onClick={() => navigate("/dashboard")} className="btn btn-primary mt-8">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setPreview(result);
        setForm({ ...form, coverImage: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLinkChange = (e) => {
    const url = e.target.value;
    setForm({ ...form, coverImage: url });
    setPreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.coverImage) {
      toast.error("Please provide a cover image (upload or link)");
      return;
    }

    setLoading(true);
    try {
      await API.post("/books", {
        ...form,
        addedBy: user._id,
        addedByName: user.name,
      });
      toast.success("Book added successfully!");
      navigate("/my-books");
    } catch (err) {
      toast.error("Failed to add book");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
            <FiBookOpen className="text-primary" />
            Add New Book
          </h1>
          <p className="text-xl opacity-70 mt-4">Share your books with the community</p>
        </div>

        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Cover Image Section */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <FiImage /> Book Cover
                  </span>
                </label>

                {/* Toggle between Upload and Link */}
                <div className="tabs tabs-boxed mb-4">
                  <a
                    className={`tab ${!isLinkMode ? "tab-active" : ""}`}
                    onClick={() => setIsLinkMode(false)}
                  >
                    <FiUpload className="mr-2" /> Upload Photo
                  </a>
                  <a
                    className={`tab ${isLinkMode ? "tab-active" : ""}`}
                    onClick={() => setIsLinkMode(true)}
                  >
                    <FiLink className="mr-2" /> Paste Link
                  </a>
                </div>

                {/* Upload Mode */}
                {!isLinkMode && !preview && (
                  <label className="cursor-pointer">
                    <div className="border-4 border-dashed border-base-300 rounded-xl w-full h-96 flex flex-col items-center justify-center hover:border-primary transition">
                      <FiUpload className="w-16 h-16 opacity-50" />
                      <p className="mt-4 text-lg">Click to upload cover</p>
                      <p className="text-sm opacity-70 mt-2">JPG, PNG, WebP</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      required={!isLinkMode}
                    />
                  </label>
                )}

                {/* Link Mode */}
                {isLinkMode && (
                  <div className="flex gap-2">
                    <div className="input-group">
                      <span className="bg-base-200">
                        <FiGlobe />
                      </span>
                      <input
                        type="url"
                        placeholder="https://example.com/cover.jpg"
                        className="input input-bordered w-full"
                        value={form.coverImage}
                        onChange={handleLinkChange}
                        required={isLinkMode}
                      />
                    </div>
                  </div>
                )}

                {/* Preview */}
                {preview && (
                  <div className="relative mt-6">
                    <img src={preview} alt="Preview" className="w-full max-w-md mx-auto rounded-xl shadow-lg" />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview("");
                        setForm({ ...form, coverImage: "" });
                        setIsLinkMode(false);
                      }}
                      className="absolute top-2 right-2 btn btn-circle btn-error btn-sm"
                    >
                      <FiX />
                    </button>
                  </div>
                )}
              </div>

              {/* Rest of the form (same as before) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Book Title</span></label>
                  <input type="text" placeholder="Enter book title" className="input input-bordered w-full" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Author Name</span></label>
                  <input type="text" placeholder="Enter author name" className="input input-bordered w-full" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
                </div>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Category</span></label>
                <select className="select select-bordered w-full" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option>Fiction</option>
                  <option>Non-Fiction</option>
                  <option>Science</option>
                  <option>Biography</option>
                  <option>Mystery</option>
                  <option>Romance</option>
                  <option>Self-Help</option>
                  <option>History</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Description (Optional)</span></label>
                <textarea placeholder="Write a brief description..." className="textarea textarea-bordered h-32" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>

              <div className="flex gap-4">
                <button type="submit" disabled={loading || !form.coverImage} className="btn btn-primary flex-1">
                  {loading ? <span className="loading loading-spinner"></span> : <>Add Book</>}
                </button>
                <button type="button" onClick={() => navigate("/my-books")} className="btn btn-ghost flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}